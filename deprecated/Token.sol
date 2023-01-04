// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Token {
    mapping(address => uint) public balances;
    mapping(address => mapping(address => uint)) public allowances;
    string public name = "DABI Token";
    string public symbol = "DABI";
    address public owner;
    uint public decimals = 18;
    uint public totalSupply = 10000 * 10 ** decimals;
    
    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor() {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function distruct() public {
        require(msg.sender == owner, "You are not the owner");
        selfdestruct(payable(msg.sender));
    }

    function transfer(address to, uint amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");
        balances[msg.sender] -= amount;
        balances[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }

    function balanceOf(address account) external view returns(uint) {
        return balances[account];
    }

    function mint(address to, uint amount) external {
        require(msg.sender == owner, "You are not the owner");
        require(to != address(0), "Cannot mint to zero address");
        balances[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }

    function burn(address from, uint amount) external {
        require(msg.sender == owner, "You are not the owner");
        require(from != address(0), "Cannot burn from zero address");
        require(balances[from] >= amount, "Not enough tokens");
        balances[from] -= amount;
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }

    function approve(address spender, uint amount) external {
        allowances[msg.sender][spender] = amount;
    }

    function transferFrom(address from, address to, uint amount) external {
        require(balances[from] >= amount, "Not enough tokens");
        require(allowances[from][msg.sender] >= amount, "Not enough allowance");
        balances[from] -= amount;
        balances[to] += amount;
        emit Transfer(from, to, amount);
    }

    function allowance(address owner, address spender) external view returns(uint) {
        return allowances[owner][spender];
    }
}