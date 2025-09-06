import json
import os
from fastapi import APIRouter
from services.parser_service import extract_name_from_resume
from schemas.cover_letter_schema import CoverLetterRequest, CoverLetterResponse
from services.openai_service import generate_cover_letter_

router = APIRouter()

@router.post("/generate", response_model=CoverLetterResponse)
async def generate_cover_letter(request: CoverLetterRequest):
    # Path to your stored data.json (in project root)
    # file_path = os.path.join(os.getcwd(), "data.json")

    # # Load the JSON data
    # with open(file_path, "r") as f:
    #     data = json.load(f)

    user_name = extract_name_from_resume(request.resume_text)
    # Assuming your data.json looks like: {"cover_letter": "...."}
    cover_letter = generate_cover_letter_(
        request.resume_text, request.job_description, request.word_limit
    )
    return CoverLetterResponse(
        cover_letter=cover_letter,
        user_name=user_name
    )
    # return CoverLetterResponse(cover_letter=data.get("cover_letter", ""))
