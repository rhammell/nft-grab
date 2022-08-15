import { 
  Box, 
  Text, 
  Link,
} from '@chakra-ui/react'
import appChain from '../config.js'

function NFTDetails({ nftInfo }) {
  return (
    <Box p={2} >
      <Text fontWeight='bold'>{nftInfo.metadata ? nftInfo.metadata.name : '...'}</Text>
      <Link 
        href={appChain.explorer + 'address/' + nftInfo.token_address}
        isExternal
      >
        {nftInfo.name}
      </Link>
    </Box>
  );
}

export default NFTDetails