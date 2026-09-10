import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, text


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in .env")

engine = create_engine(DATABASE_URL.replace(
    "postgresql://",
    "postgresql+psycopg://"
))


try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Database connection successful! ✅")
        print("Result:", result.scalar())

except Exception as e:
    print("Database connection failed! ❌")
    print("Error:", e)