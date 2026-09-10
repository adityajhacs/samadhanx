import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.cluster_analysis import ClusterAnalysisResponse
from app.services.ai.cluster_analysis import analyze_and_save_cluster


router = APIRouter(
    prefix="/api",
    tags=["Cluster Analysis"],
)


@router.post(
    "/clusters/{cluster_id}/analyze",
    response_model=ClusterAnalysisResponse,
)
def analyze_cluster(
    cluster_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check whether cluster exists
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