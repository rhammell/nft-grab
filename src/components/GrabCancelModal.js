import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useChain } from 'react-moralis';
import { useWeb3ExecuteFunction } from 'react-moralis'
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
} from '@chakra-ui/react'
import NFTDetails from './NFTDetails'
import contractInfo from './../contracts/contractInfo.json'
import appChain from '../config.js'

function GrabCancelModal({ grabInfo, isOpen, onClose, fetchGrabs }) {
  const Web3ExecuteFunction = useWeb3ExecuteFunction();
  const { switchNetwork, chainId, account } = useChain();
  const [step, setStep] = useState(1);
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const grabsAddress = contractInfo.networks[appChain.id].address;

  useEffect(() => {
    closeModal()  
  }, [account]);

  const closeModal = () => {
    setStep(1)
    setIsPending(false)
    onClose()
  }

  const cancelGrab = async () => {
    const functionOptions = {
      abi: contractInfo.abi,
      contractAddress: grabsAddress,
      functionName: "cancelAuction",
      params: {
        _auctionId: grabInfo.auctionId
      }
    }

    try {
      setIsPending(true);
      const transaction  = await Web3ExecuteFunction.fetch({
        params: functionOptions,
        throwOnError: true,
      })
      const res = await transaction.wait({throwOnError: true})
      setIsPending(false);
      setStep(2);
      fetchGrabs();
    } catch (e) {
      alert(e.message);
      setIsPending(false);
    }
  }

  let content = {};
  if ( step == 1 && chainId != appChain.key) {
    content.heading = 'Switch Network'
    content.body = <>
      <Text>{`To cancel a Grab you must first switch to the  ${appChain.name} network.`}</Text>
    </>    
    content.buttonClick = () => switchNetwork(appChain.key)
    content.buttonText = `Switch to ${appChain.name}`
  } else if (step == 1) {
    content.heading = 'Cancel Grab'
    content.body = <>
        <Text>Canceling will end the Grab and transfer the NFT back to your wallet.</Text>
        <br></br>
        <Text>Would you like to continue?</Text>
      </> 
    content.buttonClick = cancelGrab
    content.buttonText = 'Cancel Grab'
  } else if (step == 2) {
    content.heading = 'Success!'
    content.body = <>
      <Text>Your Grab has been canceled!. .</Text>
    </>
    content.buttonClick = () => navigate("/my-grabs")
    content.buttonText = 'New Grab'
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
                  src={grabInfo?.image}
                  bg='gray.400'
                />
              </AspectRatio>
              <NFTDetails nftInfo={grabInfo} />
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
                  loadingText='Canceling...'
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

export default GrabCancelModal