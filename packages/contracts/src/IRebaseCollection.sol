// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";


interface IRebaseCollection is IERC1155 {

    event Rebased(uint256 indexed epoch,uint256 initialTotalSupply,uint256 finalTotalSupply);

    function mint( uint256 id, uint256 amount, bytes memory data) external;

    function rebase(uint256 id, uint256 supplyDelta) external returns (uint256);

    function totalSupply(uint256 id) external view returns (uint256);

    function baseTotalSupply(uint256 id) external view returns (uint256);

    function baseBalanceOf(address account, uint256 id) external view returns (uint256);

    function exists(uint256 id) external view returns (bool);

}
