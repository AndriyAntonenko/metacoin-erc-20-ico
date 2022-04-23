pragma solidity ^0.8.13;

import "./ERC20.sol";

contract Metacoin is IERC20 {
  string public symbol;
  string public  name;
  uint8 public decimals;
  
  uint public totalSupply;
  mapping (address => uint256) private balances;
  mapping (address => mapping (address => uint256)) private allowed; // A approves B to spend C tokens 

  constructor(uint _initialSupply) {
    name = "Metacoun";
    symbol = "MTC";
    decimals = 8;
    totalSupply = _initialSupply;

    balances[msg.sender] = _initialSupply;
  }

  function balanceOf(address _owner) public view returns (uint256 balance) {
    return balances[_owner];
  }

  function transfer(address _to, uint256 _value) public returns (bool success) {
    require(balances[msg.sender] >= _value);

    balances[msg.sender] -= _value;
    balances[_to] += _value;
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    require(balances[_from] >= _value);
    require(_value <= allowed[_from][msg.sender]);

    balances[_from] -= _value;
    balances[_to] += _value;
    allowed[_from][msg.sender] -= _value;
    emit Transfer(_from, _to, _value);
    return true;
  }

  // Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
  // I am approving _spender to spend _value amount of tokens
  function approve(address _spender, uint256 _value) public returns (bool) {
    allowed[msg.sender][_spender] = _value; // msg.sender allowe _spender to spend _value tokens from his account 
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  function allowance(address _owner, address _spender) public view returns (uint256) {
    return allowed[_owner][_spender];
  }
}
