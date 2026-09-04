from dotenv import load_dotenv
from google import genai

from app.schemas.ai import AIAnalysis
from app.services.ai.prompts import SYSTEM_PROMPT


load_dotenv()

client = genai.Client()


def analyze_problem(problem: str) -> AIAnalysis:

    prompt = f"""
{SYSTEM_PROMPT}

Analyze this citizen-reported civic problem:

{problem}
"""

    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt,
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": AIAnalysis.model_json_schema(),
        },
    )

    return AIAnalysis.model_validate_json(
        interaction.output_text
    )