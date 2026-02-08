from pydantic import BaseModel, EmailStr

class FeedbackCreate(BaseModel):
    name: str
    email: EmailStr # Email của người gửi feedback
    subject: str
    message: str