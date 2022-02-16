// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "ds-test/test.sol";
import "src/RebaseCollection.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

contract RebaseCollectionTest is DSTest, IERC1155Receiver {
    RebaseCollection rebaseCollection;

    uint256 public constant COMMON = 0;
    uint256 public constant RARE = 1;
    uint256 public constant LEGENDARY = 2;
    uint256 public constant GOD = 3;

    uint256 private constant INITIAL_SUPPLY = 1;

    function setUp() public {
        rebaseCollection = new RebaseCollection("");
    }

    function testInitialisedCorrectly() public {
        // Correct Total Supply
        assertEq(rebaseCollection.totalSupply(COMMON), INITIAL_SUPPLY);
        assertEq(rebaseCollection.totalSupply(RARE), INITIAL_SUPPLY);
        assertEq(rebaseCollection.totalSupply(LEGENDARY), INITIAL_SUPPLY);
        assertEq(rebaseCollection.totalSupply(GOD), INITIAL_SUPPLY);

        // Correct Balance
        assertEq(
            rebaseCollection.balanceOf(address(this), COMMON),
            INITIAL_SUPPLY
        );
        assertEq(
            rebaseCollection.balanceOf(address(this), RARE),
            INITIAL_SUPPLY
        );
        assertEq(
            rebaseCollection.balanceOf(address(this), LEGENDARY),
            INITIAL_SUPPLY
        );
        assertEq(
            rebaseCollection.balanceOf(address(this), GOD),
            INITIAL_SUPPLY
        );
    }

    function testMinting() public {
        uint256 amountToMint = 10;

        uint256 balanceBefore = rebaseCollection.balanceOf(
            address(this),
            COMMON
        );
        uint256 supplyBefore = rebaseCollection.totalSupply(COMMON);

        rebaseCollection.mint(COMMON, amountToMint, "");

        assertEq(
            rebaseCollection.balanceOf(address(this), COMMON),
            balanceBefore + amountToMint
        );
        assertEq(
            rebaseCollection.totalSupply(COMMON),
            supplyBefore + amountToMint
        );
    }

    function testTransferFrom() public {
        uint256 amountToTransfer = 1;

        rebaseCollection.safeTransferFrom(
            address(this),
            address(0x11),
            COMMON,
            amountToTransfer,
            ""
        );

        assertEq(
            rebaseCollection.balanceOf(address(this), COMMON),
            INITIAL_SUPPLY - amountToTransfer
        );
        assertEq(
            rebaseCollection.balanceOf(address(0x11), COMMON),
            amountToTransfer
        );
    }

    function testBatchTransferFrom() public {
        uint256 amountToTransfer = 1;
        address[] memory defaultOperators = new address[](1);

        uint256[] memory ids = new uint256[](4);
        (ids[0], ids[1], ids[2], ids[3]) = (COMMON, RARE, LEGENDARY, GOD);
        uint256[] memory amounts = new uint256[](4);
        (amounts[0], amounts[1], amounts[2], amounts[3]) = (amountToTransfer,amountToTransfer,amountToTransfer,amountToTransfer);
        address[] memory fromAddresses = new address[](4);
        (fromAddresses[0], fromAddresses[1], fromAddresses[2], fromAddresses[3]) = (address(this),address(this),address(this),address(this));
        address[] memory toAddresses = new address[](4);
        (toAddresses[0], toAddresses[1], toAddresses[2], toAddresses[3]) = (address(0x11),address(0x11),address(0x11),address(0x11));
        

        rebaseCollection.safeBatchTransferFrom(
            address(this),
            address(0x11),
            ids,
            amounts,
            ""
        );

        uint256 fromBalance = INITIAL_SUPPLY - amountToTransfer;
        uint256[] memory batchBalancesFrom = rebaseCollection.balanceOfBatch(fromAddresses, ids);
        uint256[] memory batchBalancesTo = rebaseCollection.balanceOfBatch(toAddresses, ids);


        assertEq(batchBalancesFrom[0], fromBalance);
        assertEq(batchBalancesFrom[1], fromBalance);
        assertEq(batchBalancesFrom[2], fromBalance);
        assertEq(batchBalancesFrom[3], fromBalance);

        assertEq(batchBalancesTo[0], amounts[0]);
        assertEq(batchBalancesTo[1], amounts[1]);
        assertEq(batchBalancesTo[2], amounts[2]);
        assertEq(batchBalancesTo[3], amounts[3]);

    }

    function testTotalBalanceAfterRebase() public {
        // Test that balance changes as expected after rebase

        rebaseCollection.rebase(COMMON, rebaseCollection.totalSupply(COMMON)); // Double the total supply
        uint256 commonBalance = rebaseCollection.balanceOf(
            address(this),
            COMMON
        );
        // Doubling the total supply should double your balance
        assertEq(commonBalance, INITIAL_SUPPLY * 2);
    }

    function testIncreaseFractionBehaviour() public {
        /**
         * Test that there is no fractions:
         * 1 NFT becomes 2 NFTs when rebase increases supply >= 100%
         * 2 NFT becomes 3 NFTs when rebase increases supply >= 50%
         * 3 NFT becomes 4 NFTs when rebase increases supply >= ~33%
         */

        rebaseCollection.mint(COMMON, 9999, ""); // Now the supply is 10k

        // Transfer 1 NFT
        rebaseCollection.safeTransferFrom(
            address(this),
            address(0x11),
            COMMON,
            1,
            ""
        );

        // Increase supply by ~99.999%
        rebaseCollection.rebase(
            COMMON,
            rebaseCollection.totalSupply(COMMON) - 1
        );

        // Here we see even though we increased the total supply by 99% we still only have 1 NFT
        // This is because we have a low supply (only 1 NFT) which is increased to 1.99 NFTs. This is then
        // rounded down to 1 NFT by Solidity.

        // If you only have 1 NFT you need to increase the supply at least 100% to have 2 NFTs
        // The more NFTs you have the less you have to increase the supply to get another NFT
        assertEq(rebaseCollection.balanceOf(address(0x11), COMMON), 1);

        rebaseCollection.rebase(COMMON, 1); // Increase supply by ~0.01% (Total of 100%)
        // When we increase the supply by 100% we get 2 NFTs in total as expected
        assertEq(rebaseCollection.balanceOf(address(0x11), COMMON), 2);
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
