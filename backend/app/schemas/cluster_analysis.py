import uuid
from pydantic import BaseModel


class ClusterAnalysisResponse(BaseModel):
    cluster_id: uuid.UUID
    common_theme: str
    possible_root_cause: str