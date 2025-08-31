from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import resume, cover_letter
from middlewares import log_and_rate_limit

app = FastAPI(title="AI Cover Letter Generator")

# Register middleware
app.middleware("http")(log_and_rate_limit)

# Allow frontend (React) access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(resume.router, prefix="/resume", tags=["Resume"])
app.include_router(cover_letter.router, prefix="/cover-letter", tags=["Cover Letter"])
