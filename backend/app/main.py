from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app import profiles
from app.answer_help import router as answer_help_router
from app.config import settings
from app.learning import router as learning_router
from app.material_processing import router as processing_router
from app.planner import router as planner_router
from app.profiles import router as profiles_router
from app.recommendations import router as recommendations_router
from app.rescheduling import router as rescheduling_router


@asynccontextmanager
async def lifespan(_app: FastAPI):
    async with httpx.AsyncClient(timeout=15) as client:
        profiles.supabase_client = client
        try:
            yield
        finally:
            profiles.supabase_client = None


app = FastAPI(title="TemanBelajar API", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings().cors_origins,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
app.include_router(profiles_router)
app.include_router(learning_router)
app.include_router(answer_help_router)
app.include_router(planner_router)
app.include_router(rescheduling_router)
app.include_router(recommendations_router)
app.include_router(processing_router)


@app.exception_handler(RequestValidationError)
async def validation_error(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "detail": "ada isian yang belum sesuai, periksa bagian yang ditandai",
            "fields": [
                {"path": list(error["loc"]), "type": error["type"]}
                for error in exc.errors()
            ],
        },
    )


@app.get("/health", tags=["operasional"])
def health() -> dict[str, str]:
    return {"status": "ok"}
