from pydantic import BaseModel, Field
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

    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt,
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": SolutionRecommendation.model_json_schema(),
        },
    )

    return SolutionRecommendation.model_validate_json(
        interaction.output_text
    )