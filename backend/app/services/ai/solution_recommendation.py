from pydantic import BaseModel, Field, ValidationError
from google import genai
from dotenv import load_dotenv

from app.services.ai.prompts import SYSTEM_PROMPT


load_dotenv()

client = genai.Client()


class SolutionRecommendation(BaseModel):
    relevance_explanation: str
    compatibility_score: int = Field(ge=0, le=100)
    key_matches: list[str]
    limitations: list[str]
    confidence: int = Field(ge=0, le=100)


def explain_solution_recommendation(
    problem: str,
    solution: str,
    similarity: float
) -> SolutionRecommendation:

    # Input validation
    if not isinstance(problem, str):
        raise ValueError("Problem must be a string.")

    if not isinstance(solution, str):
        raise ValueError("Solution must be a string.")

    if not isinstance(similarity, (int, float)):
        raise ValueError("Similarity must be a number.")

    problem = problem.strip()
    solution = solution.strip()

    if not problem:
        raise ValueError("Problem cannot be empty.")

    if not solution:
        raise ValueError("Solution cannot be empty.")

    if len(problem) > 10000:
        raise ValueError("Problem is too long.")

    if len(solution) > 10000:
        raise ValueError("Solution is too long.")

    if not 0 <= similarity <= 1:
        raise ValueError("Similarity must be between 0 and 1.")

    prompt = f"""
{SYSTEM_PROMPT}

You are now acting as the SamadhanX Solution Memory
Recommendation Engine.

A previous solution has been retrieved because it is
semantically similar to a new civic problem.

Analyze whether the previous solution is actually relevant.

Evaluate:

1. Why the previous solution is relevant
2. Compatibility score from 0 to 100
3. Key similarities between the problem and solution
4. Limitations or differences
5. AI confidence from 0 to 100

Important rules:

- Semantic similarity does NOT mean the solution is guaranteed
  to work.
- Do not present the previous solution as proven for the new problem.
- Identify practical similarities only from the provided information.
- Clearly mention limitations where information is insufficient.
- Compatibility score must be between 0 and 100.
- Confidence must be between 0 and 100.
- Do not invent facts.
- Return only the requested structured output.

New Civic Problem:

{problem}

Previous Solution:

{solution}

Embedding Similarity:

{similarity}
"""

    try:
        interaction = client.interactions.create(
            model="gemini-3.6-flash",
            input=prompt,
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": SolutionRecommendation.model_json_schema(),
            },
        )

        if not interaction.output_text:
            raise ValueError("AI returned an empty response.")

        return SolutionRecommendation.model_validate_json(
            interaction.output_text
        )

    except ValidationError as exc:
        raise ValueError(
            "AI returned an invalid Solution Recommendation format."
        ) from exc

    except ValueError:
        raise

    except Exception as exc:
        raise RuntimeError(
            "AI Solution Recommendation service is temporarily unavailable."
        ) from exc