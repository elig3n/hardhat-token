// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, ERC20Burnable, Pausable, Ownable {
    mapping(address => uint256) internal _firstBalanceRecivedTimes;

    event FirstBalanceRecived(address indexed user, uint256 time);

    constructor(uint256 initialSupply) ERC20("Dabi3.0", "DABI") {
        _mint(msg.sender, initialSupply);
    }

    function distruct() public onlyOwner {
        selfdestruct(payable(msg.sender));
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override {
        if (_firstBalanceRecivedTimes[recipient] == 0) {
            _firstBalanceRecivedTimes[recipient] = block.timestamp;
            emit FirstBalanceRecived(recipient, block.timestamp);
        }
        super._transfer(sender, recipient, amount);
    }

    function getFirstBalanceRecivedTime(address _address) public view returns (uint256)
    {
        return _firstBalanceRecivedTimes[_address];
    }

    function giveaway(address[] memory addresses, uint256 amount)
        public
        onlyOwner
    {
        require(
            balanceOf(owner()) >= amount * addresses.length,
            "Owner does not have enough tokens"
        );
        for (uint256 i = 0; i < addresses.length; i++) {
            transfer(addresses[i], amount);
        }
    }
}
