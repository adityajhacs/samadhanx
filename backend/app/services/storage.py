import os
from uuid import uuid4

from dotenv import load_dotenv
from supabase import create_client, Client


load_dotenv()


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")


if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError(
        "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set"
    )


supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
)


def upload_file(
    file_bytes: bytes,
    filename: str,
    content_type: str,
    bucket: str,
) -> str:
    extension = filename.rsplit(".", 1)[-1] if "." in filename else ""

    file_path = (
        f"{uuid4()}.{extension}"
        if extension
        else str(uuid4())
    )

    supabase.storage.from_(bucket).upload(
        file_path,
        file_bytes,
        {
            "content-type": content_type,
            "upsert": "false",
        },
    )

    public_url = supabase.storage.from_(bucket).get_public_url(
        file_path
    )

    return public_url