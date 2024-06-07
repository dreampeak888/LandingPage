import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './NavBar';
import Footer from './Footer';
import LoggedNavbar from './LoggedNavbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      < LoggedNavbar />
      <Box as="main" pt={-10}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
