// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "./IRebaseCollection.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract Staking {
    IERC1155 NFT;
    IRebaseCollection sNFT;

    mapping(address => mapping(uint256 => uint256)) stakers;

    constructor(IERC1155 _NFT, IRebaseCollection _sNFT) {
        NFT = _NFT;
        sNFT = _sNFT;
    }

    function stake(uint256 _amount, uint256 _id) external {
        // Track original NFTs
        stakers[msg.sender][_id] += _amount;

        NFT.safeTransferFrom(msg.sender, address(this), _id, _amount, "");
        sNFT.safeTransferFrom(address(this), msg.sender, _id, _amount, "");
        // TODO: Integrate rebase of sNFT into staking. Also look at reward machanism for triggering rebase
    }

    function unstake(uint256 _amount, uint256 _id) external {
        // require(_amount <= stakers[msg.sender][_id], );
        require(_amount > 0);
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
                NFT.safeTransferFrom(address(this), msg.sender, _id, nftsStaked, "");
            }
            sNFT.safeTransferFrom(msg.sender, address(this), _id, _amount, "");

            // TODO: Transfer rewards with the left overs
        }

    }
}
