import requests
import sys
from datetime import datetime
import json

class CyberentAPITester:
    def __init__(self, base_url="https://secure-scan-13.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": None,
                "error": None
            }

            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    result["response_data"] = response.json()
                except:
                    result["response_data"] = response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    result["error"] = response.json()
                except:
                    result["error"] = response.text

            self.test_results.append(result)
            return success, response.json() if success and response.content else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            result = {
                "test_name": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": None,
                "success": False,
                "response_data": None,
                "error": str(e)
            }
            self.test_results.append(result)
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_contact_form_submission(self):
        """Test contact form submission"""
        test_data = {
            "name": "Test User",
            "company": "Test Company",
            "email": "test@example.com",
            "service_type": "web",
            "message": "This is a test message for VAPT services."
        }
        return self.run_test("Contact Form Submission", "POST", "contact", 200, test_data)

    def test_contact_form_validation(self):
        """Test contact form validation with missing required fields"""
        invalid_data = {
            "name": "",  # Missing required field
            "email": "invalid-email",  # Invalid email
            "service_type": "",  # Missing required field
            "message": ""  # Missing required field
        }
        success, response = self.run_test("Contact Form Validation", "POST", "contact", 422, invalid_data)
        return success

    def test_get_contact_submissions(self):
        """Test getting contact submissions"""
        return self.run_test("Get Contact Submissions", "GET", "contact", 200)

    def test_status_endpoint_post(self):
        """Test status endpoint POST"""
        test_data = {
            "client_name": "Test Client"
        }
        return self.run_test("Status Endpoint POST", "POST", "status", 200, test_data)

    def test_status_endpoint_get(self):
        """Test status endpoint GET"""
        return self.run_test("Status Endpoint GET", "GET", "status", 200)

def main():
    print("🚀 Starting Cyberent³ API Testing...")
    print("=" * 50)
    
    tester = CyberentAPITester()
    
    # Run all tests
    print("\n📡 Testing API Endpoints...")
    tester.test_root_endpoint()
    
    print("\n📝 Testing Contact Form...")
    tester.test_contact_form_submission()
    tester.test_contact_form_validation()
    tester.test_get_contact_submissions()
    
    print("\n📊 Testing Status Endpoints...")
    tester.test_status_endpoint_post()
    tester.test_status_endpoint_get()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed. Check the details above.")
        
        # Print failed tests summary
        failed_tests = [test for test in tester.test_results if not test["success"]]
        if failed_tests:
            print("\n🔍 Failed Tests Summary:")
            for test in failed_tests:
                print(f"  - {test['test_name']}: {test.get('error', 'Status code mismatch')}")
        
        return 1

if __name__ == "__main__":
    sys.exit(main())