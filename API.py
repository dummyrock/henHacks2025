from datetime import date, timedelta
from enum import Enum
from typing import List, Optional
from pydantic import EmailStr, field_validator

from fastapi.security import APIKeyHeader
from fastapi import Depends, FastAPI, HTTPException, status, Security
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, Date, ForeignKey, Integer, String, create_engine
from sqlalchemy.orm import Session, declarative_base, relationship, sessionmaker
from apscheduler.schedulers.background import BackgroundScheduler
from contextlib import asynccontextmanager

# Add near the top with other constants
API_KEY_NAME = "X-API-Key"
API_KEY = "secret-key-123"  # Change this to a secure key in production

# Add API key security scheme
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def api_key_auth(api_key: str = Security(api_key_header)):
    if api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API Key",
        )
    return api_key

# Add lifespan handler for scheduler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start the scheduler
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_old_prescriptions, 'cron', hour=3, minute=0)
    scheduler.start()
    
    yield
    
    # Shutdown the scheduler
    scheduler.shutdown()

SQLALCHEMY_DATABASE_URL = "sqlite:///./health.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI(lifespan=lifespan,dependencies=[Security(api_key_auth)])

# Add this new function
def check_old_prescriptions():
    with SessionLocal() as db:
        one_month_ago = date.today() - timedelta(days=30)
        
        old_prescriptions = db.query(HealthEntry).filter(
            HealthEntry.entry_type == HealthEntryType.PRESCRIPTION,
            HealthEntry.date <= one_month_ago
        ).all()
        
        if old_prescriptions:
            print("\n=== Old prescriptions found ===")
            for prescription in old_prescriptions:
                print(f"Prescription ID: {prescription.id}")
                print(f"User ID: {prescription.user_id}")
                print(f"Date: {prescription.date}")
                print(f"Description: {prescription.description}")
                print("----------------------------")
        else:
            print("\nNo old prescriptions found")

# Database Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String) #in all forms of email
    phone_number = Column(String) # in (- - -) - - -  - - - -
    height = Column(Integer)  # in cm
    weight = Column(Integer)  # in kg

    health_entries = relationship("HealthEntry", back_populates="user")

class HealthEntryType(str, Enum):
    APPOINTMENT = "appointment"
    PRESCRIPTION = "prescription"

class HealthEntry(Base):
    __tablename__ = "health_entries"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    entry_type = Column(String)
    description = Column(String)
    doctor_info = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="health_entries")

Base.metadata.create_all(bind=engine)

# Pydantic Schemas
class HealthEntryCreate(BaseModel):
    date: date
    entry_type: HealthEntryType
    description: str
    doctor_info: str

class HealthEntryResponse(HealthEntryCreate):
    id: int
    user_id: int

    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    phone_number: str
    height: int
    weight: int
    
    @field_validator('phone_number')
    def validate_phone_number(cls, v):
        if not v.startswith('+') or not v[1:].isdigit():
            raise ValueError('Invalid phone number format')
        return v

class UserResponse(UserCreate):
    id: int
    health_entries: List[HealthEntryResponse] = []

    model_config = ConfigDict(from_attributes=True)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API Endpoints
@app.post("/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED,dependencies=[Security(api_key_auth)])
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/", response_model=List[UserResponse],dependencies=[Security(api_key_auth)])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users/{user_id}/health-entries/", response_model=HealthEntryResponse, status_code=201,dependencies=[Security(api_key_auth)])
def create_health_entry(
    user_id: int, entry: HealthEntryCreate, db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_entry = HealthEntry(**entry.dict(), user_id=user_id)
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

@app.get("/users/{user_id}/health-entries/", response_model=List[HealthEntryResponse],dependencies=[Security(api_key_auth)])
def get_user_health_entries(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.health_entries

check_old_prescriptions()