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

    await deployer.deploy(Metacoin, metacoinConfig.totalSupply);
    await deployer.deploy(MetacoinSale, Metacoin.address, metacoinConfig.price);
    const metaCoin = await Metacoin.deployed();
    console.log(
      `Metacoin deployed at ${metaCoin.address} in network: ${network}.`
    );
  };
};
