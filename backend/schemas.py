from pydantic import BaseModel, EmailStr
from typing import Optional, List

class ForecastRequest(BaseModel):
    query: str
    language: str = "English"

class ForecastResponse(BaseModel):
    explanation: str
    predicted_attendance: int

class NutritionRequest(BaseModel):
    query: str
    language: str = "English"

class NutritionResponse(BaseModel):
    suggestion: str

class Feedback(BaseModel):
    meal: str
    taste: str
    waste: str
    comment: Optional[str] = None

class ScholarshipRequest(BaseModel):
    country: str = "India"
    level: str = "Undergraduate"
    field: str = "STEM"
    count: int = 5

class ScholarshipItem(BaseModel):
    name: str
    provider: str
    amount: str
    deadline: str
    eligibility: str

class LostItemRequest(BaseModel):
    description: str
    recipient_email: EmailStr

class LostItemResponse(BaseModel):
    found: bool
    matched_labels: List[str]