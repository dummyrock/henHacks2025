# Building DoseAlert: A Journey in Solving Real-World Healthcare Challenges

## Inspiration: Bridging the Gap in Medication Adherence

The spark for **DoseAlert** came from a conversation with Dylan's father, a healthcare professional who highlighted a critical problem: *patients often forget about upcoming vaccinations and medications*. This directly impacts treatment outcomes and public health. We realized technology could bridge this gap, creating a system that empowers patients through automated reminders and accessible health information.

## What We Built: A User-Centric Solution

### Core Features
- **Automated SMS Reminders**: Integrated custom email sms to send timely alerts
- **Medication Tracking Dashboard**: FastAPI backend with webez frontend
- **AI-Powered Drug Insights**: Laid groundwork for generative AI medicine descriptions *(planned expansion)*
- **Health Entry System**: Secure API endpoints for user data management

```python
# FastAPI Scheduler for Daily Checks
@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = BackgroundScheduler()
    scheduler.add_job(check_old_prescriptions, 'cron', hour=3, minute=0)  # 3 AM daily
    scheduler.start()
    yield
    scheduler.shutdown()
```
```typescript 
// Webez API Integration Example
async function getHealthEntries(userId: number) {
  const response = await axios.get(
    `http://128.4.102.9:8000/users/${userId}/health-entries/`,
    { headers: { "X-API-KEY": "secret-key-123" } }
  );
  return response.data;
}
```
# Technical Journey: Lessons Learned

## Frontend Evolution

### React Deep Dive: Used Apple's Genius Bar approach to master component architecture
- Analyzed Apple's component patterns through Genius Bar documentation
- Implemented atomic design principles for reusable UI elements

### Styling Breakthroughs: Implemented CSS Modules for cohesive designs
- Solved CSS namespace collisions through modular architecture
- Created theme variables for consistent color/font management

### API Integration: Bridged TypeScript frontend with Python backend
- Developed type guards for safe API response handling
- Implemented axios interceptors for global error handling

## Backend Challenges

### First FastAPI Implementation: Created RESTful endpoints with JWT authentication
- Learned dependency injection patterns for database sessions
- Implemented middleware for CORS and request validation

### Database Optimization: Learned PostgreSQL optimization techniques
- Added composite indexes for common query patterns
- Implemented connection pooling with asyncpg

### Async Programming: Mastered background tasks with APScheduler
- Configured cron-style scheduling for daily SMS batches
- Implemented task locking to prevent duplicate executions

## API Cross-Language Hurdles
```typescript
// TypeScript Frontend Validation
interface HealthEntry {
  userId: number;
  medication: string;
  dueDate: DateString;
}
```
```python
# Python Pydantic Model
class HealthEntry(BaseModel):
    user_id: int = Field(gt=0)
    medication: str = Field(min_length=3)
    due_date: date
```

**Key Learnings:**
- Implemented shared validation contracts via OpenAPI spec
- Understood how react simplifies the process of adding html to a site
- Created API key

## What's Next: Expanding Impact

### Future Roadmap

| Priority | Feature                  | Tech Stack          |
|----------|--------------------------|---------------------|
| P0       | Multi-Language Support   | i18next, Localazy   |
| P1       | Doctor Network           | Mapbox, Elasticsearch |
| P2       | AI Symptom Checker       | YOLOv12, WebRTC      |
| P3       | Medicine Wiki            | GPT-4 API, RAG      |
