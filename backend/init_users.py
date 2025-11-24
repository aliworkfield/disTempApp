#!/usr/bin/env python3

"""
Script to initialize the database with default users
"""

import os
import sys
from sqlmodel import Session
from app.core.db import engine
from app.models import User
from app.core.security import get_password_hash

def create_users():
    """Create default admin and test users"""
    with Session(engine) as session:
        # Check if users already exist
        existing_admin = session.exec(
            "SELECT * FROM \"user\" WHERE email = 'admin@example.com'"
        ).first()
        
        if not existing_admin:
            # Create admin user
            admin_user = User(
                email="admin@example.com",
                hashed_password=get_password_hash("password123"),
                full_name="Admin User",
                is_superuser=True,
                is_active=True
            )
            session.add(admin_user)
            print("Admin user created")
        
        # Check if test user already exists
        existing_test = session.exec(
            "SELECT * FROM \"user\" WHERE email = 'test@example.com'"
        ).first()
        
        if not existing_test:
            # Create test user
            test_user = User(
                email="test@example.com",
                hashed_password=get_password_hash("password123"),
                full_name="Test User",
                is_superuser=False,
                is_active=True
            )
            session.add(test_user)
            print("Test user created")
        
        session.commit()
        print("Users initialized successfully")

if __name__ == "__main__":
    create_users()