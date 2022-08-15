import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useWeb3ExecuteFunction, useMoralisWeb3Api, useChain, useMoralis } from 'react-moralis'
import { Heading, Text, Button, Center, VStack, Link, SimpleGrid, useDisclosure, Stack, Spinner } from '@chakra-ui/react'
import GrabCard from './GrabCard'
import CancelModal from './CancelModal'
import contractInfo from './../contracts/contractInfo.json'
import appChain from '../config.js'
import { formatGrab, formatNFT } from '../helpers/formatters'

const MyGrabs = () => {
  const { switchNetwork, chainId, account } = useChain();
  const Web3ExecuteFunction = useWeb3ExecuteFunction();
  const Web3Api = useMoralisWeb3Api();
  const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure();
  const [error, setError] = useState(false);
  const [grabs, setGrabs] = useState([]);
  const [grabInfo, setGrabInfo] = useState({})
  const [isFetching, setIsFetching] = useState(false)
  const grabsContract = contractInfo.networks[appChain.id].address;

  const handleCancelGrab = (grabInfo) => {
    setGrabInfo(grabInfo);
    onCancelOpen();
  }

  const fetchGrabs = async () => {
    setIsFetching(true)
    try {
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
          (grab.seller.toLowerCase() == account.toLowerCase() || 
          grab.bidder.toLowerCase() == account.toLowerCase()) &&
          grab.isCanceled == false
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
  }, [account, chainId]);

  let content = <></>
  if (!account) {
    content = <Center mt={14} textAlign='center'>
      <Text fontSize="lg">Connect your wallet to view your NFTs and make new Grabs.</Text>
    </Center>
  } 
  else if (error) {
    content = <Center mt={14} textAlign='center'>
      <Text fontSize="lg">Oops! There was a problem retrieving your Grabs.</Text>
    </Center>
  }
  else if (isFetching) {
    content = <Center mt={14}> 
      <Spinner size='lg' />
    </Center>
  }
  else if (chainId != appChain.key) {
    content = <Center mt={14} textAlign='center'>
      <Text fontSize="lg">
        Switch network to <Link textDecoration='underline' onClick={()=>switchNetwork(appChain.key)}>{appChain.name}</Link> to view your Grabs.
      </Text>
    </Center>
  }
  else if (grabs.length == 0) {
    content = <Center mt={14} textAlign='center'>
      <VStack>
          <Text fontSize="lg">Zero Grabs found for this wallet.</Text>
          <Text fontSize="lg">
            Bid on <Link as={RouterLink} to="/grabs" textDecoration='underline'>Active Grabs</Link> or create a <Link as={RouterLink} to="/grabs" textDecoration='underline'>New Grab</Link> from your NFT Collection.
          </Text>
      </VStack>
    </Center>
  } 
  else {
    content = <>
      <SimpleGrid columns={{sm: 1, md: 2, lg: 3}}  spacing='25px' mt={5}>
        {grabs && grabs.map((grab, index) => {
          return (
              <GrabCard grabInfo={grab} key={index} onCancelGrab={handleCancelGrab} />
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
        direction={{base: 'column', lg: 'row'}}
        spacing={{base: 4, lg: 10}}
        align='center'
      >
      <Heading maxW={{base: '100%', lg: '40%'}} fontSize='6xl'>Mangage Your Grabs.</Heading>
      <VStack align='start' spacing={4} fontSize={'lg'}>
          <Text>Check on Grabs your created or bid on.</Text>
          <Text>Widthdraw Funds or Tokens from completed Grabs.</Text>
        </VStack>  
      </Stack>
      {content}
      <CancelModal isOpen={isCancelOpen} onClose={onCancelClose} grabInfo={grabInfo} fetchGrabs={fetchGrabs} />
    </>
  )
}

export default MyGrabs