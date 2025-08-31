import os
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_cover_letter_(resume_text: str, job_description: str, word_limit: int = 300) -> str:
    """
    Generate a tailored cover letter using resume + job description.
    Includes basic validation and word limit control.
    """

    # ---- Input validation ----
    if not resume_text or len(resume_text.split()) < 30:
        raise ValueError("Resume text is too short or missing.")

    if not job_description or len(job_description.split()) < 20:
        raise ValueError("Job description is too short or missing.")

    # Very basic keyword check
    job_keywords = ["experience", "responsibilities", "skills", "requirements", "role"]
    if not any(kw in job_description.lower() for kw in job_keywords):
        raise ValueError("Provided job description seems invalid or irrelevant.")

    # ---- Prompt construction ----
    prompt = f"""
        You are an expert career coach and professional writer. 

        Task: Write a tailored cover letter based on the given resume and job description. 
        Follow these rules strictly:

        1. Structure: 
        - Greeting and strong introduction (show enthusiasm for the role).
        - Body: Match 2–3 key skills/experiences from the resume to the job description requirements. 
        - Closing: Show interest in the company, add a polite call-to-action.

        2. Tone: Professional, confident, concise, and ATS-friendly (no flowery language, avoid clichés).

        3. Content rules:
        - Do not invent experiences or skills that are not in the resume.
        - Emphasize measurable achievements and relevant strengths.
        - Keep paragraphs short (3–5 sentences each).
        - Limit the letter to approximately {word_limit} words.

        Resume:
        {resume_text}

        Job Description:
        {job_description}

        Now generate the final cover letter.
    """


    # ---- Groq API call ----
    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=word_limit * 4,  # buffer (approx 4 tokens per word)
    )

    # ---- Extract + validate response ----
    result = response.choices[0].message.content.strip() if response.choices else None

    if not result:
        raise ValueError("Cover letter generation failed. Empty response from model.")

    # Basic sanity check: ensure it looks like a cover letter (at least a few sentences)
    sentences = re.split(r"[.!?]", result)
    if len(sentences) < 3:
        raise ValueError("Generated text does not look like a valid cover letter.")

    return result

