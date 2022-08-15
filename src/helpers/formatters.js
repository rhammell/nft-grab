
/**
 * Returns a string of form "abc...xyz"
 * @param {string} str string to string
 * @param {number} n number of chars to keep at front/end
 * @returns {string}
 */
export const getEllipsisTxt = (str, n = 6) => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - n)}`;
  }
  return "";
};

const resolveIPFSLink = (url) => {
  if (!url || !url.includes("ipfs://")) return url;
  return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
};

export const formatGrab = (grab) => {
  const formattedGrab = {...grab}
  formattedGrab.auctionId = grab.auctionId.toString();
  formattedGrab.startBlock = grab.startBlock.toString();
  formattedGrab.endBlock = grab.endBlock.toString();
  formattedGrab.bidTotal = grab.bidTotal.toString();
  formattedGrab.bidPrice = grab.bidPrice.toString();
  formattedGrab.tokenId = grab.tokenId.toString();
  formattedGrab.seller = grab.seller.toLowerCase();
  formattedGrab.bidder = grab.bidder.toLowerCase();
  formattedGrab.nftContract = grab.nftContract.toLowerCase();
  return formattedGrab
}

export const formatNFT = (nft) => {
  const formattedNFT = {...nft}
  formattedNFT.metadata = JSON.parse(nft.metadata);
  formattedNFT.image = resolveIPFSLink(formattedNFT.metadata.image);
  formattedNFT.token_address = nft.token_address.toLowerCase();
  return formattedNFT;
}
