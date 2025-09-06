import re
from docx import Document
import PyPDF2

def extract_text_from_pdf(file):
    reader = PyPDF2.PdfReader(file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text.strip()

def extract_text_from_docx(file):
    doc = Document(file)
    return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])

def extract_name_from_resume(text: str) -> str:
    """
    Try to extract candidate's name from resume text.
    Heuristics:
    - First non-empty line that looks like a name (2–3 words, capitalized).
    - Skip lines with numbers, emails, or all caps.
    """
    if not text:
        return "Candidate"

    lines = text.splitlines()
    for line in lines[:10]:  # only check first 10 lines
        clean = line.strip()
        if not clean:
            continue

        # Skip if line has numbers, email, or too long
        if re.search(r"\d", clean) or "@" in clean or len(clean.split()) > 4:
            continue

        # Check if it's 2–3 words, title case
        words = clean.split()
        if 1 < len(words) <= 3 and all(w[0].isupper() for w in words if w.isalpha()):
            return clean

    return "Candidate"
