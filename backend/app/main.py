from fastapi import FastAPI

app = FastAPI(
    title="SamadhanX API",
    description="AI-powered civic problem solving platform",
    version="1.0.0"
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "SamadhanX API"
    }