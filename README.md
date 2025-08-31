# AI Cover Letter Generator

This project helps users quickly generate tailored, ATS-friendly cover letters from their resumes and job descriptions.  
It consists of a **FastAPI backend** and a **React frontend**.

---
## 🚀 Features
- Upload a resume (PDF/DOCX).
- Paste a job description.
- Generate a customized cover letter using AI (via Groq API).
- Copy or download the cover letter easily.
- Clean, responsive UI with feedback via snackbars.
---
## 🛠️ Tech Stack
- **Backend**: FastAPI, Python, Groq API
- **Frontend**: React (MUI + Framer Motion)
- **Deployment**: Compatible with Render / Vercel / Netlify
---

## 📂 Project Structure
- /backend → FastAPI server
- /frontend → React app

## Installation
```bash
### 1. Clone the repo
```bash
git clone <your-repo-url>
cd <project-root>

### Backend Setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

- Create a .env file inside backend/ with:
GROQ_API_KEY=your_groq_api_key_here

- Run the server:
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

### Frontend Setup (React)
cd frontend
npm install

- Create a .env file inside frontend/ with:
REACT_APP_API_BASE_URL=http://localhost:8000

npm start
```
## Contributing
Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
```
