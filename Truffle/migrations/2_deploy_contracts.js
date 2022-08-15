const NFTGrab = artifacts.require("NFTGrab");

module.exports = async function (deployer) {
  await deployer.deploy(NFTGrab);
};