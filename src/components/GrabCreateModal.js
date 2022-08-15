import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useChain, useWeb3Transfer, useMoralis } from 'react-moralis';
import {
  Box,
  Text,
  Image,
  Button,
  AspectRatio,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  VStack,
  HStack,
  Stack,
  Heading,
  Flex,
  Link,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react'
import NFTDetails from './NFTDetails'
import contractInfo from './../contracts/contractInfo.json'
import appChain from '../config.js'

function GrabCreateModal({ nftInfo, isOpen, onClose, getNFTBalances }) {
  const { switchNetwork, chainId, account } = useChain();
  const [step, setStep] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();
  const transferNFT = useWeb3Transfer();
  const grabAddress = contractInfo.networks[appChain.id].address;

  useEffect(() => {
    closeModal()  
  }, [account]);

  const closeModal = () => {
    setStep(1)
    setIsPending(false)
    onClose()
  }

  const createGrab = async () => {
    const options = {
      type: nftInfo?.contract_type?.toLowerCase(),
      receiver: grabAddress,
      contractAddress: nftInfo.token_address,
      tokenId: nftInfo.token_id
    }

    try {
      setIsPending(true);
      const transaction = await transferNFT.fetch({params: options, throwOnError: true })
      const res = await transaction.wait({throwOnError: true})
      setIsPending(false);
      setStep(2);
      getNFTBalances();
    } catch (e) {
      alert(e.message);
      setIsPending(false);
    }
  }

  let content = {}
  if ( step == 1 && chainId != appChain.key) {
    content.heading = 'Switch Network'
    content.body = <>
      <Text>{`To create a Grab you must first switch to the  ${appChain.name} network.`}</Text>
    </>    
    content.buttonClick = () => switchNetwork(appChain.key)
    content.buttonText = `Switch to ${appChain.name}`
  } else if (step == 1) {
    content.heading = 'Create Grab'
    content.body = <>
        <Text>Grabs are created by transfering your NFT to our <Link isExternal textDecoration='underline' href={appChain.explorer + 'address/' + grabAddress}>escrow contract</Link>, which handles the auction on chain.</Text>
        <br></br>
        <Text>When the Grab is created you'll be able to:</Text>
        <UnorderedList>
          <ListItem>View your listing in My Grabs</ListItem>
          <ListItem>Cancel the auction prior to a first bid</ListItem>
          <ListItem>Widthdraw bids after the auction has completed</ListItem>
        </UnorderedList>
      </> 
    content.buttonClick = createGrab
    content.buttonText = 'Create Grab'
  } else if (step == 2) {
    content.heading = 'Success!'
    content.body = <>
      <Text>Your Grab has been created!</Text>
    </>
    content.buttonClick = () => navigate("/my-grabs")
    content.buttonText = 'View My Grabs'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
    >
      <ModalOverlay />
      <ModalContent
        borderRadius={0}
        border='2px solid black'
        maxW='62em'
        mx='1em'
        mt='5em'
      >
        <ModalHeader />
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            <Box>
              <AspectRatio
                ratio={1}
                minW={'300px'}
                borderColor='gray.800'
                borderWidth='2px'
              >
                <Image
                  src={nftInfo?.image}
                  bg='gray.400'
                />
              </AspectRatio>
              <NFTDetails nftInfo={nftInfo} />
            </Box>

            <Stack ml={8} w='100%' spacing={8}>
              <Box>
                <Heading mb={4}>{content.heading}</Heading>
                {content.body}
              </Box>
              
              <VStack w='fit-content'>
                <Button
                  border='2px'
                  borderRadius={0}
                  borderColor='black'
                  backgroundColor={'white'}
                  w='250px'
                  onClick={content.buttonClick}
                  isLoading={isPending}
                  loadingText='Creating...'
                >
                  {content.buttonText}
                </Button>
                {isPending &&
                  <Text fontSize='sm' textAlign={'center'}>Please keep window open</Text>
                }
              </VStack>
            </Stack>
          </Flex>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}

export default GrabCreateModal