from fastapi import APIRouter, UploadFile
from services.parser_service import extract_text_from_pdf, extract_text_from_docx
from schemas.resume_schema import ResumeResponse

router = APIRouter()

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(file: UploadFile):
    if file.filename.endswith(".pdf"):
        text = extract_text_from_pdf(file.file)
    elif file.filename.endswith(".docx"):
        text = extract_text_from_docx(file.file)
    else:
        return {"error": "Only PDF or DOCX supported"}
    
    return ResumeResponse(resume_text=text)
