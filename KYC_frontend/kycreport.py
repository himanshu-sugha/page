import sys
from kyc import convertDataToJSON, pinJSONtoIPFS, initContract, w3
from pprint import pprint

# Initialize KYC contract
kyccontract = initContract()

def createkycReport():
    """
    Collects user input for creating a KYC report and uploads it to IPFS.
    Returns the user ID and IPFS URI of the report.
    """
    first_name = input("First Name: ")
    last_name = input("Last Name: ")
    dob = input("Date of Birth (MM/DD/YYYY): ")
    email = input("Email: ")
    nationality = input("Nationality: ")
    occupation = input("Occupation: ")
    annual_income = input("Annual Income: ")
    user_id = input("User ID: ")
    image = input("Driver's License Image URI: ")
    
    # Convert input data to JSON format
    json_data = convertDataToJSON(first_name, last_name, dob, email, nationality, occupation, annual_income, image)
    
    # Pin JSON data to IPFS and retrieve the URI
    report_uri = pinJSONtoIPFS(json_data)
    return user_id, report_uri

def kycreport(user_id, report_uri):
    """
    Registers a new KYC report on the blockchain.
    """
    try:
        tx_hash = kyccontract.functions.registerKYC(user_id, report_uri).transact({"from": user_id})
        receipt = w3.eth.waitForTransactionReceipt(tx_hash)
        return receipt
    except Exception as e:
        print(f"Error while creating KYC report: {e}")
        sys.exit(1)

def kycupdate(user_id, report_uri):
    """
    Updates an existing KYC report on the blockchain.
    """
    try:
        tx_hash = kyccontract.functions.updateKYC(user_id, report_uri).transact({"from": user_id})
        receipt = w3.eth.waitForTransactionReceipt(tx_hash)
        return receipt
    except Exception as e:
        print(f"Error while updating KYC report: {e}")
        sys.exit(1)

def main():
    """
    Main function to handle KYC operations based on command-line arguments.
    """
    if len(sys.argv) < 2:
        print("Usage: python kycreport.py [report|update]")
        sys.exit(1)
    
    operation = sys.argv[1].lower()

    if operation == "report":
        user_id, report_uri = createkycReport()
        receipt = kycreport(user_id, report_uri)
        pprint(receipt)
        print("KYC Report IPFS Hash:", report_uri)

    elif operation == "update":
        user_id, report_uri = createkycReport()
        receipt = kycupdate(user_id, report_uri)
        pprint(receipt)
        print("KYC Report IPFS Hash:", report_uri)

    else:
        print(f"Invalid operation: {operation}")
        print("Usage: python kycreport.py [report|update]")
        sys.exit(1)

if __name__ == "__main__":
    main()
