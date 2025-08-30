import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_cover_letter_(resume_text: str, job_description: str) -> str:
    prompt = f"""
        You are a career coach.
        Resume: {resume_text}
        Job description: {job_description}
        Write a tailored cover letter (250–300 words), professional and ATS-friendly.
    """

    response = client.chat.completions.create(
        model="llama3-8b-8192", 
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=500,
    )

    return response.choices[0].message.content.strip()
