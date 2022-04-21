const Metacoin = artifacts.require("./Metacoin.sol");

module.exports = function(deployer) {
  deployer.deploy(Metacoin);
};
