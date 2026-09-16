
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.core.auth import get_current_user, require_role
from app.core.database import get_db

from app.models.problem import Problem
from app.models.problem_ai_analysis import ProblemAIAnalysis
from app.models.university_problem_interest import UniversityProblemInterest
from app.models.solution import Solution
from app.models.project import Project
from app.models.collaboration import Collaboration
from app.models.user import User

from app.schemas.problem import (
    ProblemCreate,
    ProblemUpdate,
    ProblemResponse,
)

from app.services.ai.analysis import analyze_problem
from app.services.ai.embedding import generate_embedding
from app.services.storage import upload_file


router = APIRouter(
    prefix="/api/problems",
    tags=["Problems"]
)


@router.get("/", response_model=list[ProblemResponse])
def get_problems(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problems = db.query(Problem).all()
    return problems


@router.get("/my", response_model=list[ProblemResponse])
def get_my_problems(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("citizen"))
):
    problems = (
        db.query(Problem)
        .filter(Problem.citizen_id == current_user.id)
        .order_by(Problem.created_at.desc())
        .all()
    )

    return problems


@router.get("/{problem_id}/progress")
def get_problem_progress(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("citizen"))
):
    problem = (
        db.query(Problem)
        .filter(
            Problem.id == problem_id,
            Problem.citizen_id == current_user.id
        )
        .first()
    )

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )

    stages = [
        {
            "key": "reported",
            "label": "Reported",
            "completed": True,
        },
        {
            "key": "ai_analysis",
            "label": "AI Analysis",
            "completed": False,
        },
        {
            "key": "university_matching",
            "label": "University Matching",
            "completed": False,
        },
        {
            "key": "solution",
            "label": "Solution",
            "completed": False,
        },
        {
            "key": "project",
            "label": "Project",
            "completed": False,
        },
        {
            "key": "industry_collaboration",
            "label": "Industry Collaboration",
            "completed": False,
        },
        {
            "key": "prototype",
            "label": "Prototype",
            "completed": False,
        },
        {
            "key": "deployment",
            "label": "Deployment",
            "completed": False,
        },
        {
            "key": "resolved",
            "label": "Resolved",
            "completed": False,
        },
    ]

    # 1. AI Analysis
    ai_analysis = (
        db.query(ProblemAIAnalysis)
        .filter(
            ProblemAIAnalysis.problem_id == problem.id
        )
        .first()
    )

    if ai_analysis:
        stages[1]["completed"] = True

    # 2. University Matching
    university_match = (
        db.query(UniversityProblemInterest)
        .filter(
            UniversityProblemInterest.problem_id == problem.id
        )
        .first()
    )

    if university_match:
        stages[2]["completed"] = True

    # 3. Solution
    solution = (
        db.query(Solution)
        .filter(
            Solution.problem_id == problem.id
        )
        .first()
    )

    if solution:
        stages[3]["completed"] = True

    # 4. Project
    project = (
        db.query(Project)
        .filter(
            Project.problem_id == problem.id
        )
        .first()
    )

    if project:
        stages[4]["completed"] = True

    # 5. Industry Collaboration
    collaboration = None

    if project:
        collaboration = (
            db.query(Collaboration)
            .filter(
                Collaboration.project_id == project.id
            )
            .first()
        )

    if collaboration:
        stages[5]["completed"] = True

    # 6. Prototype
    if solution and solution.prototype_status:
        prototype_status = solution.prototype_status.strip().lower()

        if prototype_status not in {
            "idea",
            "planned",
            "planning",
            "proposed",
        }:
            stages[6]["completed"] = True

    # 7. Deployment
    if project and project.status:
        project_status = project.status.strip().lower()

        if project_status in {
            "deployed",
            "deployment",
            "live",
            "completed",
        }:
            stages[7]["completed"] = True

    # 8. Resolved
    if problem.status and problem.status.strip().lower() == "resolved":
        stages[8]["completed"] = True

    completed_count = sum(
        1 for stage in stages if stage["completed"]
    )

    total_stages = len(stages)

    progress = round(
        (completed_count / total_stages) * 100
    )

    current_stage = "Reported"

    for stage in stages:
        if not stage["completed"]:
            current_stage = stage["label"]
            break

    if completed_count == total_stages:
        current_stage = "Resolved"

    return {
        "problem_id": str(problem.id),
        "progress": progress,
        "current_stage": current_stage,
        "stages": stages,
    }


@router.get("/{problem_id}", response_model=ProblemResponse)
def get_problem(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = db.query(Problem).filter(
        Problem.id == problem_id
    ).first()

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )

    return problem


@router.post("/", response_model=ProblemResponse)
def create_problem(
    problem: ProblemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("citizen"))
):
    # Text used for semantic embedding.
    problem_text = (
        f"Title: {problem.title}\n"
        f"Description: {problem.description}\n"
        f"Category: {problem.category}\n"
        f"District: {problem.district}"
    )

    try:
        problem_embedding = generate_embedding(problem_text)

    except Exception as error:
        print("Problem embedding generation error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to generate problem embedding."
        )

    new_problem = Problem(
        citizen_id=current_user.id,
        title=problem.title,
        description=problem.description,
        district=problem.district,
        category=problem.category,
        status="Pending",
        latitude=problem.latitude,
        longitude=problem.longitude,
        image_url=problem.image_url,
        video_url=problem.video_url,
        embedding=problem_embedding,
    )

    db.add(new_problem)
    db.commit()
    db.refresh(new_problem)

    return new_problem


@router.put("/{problem_id}", response_model=ProblemResponse)
def update_problem(
    problem_id: str,
    problem_data: ProblemUpdate,
    db: Session = Depends(get_db)
):
    problem = db.query(Problem).filter(
        Problem.id == problem_id
    ).first()

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )

    update_data = problem_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(problem, field, value)

    db.commit()
    db.refresh(problem)

    return problem


@router.post("/{problem_id}/analyze")
def analyze_problem_endpoint(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = db.query(Problem).filter(
        Problem.id == problem_id
    ).first()

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )

    result = analyze_problem(problem.description)

    existing_analysis = db.query(ProblemAIAnalysis).filter(
        ProblemAIAnalysis.problem_id == problem.id
    ).first()

    if existing_analysis:
        existing_analysis.subcategory = result.subcategory
        existing_analysis.severity_level = result.severity_level
        existing_analysis.affected_sector = result.affected_sector
        existing_analysis.estimated_affected_people = (
            result.estimated_affected_people
        )
        existing_analysis.root_cause = result.root_cause
        existing_analysis.ai_summary = result.ai_summary
        existing_analysis.keywords = result.keywords
        existing_analysis.created_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(existing_analysis)

        return result

    analysis = ProblemAIAnalysis(
        id=uuid.uuid4(),
        problem_id=problem.id,
        subcategory=result.subcategory,
        severity_level=result.severity_level,
        affected_sector=result.affected_sector,
        estimated_affected_people=result.estimated_affected_people,
        root_cause=result.root_cause,
        ai_summary=result.ai_summary,
        keywords=result.keywords,
        created_at=datetime.now(timezone.utc),
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return result


@router.post("/upload")
async def upload_problem_file(
    file: UploadFile = File(...),
    current_user: User = Depends(require_role("citizen")),
):
    if file.content_type is None:
        raise HTTPException(
            status_code=400,
            detail="File type could not be detected."
        )

    if file.content_type.startswith("image/"):
        bucket = "problem-images"

    elif file.content_type.startswith("video/"):
        bucket = "problem-videos"

    else:
        raise HTTPException(
            status_code=400,
            detail="Only image and video files are allowed."
        )

    file_bytes = await file.read()

    max_size = (
        300 * 1024
        if file.content_type.startswith("image/")
        else 300 * 1024 * 1024
    )

    if len(file_bytes) > max_size:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds the allowed limit."
        )

    try:
        url = upload_file(
            file_bytes=file_bytes,
            filename=file.filename or "upload",
            content_type=file.content_type,
            bucket=bucket,
        )

        return {
            "url": url,
            "type": "image"
            if file.content_type.startswith("image/")
            else "video",
        }

    except Exception as error:
        print("File upload error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to upload file."
        )

