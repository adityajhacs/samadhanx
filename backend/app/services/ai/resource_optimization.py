from pydantic import BaseModel, Field
from google import genai
from dotenv import load_dotenv

from app.services.ai.prompts import SYSTEM_PROMPT


load_dotenv()

client = genai.Client()


class ResourceOptimizationRecommendation(BaseModel):
    solution_name: str
    priority_rank: int
    priority_score: int = Field(ge=0, le=100)
    expected_impact: str
    cost_efficiency: str
    scalability: str
    recommendation_reason: str
    key_tradeoffs: list[str]
    confidence: int = Field(ge=0, le=100)
    uncertainty_notes: str


class ResourceOptimizationAnalysis(BaseModel):
    overall_recommendation: str
    ranked_solutions: list[ResourceOptimizationRecommendation]


def optimize_resources(
    problem: str,
    solutions: str
) -> ResourceOptimizationAnalysis:

    prompt = f"""
{SYSTEM_PROMPT}

You are now acting as the SamadhanX Impact and Resource
Optimization Engine.

Your task is to compare proposed solutions for a civic problem
and rank them based on expected impact and efficient use of
available resources.

Evaluate each solution using:

1. Problem severity
2. Affected population
3. Estimated cost
4. Feasibility
5. Expected impact
6. Scalability
7. Cost efficiency

Important rules:

- Rank solutions from highest to lowest priority.
- Priority score must be between 0 and 100.
- Consider impact, feasibility and resource efficiency together.
- Do not automatically rank the cheapest solution highest.
- Do not automatically rank the highest-impact solution highest
  if feasibility is very low.
- Clearly identify tradeoffs.
- Do not invent missing facts.
- Treat estimates and AI interpretations as uncertain when
  supporting information is insufficient.
- Confidence must be between 0 and 100.
- Mention important uncertainties.
- Return only the requested structured output.

Civic Problem:

{problem}

Proposed Solutions:

{solutions}
"""

    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt,
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": ResourceOptimizationAnalysis.model_json_schema(),
        },
    )

    return ResourceOptimizationAnalysis.model_validate_json(
        interaction.output_text
    )