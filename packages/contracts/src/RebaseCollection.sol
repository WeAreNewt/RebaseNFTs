// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/**
 * @title RebaseCollection
 * @dev The RebaseCollection is an ERC1155 NFT collection that can also rebase.
 *      It utilises the ERC1155's ability to be both fungible and non fungible.
 *      Each token in the collection has an elastic supply which means you can
 *      rebase on a single token id.
 *
 *      RebaseCollection applies 'base units' and a 'scaling factor' to distribute tokens
 *      and scale the supply respectively.
 *
 *      Rebasing techniques are inspired by Ampleforth's Contracts: https://github.com/ampleforth/ampleforth-contracts
 */
contract RebaseCollection is ERC1155 {
    uint256 public constant COMMON = 0;
    uint256 public constant RARE = 1;
    uint256 public constant LEGENDARY = 2;
    uint256 public constant GOD = 3;

    /**
     * @notice Emitted when tokens of a blacklisted account are burned
     * @param epoch The timestamp of when the rebase occured
     * @param initialTotalSupply The total supply before rebase
     * @param finalTotalSupply The total supply after rebase
     *
     * Requirements:
     * - Must emit when a rebase occurs
     */
    event Rebased(
        uint256 indexed epoch,
        uint256 initialTotalSupply,
        uint256 finalTotalSupply
    );

    // TODO: Add events
    
    uint256 private constant MAX_UINT256 = type(uint256).max;
    uint256 private constant TOTAL_NFTS_TO_MINT = 10000;

    /**
     * @notice The total number of base units that will be in circulation.
     *         Base units are transferred to users and then scaled to create the final balance.
     * @dev It is the largest multiple of the inital total supply for better accuracy
     *      and maximum granularity.
     */
    uint256 private constant MAX_BASE_UNITS = MAX_UINT256 - (MAX_UINT256 % TOTAL_NFTS_TO_MINT);
    uint256 private constant ONE_NFT_WORTH_OF_BASE_UNITS = MAX_BASE_UNITS / TOTAL_NFTS_TO_MINT;

    /**
     * @notice The largest value the total supply can reach
     * @dev When a reabse occurs we request to change the supply by `supplyDelta`
     *      However, the actual `supplyDelta` can deviate from the requested `supplyDelta`
     *      This deviation is guaranteed to be < (_totalSupply^2)/(total_base_units - _totalSupply)
     *      Using type(uint128).max as the MAX_SUPPLY we guarantee the deviation is < 1
     */
    uint256 private constant MAX_SUPPLY = type(uint128).max;

    /**
     * @notice The total supply of tokens in circulation
     * @dev The total supply can change when a rebase occurs
     *      The total supply may not reflect actual amounts of tokens in circulation
     *      due to rounding down.
     */
    mapping(uint256 => uint256) private _totalSupply;

    /**
     * @notice The amount to divide the base units by to get the balance
     */
    mapping(uint256 => uint256) private _scalingFactor;

    /**
     * @notice The base amount of tokens held by an account
     * @dev This amount is divided by a scale factor to get the final balance
     */
    mapping(uint256 => mapping(address => uint256)) private _baseUnitBalances;
    mapping(uint256  => uint256) private total_base_units; 

    constructor(string memory metadataURI) ERC1155(metadataURI) {
        mint(COMMON, 1, "");
        mint(RARE, 1, "");
        mint(LEGENDARY, 1, "");
        mint(GOD, 1, "");
    }

    /**
     * @notice Mints new NFTs
     * @dev To do this you must update total supply, base units balance 
     *      of the owner and the scaling factor
     */
    function mint(
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        require(totalSupply(id) + amount <= TOTAL_NFTS_TO_MINT, "RebaseCollection: Total supply exceeded");
        address operator = _msgSender();

        _totalSupply[id] += amount;
        uint256 baseUnitValue = ONE_NFT_WORTH_OF_BASE_UNITS *  amount;
        total_base_units[id] += baseUnitValue; 
        _baseUnitBalances[id][msg.sender] += baseUnitValue;
        _scalingFactor[id] = total_base_units[id] / _totalSupply[id];
        emit TransferSingle(operator, address(0), msg.sender, id, amount);

        // _doSafeTransferAcceptanceCheck(operator,address(0),to,id,amount,data);  // TODO: Add this back
    }

    /**
     * @notice Adjusts the total supply of a token `id` by a `supplyDelta`
     * @param id The token id of the NFT you wish to adjust the supply for.
     * @param supplyDelta The number of new tokens to add into circulation (can be negative).
     * @return The total supply after the rebase.
     */
    function rebase(uint256 id, int256 supplyDelta) external returns (uint256) {
        uint256 initialTotalSupply = _totalSupply[id];

        if (supplyDelta == 0) {
            emit Rebased(block.timestamp, initialTotalSupply, _totalSupply[id]);
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

        // When the total supply changes you must also adjust the scaling factor to change the balances
        _scalingFactor[id] = total_base_units[id] / _totalSupply[id];

        emit Rebased(block.timestamp, initialTotalSupply, _totalSupply[id]);
        return _totalSupply[id];
    }

    /**
     * @notice The total number of tokens in circulation
     */
    function totalSupply(uint256 id) public view returns (uint256) {
        return _totalSupply[id];
    }

    /**
     * @notice The total number of base units in circulation
     */
    function baseTotalSupply(uint256 id) external view returns (uint256) {
        return total_base_units[id];
    }

    /**
     * @notice The number of tokens an `account` holds for a token `id`
     * @dev Balance is retrieved by dividing the base units by the scaling factor
     */
    function balanceOf(address account, uint256 id)
        public
        view
        override
        returns (uint256)
    {
        // TODO: We would probably get better results by rounding up/down?
        // TODO: What happens when balanceOf is zero? How would the user sell the NFT on OpenSea?
        require(
            account != address(0),
            "RebaseCollection: balance query for the zero address"
        );

        uint256 baseUnitValue = _baseUnitBalances[id][account]; 
        if (baseUnitValue > 0) {
            return  baseUnitValue / _scalingFactor[id]; 
        } else {
            return 0;
        }
        
    }

    /**
     * @notice The number of base units an `account` holds for a token `id`
     */
    function baseBalanceOf(address account, uint256 id)
        external
        view
        returns (uint256)
    {
        return _baseUnitBalances[id][account];
    }

    /**
     * @notice Transfers a desired `amount` of a token `id`
     * @dev Caller enters a desired `amount` which must be converted
     *      to its `baseUnitValue` before transfer.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "RebaseCollection: caller is not owner nor approved"
        );
        require(to != address(0), "RebaseCollection: transfer to the zero address");
        require(_scalingFactor[id] > 0, "RebaseCollection: scaling factor must be greater than zero");

        address operator = _msgSender();
        uint256 baseUnitValue = amount * _scalingFactor[id]; // Scale `amount` so we only transfer base unit value
        uint256 fromBalance = _baseUnitBalances[id][from];
        require(
            fromBalance >= baseUnitValue,
            "RebaseCollection: insufficient balance for transfer"
        );
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
