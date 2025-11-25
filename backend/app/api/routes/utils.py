from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.api.deps import SessionDep
from app.core.config import settings
from app.core.ldap_auth import authenticate_user_ldap
from pydantic import BaseModel

router = APIRouter(tags=["utils"])


class LDAPTestRequest(BaseModel):
    username: str
    password: str


class LDAPTestResponse(BaseModel):
    success: bool
    message: str


@router.get("/utils/health-check/")
def health_check() -> bool:
    return True


@router.post("/utils/test-ldap-connection", response_model=LDAPTestResponse)
def test_ldap_connection(request: LDAPTestRequest, session: SessionDep) -> LDAPTestResponse:
    """
    Test LDAP connection with provided credentials
    """
    try:
        # Attempt to authenticate user against LDAP
        ldap_authenticated = authenticate_user_ldap(
            username=request.username,
            password=request.password,
            ldap_server=settings.LDAP_SERVER,
            base_dn=settings.LDAP_BASE_DN
        )
        
        if ldap_authenticated:
            return LDAPTestResponse(
                success=True,
                message="LDAP connection successful! User authenticated."
            )
        else:
            return LDAPTestResponse(
                success=False,
                message="LDAP authentication failed. Please check your credentials."
            )
    except Exception as e:
        return LDAPTestResponse(
            success=False,
            message=f"LDAP connection error: {str(e)}"
        )