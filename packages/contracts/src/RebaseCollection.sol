// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract RebaseCollection is ERC1155 {
    uint256 public constant COMMON = 0;
    uint256 public constant UNCOMMON = 1;
    uint256 public constant RARE = 2;
    uint256 public constant EPIC = 3;
    uint256 public constant LEGENDARY = 4;

    event LogRebase(uint256 indexed epoch, uint256 totalSupply);

    uint256 private constant MAX_UINT256 = type(uint256).max;
    uint256 private immutable INITIAL_TOTAL_SUPPLY;

    // TOTAL_BASE_UNITS is a multiple of INITIAL_TOTAL_SUPPLY so that _baseUnitsPerSupply is an integer.
    // Use the highest value that fits in a uint256 for max granularity.
    uint256 private immutable TOTAL_BASE_UNITS;

    // MAX_SUPPLY = maximum integer < (sqrt(4*TOTAL_BASE_UNITS + 1) - 1) / 2
    uint256 private constant MAX_SUPPLY = type(uint128).max;

    mapping(uint256 => uint256) private _totalSupply;
    mapping(uint256 => uint256) private _baseUnitsPerSupply;
    mapping(uint256 => mapping(address => uint256)) private _baseUnitBalances; 

    mapping(address => mapping(address => uint256)) private _allowances;

    constructor(string memory metadataURI, uint256 initialSupply) ERC1155(metadataURI) {
        INITIAL_TOTAL_SUPPLY = initialSupply;
        TOTAL_BASE_UNITS = MAX_UINT256 - (MAX_UINT256 % INITIAL_TOTAL_SUPPLY);
        initTokenId(COMMON);
        initTokenId(UNCOMMON);
        initTokenId(RARE);
        initTokenId(EPIC);
        initTokenId(LEGENDARY);
    }

    function initTokenId(uint256 id) private {
        _totalSupply[id] = INITIAL_TOTAL_SUPPLY; 
        _baseUnitBalances[id][msg.sender] = TOTAL_BASE_UNITS; 
        _baseUnitsPerSupply[id] = TOTAL_BASE_UNITS / _totalSupply[id]; 
    }

    /**
     * @param supplyDelta The number of new tokens to add into circulation via expansion.
     * @return The total number of fragments after the supply adjustment.
     */
    function rebase(uint256 id, int256 supplyDelta)
        external
        returns (uint256)
    {        
        if (supplyDelta == 0) {
            emit LogRebase(block.timestamp, _totalSupply[id]);
            return _totalSupply[id];
        }

        if (supplyDelta < 0) {
            _totalSupply[id] = _totalSupply[id] - uint256(-supplyDelta);
        } else {
            _totalSupply[id] = _totalSupply[id] + uint256(supplyDelta);
        }

        if (_totalSupply[id] > MAX_SUPPLY) {
            _totalSupply[id] = MAX_SUPPLY;
        }

        _baseUnitsPerSupply[id] = TOTAL_BASE_UNITS / _totalSupply[id];

        // From this point forward, _baseUnitsPerSupply is taken as the source of truth.
        // We recalculate a new _totalSupply to be in agreement with the _baseUnitsPerSupply
        // conversion rate.
        // This means our applied supplyDelta can deviate from the requested supplyDelta,
        // but this deviation is guaranteed to be < (_totalSupply^2)/(TOTAL_BASE_UNITS - _totalSupply).
        //
        // In the case of _totalSupply <= MAX_UINT128 (our current supply cap), this
        // deviation is guaranteed to be < 1, so we can omit this step. If the supply cap is
        // ever increased, it must be re-included.
        // _totalSupply = TOTAL_BASE_UNITS / _baseUnitsPerSupply)

        emit LogRebase(block.timestamp, _totalSupply[id]);
        return _totalSupply[id];
    }

    function totalSupply(uint256 id) public view returns (uint256) {
        return _totalSupply[id];
    }

    function balanceOf(address account, uint256 id) public view override returns (uint256) {
        require(account != address(0), "ERC1155: balance query for the zero address");
        return _baseUnitBalances[id][account] / _baseUnitsPerSupply[id] ;
    }

    function baseBalanceOf(address account, uint256 id) external view returns (uint256) {
        return _baseUnitBalances[id][account];
    }

    function baseTotalSupply() external view returns (uint256) {
        return TOTAL_BASE_UNITS;
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );
        require(to != address(0), "ERC1155: transfer to the zero address");

        address operator = _msgSender();
        uint256 baseUnitValue = amount * _baseUnitsPerSupply[id];

        uint256 fromBalance = _baseUnitBalances[id][from];
        require(fromBalance >= baseUnitValue, "ERC1155: insufficient balance for transfer");
        unchecked {
            _baseUnitBalances[id][from] = fromBalance - baseUnitValue;
        }
        _baseUnitBalances[id][to] += baseUnitValue;

        emit TransferSingle(operator, from, to, id, amount);

        // _doSafeTransferAcceptanceCheck(operator, from, to, id, amount, data); // TODO: Add this back
    }

    // TODO: safeBatchTransferFrom

    /**
     * @dev Indicates whether any token exist with a given id, or not.
     */
    function exists(uint256 id) public view returns (bool) {
        return totalSupply(id) > 0;
    }
    
}
