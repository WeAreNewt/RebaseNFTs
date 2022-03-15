// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "./IRebaseCollection.sol";
import "./IBaseCollection.sol";
import "./Randomness.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

contract Staking is Randomness, IERC1155Receiver {
    IBaseCollection NFT;
    IRebaseCollection sNFT;

    // Track original NFTs
    mapping(address => mapping(uint256 => uint256)) stakers;

    constructor(address _NFT, address _sNFT) {
        NFT = IBaseCollection(_NFT);
        sNFT = IRebaseCollection(_sNFT);
    }

    function stake(uint256 _amount, uint256 _id) external {
        require(_amount > 0, "Staking: Can't stake an amount of zero");
        require(
            NFT.balanceOf(msg.sender, _id) >= _amount,
            "Staking: You dont have enough NFTs to stake"
        );
        stakers[msg.sender][_id] += _amount;

        NFT.safeTransferFrom(msg.sender, address(this), _id, _amount, "");

        sNFT.mint(_id, _amount, "");
    }

    function unstake(uint256 _amount, uint256 _id) external {
        require(_amount > 0, "Staking: Can't unstake an amount of zero");
        require(
            sNFT.balanceOf(msg.sender, _id) >= _amount,
            "Staking: Not enough sNFTs"
        );

        uint256 nftsStaked = stakers[msg.sender][_id];

        if (nftsStaked >= _amount) {
            stakers[msg.sender][_id] -= _amount;
            NFT.safeTransferFrom(address(this), msg.sender, _id, _amount, "");
            sNFT.safeTransferFrom(msg.sender, address(this), _id, _amount, "");
            return;
        } else {
            uint256 leftOver = _amount - nftsStaked;

            if (nftsStaked > 0) {
                stakers[msg.sender][_id] -= _amount;
                NFT.safeTransferFrom(
                    address(this),
                    msg.sender,
                    _id,
                    nftsStaked,
                    ""
                );
            }

            sNFT.burnFrom(msg.sender, _id, _amount);

            for (uint256 i = 0; i < leftOver; i++) {
                // Generate random number between 0 and 99
                uint256 randomValue = generateRandom(100);

                // There is a 1% chance that the random value is 37
                // TODO: What is the incentive for the top tokenId holders?
                if (randomValue == 37 && NFT.exists(_id + 1)) {
                    NFT.mint(msg.sender, _id + 1, 1, "");
                } else {
                    NFT.mint(msg.sender, _id, 1, "");
                }
            }
        }
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function supportsInterface(bytes4 interfaceId)
        external
        view
        returns (bool)
    {
        return true; // Change lol
    }
}
