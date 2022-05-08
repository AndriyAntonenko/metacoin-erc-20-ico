const HDWalletProvider = require("@truffle/hdwallet-provider");

require('dotenv').config()
require("ts-node").register({
  files: true,
});

module.export = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: "7545",
      network_id: "*"
    },
    rinkeby: {
      provider: () => 
        new HDWalletProvider(process.env.RINKEBY_DEPLOY_MNEMONIC, process.env.RINKEBY_INFURA_URL),
      network_id: 4,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};
