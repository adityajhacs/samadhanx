import httpx
import jwt
import json

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


security = HTTPBearer()

SUPABASE_URL = "https://jwyarknzbfwtsbrgiroo.supabase.co"

JWKS_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
JWT_ISSUER = f"{SUPABASE_URL}/auth/v1"


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        # Get Supabase public signing keys
        response = httpx.get(
            JWKS_URL,
            timeout=10
        )
        response.raise_for_status()

        jwks = response.json()

        # Read token header
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")

        # Find matching public key
        key = next(
            (
                key
                for key in jwks["keys"]
                if key.get("kid") == kid
            ),
            None
        )

        if key is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token signing key"
            )

        # Convert JWKS key into a usable public key
        public_key = jwt.algorithms.ECAlgorithm.from_jwk(
            json.dumps(key)
        )

        # Verify JWT
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["ES256"],
            issuer=JWT_ISSUER,
            audience="authenticated"
        )

        return payload

    except HTTPException:
        raise

    except Exception as e:
        print(
            f"JWT verification error: {type(e).__name__}: {e}"
        )

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )