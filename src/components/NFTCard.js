import { 
  Box, 
  Image, 
  Button, 
  AspectRatio
} from '@chakra-ui/react'
import NFTDetails from './NFTDetails'

function NFTCard({ nftInfo, onCreateGrab }) {
  return (
    <Box
      borderColor='black'
      borderWidth='2px'
    >
      <AspectRatio ratio={1} >
        <Image  
          src={nftInfo.image}
          bg='gray.400'
        />
      </AspectRatio>
      <NFTDetails nftInfo={nftInfo} />
      <Button
          backgroundColor='white'
          borderRadius={0}
          borderTop='2px solid black'
          width='100%'
          onClick={() => onCreateGrab(nftInfo)}
        >
          Create Grab
        </Button>
    </Box>
  );
}

export default NFTCard