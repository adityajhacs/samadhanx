from pydantic import BaseModel, Field, ValidationError
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

    # Input validation
    if not isinstance(problem, str):
        raise ValueError("Problem must be a string.")

    if not isinstance(solutions, str):
        raise ValueError("Solutions must be a string.")

    problem = problem.strip()
    solutions = solutions.strip()

    if not problem:
        raise ValueError("Problem cannot be empty.")

    if not solutions:
        raise ValueError("Solutions cannot be empty.")

    if len(problem) > 10000:
        raise ValueError("Problem is too long.")

    if len(solutions) > 10000:
        raise ValueError("Solutions are too long.")

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

    try:
        interaction = client.interactions.create(
            model="gemini-3.6-flash",
            input=prompt,
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": ResourceOptimizationAnalysis.model_json_schema(),
            },
        )

        if not interaction.output_text:
            raise ValueError("AI returned an empty response.")

        return ResourceOptimizationAnalysis.model_validate_json(
            interaction.output_text
        )

    except ValidationError as exc:
        raise ValueError(
            "AI returned an invalid Resource Optimization format."
        ) from exc

    except ValueError:
        raise

    except Exception as exc:
        raise RuntimeError(
            "AI Resource Optimization service is temporarily unavailable."
        ) from exc
    def test_optimize_resources_rejects_empty_problem():
     with raises(ValueError, match="Problem cannot be empty"):
        optimize_resources(
            problem="",
            solutions="Solution 1: Water Tank"
        )


def test_optimize_resources_rejects_non_string_problem():
    with raises(ValueError, match="Problem must be a string"):
        optimize_resources(
            problem=None,
            solutions="Solution 1: Water Tank"
        )


def test_optimize_resources_rejects_empty_solutions():
    with raises(ValueError, match="Solutions cannot be empty"):
        optimize_resources(
            problem="Unreliable drinking water access",
            solutions=""
        )


def test_optimize_resources_rejects_non_string_solutions():
    with raises(ValueError, match="Solutions must be a string"):
        optimize_resources(
            problem="Unreliable drinking water access",
            solutions=None
        )


def test_optimize_resources_rejects_oversized_problem():
    huge_problem = "A" * 10001

    with raises(ValueError, match="Problem is too long"):
        optimize_resources(
            problem=huge_problem,
            solutions="Solution 1: Water Tank"
        )


def test_optimize_resources_rejects_oversized_solutions():
    huge_solutions = "A" * 10001

    with raises(ValueError, match="Solutions are too long"):
        optimize_resources(
            problem="Unreliable drinking water access",
            solutions=huge_solutions
        )