
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.cluster_analysis import ClusterAnalysisResponse
from app.services.ai.cluster_analysis import analyze_and_save_cluster
from app.services.ai.clustering import build_problem_clusters


router = APIRouter(
    prefix="/api",
    tags=["Cluster Analysis"],
)


# ---------------------------------------------------------
# GET ALL CLUSTERS
# ---------------------------------------------------------
@router.get(
    "/clusters",
)
def get_clusters(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    clusters = db.execute(
        text("""
            SELECT
                pc.id AS cluster_id,
                pc.name,
                pc.common_theme,
                pc.possible_root_cause,
                COUNT(cp.problem_id) AS problem_count
            FROM public.problem_clusters pc
            LEFT JOIN public.cluster_problems cp
                ON cp.cluster_id = pc.id
            GROUP BY
                pc.id,
                pc.name,
                pc.common_theme,
                pc.possible_root_cause
            ORDER BY pc.name
        """)
    ).mappings().all()

    return [
        {
            "cluster_id": row["cluster_id"],
            "name": row["name"],
            "common_theme": row["common_theme"],
            "possible_root_cause": row["possible_root_cause"],
            "problem_count": row["problem_count"],
        }
        for row in clusters
    ]


@router.get("/clusters/{cluster_id}/problems")
def get_cluster_problems(
    cluster_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all citizen problems linked to a specific problem cluster.
    """

    # First verify that the cluster exists
    cluster = db.execute(
        text("""
            SELECT id, name
            FROM public.problem_clusters
            WHERE id = :cluster_id
        """),
        {
            "cluster_id": str(cluster_id)
        },
    ).mappings().first()

    if not cluster:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cluster not found",
        )

    # Fetch problems linked through cluster_problems
    problems = db.execute(
        text("""
            SELECT
                p.id,
                p.title,
                p.description,
                p.district,
                p.category,
                p.severity_score,
                p.status,
                p.citizen_id
            FROM public.cluster_problems cp
            INNER JOIN public.problems p
                ON p.id = cp.problem_id
            WHERE cp.cluster_id = :cluster_id
            ORDER BY p.created_at DESC
        """),
        {
            "cluster_id": str(cluster_id)
        },
    ).mappings().all()

    return [
        {
            "id": row["id"],
            "title": row["title"],
            "description": row["description"],
            "district": row["district"],
            "category": row["category"],
            "severity_score": row["severity_score"],
            "status": row["status"],
            "citizen_id": row["citizen_id"],
        }
        for row in problems
    ]


# ---------------------------------------------------------
# BUILD / REFRESH CLUSTERS
# ---------------------------------------------------------
@router.post(
    "/clusters/build",
)
def build_clusters(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        clusters = build_problem_clusters(db)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to build problem clusters: {str(exc)}",
        ) from exc

    return {
        "message": "Problem clusters built successfully",
        "cluster_count": len(clusters),
        "clusters": clusters,
    }


# ---------------------------------------------------------
# ANALYZE ONE CLUSTER WITH AI
# ---------------------------------------------------------
@router.post(
    "/clusters/{cluster_id}/analyze",
    response_model=ClusterAnalysisResponse,
)
def analyze_cluster(
    cluster_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cluster = db.execute(
        text("""
            SELECT
                id,
                common_theme,
                possible_root_cause
            FROM public.problem_clusters
            WHERE id = :cluster_id
        """),
        {
            "cluster_id": str(cluster_id)
        },
    ).mappings().first()

    if not cluster:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem cluster not found",
        )

    try:
        analysis = analyze_and_save_cluster(
            cluster_id=cluster_id,
            db=db,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No problems found in this cluster",
        )

    return ClusterAnalysisResponse(
        cluster_id=cluster_id,
        common_theme=analysis.common_theme,
        possible_root_cause=analysis.possible_root_cause,
    )


# ---------------------------------------------------------
# GET SAVED AI ANALYSIS
# ---------------------------------------------------------
@router.get(
    "/clusters/{cluster_id}/analysis",
    response_model=ClusterAnalysisResponse,
)
def get_cluster_analysis(
    cluster_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cluster = db.execute(
        text("""
            SELECT
                id,
                common_theme,
                possible_root_cause
            FROM public.problem_clusters
            WHERE id = :cluster_id
        """),
        {
            "cluster_id": str(cluster_id)
        },
    ).mappings().first()

    if not cluster:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem cluster not found",
        )

    if not cluster["common_theme"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cluster analysis not found",
        )

    return ClusterAnalysisResponse(
        cluster_id=cluster["id"],
        common_theme=cluster["common_theme"],
        possible_root_cause=cluster["possible_root_cause"],
    )
