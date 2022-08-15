import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useWeb3ExecuteFunction, useMoralisWeb3Api, useChain, useMoralis } from 'react-moralis'
import { Heading, Text, Button, Center, VStack, Link, SimpleGrid, useDisclosure, Stack, Spinner } from '@chakra-ui/react'
import GrabCard from './GrabCard'
import BidModal from './BidModal'
import contractInfo from './../contracts/contractInfo.json'
import appChain from '../config.js'
import { formatGrab, formatNFT } from '../helpers/formatters'

const Grabs = () => {
  const { web3, isWeb3Enabled, enableWeb3 } = useMoralis()
  const { switchNetwork, chainId, account } = useChain();
  const Web3ExecuteFunction = useWeb3ExecuteFunction();
  const Web3Api = useMoralisWeb3Api();
  const { isOpen: isBidOpen, onOpen: onBidOpen, onClose: onBidClose } = useDisclosure();
  const [error, setError] = useState(false);
  const [grabs, setGrabs] = useState([]);
  const [grabInfo, setGrabInfo] = useState()
  const [isFetching, setIsFetching] = useState(false)
  const grabsContract = contractInfo.networks[appChain.id].address;

  const handleBidGrab = (grabInfo) => {
    setGrabInfo(grabInfo);
    onBidOpen();
  }

  const switchAndEnable = async () => {
    await switchNetwork(appChain.key)
    const connectorId = window.localStorage.getItem("connectorId");
    await enableWeb3({ provider: connectorId, anyNetwork: "true" });
  }
  
  const fetchGrabs = async () => {
    setIsFetching(true)
    setError(false)
    try {
      const blockNumber = await web3.getBlockNumber();
      console.log('block number');
      console.log(blockNumber)
      const functionOptions = {
        abi: contractInfo.abi,
        contractAddress: grabsContract,
        functionName: "getAuctions",
      }
      let grabsArr = await Web3ExecuteFunction.fetch({
        params: functionOptions,
        throwOnError: true,
      })
      grabsArr = grabsArr.map(grab => formatGrab(grab));
      grabsArr = grabsArr.filter(function(grab) {
        return (
          // Filter for active grabs
          grab.isCanceled == false &&
          (grab.endBlock == 0 || blockNumber < grab.endBlock)
        )
      })

      const nftOptions = {
        chain: appChain.key,
        address: grabsContract,
      };
      const data = await Web3Api.account.getNFTs(nftOptions);
      let nftsArr = data.result;
      nftsArr = nftsArr.map(nft => formatNFT(nft));

      const newGrabs = []
      grabsArr.forEach(grab => {
        nftsArr.forEach(nft => {
          if (
            grab.tokenId == nft.token_id &&
            grab.nftContract == nft.token_address
          ) {
            newGrabs.push({...grab, ...nft})
          }
        })
      })
      setIsFetching(false)
      setGrabs(newGrabs);      
    } catch(e) {
      setIsFetching(false)
      setError(true);
      console.log(e)
    }
  }

  useEffect( () => {
    if (account && chainId == appChain.key) {
      fetchGrabs();  
    }
  }, [account, chainId, isWeb3Enabled]);

  let content = <></>
  if (!account) {
    content = <Center mt={20} textAlign='center'>
      <Text fontSize="lg">Connect your wallet to view Active Grabs.</Text>
    </Center>
  } 
  else if (error) {
    content = <Center mt={20} textAlign='center'>
      <Text fontSize="lg">Oops! There was a problem retrieving Grabs.</Text>
    </Center>
  }
  else if (isFetching) {
    content = <Center mt={20}> 
      <Spinner size='lg' />
    </Center>
  }
  else if (chainId != appChain.key) {
    content = <Center mt={20} textAlign='center'>
      <Text fontSize="lg">
        Switch network to <Link textDecoration='underline' onClick={switchAndEnable}>{appChain.name}</Link> to view Active Grabs.
      </Text>
    </Center>
  }
  else if (grabs.length == 0) {
    content = <Center mt={20} textAlign='center'>
      <VStack>
          <Text fontSize="lg">There currently are no Active Grabs.</Text>
          <Text fontSize="lg">
            Create a <Link as={RouterLink} to="/new-grab" textDecoration='underline'>New Grab</Link> from your NFT Collection.
          </Text>
      </VStack>
    </Center>
  } 
  else {
    content = <>
      <SimpleGrid columns={{sm: 1, md: 2, lg: 3}} spacing='25px' mt={5}>
        {grabs && grabs.map((grab, index) => {
          return (
              <GrabCard grabInfo={grab} key={index} onBidGrab={handleBidGrab} />
            )
        })}
      </SimpleGrid>
    </>
  }

  return (
    <>
      <Stack
        minH='200px'
        border='2px solid black'
        py={'10'}
        px={'20'}
        direction={{base: 'column', md: 'row'}}
        spacing={{base: 4, lg: 10}}
        align='center'
      >
      <Heading maxW={{base: '100%', lg: '50%'}} fontSize='6xl'>Top NFTs for 1 MATIC.</Heading>
      <VStack align='start' spacing={4} fontSize={'lg'}>
          <Text>NFT auctions with a twist.</Text>
          <Text>Grab your place as the latest. But - but each new bid adds more time.</Text>
        </VStack>  
      </Stack>
      {content}
      {grabInfo &&
        <BidModal isOpen={isBidOpen} onClose={onBidClose} grabInfo={grabInfo} fetchGrabs={fetchGrabs} />
      }
    </>
  )
}

export default Grabs



