from fastapi import FastAPI

app = FastAPI(title="TemanBelajar API", version="0.1.0")


@app.get("/health", tags=["operasional"])
def health() -> dict[str, str]:
    return {"status": "ok"}
