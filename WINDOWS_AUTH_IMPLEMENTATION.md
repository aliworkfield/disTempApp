# Windows Domain Authentication Implementation

This document describes the changes made to implement Windows domain authentication (LDAP/Active Directory) instead of the default password-based authentication.

## Backend Changes

### 1. Added LDAP Authentication Module
- Created `backend/app/core/ldap_auth.py` with functions for:
  - Authenticating users against LDAP/Active Directory
  - Retrieving user information from LDAP
  - Creating or updating users in the database based on LDAP data

### 2. Updated Login Endpoint
- Modified `backend/app/api/routes/login.py` to use LDAP authentication instead of password hashing
- The login endpoint now:
  1. Authenticates users against LDAP using provided credentials
  2. Retrieves or creates user records in the database
  3. Generates JWT tokens for session management

### 3. Updated Configuration
- Added LDAP configuration settings to `backend/app/core/config.py`:
  - `LDAP_SERVER`: LDAP server URL
  - `LDAP_BASE_DN`: Base DN for user search
  - `LDAP_ADMIN_USER`: Admin user for LDAP queries
  - `LDAP_ADMIN_PASSWORD`: Admin password for LDAP queries

### 4. Updated CRUD Functions
- Modified `backend/app/crud.py` to remove password hashing since LDAP handles authentication
- User creation and updates no longer store password hashes

## Frontend Changes

### 1. Updated Login Form
- Modified `frontend/src/routes/login.tsx` to:
  - Remove the password input field
  - Change the login button text to "Log In with Windows Credentials"
  - Add informational text about Windows domain authentication
  - Update the "Forgot Password" link to "Contact Administrator"

### 2. Updated Signup Page
- Modified `frontend/src/routes/signup.tsx` to:
  - Remove the signup form entirely
  - Display a message that accounts must be created by administrators
  - Provide a link back to the login page

### 3. Authentication Hook
- The authentication hook (`frontend/src/hooks/useAuth.ts`) remains unchanged since it still uses the same API endpoints

## Configuration Requirements

To use Windows domain authentication, you need to configure the following environment variables in your `.env` file:

```
LDAP_SERVER=ldap://your-domain-controller.company.com
LDAP_BASE_DN=DC=company,DC=com
LDAP_ADMIN_USER=CN=service-account,OU=Service Accounts,DC=company,DC=com
LDAP_ADMIN_PASSWORD=service-account-password
```

## How It Works

1. User enters their username and clicks "Log In with Windows Credentials"
2. Frontend sends a request to the backend with username and a dummy password
3. Backend authenticates the user against LDAP/Active Directory using the provided credentials
4. If authentication is successful:
   - Backend retrieves user information from LDAP
   - Backend creates or updates the user record in the database
   - Backend generates a JWT token for session management
5. Frontend stores the JWT token and uses it for subsequent API requests

## Security Considerations

- LDAP connections should use LDAPS (LDAP over SSL) in production environments
- The service account credentials should have minimal permissions, only able to read user information
- Passwords are never stored in the application database
- All communication should be encrypted using HTTPS

## Testing

To test the implementation:
1. Configure the LDAP settings in your `.env` file
2. Start the application using `docker compose watch`
3. Navigate to the login page
4. Enter a valid domain username
5. Authentication will be performed against your LDAP/Active Directory server