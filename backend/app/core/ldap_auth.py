import ldap3
from ldap3 import Server, Connection, ALL_ATTRIBUTES, SUBTREE
from ldap3.core.exceptions import LDAPException
from app.models import User
from sqlmodel import Session, select


def authenticate_user_ldap(username: str, password: str, ldap_server: str, base_dn: str) -> bool:
    """
    Authenticate a user against LDAP/Active Directory
    
    Args:
        username: The username (sAMAccountName or email)
        password: The user's password
        ldap_server: LDAP server URL
        base_dn: Base DN for user search
        
    Returns:
        bool: True if authentication successful, False otherwise
    """
    try:
        # Connect to LDAP server
        server = Server(ldap_server, get_info=ALL_ATTRIBUTES)
        conn = Connection(server, user=username, password=password, auto_bind=True)
        
        # If bind is successful, authentication is valid
        conn.unbind()
        return True
    except LDAPException:
        # Authentication failed
        return False


def get_user_info_ldap(username: str, ldap_server: str, base_dn: str, admin_user: str, admin_password: str) -> dict | None:
    """
    Get user information from LDAP/Active Directory
    
    Args:
        username: The username (sAMAccountName or email)
        ldap_server: LDAP server URL
        base_dn: Base DN for user search
        admin_user: Admin user for LDAP queries
        admin_password: Admin password for LDAP queries
        
    Returns:
        dict: User information or None if user not found
    """
    try:
        # Connect to LDAP server with admin credentials
        server = Server(ldap_server, get_info=ALL_ATTRIBUTES)
        conn = Connection(server, user=admin_user, password=admin_password, auto_bind=True)
        
        # Search for user
        search_filter = f"(sAMAccountName={username})"
        conn.search(search_base=base_dn, search_filter=search_filter, search_scope=SUBTREE, attributes=['*'])
        
        if len(conn.entries) > 0:
            entry = conn.entries[0]
            user_info = {
                'username': str(entry.sAMAccountName) if hasattr(entry, 'sAMAccountName') else username,
                'email': str(entry.mail) if hasattr(entry, 'mail') else f"{username}@company.com",
                'full_name': str(entry.displayName) if hasattr(entry, 'displayName') else str(entry.cn) if hasattr(entry, 'cn') else username,
                'is_active': True,
                'is_superuser': 'admin' in str(entry.memberOf).lower() if hasattr(entry, 'memberOf') else False
            }
            conn.unbind()
            return user_info
        else:
            conn.unbind()
            return None
            
    except LDAPException:
        return None


def get_or_create_user_from_ldap(session: Session, username: str, ldap_server: str, base_dn: str, admin_user: str, admin_password: str) -> User | None:
    """
    Get or create a user in the database based on LDAP information
    
    Args:
        session: Database session
        username: The username (sAMAccountName or email)
        ldap_server: LDAP server URL
        base_dn: Base DN for user search
        admin_user: Admin user for LDAP queries
        admin_password: Admin password for LDAP queries
        
    Returns:
        User: The user object or None if user not found
    """
    # First check if user exists in database
    statement = select(User).where(User.email == username)
    user = session.exec(statement).first()
    
    if user:
        return user
    
    # If user doesn't exist, get info from LDAP
    user_info = get_user_info_ldap(username, ldap_server, base_dn, admin_user, admin_password)
    
    if not user_info:
        return None
    
    # Create user in database
    db_user = User(
        email=user_info['email'],
        is_active=user_info['is_active'],
        is_superuser=user_info['is_superuser'],
        full_name=user_info['full_name'],
        hashed_password=""  # No password needed for LDAP auth
    )
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    
    return db_user