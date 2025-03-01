import requests
import json
from datetime import date

BASE_URL = "http://localhost:8000"
API_KEY = "secret-key-123"
HEADERS = {"X-API-Key": API_KEY}

def create_user(username: str, email: str, phone_number: str, carrier: str, height: int, weight: int):
    """Create a new user through the API"""
    url = f"{BASE_URL}/users/"
    user_data = {
        "username": username,
        "email": email,
        "phone_number": phone_number,
        "carrier": carrier,
        "height": height,
        "weight": weight
    }
    
    try:
        response = requests.post(url, json=user_data, headers=HEADERS)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating user: {e}")
        if response:
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text}")
        return None

def create_health_entry(user_id: int, entry_data: dict):
    """Create a health entry for a user"""
    url = f"{BASE_URL}/users/{user_id}/health-entries/"
    try:
        response = requests.post(url, json=entry_data, headers=HEADERS)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating health entry: {e}")
        if response:
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text}")
        return None

if __name__ == "__main__":
    # Create user
    new_user = create_user(
        username="jack_doe",
        email='dfrajerman@gmail.com',
        phone_number='+14434017911',
        carrier='verizon',
        height=175,
        weight=70
    )
    
    if new_user:
        print("Successfully created user:")
        print(json.dumps(new_user, indent=2))
        
        # Create health entry for the vaccine
        vaccine_entry = {
            "date": str(date.today()),  # Current date
            "entry_type": "prescription",
            "description": "COVID-19 booster shot",
            "doctor_info": "Dr. Sarah Miller, City Vaccination Center"
        }
        
        health_entry = create_health_entry(new_user["id"], vaccine_entry)
        
        if health_entry:
            print("\nSuccessfully added health entry:")
            print(json.dumps(health_entry, indent=2))
        else:
            print("\nFailed to add health entry")
    else:
        print("Failed to create user")