from pydantic import BaseModel, Field
from google import genai
from dotenv import load_dotenv

from app.services.ai.prompts import SYSTEM_PROMPT


load_dotenv()

client = genai.Client()


class PilotFeedbackAnalysis(BaseModel):
    sentiment: str
    themes: list[str]
    common_issues: list[str]
    pilot_insight: str
    confidence: int = Field(ge=0, le=100)
    uncertainty_notes: str


def analyze_pilot_feedback(feedback: str) -> PilotFeedbackAnalysis:

    prompt = f"""
{SYSTEM_PROMPT}

You are now acting as the SamadhanX Field Pilot AI Analysis Engine.

Analyze the following field pilot feedback collected after
testing a civic solution.

Identify:

1. Overall sentiment
2. Major themes
3. Common issues reported
4. Key pilot insight
5. AI confidence from 0 to 100
6. Important uncertainties

Important rules:

- Base the analysis only on the provided feedback.
- Do not invent facts or events.
- Do not present assumptions as verified facts.
- Identify recurring or important themes clearly.
- Common issues should represent actual issues mentioned
  or strongly supported by the feedback.
- Keep the pilot insight practical and concise.
- Confidence must be between 0 and 100.
- Mention uncertainties when the feedback is insufficient
  or ambiguous.
- Return only the requested structured output.

Field Pilot Feedback:

{feedback}
"""

    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt,
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": PilotFeedbackAnalysis.model_json_schema(),
        },
    )

    return PilotFeedbackAnalysis.model_validate_json(
        interaction.output_text
    )