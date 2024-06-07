import React, { ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './NavBar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <Navbar user={null} />
      <Box as="main" pt={100}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
