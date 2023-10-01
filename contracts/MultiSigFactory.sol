// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

// Import Clones library from OpenZeppelin
import "./MultiSigWallet.sol";
 import "@openzeppelin/contracts/proxy/Clones.sol";

contract BunyMultiFactory {
    using Clones for address;

    address private _template;

    struct Deployment {
        address deployer;
        address contractAddress;
        uint deploymentNumber;
        string contractName; 
    }

      // New UserWallets struct
    struct UserWallets {
        address[] wallets;
    }

    mapping(address => address[]) public userWallets; // Mapping from owner's address to their associated wallets
    mapping(address => address[]) public ownersOfWallet;
    mapping(address => Deployment[]) public deploymentsByDeployer;
    event ContractCloned(address indexed target);

    constructor(address template_) {
        require(template_ != address(0), "Invalid template address");
        _template = template_;
    }

    function createMultiSigWallet(uint _minSignatures, string memory _contractName) public returns (address) {
    address clone = _template.clone();
    MultiSigWallet(payable(clone)).initialize(_minSignatures, _contractName, msg.sender, address(this));
    uint deploymentNumber = deploymentsByDeployer[msg.sender].length + 1; // Next deployment number for this deployer

    Deployment memory newDeployment = Deployment({
        deployer: msg.sender,
        contractAddress: clone,
        deploymentNumber: deploymentNumber,
        contractName: _contractName   // Set the contractName field here
    });

    deploymentsByDeployer[msg.sender].push(newDeployment);
    emit ContractCloned(clone);
    userWallets[msg.sender].push(clone);
    return clone;
}


    function setTemplate(address newTemplate) public {
        require(newTemplate != address(0), "Invalid template address");
        _template = newTemplate;
    }

    function getDeploymentsOf(address deployer) public view returns (Deployment[] memory) {
        return deploymentsByDeployer[deployer];
    }
     function newOwnerAdded(address walletAddress, address newOwner, address deployer) external {
        // Only a MultiSigWallet contract created from this factory should be able to call this function
        require(deploymentsByDeployer[deployer].length > 0, "Unauthorized");
        ownersOfWallet[walletAddress].push(newOwner);
        userWallets[newOwner].push(walletAddress);
    }

    function getWalletsOfUser(address user) public view returns (address[] memory) {
        return userWallets[user];
    }

    function getOwnersOf(address walletAddress) public view returns (address[] memory) {
        return ownersOfWallet[walletAddress];
    }
}
