// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract NFTGrab is IERC721Receiver {
  
    // Contract events
    event AuctionCreated(uint256 indexed auctionId);
    event AuctionCanceled(uint256 indexed auctionId);
    event AuctionBid(uint256 indexed auctionId);

    /**
    * @dev Structure defining the properties of each auction
    *
    * nftContract - ERC721 Interface for NFT contract address
    * seller - Address of token seller
    * bidder - Address of latest bidder
    * tokenId - NFT identifier for token
    * auctionId - Identifier for auction details
    * startBlock - Block number when auction began
    * endBlock - Block number when auciton will end
    * blockIncrease - Number of blocks added with each bid
    * bidPrice - Value required to place a bid
    * bidTotal - Value of all bids placed
    */ 
    struct Auction {
        IERC721 nftContract;
        address seller;
        address bidder;
        uint256 tokenId;
        uint256 auctionId;
        uint256 startBlock;
        uint256 endBlock;
        uint256 blockIncrease; 
        uint256 bidPrice;
        uint256 bidTotal;
        bool isCanceled;
        bool isTokenWidthdrawn;
        bool isBidsWidthdrawn;
    }

    // Array of auction IDs
    uint256[] private auctionIds;

    // Mapping of auction ID to Auction details
    mapping (uint256 => Auction) private auctions;

    /**
    * @dev Implementation of the required {onERC721Received} function for contracts 
    * intended as recipients of ERC721 token transfers using {safeTransferFrom}. 
    *
    * Creates auction for the received token and returns required ERC721TokenReciever value. 
    *
    * TODO: Allow custom auction details to be passed through the calldata
    *
    * @param _from Address that previously owned the token
    * @param _tokenId NFT identifier of token being transfered
    * @return Expected magic value defined by ERC721TokenReciever spec
    */
    function onERC721Received(
        address,
        address _from,
        uint256 _tokenId,
        bytes calldata
    ) 
        external 
        returns (bytes4) 
    {
        _createAuction(msg.sender, _from, _tokenId);
        return this.onERC721Received.selector;
    }

    /**
    * @dev Accepts a new bid for an auction
    *
    * A successfull bid will add the caller as auction bidder and 
    * increase the auction's `endBlock` deadline. Auctions with no previous 
    * bidders will have `startBlock` set. 
    *
    * Emits an {AuctionBid} event
    *
    * Requirements
    * - `_auctionId` must correspond to valid auction
    * - Auction `seller` cannot place a bid
    * - Payment must meet minimum bid price
    * - Auction must not be canceled
    * - Bid must be placed before auction's `endBlock` deadline if not the first bid
    *
    * @param _auctionId Identifier for auction listing
    */
    function bid(
        uint _auctionId
    )
        external
        auctionExists(_auctionId)    
        payable
    {
        Auction storage auction = auctions[_auctionId];
        require(msg.sender != auction.seller, "Auction seller cannot place bid.");
        require(msg.value >= auction.bidPrice, "Auction bid price not met.");
        require(auction.isCanceled != true, "Auction has been canceled");

        if (auction.startBlock != 0) {
            require(block.number <= auction.endBlock, "Auction bidding has ended.");
        } else {
            auction.startBlock = block.number;
        }

        auction.bidder = msg.sender;
        auction.endBlock = block.number + auction.blockIncrease;
        auction.bidTotal += msg.value; 

        emit AuctionBid(_auctionId);
    }

    /**
    * @dev Cancel an auction and return the token to the seller.
    *
    * Emits an {AuctionCancelled} event
    *
    * Requirements
    * - `_auctionId` must correspond to valid auction
    * - Only `seller` can cancel the auction
    * - Can only be canceled if no bids have been placed
    *
    * @param _auctionId Identifier for auction listing
    */
    function cancelAuction(
        uint _auctionId
    ) 
        external 
        auctionExists(_auctionId) 
    {
        Auction storage auction = auctions[_auctionId];
        require(auction.seller == msg.sender, "Auction can only be canceled by the seller.");
        require(auction.bidder == address(0), "Auction cannot be canceled after start of bidding.");

        auction.nftContract.safeTransferFrom(
            address(this), 
            auction.seller, 
            auction.tokenId
        );

        auction.isCanceled = true;

        emit AuctionCanceled(_auctionId);
    }

    /**
    * @dev Transfer the auction token to the winning bidder
    *
    * Emits an {AuctionCompleted} event
    *
    * Requirements
    * - `_auctionId` must correspond to valid auction
    * - Can only be widthdrawn after auction's `endBlock` deadline
    * - Only `bidder` can widthdraw the token
    * 
    * @param _auctionId Identifier for auction listing
    */
    function widthdrawToken(
        uint _auctionId
    ) 
        external 
        auctionExists(_auctionId) 
    {
        Auction storage auction = auctions[_auctionId];
        require(block.number > auction.endBlock, "Auction bidding has not ended.");
        require(msg.sender == auction.bidder, "Token can only be widthdrawn by the winning bidder.");
        require(auction.isTokenWidthdrawn == false, "Token has already been widthdrawn.");
        
        auction.nftContract.safeTransferFrom(
            address(this), 
            auction.bidder, 
            auction.tokenId
        );

        auction.isTokenWidthdrawn = true;
    }

    /**
    * @dev Transfer the auction bids to the seller
    *
    * Requirements
    * - `_auctionId` must correspond to valid auction
    * - Can only be widthdrawn after auction's `endBlock` deadline
    * - Only `seller` can widthdraw bids
    * 
    * @param _auctionId Identifier for auction listing
    */
    function widthdrawBids(
        uint _auctionId
    ) 
        external 
        auctionExists(_auctionId) 
    {
        Auction storage auction = auctions[_auctionId];
        require(block.number > auction.endBlock, "Auction bidding has not ended.");
        require(msg.sender == auction.seller, "Bids can only be widthdrawn by the seller.");
        require(auction.isBidsWidthdrawn == false, "Bids have already been widthdrawn.");

        payable(auction.seller).transfer(auction.bidTotal);
    }

    /**
    * @dev Return auction details for input auction ID.
    *
    * Requirements
    * - `_auctionId` must correspond to valid auction
    *
    * @param _auctionId Identifier for auction listing
    * @return Auction structure containing the auction's details
    */
    function getAuction(
        uint _auctionId
    ) 
        external 
        view 
        auctionExists(_auctionId) 
        returns (Auction memory) 
    {
        return auctions[_auctionId];
    }

    /**
    * @dev Return details for all auctions
    *
    * @return Array of Auction structures containing each auction's details
    */
    function getAuctions() 
        external
        view 
        returns (Auction[] memory) 
    {
        return _getAuctions(auctionIds);
    }

    /**
    * @dev Return array of auction IDs
    *
    * @return Array of auction IDs
    */
    function getAuctionIds() external view returns (uint256[] memory) {
        return auctionIds;
    }

    /**
    * @dev Modifier to check if '_auctionID' references a created auction
    */
    modifier auctionExists(uint256 _auctionId) {
        require(auctions[_auctionId].seller != address(0), "Auction ID does not reference valid auction");
        _;
    }

    /**
    * @dev Return auction data for array of IDs
    *
    *
    * @param _auctionIds Array of uint256 IDs
     */
     function _getAuctions(
        uint256[] memory _auctionIds
     )
        internal
        view
        returns (Auction[] memory)
    {
        Auction[] memory _auctions = new Auction[](_auctionIds.length);
        for (uint i = 0; i < _auctionIds.length; i++) {
            _auctions[i] = auctions[_auctionIds[i]];
        }
        return _auctions;
    }
    

    /**
    * @dev Create a new auction for a token
    *
    * Emits an {AuctionCreated} event
    *
    * @param _nftAddress Address of the NFT contract defining the token
    * @param _seller Address of seller of the token
    * @param _tokenId NFT identifier of the token
    */
    function _createAuction(
        address _nftAddress, 
        address _seller, 
        uint _tokenId
    ) 
        internal
    {
        uint auctionId = auctionIds.length;

        Auction memory newAuction = Auction({
            nftContract: IERC721(_nftAddress),
            seller: _seller,
            bidder: address(0),
            tokenId: _tokenId,
            auctionId: auctionId,
            bidPrice: 1 ether,
            startBlock: 0,
            endBlock: 0,
            blockIncrease: 100,
            bidTotal: 0,
            isCanceled: false,
            isTokenWidthdrawn: false,
            isBidsWidthdrawn: false
        });

        auctionIds.push(auctionId);
        auctions[auctionId] = newAuction;

        emit AuctionCreated(auctionId);
    }
}