from pydantic import BaseModel, Field
from google import genai
from dotenv import load_dotenv

from app.services.ai.prompts import SYSTEM_PROMPT


load_dotenv()

client = genai.Client()


class ImpactMeasurementAnalysis(BaseModel):
    overall_impact: str
    key_improvements: list[str]
    areas_of_concern: list[str]
    impact_score: int = Field(ge=0, le=100)
    interpretation: str
    confidence: int = Field(ge=0, le=100)
    uncertainty_notes: str


def analyze_impact_metrics(metrics: str) -> ImpactMeasurementAnalysis:

    prompt = f"""
{SYSTEM_PROMPT}

You are now acting as the SamadhanX Impact Measurement AI Engine.

Analyze the following raw impact metrics collected after
implementation of a civic solution.

Evaluate:

1. Overall impact
2. Key improvements
3. Areas of concern
4. Impact score from 0 to 100
5. Interpretation of the observed metrics
6. AI confidence from 0 to 100
7. Important uncertainties

Important rules:

- Base the analysis only on the provided metrics.
- Do not invent measurements, outcomes, or causes.
- Clearly distinguish observed results from AI interpretation.
- Do not claim causation unless the provided data supports it.
- Impact score must be between 0 and 100.
- Confidence must be between 0 and 100.
- Mention important limitations or missing data.
- Keep the interpretation practical and concise.
- Return only the requested structured output.

Raw Impact Metrics:

{metrics}
"""

    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt,
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": ImpactMeasurementAnalysis.model_json_schema(),
        },
    )

    return ImpactMeasurementAnalysis.model_validate_json(
        interaction.output_text
    )