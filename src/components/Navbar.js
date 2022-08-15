import {
  Box,
  Heading,
  Link,
  Stack,
  HStack,
  StackDivider,
  Collapse,
  Flex,
  Container,
  IconButton,
  useDisclosure,
  Text
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { NavLink, Link as RouterLink } from 'react-router-dom';
import ConnectWallet from './ConnectWallet/ConnectWallet'

const PolygonLogo = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 10C0 4.47715 4.47715 0 10 0H20C25.5228 0 30 4.47715 30 10V20C30 25.5228 25.5228 30 20 30H10C4.47715 30 0 25.5228 0 20V10Z"
      fill="#8247E5"
    />
    <path
      d="M20.4896 11.5015C20.1157 11.2878 19.635 11.2878 19.2077 11.5015L16.2166 13.2641L14.1869 14.3858L11.2493 16.1484C10.8754 16.362 10.3947 16.362 9.96736 16.1484L7.67062 14.7596C7.29674 14.546 7.02967 14.1187 7.02967 13.638V10.9674C7.02967 10.5401 7.24332 10.1128 7.67062 9.8457L9.96736 8.51039C10.3412 8.29674 10.822 8.29674 11.2493 8.51039L13.546 9.89911C13.9199 10.1128 14.1869 10.5401 14.1869 11.0208V12.7834L16.2166 11.6083V9.79228C16.2166 9.36499 16.003 8.93769 15.5757 8.67062L11.3027 6.16024C10.9288 5.94659 10.4481 5.94659 10.0208 6.16024L5.64095 8.72404C5.21365 8.93769 5 9.36499 5 9.79228V14.8131C5 15.2404 5.21365 15.6677 5.64095 15.9347L9.96736 18.4451C10.3412 18.6588 10.822 18.6588 11.2493 18.4451L14.1869 16.7359L16.2166 15.5608L19.1543 13.8516C19.5282 13.638 20.0089 13.638 20.4362 13.8516L22.7329 15.1869C23.1068 15.4006 23.3739 15.8279 23.3739 16.3086V18.9792C23.3739 19.4065 23.1602 19.8338 22.7329 20.1009L20.4896 21.4362C20.1157 21.6499 19.635 21.6499 19.2077 21.4362L16.911 20.1009C16.5371 19.8872 16.27 19.4599 16.27 18.9792V17.27L14.2404 18.4451V20.2077C14.2404 20.635 14.454 21.0623 14.8813 21.3294L19.2077 23.8398C19.5816 24.0534 20.0623 24.0534 20.4896 23.8398L24.816 21.3294C25.1899 21.1157 25.457 20.6884 25.457 20.2077V15.1335C25.457 14.7062 25.2433 14.2789 24.816 14.0119L20.4896 11.5015Z"
      fill="white"
    />
  </svg>
);

const Links = [
  {
    'label': 'Active Grabs',
    'to': '/grabs'
  },
  {
    'label': 'New Grab',
    'to': '/new-grab'
  },
  {
    'label': 'My Grabs',
    'to': '/my-grabs'
  }
];

const PageLink = ({ label, to, onClose }) => {
  const borderWidth = '3px'

  return (
    <Flex
      alignItems='center'
      h='60px'
      as={NavLink}
      onClick={onClose}
      to={to}
      px={6}
      py={borderWidth}
      fontWeight={500}
      _hover={{
        bg: 'gray.100',
      }}
      _activeLink={{
        borderStyle: 'solid',
        borderColor: 'gray.600',
        borderBottomWidth: borderWidth,
        pb: '0px'
      }}
    >
      {label}
    </Flex>
  )
};

const Navbar = () => {
  const { isOpen, onClose, onToggle } = useDisclosure();

  return (
    <Box
      borderBottom={1}
      borderStyle='solid'
      borderColor='gray.200'
    >
      <Container
        maxW='container.lg'
      >
        <Flex
          alignItems='center'
          justifyContent='space-between'
          h='60px'
        >
          <IconButton
            display={{md: 'none'}}
            variant='ghost'
            mr={2}
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
          />

          <Flex
            flex={1}
          >
            <HStack
              spacing={12}
            >
              <Link
                as={RouterLink}
                to={'/'}
                _focus={{
                  boxShadow: 'none'
                }}
                _hover={{
                  textDecoration: 'none',
                }}
              >
                <Heading
                  fontWeight='extrabold'
                  size='md'
                  letterSpacing={'tighter'}
                  onClick={onClose}
                >
                  NFT-Grab
                </Heading>
              </Link>
              <Stack
                direction='row'
                spacing={4}
                display={{base: 'none', md: 'flex'}}
              >
                {Links.map((link) => (
                  <PageLink key={link.label} label={link.label} to={link.to} onClose={onClose}></PageLink>)
                )}
              </Stack>
            </HStack>
          </Flex>
          <ConnectWallet />
        </Flex>
      </Container>

      <Collapse in={isOpen}>
          <Stack
            spacing={0}
            divider={<StackDivider borderColor='gray.200' />}
            display={{ md: 'none' }}
          >
            {Links.map((link) => (
              <PageLink key={link.label} label={link.label} to={link.to} onClose={onClose}></PageLink>)
            )}
          </Stack>
        </Collapse>

    </Box>
  )
}

export default Navbar