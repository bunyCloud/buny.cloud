// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract MultiSigWallet {
    string public contractName;
    uint constant DURATION_24_HOURS = 86400; // 24 hours in seconds
    uint public minSignatures;
    address private _owner;
    mapping(address => uint8) private _owners;
    uint private _transactionIdx;
    address[] private _allOwners;
    mapping(uint => Transaction) private _transactions;
    uint[] private _pendingTransactions;

      struct Transaction {
        address from;
        address to;
        uint amount;
        uint8 signatureCount;
        uint creationTime;
        uint expiryTime;  
        mapping(address => uint8) signatures;
        }

        modifier isOwner() {
            require(msg.sender == _owner, "Not an owner");
            _;
        }

        modifier validOwner() {
            require(
                msg.sender == _owner || _owners[msg.sender] == 1,
                "Not a valid owner"
            );
            _;
        }

    event DepositFunds(address from, uint amount);
    event TransactionCreated(address from,address to, uint amount, uint transactionId);
    event TransactionCompleted(address from,address to,uint amount,uint transactionId);
    event TransactionSigned(address by, uint transactionId);

   
    function initialize(uint _minSignatures, string memory _contractName, address _ownerAddress) public {
    require(minSignatures == 0 && bytes(contractName).length == 0, "Contract already initialized");
    require(_minSignatures > 0, "Minimum signatures should be greater than 0");
    minSignatures = _minSignatures; 
    contractName = _contractName;
    _owner = _ownerAddress;
    _owners[_owner] = 1; 
    _allOwners.push(_owner);
}


    function addOwner(address owner) public isOwner {
        require(_owners[owner] == 0, "Address is already an owner");
        _owners[owner] = 1;
        _allOwners.push(owner);
    }

    function removeOwner(address owner) public isOwner {
        require(_owners[owner] == 1, "Address is not an owner");
        _owners[owner] = 0;
        for (uint i = 0; i < _allOwners.length; i++) {
            if (_allOwners[i] == owner) {
                _allOwners[i] = _allOwners[_allOwners.length - 1];
                _allOwners.pop();
                break;
            }
        }
    }

    function getAllOwners() public view returns (address[] memory) {
        return _allOwners;
    }

    receive() external payable {
        emit DepositFunds(msg.sender, msg.value);
    }

   function removeExpiredTransactions() internal {
    uint i = 0;
    while (i < _pendingTransactions.length) {
        if (
            _transactions[_pendingTransactions[i]].creationTime + DURATION_24_HOURS <
            block.timestamp
        ) {
            deleteTransaction(_pendingTransactions[i]);
        } else {
            i++;
        }
    }
}

  function transferTo(
    address to,
    uint amount
) public validOwner {
    removeExpiredTransactions();
    require(address(this).balance >= amount, "Insufficient balance");
    uint transactionId = _transactionIdx++;
    Transaction storage transaction = _transactions[transactionId];
    transaction.from = msg.sender;
    transaction.to = to;
    transaction.amount = amount;
    transaction.signatureCount = 0;
    transaction.creationTime = block.timestamp;
    transaction.expiryTime = block.timestamp + DURATION_24_HOURS;
    _pendingTransactions.push(transactionId);
    emit TransactionCreated(msg.sender, to, amount, transactionId);
}


function getRemainingTimeForTransaction(uint transactionId) public view returns (uint) {
    Transaction storage transaction = _transactions[transactionId];
    if (block.timestamp >= transaction.expiryTime) {
        return 0;
    }
    return transaction.expiryTime - block.timestamp;
}



  function getPendingTransactions()
    public
    view
    validOwner
    returns (
        uint[] memory,
        address[] memory,
        address[] memory,
        uint[] memory,
        uint8[] memory,
        uint[] memory, 
        uint[] memory  
    )
{
    uint length = _pendingTransactions.length;
    address[] memory fromAddresses = new address[](length);
    address[] memory toAddresses = new address[](length);
    uint[] memory amounts = new uint[](length);
    uint8[] memory signatureCounts = new uint8[](length);
    uint[] memory creationTimes = new uint[](length);
    uint[] memory remainingTimes = new uint[](length);
    for (uint i = 0; i < length; i++) {
        Transaction storage transaction = _transactions[_pendingTransactions[i]];
        fromAddresses[i] = transaction.from;
        toAddresses[i] = transaction.to;
        amounts[i] = transaction.amount;
        signatureCounts[i] = transaction.signatureCount;
        creationTimes[i] = transaction.creationTime;  
        uint elapsedTime = block.timestamp - transaction.creationTime;
        remainingTimes[i] = (elapsedTime >= DURATION_24_HOURS) ? 0 : DURATION_24_HOURS - elapsedTime;
    }
    return (
        _pendingTransactions,
        fromAddresses,
        toAddresses,
        amounts,
        signatureCounts,
        creationTimes,     
        remainingTimes 
    );
}

    function signTransaction(uint transactionId) public validOwner {
        removeExpiredTransactions();
        Transaction storage transaction = _transactions[transactionId];
       require(block.timestamp <= transaction.expiryTime, "Transaction has expired");
        require(transaction.from != address(0), "Transaction must exist");
        require(
            msg.sender != transaction.from,
            "Transaction creator cannot sign"
        );
        require(transaction.signatures[msg.sender] != 1, "Cannot sign twice");
        transaction.signatures[msg.sender] = 1;
        transaction.signatureCount++;
        emit TransactionSigned(msg.sender, transactionId);
        if (transaction.signatureCount >= minSignatures) {
            require(
                address(this).balance >= transaction.amount,
                "Insufficient balance"
            );
            (bool sent, bytes memory data) = transaction.to.call{
                value: transaction.amount
            }("");
            require(sent, "Failed to send Ether");
            emit TransactionCompleted(
                transaction.from,
                transaction.to,
                transaction.amount,
                transactionId
            );
            deleteTransaction(transactionId);
        }
    }

   function deleteTransaction(uint transactionId) public validOwner {
    for (uint i = 0; i < _pendingTransactions.length; i++) {
        if (transactionId == _pendingTransactions[i]) {
            _pendingTransactions[i] = _pendingTransactions[_pendingTransactions.length - 1];
            _pendingTransactions.pop();
            break;
        }
    }
    delete _transactions[transactionId];
}


    function walletBalance() public view returns (uint) {
        return address(this).balance;
    }
}
