pragma solidity ^0.8.13;

import "./ERC20.sol";

contract Metacoin is IERC20 {
  string public symbol;
  string public  name;
  uint8 public decimals;
  
    uint public _totalSupply;
    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowed;


  constructor() {
    name = "Metacoun";
    symbol = "MTC";
    decimals = 8;
    _totalSupply = 1000000;
  }

  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }

  function balanceOf(address owner) public view returns (uint256 balance) {
    return _balances[owner];
  }

  function transfer(address to, uint256 value) public returns (bool success) {
    require(_balances[msg.sender] >= value);
    require(to != address(0));

    _balances[msg.sender] = _balances[msg.sender] - value;
    _balances[to] = _balances[to] + value;
    emit Transfer(msg.sender, to, value);
    return true;
  }

  function transferFrom(address from, address to, uint256 value) public returns (bool) {
    require(_balances[from] >= value);
    require(value <= _allowed[from][msg.sender]);
    require(to != address(0));

    _balances[from] = _balances[from] - value;
    _balances[to] = _balances[to] + value;
    _allowed[from][msg.sender] = _allowed[from][msg.sender] - value;
    emit Transfer(from, to, value);
    return true;
  }

  // Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
  function approve(address spender, uint256 value) public returns (bool) {
    require(spender != address(0));

    _allowed[msg.sender][spender] = value;
    emit Approval(msg.sender, spender, value);
    return true;
  }

  function allowance(address owner, address spender) public view returns (uint256) {
    return _allowed[owner][spender];
  }
}
