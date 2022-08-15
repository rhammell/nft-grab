const chains = {
  mumbai: {
    id: "80001",
    key: "0x13881",
    name: "Polygon Mumbai",
    explorer: "https://mumbai.polygonscan.com/",
  },
  polygon: {

  }
}

// Primary chain used by the app - contract
// needs to be deployed to this network
const appChain = chains['mumbai']

export default appChain;
