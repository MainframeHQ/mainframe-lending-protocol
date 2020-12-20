/* SPDX-License-Identifier: LGPL-3.0-or-later */
pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./ChainlinkOperatorInterface.sol";
import "@paulrberg/contracts/token/erc20/Erc20Interface.sol";

/**
 * @title ChainlinkOperator
 * @author Mainframe
 * @notice Manages and aggregates USD-quoted Chainlink price feeds.
 */
// TODO: to be tested
contract ChainlinkOperator is ChainlinkOperatorInterface {
    mapping(string => Feed) private _feeds;
    address private _owner;

    modifier onlyOwner() {
        require(_owner == msg.sender, "ChainlinkOperator: caller is not owner of contract");
        _;
    }

    modifier feedExists(address feedId) {
        require(feedId != address(0), "ChainlinkOperator: price feed doesn't exist");
        _;
    }

    constructor() {
        _owner = msg.sender;
    }

    /// @inheritdoc ChainlinkOperatorInterface
    function price(string memory symbol) external view override feedExists(_feeds[symbol].id) returns (uint256) {
        require(!_feeds[symbol].disabled, "ChainlinkOperator: price feed is disabled for symbol");

        (, int256 answer, , , ) = IAggregatorV3(_feeds[symbol].id).latestRoundData();
        return uint256(answer);
    }

    /// @inheritdoc ChainlinkOperatorInterface
    function addFeed(IAggregatorV3 feed, Erc20Interface asset) external override {
        uint8 decimals = feed.decimals();
        require(decimals == 8, "ChainlinkOperator: non-USD price feed");

        _feeds[asset.symbol()] = Feed(address(feed), address(asset), false);
    }

    /// @inheritdoc ChainlinkOperatorInterface
    function getFeed(string memory symbol) external view override returns (Feed memory) {
        return _feeds[symbol];
    }

    /// @inheritdoc ChainlinkOperatorInterface
    function disableFeed(string memory symbol) external override feedExists(_feeds[symbol].id) onlyOwner {
        _feeds[symbol].disabled = true;
    }

    /// @inheritdoc ChainlinkOperatorInterface
    function enableFeed(string memory symbol) external override feedExists(_feeds[symbol].id) onlyOwner {
        _feeds[symbol].disabled = false;
    }
}
