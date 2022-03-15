// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "ds-test/test.sol";
import "src/RebaseCollection.sol";
import "src/BaseCollection.sol";
import "src/Staking.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

contract StakingTest is DSTest, IERC1155Receiver {
    RebaseCollection sNFT;
    BaseCollection NFT;
    Staking stakingContract;

    uint256 public constant COMMON = 0;
    uint256 public constant RARE = 1;
    uint256 public constant LEGENDARY = 2;
    uint256 public constant GOD = 3;

    uint256 private constant INITIAL_SUPPLY = 1;

    function setUp() public {
        sNFT = new RebaseCollection("");
        NFT = new BaseCollection("");
        stakingContract = new Staking(
            address(NFT),
            address(sNFT)
        );
    }

    function testStaking() public {
        uint256 amount = 2;

        // Mint some Base NFTs
        NFT.mint(address(this), COMMON, amount, "");

        // Approve Staking contract to handle NFTs
        NFT.setApprovalForAll(address(stakingContract), true);
        sNFT.setApprovalForAll(address(stakingContract), true);

        // Stake Base NFTs
        stakingContract.stake(amount, COMMON);

        // Check you get an equal amount of sNFT back
        assertEq(
            sNFT.balanceOf(address(this), COMMON),
            amount
        );

        // Rebase all sNFT ids and increase supply by 50%
        sNFT.rebase(COMMON, sNFT.totalSupply(COMMON) / 2); 
        sNFT.rebase(RARE, sNFT.totalSupply(RARE) / 2); 
        sNFT.rebase(LEGENDARY, sNFT.totalSupply(LEGENDARY) / 2); 
        sNFT.rebase(GOD, sNFT.totalSupply(GOD) / 2); 

        // Check you now have 50% more sNFTs
        uint256 newBalance = amount + (amount / 2);
        assertEq(
            sNFT.balanceOf(address(this), COMMON),
            newBalance
        );

        // Unstake (Convert sNFT back to Base NFT)
        stakingContract.unstake(newBalance, COMMON);
        
       
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
