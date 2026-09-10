from dotenv import load_dotenv
from google import genai
from pydantic import ValidationError

from app.schemas.ai import AIAnalysis
from app.services.ai.prompts import SYSTEM_PROMPT


load_dotenv()

client = genai.Client()


def analyze_problem(problem: str) -> AIAnalysis:
    # Input validation
    if not isinstance(problem, str):
        raise ValueError("Problem must be a string.")

    problem = problem.strip()

    if not problem:
        raise ValueError("Problem description cannot be empty.")

    if len(problem) > 10000:
        raise ValueError("Problem description is too long.")

    prompt = f"""
{SYSTEM_PROMPT}

Analyze this citizen-reported civic problem:

{problem}
"""

    try:
        interaction = client.interactions.create(
            model="gemini-3.6-flash",
            input=prompt,
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": AIAnalysis.model_json_schema(),
            },
        )

        if not interaction.output_text:
            raise ValueError("AI returned an empty response.")

        return AIAnalysis.model_validate_json(
            interaction.output_text
        )

    except ValidationError as exc:
        raise ValueError(
            "AI returned an invalid response format."
        ) from exc

    except Exception as exc:
        raise RuntimeError(
            "AI analysis failed."
        ) from exc