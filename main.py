from datetime import date
from enum import Enum
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, Date, ForeignKey, Integer, String, create_engine
from sqlalchemy.orm import Session, declarative_base, relationship, sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./health.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

# Database Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
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
    height: int
    weight: int

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
@app.post("/users/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/users/{user_id}/health-entries/", response_model=HealthEntryResponse, status_code=201)
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

@app.get("/users/{user_id}/health-entries/", response_model=List[HealthEntryResponse])
def get_user_health_entries(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.health_entries