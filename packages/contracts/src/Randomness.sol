// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

/// @title A pseudo-random number generator
/// @notice You can use this contract to generate a pseudo-random number between 
/// two values given a modulus.
contract Randomness {

    /// @notice A state variable used to increase to help increase randomness
    /// in the number generation
    /// @dev Will always be incremented in the generateRandom() funcion
    uint private nonce = 0;
    

    /// @notice Generates a random number given a mod
    /// @dev All numbers will be generated between 0 and an custom number
    /// given the _mod param
    /// @param _mod The mod to generate the random value
    /// @return the random number
    function generateRandom(uint256 _mod) public returns(uint256){ //TODO: change visibility to internal
        nonce++; 
        return uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender, nonce))) % _mod;
    }


}
