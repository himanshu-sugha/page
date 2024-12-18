// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KYC {
    struct Client {
        address userID;
        string report_uri;
        bool used;
        uint end_date;
    }

    // Stores userID => Client
    mapping(address => Client) public Clientdatabase;

    address[] public clientList; // List of clients to loop through for expiring KYC reports

    uint public start_date; // Start date of KYC
    address public admin; // Contract administrator

    // Events for tracking changes
    event NewClient(address indexed userID, string report_uri);
    event ChangeClientInfo(address indexed userID, string report_uri);
    event FlagExpiringKYC(address indexed client, uint client_end_date);

    // Constructor to set the admin
    constructor() {
        admin = msg.sender;
        start_date = block.timestamp;  // Set start date during contract deployment
    }

    // Register a new client
    function registerKYC(address userID, string memory report_uri) external returns (bool) {
        require(!Clientdatabase[userID].used, "Account already exists");

        // Permanently associates the report_uri with the userID on-chain via Events
        emit NewClient(userID, report_uri);

        Clientdatabase[userID] = Client(userID, report_uri, true, block.timestamp + 365 days);
        appendClientInfo(userID);

        return Clientdatabase[userID].used;
    }

    // Update an existing client's KYC
    function updateKYC(address userID, string memory newReportUri) external returns (string memory) {
        require(Clientdatabase[userID].used, "Client does not exist");
        Clientdatabase[userID].report_uri = newReportUri;

        // Permanently associates the new report_uri with the userID on-chain via Events
        emit ChangeClientInfo(userID, newReportUri);

        return Clientdatabase[userID].report_uri;
    }

    // Check validity of a client's KYC
    function checkValidity(address userID) external view returns (string memory) {
        require(Clientdatabase[userID].used, "Client does not exist");

        if (block.timestamp > Clientdatabase[userID].end_date) {
            return "KYC report has expired!";
        } else {
            return "KYC report is valid!";
        }
    }

    // Add each new client to the client list
    function appendClientInfo(address client) private {
        clientList.push(client);
    }

    // Get the count of registered clients
    function getClientCount() external view returns (uint count) {
        return clientList.length;
    }

    // Iterate through the client list to find expiring KYC reports
    function clientLoop() external {
        require(msg.sender == admin, "You are not authorized to use this function");

        for (uint i = 0; i < clientList.length; i++) {
            if (
                Clientdatabase[clientList[i]].end_date < block.timestamp + 30 days &&
                Clientdatabase[clientList[i]].end_date > block.timestamp + 1 days
            ) {
                emit FlagExpiringKYC(clientList[i], Clientdatabase[clientList[i]].end_date);
            }
        }
    }
}
