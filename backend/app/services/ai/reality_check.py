from pydantic import BaseModel, Field
from google import genai
from dotenv import load_dotenv

from app.services.ai.prompts import SYSTEM_PROMPT


load_dotenv()

client = genai.Client()


class RealityCheckRisk(BaseModel):
    risk_category: str
    risk_description: str
    risk_level: str
    impact: str
    mitigation: str


class RealityCheckAnalysis(BaseModel):
    feasibility_score: int = Field(ge=0, le=100)
    overall_summary: str
    risks: list[RealityCheckRisk]
    confidence: int = Field(ge=0, le=100)
    uncertainty_notes: str


def analyze_reality_check(solution: str) -> RealityCheckAnalysis:

    prompt = f"""
{SYSTEM_PROMPT}

You are now acting as the SamadhanX AI RealityCheck Engine.

Analyze the following proposed solution for a civic problem.

Evaluate:

1. Technical Risks
2. Operational Risks
3. Financial Risks
4. Adoption Risks
5. Overall feasibility from 0 to 100
6. Mitigation suggestions
7. AI confidence from 0 to 100
8. Important uncertainties

Important rules:

- Do not present AI assumptions as verified facts.
- Identify risks clearly by category.
- Use risk levels such as Low, Medium, or High.
- Give practical mitigation suggestions.
- Feasibility score must be between 0 and 100.
- Confidence must be between 0 and 100.
- Mention important uncertainties when information is insufficient.
- Do not invent facts.
- Return only the requested structured output.

Proposed Solution:

{solution}
"""

    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt,
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": RealityCheckAnalysis.model_json_schema(),
        },
    )

    return RealityCheckAnalysis.model_validate_json(
        interaction.output_text
    )