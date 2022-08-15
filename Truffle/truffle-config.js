require('dotenv').config({path: './../.env'});

const HDWalletProvider = require('@truffle/hdwallet-provider');
const { 
  MNEMONIC, 
  INFURA_PROJECT_ID,
  POLYGONSCAN_API_KEY
} = process.env;

console.log(MNEMONIC)

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    mumbai: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://polygon-mumbai.infura.io/v3/${INFURA_PROJECT_ID}`),
      //provider: () => new HDWalletProvider(MNEMONIC, "https://rpc-mumbai.maticvigil.com/v1/77332c06ec3cd6145131a1488a085335e1ed2c72"),
      //provider: () => new HDWalletProvider(MNEMONIC, "https://polygon-mumbai.g.alchemy.com/v2/SCfv2euRhjW2dmcCLnzMp5MmUFdxqQFE"),
      network_id: 80001
    },
    polygon: {
      provider: () => new HDWalletProvider(MNEMONIC, `https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`),
      network_id: 137
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.13",
    }
  },

  // Required for etherscan/polygonscan verification using truffle-plugin-verify package
  plugins: [
    'truffle-plugin-verify'
  ],

  // API Keys requried for polygonscan verification
  api_keys: {
    polygonscan: POLYGONSCAN_API_KEY,
  }
};