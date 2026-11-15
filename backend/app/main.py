from fastapi import FastAPI
from app.profiles import router as profiles_router

app = FastAPI(title="TemanBelajar API", version="0.1.0")
app.include_router(profiles_router)


@app.get("/health", tags=["operasional"])
def health() -> dict[str, str]:
    return {"status": "ok"}
