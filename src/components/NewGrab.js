import { useState} from "react";
import { Link as RouterLink } from 'react-router-dom';
import { useMoralis, useNFTBalances } from "react-moralis";
import { Heading, Center, Text, Spinner, SimpleGrid, VStack, Stack, Link, useDisclosure } from '@chakra-ui/react';
import NFTCard from './NFTCard'
import CreateModal from './CreateModal'
import appChain from '../config.js'

const NewGrab = () => {
  const [ nftInfo, setNftInfo ] = useState({})
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account } = useMoralis()
  const { data: NFTBalances, error, isFetching, getNFTBalances} = useNFTBalances({chain: appChain.key});

  const handleCreateGrab = (nftInfo) => {
    setNftInfo(nftInfo);
    onOpen();
  }

  let content = <></>
  if (!account) {
    content = <Center mt={14} textAlign='center'>
      <Text fontSize="lg">Connect your wallet to view your NFTs and make new Grabs.</Text>
    </Center>
  } 
  else if (error) {
    content =         <Center mt={14} textAlign='center'>
    <Text fontSize="lg">Oops! There was a problem retrieving your NFT Balances.</Text>
  </Center>
  }
  else if (isFetching) {
    content = <Center mt={14}> 
      <Spinner size='lg' />
    </Center>
  }
  else if (NFTBalances?.result.length == 0) {
    content = <Center mt={14} textAlign='center'>
      <VStack>
        <Text fontSize="lg">Zero NFTs found for this wallet.</Text>
        <Text fontSize="lg">
          <Link isExternal textDecoration='underline' href="https://mintnft.today/">Mint</Link>, <Link isExternal textDecoration='underline' href="https://opensea.io/">Buy</Link>, 
          or <Link as={RouterLink} to="/grabs" textDecoration='underline'>Grab</Link> some to build your collection.
        </Text>
      </VStack>
    </Center>
  } 
  else {
    content = <>
      <SimpleGrid columns={{sm: 1, md: 2, lg: 3}}  spacing='25px' mt={5}>
        {NFTBalances?.result && NFTBalances.result.map((nft, index) => {
          return (
            <NFTCard nftInfo={nft} key={index} onCreateGrab={handleCreateGrab} />
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
        direction={{sm: 'column', lg: 'row'}}
        spacing={{sm: 4, lg: 10}}
        align='center'
      >
        <Heading maxW={{sm: '100%', lg: '40%'}} fontSize='6xl'>Earn more with Grabs. </Heading>
        <VStack align='start' spacing={4} fontSize={'lg'}>
          <Text>Get more MATIC for your NFTs.</Text>
          <Text>Create a Grab from any NFT in your collection below to start generating bids.</Text>
        </VStack>  
      </Stack>
      {content}
      <CreateModal isOpen={isOpen} onClose={onClose} nftInfo={nftInfo} getNFTBalances={getNFTBalances} />
    </>
  )
}

export default NewGrab






