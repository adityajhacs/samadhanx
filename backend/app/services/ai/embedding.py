from dotenv import load_dotenv
from google import genai
from google.genai import types


load_dotenv()

client = genai.Client()


def generate_embedding(text: str) -> list[float]:
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config=types.EmbedContentConfig(
            output_dimensionality=768
        )
    )

    return result.embeddings[0].values