// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.6;

import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {IERC2981Upgradeable, IERC165Upgradeable} from "@openzeppelin/contracts-upgradeable/interfaces/IERC2981Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {CountersUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import {AddressUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

import {SharedNFTLogic} from "./SharedNFTLogic.sol";
import {IEditionSingleMintable} from "./IEditionSingleMintable.sol";


contract erc721Static is
    ERC721Upgradeable,
    IEditionSingleMintable,
    IERC2981Upgradeable,
    OwnableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    event PriceChanged(uint256 amount);
    event EditionSold(uint256 price, address owner);
    address contractAddress;

    
    string public description;
    // animation_url field in the metadata
    string private animationUrl;
    // Hash for the associated animation
    // Image in the metadata
    string private imageUrl;
    // Hash for the associated image

    // Total size of edition that can be minted
    uint256 public editionSize;
    // Current token id minted
    CountersUpgradeable.Counter private atEditionId;
    // Royalty amount in bps
    uint256 royaltyBPS;
    // Addresses allowed to mint edition
    mapping(address => bool) allowedMinters;

    // Price for sale
    uint256 public salePrice;

    // NFT rendering logic contract
    SharedNFTLogic private immutable sharedNFTLogic;

    // Global constructor for factory
 constructor(address marketplaceAddress, SharedNFTLogic _sharedNFTLogic) {
        sharedNFTLogic = _sharedNFTLogic;    
        contractAddress = marketplaceAddress;


    }
    function initialize(
        address _owner,
        string memory _name,
        string memory _symbol,
        string memory _description,
        string memory _animationUrl,
        string memory _imageUrl,
        uint256 _editionSize,
        uint256 _royaltyBPS
    ) public initializer {
        __ERC721_init(_name, _symbol);
        __Ownable_init();
        // Set ownership to original sender of contract call
        transferOwnership(_owner);
        description = _description;
        animationUrl = _animationUrl;
        imageUrl = _imageUrl;
        editionSize = _editionSize;
        royaltyBPS = _royaltyBPS;
        // Set edition id start to be 1 not 0
        atEditionId.increment();
    }


    /// @dev returns the number of minted tokens within the edition
    function totalSupply() public view returns (uint256) {
        return atEditionId.current() - 1;
    }
    /**
        Simple eth-based sales function
        More complex sales functions can be implemented through ISingleEditionMintable interface
     */

    /**
      @dev This allows the user to purchase a edition edition
           at the given price in the contract.
     */
    function purchase() external payable returns (uint256) {
        require(salePrice > 0, "Not for sale");
        require(msg.value == salePrice, "Wrong price");
        address[] memory toMint = new address[](1);
        toMint[0] = msg.sender;
        emit EditionSold(salePrice, msg.sender);
        return _mintEditions(toMint);
    }

    /**
      @param _salePrice if sale price is 0 sale is stopped, otherwise that amount 
                       of ETH is needed to start the sale.
      @dev This sets a simple ETH sales price
           Setting a sales price allows users to mint the edition until it sells out.
           For more granular sales, use an external sales contract.
     */
    function setSalePrice(uint256 _salePrice) external onlyOwner {
        salePrice = _salePrice;
        emit PriceChanged(salePrice);
    }

    /**
      @dev This withdraws ETH from the contract to the contract owner.
     */
    function withdraw() external onlyOwner {
        // No need for gas limit to trusted address.
        AddressUpgradeable.sendValue(payable(owner()), address(this).balance);
    }

    /**
      @dev This helper function checks if the msg.sender is allowed to mint the
            given edition id.
     */
    function _isAllowedToMint() internal view returns (bool) {
        if (owner() == msg.sender) {
            return true;
        }
        if (allowedMinters[address(0x0)]) {
            return true;
        }
        return allowedMinters[msg.sender];
    }

    /**
      @param to address to send the newly minted edition to
      @dev This mints one edition to the given address by an allowed minter on the edition instance.
     */
    function mintEdition(address to) external override returns (uint256) {
        require(_isAllowedToMint(), "Needs to be an allowed minter");
        address[] memory toMint = new address[](1);
        toMint[0] = to;
        return _mintEditions(toMint);
    }

    /**
      @param recipients list of addresses to send the newly minted editions to
      @dev This mints multiple editions to the given list of addresses.
     */
    function mintEditions(address[] memory recipients)
        external
        override
        returns (uint256)
    {
        require(_isAllowedToMint(), "Needs to be an allowed minter");
        return _mintEditions(recipients);
    }

    /**
        Simple override for owner interface.
     */
    function owner()
        public
        view
        override(OwnableUpgradeable, IEditionSingleMintable)
        returns (address)
    {
        return super.owner();
    }

    /**
      @param minter address to set approved minting status for
      @param allowed boolean if that address is allowed to mint
      @dev Sets the approved minting status of the given address.
           This requires that msg.sender is the owner of the given edition id.
           If the ZeroAddress (address(0x0)) is set as a minter,
             anyone will be allowed to mint.
           This setup is similar to setApprovalForAll in the ERC721 spec.
     */
    function setApprovedMinter(address minter, bool allowed) public onlyOwner {
        allowedMinters[minter] = allowed;
    }

    /**
      @dev Allows for updates of edition urls by the owner of the edition.
           Only URLs can be updated (data-uris are supported), hashes cannot be updated.
     */
    function updateEditionURLs(
        string memory _imageUrl,
        string memory _animationUrl
    ) public onlyOwner {
        imageUrl = _imageUrl;
        animationUrl = _animationUrl;
    }

    /// Returns the number of editions allowed to mint (max_uint256 when open edition)
    function numberCanMint() public view override returns (uint256) {
        // Return max int if open edition
        if (editionSize == 0) {
            return type(uint256).max;
        }
        // atEditionId is one-indexed hence the need to remove one here
        return editionSize + 1 - atEditionId.current();
    }

    /**
        @param tokenId Token ID to burn
        User burn function for token id 
     */
    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Not approved");
        _burn(tokenId);
    }

    /**
      @dev Private function to mint als without any access checks.
           Called by the public edition minting functions.
     */
    function _mintEditions(address[] memory recipients)
        internal
        returns (uint256)
    {
        uint256 startAt = atEditionId.current();
        uint256 endAt = startAt + recipients.length - 1;
        require(editionSize == 0 || endAt <= editionSize, "Sold out");
        while (atEditionId.current() <= endAt) {
            _mint(
                recipients[atEditionId.current() - startAt],
                atEditionId.current()
            );
            atEditionId.increment();
        }
        return atEditionId.current();
    }

    /**
      @dev Get URIs for edition NFT
      @return imageUrl,  animationUrl
     */
    function getURIs()
        public
        view
        returns (
            string memory,
            string memory        )
    {
        return (imageUrl,  animationUrl);
    }

    /**
        @dev Get royalty information for token
        @param _salePrice Sale price for the token
     */
    function royaltyInfo(uint256, uint256 _salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        if (owner() == address(0x0)) {
            return (owner(), 0);
        }
        return (owner(), (_salePrice * royaltyBPS) / 10_000);
    }

    /**
        @dev Get URI for given token id
        @param tokenId token id to get uri for
        @return base64-encoded json metadata object
    */
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "No token");

        return
            sharedNFTLogic.createMetadataEdition(
                name(),
                description,
                imageUrl,
                animationUrl,
                tokenId,
                editionSize
            );
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, IERC165Upgradeable)
        returns (bool)
    {
        return
            type(IERC2981Upgradeable).interfaceId == interfaceId ||
            ERC721Upgradeable.supportsInterface(interfaceId);
    }
}
