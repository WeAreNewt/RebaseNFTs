// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "ds-test/test.sol";
import 'src/Randomness.sol';
contract RandomnessTest is DSTest {

    Randomness randomness;
    function setUp() public {
        randomness = new Randomness();
    }

    function testGenerateRandom() public {
        uint256 randomValue = randomness.generateRandom(100);
        require(randomValue >= 0 && randomValue <= 99);
    }
   
}