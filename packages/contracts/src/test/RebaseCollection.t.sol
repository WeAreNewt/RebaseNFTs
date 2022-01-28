// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "ds-test/test.sol";
import "src/RebaseCollection.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

contract RebaseCollectionTest is DSTest, IERC1155Receiver {
    RebaseCollection rebaseCollection;

    uint256 private constant COMMON = 0;
    uint256 private constant UNCOMMON = 1;
    uint256 private constant RARE = 2;
    uint256 private constant EPIC = 3;
    uint256 private constant LEGENDARY = 4;

    uint256 private constant INITIAL_SUPPLY = 10000;
    function setUp() public {
        rebaseCollection = new RebaseCollection("");
    }

    function testInitTotalSupply() public {
        uint256 commonSupply = rebaseCollection.totalSupply(COMMON);
        uint256 uncommonSupply = rebaseCollection.totalSupply(UNCOMMON);
        uint256 rareSupply = rebaseCollection.totalSupply(RARE);
        uint256 epicSupply = rebaseCollection.totalSupply(EPIC);
        uint256 legendarySupply = rebaseCollection.totalSupply(LEGENDARY);

        assertEq(commonSupply, INITIAL_SUPPLY);
        assertEq(uncommonSupply, INITIAL_SUPPLY);
        assertEq(rareSupply, INITIAL_SUPPLY);
        assertEq(epicSupply, INITIAL_SUPPLY);
        assertEq(legendarySupply, INITIAL_SUPPLY);
    }

    function testInitTotalBalance() public {
        uint256 commonBalance = rebaseCollection.balanceOf(address(this), COMMON);
        uint256 uncommonBalance = rebaseCollection.balanceOf(address(this), UNCOMMON);
        uint256 rareBalance = rebaseCollection.balanceOf(address(this), RARE);
        uint256 epicBalance = rebaseCollection.balanceOf(address(this), EPIC);
        uint256 legendaryBalance = rebaseCollection.balanceOf(address(this), LEGENDARY);

        assertEq(commonBalance, INITIAL_SUPPLY);
        assertEq(uncommonBalance, INITIAL_SUPPLY);
        assertEq(rareBalance, INITIAL_SUPPLY);
        assertEq(epicBalance, INITIAL_SUPPLY);
        assertEq(legendaryBalance, INITIAL_SUPPLY);
    }

    function testTransferFrom() public {

        uint256 amountToTransfer = 1; 

        rebaseCollection.safeTransferFrom(address(this), address(0x11), COMMON, amountToTransfer, "");
        rebaseCollection.safeTransferFrom(address(this), address(0x11), UNCOMMON, amountToTransfer, "");

        assertEq(rebaseCollection.balanceOf(address(this), COMMON), INITIAL_SUPPLY - amountToTransfer);
        assertEq(rebaseCollection.balanceOf(address(this), UNCOMMON), INITIAL_SUPPLY - amountToTransfer);
        assertEq(rebaseCollection.balanceOf(address(0x11), COMMON), amountToTransfer);
        assertEq(rebaseCollection.balanceOf(address(0x11), UNCOMMON), amountToTransfer);

    }

    function testTotalBalanceAfterRebase() public {

        rebaseCollection.rebase(COMMON, int256(rebaseCollection.totalSupply(COMMON))); // Double the total supply
        rebaseCollection.rebase(UNCOMMON, int256(rebaseCollection.totalSupply(UNCOMMON))); // Double the total supply
        rebaseCollection.rebase(RARE, int256(rebaseCollection.totalSupply(RARE))); // Double the total supply

        uint256 commonBalance = rebaseCollection.balanceOf(address(this), COMMON);
        uint256 uncommonBalance = rebaseCollection.balanceOf(address(this), UNCOMMON);
        uint256 rareBalance = rebaseCollection.balanceOf(address(this), RARE);
        uint256 epicBalance = rebaseCollection.balanceOf(address(this), EPIC);
        uint256 legendaryBalance = rebaseCollection.balanceOf(address(this), LEGENDARY);

        assertEq(commonBalance, INITIAL_SUPPLY * 2);
        assertEq(uncommonBalance, INITIAL_SUPPLY * 2);
        assertEq(rareBalance, INITIAL_SUPPLY * 2);
        assertEq(epicBalance, INITIAL_SUPPLY);
        assertEq(legendaryBalance, INITIAL_SUPPLY);
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
