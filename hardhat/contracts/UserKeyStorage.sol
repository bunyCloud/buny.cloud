// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserKeyStorage {
    
    struct UserKeyInfo {
        address userAddress;
        string username;
        string encryptedKey;
    }
    
    string public contractName = 'Buny User Directory';
    UserKeyInfo[] public userKeys;
    uint256 public messageCounter = 0;

    mapping(address => uint256[]) public userMessageIds; 
    mapping(address => string) public userToKey;
    mapping(address => uint256) public userIndex;
    mapping(address => string[]) public userMessages;
    mapping(uint256 => string) public messageIdToMessage;
    mapping(uint256 => address) public messageIdToOwner;  // mapping to track owner of each message

    event UserRemoved(address indexed userAddress);
    event UserAdded(address indexed userAddress, string username, string encryptedKey);
    event MessageAdded(address indexed userAddress, uint256 messageId, string message);
    
    modifier userExists(address _userAddress) {
        require(bytes(userToKey[_userAddress]).length != 0, "User not found");
        _;
    }

    modifier userDoesNotExist(address _userAddress) {
        require(bytes(userToKey[_userAddress]).length == 0, "User already exists");
        _;
    }
    
    function addWallet(address _userAddress, string memory _username, string memory _encryptedKey) public userDoesNotExist(_userAddress) {
        userKeys.push(UserKeyInfo(_userAddress, _username, _encryptedKey));
        userToKey[_userAddress] = _encryptedKey;
        userIndex[_userAddress] = userKeys.length - 1;
        emit UserAdded(_userAddress, _username, _encryptedKey); 
    }

    function getUserInfo(address _userAddress) public view userExists(_userAddress) returns (UserKeyInfo memory) {
        return userKeys[userIndex[_userAddress]];
    }

    function getEncryptedKey(address _userAddress) public view returns (string memory) {
        return userToKey[_userAddress];
    }
    
    function getTotalUsers() public view returns (uint256) {
        return userKeys.length;
    }

    function getAllUsers() public view returns (address[] memory, string[] memory, string[] memory) {
        address[] memory addresses = new address[](userKeys.length);
        string[] memory usernames = new string[](userKeys.length);
        string[] memory encryptedKeys = new string[](userKeys.length);

        for (uint256 i = 0; i < userKeys.length; i++) {
            addresses[i] = userKeys[i].userAddress;
            usernames[i] = userKeys[i].username;
            encryptedKeys[i] = userKeys[i].encryptedKey;
        }

        return (addresses, usernames, encryptedKeys);
    }

   function getMessages(address _userAddress) public view userExists(_userAddress) returns (uint256[] memory, string[] memory) {
    return (userMessageIds[_userAddress], userMessages[_userAddress]);
}
   
    function addMessage(address _userAddress, string memory _message) public userExists(_userAddress) {
        userMessages[_userAddress].push(_message);
        messageCounter++;
        messageIdToMessage[messageCounter] = _message;
        messageIdToOwner[messageCounter] = _userAddress; // track the owner of the message
        userMessageIds[_userAddress].push(messageCounter);
        
        emit MessageAdded(_userAddress, messageCounter, _message);
    }

   
    function deleteMessage(uint256 _messageId) public {
        require(_messageId <= messageCounter, "Message ID does not exist");
        require(messageIdToOwner[_messageId] == msg.sender, "Only the owner can delete this message");
        delete messageIdToMessage[_messageId];

        address owner = messageIdToOwner[_messageId];
        uint256 indexToDelete;
        bool found = false;
        for(uint256 i = 0; i < userMessageIds[owner].length; i++) {
            if(userMessageIds[owner][i] == _messageId) {
                indexToDelete = i;
                found = true;
                break;
            }
        }

        require(found, "Message not found for the user");

        userMessages[owner][indexToDelete] = "";

        for(uint256 i = indexToDelete; i < userMessageIds[owner].length - 1; i++) {
            userMessageIds[owner][i] = userMessageIds[owner][i + 1];
        }

        userMessageIds[owner].pop();
    }

    function removeUser(address _userAddress) public userExists(_userAddress) {
        require(_userAddress == msg.sender, "Only the user can remove themselves"); // Ensuring only the user can remove their own details

        delete userToKey[_userAddress];
        for (uint256 i = 0; i < userMessageIds[_userAddress].length; i++) {
            delete messageIdToMessage[userMessageIds[_userAddress][i]];
        }
        delete userMessageIds[_userAddress];
        delete userMessages[_userAddress];

        uint256 indexToDelete = userIndex[_userAddress];
        for (uint256 i = indexToDelete; i < userKeys.length - 1; i++) {
            userKeys[i] = userKeys[i + 1];
            userIndex[userKeys[i].userAddress] = i;
        }

        userKeys.pop();
        delete userIndex[_userAddress];
        emit UserRemoved(_userAddress);
    }
}
