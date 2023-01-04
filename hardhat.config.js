/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const { mnemonic, bscscanApiKey } = require('./secrets.json');

module.exports = {
  defaultNetwork: "testnet",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
    },
    testnet: {
      url: "https://bsc-testnet.public.blastapi.io",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic: mnemonic }
    },
    mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: { mnemonic: mnemonic }
    }
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: bscscanApiKey
  },
  mocha: {
    timeout: 20000
  }
};
