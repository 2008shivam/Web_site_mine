from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import resend
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend configuration
resend.api_key = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
NOTIFICATION_EMAIL = os.environ.get('NOTIFICATION_EMAIL', 'jhashivam2008@gmail.com')

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Contact Form Models
class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: Optional[str] = None
    email: EmailStr
    service_type: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactSubmissionCreate(BaseModel):
    name: str
    company: Optional[str] = None
    email: EmailStr
    service_type: str
    message: str

class ContactSubmissionResponse(BaseModel):
    success: bool
    message: str
    id: str


# Routes
@api_router.get("/")
async def root():
    return {"message": "Cyberent³ API - Exponential Security. Zero Compromise."}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Service type mapping for email
SERVICE_TYPES = {
    "web": "Web Application VAPT",
    "mobile": "Mobile Application VAPT",
    "network": "Infrastructure/Network VAPT",
    "thick": "Thick Client VAPT",
    "api": "API Security Testing",
    "grc": "GRC Auditing",
    "multiple": "Multiple Services"
}

async def send_notification_email(submission: ContactSubmission):
    """Send email notification for new contact form submission"""
    service_name = SERVICE_TYPES.get(submission.service_type, submission.service_type)
    
    html_content = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #00FF94; padding: 30px;">
            <h1 style="color: #00FF94; margin-bottom: 20px;">New Contact Form Submission</h1>
            <p style="color: #94A3B8; margin-bottom: 20px;">You have received a new inquiry from the Cyberent³ website.</p>
            
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #94A3B8;">Name:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #ffffff;">{submission.name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #94A3B8;">Company:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #ffffff;">{submission.company or 'Not provided'}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #94A3B8;">Email:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #00FF94;">{submission.email}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #94A3B8;">Service:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #222; color: #ffffff;">{service_name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; color: #94A3B8;" colspan="2">Message:</td>
                </tr>
                <tr>
                    <td style="padding: 10px; background-color: #0a0a0a; color: #ffffff;" colspan="2">{submission.message}</td>
                </tr>
            </table>
            
            <p style="color: #475569; font-size: 12px; margin-top: 30px;">
                Submission ID: {submission.id}<br>
                Submitted at: {submission.created_at.strftime('%Y-%m-%d %H:%M UTC')}
            </p>
        </div>
    </body>
    </html>
    """
    
    params = {
        "from": SENDER_EMAIL,
        "to": [NOTIFICATION_EMAIL],
        "subject": f"[Cyberent³] New Inquiry: {service_name} - {submission.name}",
        "html": html_content
    }
    
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        logging.info(f"Notification email sent for submission {submission.id}")
    except Exception as e:
        logging.error(f"Failed to send notification email: {e}")

# Contact Form Endpoint
@api_router.post("/contact", response_model=ContactSubmissionResponse)
async def submit_contact_form(input: ContactSubmissionCreate):
    try:
        submission = ContactSubmission(**input.model_dump())
        
        doc = submission.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        
        await db.contact_submissions.insert_one(doc)
        
        # Send email notification (non-blocking)
        asyncio.create_task(send_notification_email(submission))
        
        return ContactSubmissionResponse(
            success=True,
            message="Your message has been transmitted securely. Our team will respond within 24 hours.",
            id=submission.id
        )
    except Exception as e:
        logging.error(f"Contact form submission error: {e}")
        raise HTTPException(status_code=500, detail="Transmission failed. Please try again.")

@api_router.get("/contact", response_model=List[ContactSubmission])
async def get_contact_submissions():
    submissions = await db.contact_submissions.find({}, {"_id": 0}).to_list(1000)
    
    for sub in submissions:
        if isinstance(sub['created_at'], str):
            sub['created_at'] = datetime.fromisoformat(sub['created_at'])
    
    return submissions


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
