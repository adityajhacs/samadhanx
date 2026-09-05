import uuid
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.problem import Problem
from app.models.problem_ai_analysis import ProblemAIAnalysis
from app.services.ai.analysis import analyze_problem


def analyze_and_save_problem(
    problem_id: UUID,
    db: Session
):
    # 1. Problem fetch karo
    problem = (
        db.query(Problem)
        .filter(Problem.id == problem_id)
        .first()
    )

    if not problem:
        return None

    # Existing AI analysis check
    existing_analysis = (
        db.query(ProblemAIAnalysis)
        .filter(ProblemAIAnalysis.problem_id == problem_id)
        .first()
    )

    if existing_analysis:
        return existing_analysis

    # 2. Gemini ke liye problem data prepare karo
    problem_text = f"""
Title: {problem.title}

Description: {problem.description}

District: {problem.district}
"""

    # 3. AI analysis generate karo
    ai_result = analyze_problem(problem_text)

    try:
        # 4. Existing problem update karo
        problem.category = ai_result.category
        problem.severity_score = ai_result.severity_score

        # 5. AI analysis save karo
        analysis = ProblemAIAnalysis(
            id=uuid.uuid4(),
            problem_id=problem.id,
            subcategory=ai_result.subcategory,
            severity_level=ai_result.severity_level,
            affected_sector=ai_result.affected_sector,
            estimated_affected_people=ai_result.estimated_affected_people,
            root_cause=ai_result.root_cause,
            ai_summary=ai_result.ai_summary,
            keywords=ai_result.keywords,
            created_at=datetime.now(timezone.utc)
        )

        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        return analysis

    except SQLAlchemyError:
        db.rollback()
        raise