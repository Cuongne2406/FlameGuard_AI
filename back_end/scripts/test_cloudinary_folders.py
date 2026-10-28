import os
import sys

# Add app directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class MockRole:
    def __init__(self, name):
        self.name = name

class MockOrg:
    def __init__(self, name, org_type):
        self.name = name
        self.type = MockType(org_type)

class MockType:
    def __init__(self, value):
        self.value = value

class MockUserOrg:
    def __init__(self, org):
        self.organization = org

class MockUser:
    def __init__(self, student_id, roles, organizations):
        self.student_id = student_id
        self.roles = roles
        self.organizations = organizations

def test_folder_logic():
    from app.services.cloudinary_service import get_cloudinary_folder
    
    # Test Case 1: Admin
    admin_user = MockUser(
        student_id="ADMIN01",
        roles=[MockRole("ADMIN")],
        organizations=[]
    )
    print(f"Admin path: {get_cloudinary_folder(admin_user)}")
    
    # Test Case 2: SubAdmin (Faculty Admin)
    subadmin_user = MockUser(
        student_id="23110001",
        roles=[MockRole("FACULTY_ADMIN")],
        organizations=[MockUserOrg(MockOrg("CNTT", "FACULTY"))]
    )
    print(f"SubAdmin path: {get_cloudinary_folder(subadmin_user)}")
    
    # Test Case 3: Regular User with Class
    regular_user = MockUser(
        student_id="24123456",
        roles=[MockRole("USER")],
        organizations=[
            MockUserOrg(MockOrg("D24CNPM1", "CLASS")),
            MockUserOrg(MockOrg("Faculty of IT", "FACULTY"))
        ]
    )
    print(f"Regular User path: {get_cloudinary_folder(regular_user)}")

    # Test Case 4: User without student_id or class
    guest_user = MockUser(
        student_id=None,
        roles=[],
        organizations=[]
    )
    print(f"Guest path: {get_cloudinary_folder(guest_user)}")

if __name__ == "__main__":
    try:
        test_folder_logic()
    except Exception as e:
        print(f"Error during test: {e}")
        import traceback
        traceback.print_exc()
