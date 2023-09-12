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
    }

    mapping(address => Deployment[]) public deploymentsByDeployer;
    event ContractCloned(address indexed target);

    constructor(address template_) {
        require(template_ != address(0), "Invalid template address");
        _template = template_;
    }

    function createMultiSigWallet(uint _minSignatures, string memory _contractName) public returns (address) {
        address clone = _template.clone();
        MultiSigWallet(payable(clone)).initialize(_minSignatures, _contractName);
        uint deploymentNumber = deploymentsByDeployer[msg.sender].length + 1; // Next deployment number for this deployer
        Deployment memory newDeployment = Deployment({
            deployer: msg.sender,
            contractAddress: clone,
            deploymentNumber: deploymentNumber
        });
        deploymentsByDeployer[msg.sender].push(newDeployment);
        emit ContractCloned(clone);
        return clone;
    }

    function setTemplate(address newTemplate) public {
        require(newTemplate != address(0), "Invalid template address");
        _template = newTemplate;
    }

    function getDeploymentsOf(address deployer) public view returns (Deployment[] memory) {
        return deploymentsByDeployer[deployer];
    }
}