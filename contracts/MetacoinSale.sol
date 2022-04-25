pragma solidity ^0.8.13;

import "./Metacoin.sol";

contract MetacoinSale {
  address private admin;
  Metacoin public tokenContract;
  uint256 public tokenPrice;
  uint256 public tokenSold;

  event Sell(
    address indexed _buyer,
    uint256 indexed _amount
  );

  constructor(Metacoin _tokenContract, uint256 _initialPrice) {
    // assign an admin
    admin = msg.sender;
    // Token contract
    tokenContract = _tokenContract;
    // set token price
    tokenPrice = _initialPrice;
  }

  function safeMultiply(uint256 x, uint256 y) internal pure returns (uint256 z) {
    require(y == 0 || (z = x * y) / y == x);
  }

  function buyTokens(uint256 _amount) public payable {
    // require that value is equal to tokens
    require(msg.value == safeMultiply(_amount, tokenPrice));
    // require that the contract has enough tokens
    require(tokenContract.balanceOf(address(this)) >= _amount);
    // require that transfer is successful
    require(tokenContract.transfer(msg.sender, _amount));
    // keep track of tokenSold
    tokenSold += _amount; 
    // trigger Sell Event
    emit Sell(msg.sender, _amount);
  }

  function endSale() public restricted {
    // transfer remained tokens to admin
    require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
    selfdestruct(payable(admin));
  }

  modifier restricted {
    require(msg.sender == admin);
    _;
  }
}
