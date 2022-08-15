import { useState, useEffect } from 'react'
import { 
  Box, 
  Image, 
  AspectRatio,
  Text,
  Button,
  Progress,
  Badge,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Stack
} from '@chakra-ui/react'
import NFTDetails from './NFTDetails'
import { useMoralis } from 'react-moralis'
import { getEllipsisTxt } from '../helpers/formatters';

function GrabCard({ grabInfo, onCancelGrab, onBidGrab }) {
  let { account, web3 } = useMoralis();
  const [blockNumber, setBlockNumber] = useState(0)
  account = account.toLowerCase();

  useEffect(() => {
    let id = setInterval( async () => {
      console.log('interval tick')
      const num = await web3.getBlockNumber();
      setBlockNumber(num);
    }, 1000)
    return () => {clearInterval(id)}
  }, [])

  return (
    <>
    <Box
      borderColor='black'
      borderWidth='2px'
    >
      <Progress value={25} borderBottom='2px solid black' />
      <AspectRatio ratio={1} >
        <Image  
          src={grabInfo.image}
          bg='gray.400'
        />
      </AspectRatio>
      <NFTDetails nftInfo={grabInfo} /> 
      <Text mb='1' fontSize="md" textAlign='center'>Auction ends in <b>150</b> blocks</Text>
      <Button
        colorScheme='blue'
        borderRadius={0}
        borderTop='2px solid black'
        borderBottom='2px solid black'
        width='100%'
      > 
        Grab For 1 MATIC
      </Button>
  

      <Box>
        <TableContainer>
          <Table size='sm'>
            <Tbody>
              <Tr>
                <Td>Seller</Td>
                <Td>0x2kdu...s82ndh</Td>
              </Tr>
              <Tr>
                <Td>Grabber</Td>
                <Td>0x01nh...s7d3h3</Td>
              </Tr>
              <Tr>
                <Td>Duration</Td>
                <Td>-</Td>
              </Tr>
              <Tr>
                <Td>Bids Total</Td>
                <Td>0 MATIC</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      



        {grabInfo.endBlock > 0 && grabInfo.endBlock > blockNumber &&
          <Text>Blocks Remaining: {grabInfo.endBlock - blockNumber}</Text>
        }
        {account == grabInfo.seller && grabInfo.startBlock == 0 && onCancelGrab &&
          <Button 
            onClick={() => onCancelGrab(grabInfo)}
          >
            Cancel grab
          </Button>
        }
    </Box>
    </>
  );
}

export default GrabCard