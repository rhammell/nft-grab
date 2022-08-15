import { Outlet } from 'react-router-dom'
import { Box, Container } from '@chakra-ui/react'
import Navbar from './Navbar'

function Layout() {
  return (
    <Box>
      <Navbar />
      <Container
        maxW='container.lg'
        mt={8}
        mb={20}
      >
        <Outlet />
      </Container>
    </Box>
  );
}

export default Layout