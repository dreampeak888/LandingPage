import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

const Links = ['About', 'Contact', 'Calendar'];

const NavLink: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Link
      px={2}
      py={1}
      rounded={'md'}
      color={'gray.200'}
      fontWeight="bold" // Set initial font weight
      fontSize="md" // Set initial font size
      _hover={{
        textDecoration: 'none',
        fontWeight: 'bold', // Make font bold on hover
        color: 'black', // Set font color to white on hover
        fontSize: 'sm', // Increase font size on hover
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}>
      {children}
    </Link>
  );

const Navbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box
        bg={useColorModeValue('transparent', 'transparent')}
        px={4}
        position="fixed"
        width="100%"
        zIndex="1"
        css={{
          backdropFilter: 'blur(10px)',
        }}
        _scroll={{ bg: useColorModeValue('white', 'gray.800') }}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>Logo</Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Button as={Link} href="login" variant={'link'} mr={4} color={'gray.200'}>
              Login
            </Button>
            <Button as={Link} href="register" bgColor={'black'} textColor={'gray.200'}>
              Register
            </Button>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Navbar;
