import requests
import json
from datetime import date

BASE_URL = "http://localhost:8000"
API_KEY = "secret-key-123"
HEADERS = {"X-API-Key": API_KEY}

def create_user(username: str,password:str, email: str, phone_number: str, carrier: str, height: int, weight: int):
    """Create a new user through the API"""
    url = f"{BASE_URL}/users/"
    user_data = {
        "username": username,
        'password': password,
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
    """Create a health entry for a user using FastAPI endpoint"""
    url = f"{BASE_URL}/users/{user_id}/health-entries/"
    try:
        response = requests.post(url, json=entry_data, headers=HEADERS)
        response.raise_for_status()
        return response.json()  # Return the created entry from FastAPI response
    except requests.exceptions.RequestException as e:
        print(f"Error creating health entry: {e}")
        if response is not None:
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text}")
        return None

if __name__ == "__main__":
    while True:
        val = input("Welcome to api interface:\n1) Add New User\n2) Add Health Entry to User\n3) End\n")
        if val == '1':
            use = input("username: ")
            pwd = input('password: ')
            ema = input("email: ")
            phone = input("phone number: ")
            car = input("carrier(because we are sending through email): ")
            hei = input("height(cm): ")
            wei = input('weight(kg): ')
            
            new_user = create_user(
                username=use,
                password=pwd,
                email=ema,
                phone_number="+1" + phone,
                carrier=car,
                height=hei,
                weight=wei
            )
            if new_user:
                print("Successfully created user:")
                print(json.dumps(new_user, indent=2))
            else:
                print("Failed to create user")
        elif val == '2':
            username = input("User's name: ")

            try:
                # Fetch users from API
                users_response = requests.get(f"{BASE_URL}/users/", headers=HEADERS)
                users_response.raise_for_status()
                users = users_response.json()
            except Exception as e:
                print(f"Error fetching users: {e}")
                continue

            # Find the user by username
            user = next((u for u in users if u["username"] == username), None)
            if not user:
                print(f"User {username} not found!")
                continue

            # Get user ID
            user_id = user["id"]

            # Get health entry details
            entry_type = input("Entry type (prescription/appointment): ")
            description = input("Description: ")
            doctor_info = input("Doctor Info: ")

            # Create health entry data
            health_entry_data = {
                "date": str(date.today()),  # Current date
                "entry_type": entry_type,
                "description": description,
                "doctor_info": doctor_info
            }

            # Call the function to create health entry
            health_entry = create_health_entry(user_id, health_entry_data)

            if health_entry:
                print("\nSuccessfully added health entry:")
                print(json.dumps(health_entry, indent=2))
            else:
                print("\nFailed to add health entry.")
        
        elif val == "3":
            break
        else:
            print('not 1, 2, or 3')