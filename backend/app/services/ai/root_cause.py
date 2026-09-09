from pydantic import BaseModel, Field, ValidationError
from google import genai
from dotenv import load_dotenv

from app.services.ai.prompts import SYSTEM_PROMPT


load_dotenv()

client = genai.Client()


class RootCauseAnalysis(BaseModel):
    symptom: str = Field(
        description="Main symptom or visible problem reported by the citizen"
    )

    possible_causes: list[str] = Field(
        description="Possible root causes behind the reported problem"
    )

    contributing_factors: list[str] = Field(
        description="Factors that may contribute to or worsen the problem"
    )

    confidence: int = Field(
        ge=0,
        le=100,
        description="AI confidence score from 0 to 100"
    )

    need_field_verification: bool = Field(
        description="Whether field verification is recommended"
    )


def analyze_root_cause(problem: str) -> RootCauseAnalysis:

    # Input validation
    if not isinstance(problem, str):
        raise ValueError("Problem must be a string.")

    problem = problem.strip()

    if not problem:
        raise ValueError("Problem cannot be empty.")

    if len(problem) > 10000:
        raise ValueError("Problem is too long.")

    prompt = f"""
{SYSTEM_PROMPT}

You are now acting as the SamadhanX Root Cause Engine.

Analyze the following civic problem and identify:

1. Symptom
2. Possible Causes
3. Contributing Factors
4. Confidence score from 0 to 100
5. Whether field verification is needed

Important rules:

- Identify the visible symptom separately from possible causes.
- Provide multiple possible causes when appropriate.
- Contributing factors are conditions that may worsen or support the problem.
- Do not present AI-inferred causes as verified facts.
- Confidence represents AI confidence in the overall root-cause analysis.
- Set need_field_verification to true when the root cause cannot be reliably determined from the provided information.
- Do not invent facts.
- Keep the analysis relevant to the provided problem.
- Return only the requested structured output.

Citizen Problem:

{problem}
"""

    try:
        interaction = client.interactions.create(
            model="gemini-3.6-flash",
            input=prompt,
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": RootCauseAnalysis.model_json_schema(),
            },
        )

        if not interaction.output_text:
            raise ValueError("AI returned an empty response.")

        return RootCauseAnalysis.model_validate_json(
            interaction.output_text
        )

    except ValidationError as exc:
        raise ValueError(
            "AI returned an invalid Root Cause analysis format."
        ) from exc

    except ValueError:
        raise

    except Exception as exc:
        raise RuntimeError(
            "AI Root Cause service is temporarily unavailable."
        ) from exc