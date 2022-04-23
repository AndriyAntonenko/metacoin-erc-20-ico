const Metacoin = artifacts.require("Metacoin");

module.exports = function(deployer) {
  deployer.deploy(Metacoin, 1000000);
};
