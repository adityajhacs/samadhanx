from dotenv import load_dotenv
from google import genai
from google.genai import types


load_dotenv()

client = genai.Client()


def generate_embedding(text: str) -> list[float]:
    if not isinstance(text, str):
        raise ValueError("Text must be a string.")

    text = text.strip()

    if not text:
        raise ValueError("Text cannot be empty.")

    if len(text) > 10000:
        raise ValueError("Text is too long.")

    try:
        result = client.models.embed_content(
            model="gemini-embedding-001",
            contents=text,
            config=types.EmbedContentConfig(
                output_dimensionality=768
            )
        )

        if not result.embeddings or not result.embeddings[0].values:
            raise ValueError("AI returned an empty embedding.")

        return result.embeddings[0].values

    except ValueError:
        raise

    except Exception as exc:
        raise RuntimeError(
            "Embedding service is temporarily unavailable."
        ) from exc