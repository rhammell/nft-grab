import { useState } from 'react'
import { useMoralis } from 'react-moralis'
import { getEllipsisTxt } from '../../helpers/formatters';
import { getExplorer } from '../../helpers/networks';
import {
  Button,
  Text,
  Image,
  HStack,
  VStack,
  Modal,
  Link,
  IconButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  useDisclosure
} from '@chakra-ui/react'
import { CopyIcon, CheckIcon } from '@chakra-ui/icons'
import { connectors } from "./config";

const ModalStyle = {
  size: 'sm',
  borderRadius: 0,
  mt: 20,
  textAlign: 'center',
  border: '2px solid black'
}

const ConnectWallet = () => {
  const { account, logout, chainId, authenticate, enableWeb3 } = useMoralis()
  const [isCopied, setIsCopied] = useState(false)
  const { isOpen: isConnectOpen, onOpen: onConnectOpen, onClose: onConnectClose } = useDisclosure()
  const { isOpen: isDisconnectOpen, onOpen: onDisconnectOpen, onClose: onDisconnectClose } = useDisclosure()

  return (
    <>
      <Button
        border='2px'
        borderRadius={0}
        borderColor='black'
        backgroundColor='white'
        w='250px'
        onClick={account ? onDisconnectOpen : onConnectOpen}
      >
        {account ? getEllipsisTxt(account) : 'Connect Wallet'}
      </Button>

      <Modal
        size={ModalStyle.size}
        isOpen={isConnectOpen}
        onClose={onConnectClose} 
      >
        <ModalOverlay />
        <ModalContent
          borderRadius={ModalStyle.borderRadius}
          mt={ModalStyle.mt}
          textAlign={ModalStyle.textAlign}
          border={ModalStyle.border}
        >
          <ModalHeader pb={0}>
            Connect Wallet
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={12} >
            <HStack
              justify='center'
              spacing={16}
            >
              {connectors.map(({ title, icon, connectorId }, key) => (
                <VStack
                  key={key}
                  spacing={4}
                  cursor='pointer'
                  onClick={async () => {
                    try {
                      await enableWeb3({ provider: connectorId, anyNetwork: true });
                      //await authenticate({ provider: connectorId, signingMessage:"Authenticate with NFT Grab to view, bid, and create NFT auctions." });
                      window.localStorage.setItem("connectorId", connectorId);
                      onConnectClose();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                >
                  <Image
                    src={icon}
                    alt={title}
                    boxSize='75px'
                  />
                  <Text fontWeight={500}>{title}</Text>
                </VStack>
              ))}
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        size={ModalStyle.size}
        isOpen={isDisconnectOpen}
        onClose={() => {
          setIsCopied(false);
          onDisconnectClose();
        }}
      >
        <ModalOverlay />
        <ModalContent
          borderRadius={ModalStyle.borderRadius}
          mt={ModalStyle.mt}
          textAlign={ModalStyle.textAlign}
          border={ModalStyle.border}
        >
          <ModalHeader pb={0} >
            Account
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={12} >
            <VStack spacing={12}>
              <VStack>
                <HStack>
                  <Text
                    fontSize='xl'
                    fontWeight='semibold'
                  >
                    {getEllipsisTxt(account)}
                  </Text>
                  <IconButton
                    icon={isCopied ?
                      <CheckIcon /> :
                      <Tooltip
                        fontSize='xs'
                        hasArrow
                        label='Copy Address'
                        placement='top'
                      >
                        <CopyIcon />
                      </Tooltip>
                    }
                    isRound={true}
                    onClick={() => {
                      navigator.clipboard.writeText(account);
                      setIsCopied(true);
                    }}
                  />
                </HStack>
                <Link 
                  fontSize='sm'
                  href={`${getExplorer(chainId)}/address/${account}`}
                  isExternal
                >
                  View on Explorer
                </Link>
              </VStack>
              <Button
                size='md'
                width='250px'
                border='2px'
                borderColor='black'
                backgroundColor='white'
                borderRadius='0'
                onClick={async () => {
                  onDisconnectClose();
                  await logout();
                  window.localStorage.removeItem("connectorId");
                }}
              >
                Disconnect Wallet
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ConnectWallet