import React from 'react';
import { Box, Container, Heading, Text, Button, Stack, useColorModeValue } from '@chakra-ui/react';
import Layout from '../components/Tools/MainLayout';
import VideoHero from '@/components/Pages/HeroVideo';
import Carousel from '@/components/Pages/Carousel';
import Cuestionario from '@/components/Pages/Cuestionario';
import Calendar from '@/components/Pages/Calendar';
import { GetServerSidePropsContext } from 'next'

import About from '@/components/Pages/About';
const Home: React.FC = () => {
  const photos = [
    'carouselimage.webp',
    'carouselimage.webp',
    'carouselimage.webp',
    // Add more photo URLs as needed
  ];

  return (
    <Layout>
      
          
      <VideoHero title={'Herovideo'} description={'descripcion'} videoSrc={'example.mp4'}/>
      <Box py={24}>
        <Cuestionario  />
      </Box>
      
      <Box py={0}>
      <Carousel />
      </Box>
      <Box py={0} >
      <About />
      </Box>
      
    
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context)

  const { data, error } = await supabase.auth.getUser()

  if (error || !data) {
    return {
      props: {
        user: null,
      },
    }
  }

  return {
    props: {
      user: data.user,
    },
  }
}

export default Home;
