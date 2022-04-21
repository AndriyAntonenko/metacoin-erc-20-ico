pragma solidity ^0.8.13;

interface IERC20 {
  function totalSupply() external view returns (uint256);
  function balanceOf(address owner) external view returns (uint256 balance);
  function transfer(address to, uint256 value) external returns (bool success);
  function transferFrom(address from, address to, uint256 value) external returns (bool);
  function approve(address _spender, uint256 _value) external returns (bool);
  function allowance(address _owner, address _spender) external view returns (uint256);

  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
  );
}
