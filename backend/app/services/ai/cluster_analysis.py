from pydantic import BaseModel, Field
from google import genai
from dotenv import load_dotenv
from sqlalchemy import text
from sqlalchemy.orm import Session
from uuid import UUID

from app.services.ai.prompts import SYSTEM_PROMPT


load_dotenv()

client = genai.Client()


class ClusterAnalysis(BaseModel):
    common_theme: str = Field(
        description="Common theme shared by the problems in the cluster"
    )

    possible_root_cause: str = Field(
        description="Possible common root cause inferred from the problems"
    )

def analyze_problem_cluster(
    problems: list[dict]
) -> ClusterAnalysis:

    problem_text = "\n\n".join(
        [
            f"""
Problem {index}:
Title: {problem['title']}
Description: {problem['description']}
District: {problem['district']}
Category: {problem['category']}
Severity Score: {problem['severity_score']}
"""
            for index, problem in enumerate(problems, start=1)
        ]
    )

    prompt = f"""
{SYSTEM_PROMPT}

You are now analyzing a cluster of similar civic problems.

Analyze all the problems together and identify:

1. Common Theme
2. Possible Common Root Cause

Important rules:
- Base your analysis only on the provided problems.
- Do not invent verified facts.
- The root cause is an AI inference and may require field verification.
- Keep both outputs concise.
- Return only the requested structured output.

Problems in this cluster:

{problem_text}
"""

    interaction = client.interactions.create(
        model="gemini-3.6-flash",
        input=prompt,
        response_format={
            "type": "text",
            "mime_type": "application/json",
            "schema": ClusterAnalysis.model_json_schema(),
        },
    )

    return ClusterAnalysis.model_validate_json(
        interaction.output_text
    )

def analyze_and_save_cluster(
    cluster_id: UUID,
    db: Session
):
    """
    Analyze all problems inside a cluster using Gemini
    and save the generated theme and root cause.
    """

    

    # Step 1: Get problem IDs belonging to this cluster
    link_rows = db.execute(
        text("""
            SELECT problem_id
            FROM public.cluster_problems
            WHERE cluster_id = :cluster_id
        """),
        {
            "cluster_id": str(cluster_id)
        }
    ).fetchall()

    print(f"Cluster links found: {len(link_rows)}")

    if not link_rows:
        return None

    problem_ids = [row[0] for row in link_rows]

    # Step 2: Fetch the actual problems
    problems = []

    for problem_id in problem_ids:
        row = db.execute(
            text("""
                SELECT
                    id,
                    title,
                    description,
                    district,
                    category,
                    severity_score
                FROM public.problems
                WHERE id = :problem_id
            """),
            {
                "problem_id": problem_id
            }
        ).mappings().first()

        if row:
            problems.append(dict(row))

    print(f"Problems found: {len(problems)}")

    if not problems:
        return None

    # Step 3: Analyze cluster using Gemini
    print("Sending cluster problems to Gemini...")

    ai_result = analyze_problem_cluster(problems)

    print("Gemini analysis received:")
    print(ai_result.model_dump())

    # Step 4: Save AI result
    db.execute(
        text("""
            UPDATE public.problem_clusters
            SET
                common_theme = :common_theme,
                possible_root_cause = :possible_root_cause
            WHERE id = :cluster_id
        """),
        {
            "cluster_id": str(cluster_id),
            "common_theme": ai_result.common_theme,
            "possible_root_cause": ai_result.possible_root_cause
        }
    )

    db.commit()

    return ai_result