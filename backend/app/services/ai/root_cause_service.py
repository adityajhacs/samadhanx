import uuid
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.ai.root_cause import analyze_root_cause


def analyze_and_save_root_cause(
    problem_id: UUID,
    db: Session
):
    """
    Fetch a civic problem, analyze its root cause using AI,
    and save the result in the database.
    """

    problem = db.execute(
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
            "problem_id": str(problem_id)
        }
    ).mappings().first()

    if not problem:
        return None

    existing = db.execute(
        text("""
            SELECT *
            FROM public.problem_root_cause_analysis
            WHERE problem_id = :problem_id
            ORDER BY created_at DESC
            LIMIT 1
        """),
        {
            "problem_id": str(problem_id)
        }
    ).mappings().first()

    if existing:
        return dict(existing)

    problem_text = f"""
Title: {problem['title']}

Description: {problem['description']}

District: {problem['district']}

Category: {problem['category']}

Severity Score: {problem['severity_score']}
"""

    print("Sending problem to Root Cause Engine...")

    ai_result = analyze_root_cause(problem_text)

    print("Root Cause analysis received:")
    print(ai_result.model_dump())

    analysis_id = uuid.uuid4()

    db.execute(
        text("""
            INSERT INTO public.problem_root_cause_analysis (
                id,
                problem_id,
                symptom,
                possible_causes,
                contributing_factors,
                confidence,
                need_field_verification,
                created_at
            )
            VALUES (
                :id,
                :problem_id,
                :symptom,
                :possible_causes,
                :contributing_factors,
                :confidence,
                :need_field_verification,
                :created_at
            )
        """),
        {
            "id": analysis_id,
            "problem_id": str(problem_id),
            "symptom": ai_result.symptom,
            "possible_causes": ai_result.possible_causes,
            "contributing_factors": ai_result.contributing_factors,
            "confidence": ai_result.confidence,
            "need_field_verification": ai_result.need_field_verification,
            "created_at": datetime.now(timezone.utc)
        }
    )

    db.commit()

    return ai_result