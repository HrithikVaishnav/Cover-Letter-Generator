from typing import Optional
from pydantic import BaseModel

class CoverLetterRequest(BaseModel):
    resume_text: str
    job_description: str
    word_limit: Optional[int] = 250

class CoverLetterResponse(BaseModel):
    cover_letter: str
