import { metacoinConfig } from '../config'

type Network = "development" | "kovan" | "mainnet";

module.exports = (artifacts: Truffle.Artifacts, web3: Web3) => {
  return async (
    deployer: Truffle.Deployer,
    network: Network,
    accounts: string[]
  ) => {
    const Metacoin = artifacts.require("Metacoin");
    const MetacoinSale = artifacts.require("MetacoinSale");

    await deployer.deploy(Metacoin, metacoinConfig.totalSupply, { from: accounts[0] });
    await deployer.deploy(MetacoinSale, Metacoin.address, metacoinConfig.price, { from: accounts[0] });
    const metacoin = await Metacoin.deployed();
    const metacoinSale = await MetacoinSale.deployed();

    await metacoin.transfer(metacoinSale.address, metacoinConfig.amountToSale, { from: accounts[0] });
  };
};
