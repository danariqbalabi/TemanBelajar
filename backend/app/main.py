from fastapi import FastAPI
from app.profiles import router as profiles_router
from app.learning import router as learning_router
from app.planner import router as planner_router
from app.recommendations import router as recommendations_router
from app.material_processing import router as processing_router

app = FastAPI(title="TemanBelajar API", version="0.1.0")
app.include_router(profiles_router)
app.include_router(learning_router)
app.include_router(planner_router)
app.include_router(recommendations_router)
app.include_router(processing_router)


@app.get("/health", tags=["operasional"])
def health() -> dict[str, str]:
    return {"status": "ok"}
