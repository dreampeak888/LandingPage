import React, { useEffect, useRef, useState } from 'react';
import { Box, Center, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
// Define the type for the course data
interface Course {
  title: string;
  description: string;
  image: string;
  link: string;
}

// Data for fitness courses
const courses: Course[] = [
  {
    title: 'Basic Fitness',
    description: 'Get started with basic fitness exercises and routines.',
    image: '/carouselimage.webp',
    link: '/courses/basic-fitness',
  },
  {
    title: 'Advanced Muscle Course',
    description: 'Build muscle mass and strength with our advanced muscle training program.',
    image: '/carouselimage.webp',
    link: '/courses/advanced-muscle',
  },
  {
    title: 'New Gym Training',
    description: 'Start your gym journey with our comprehensive training program.',
    image: '/carouselimage.webp',
    link: '/courses/new-gym',
  },
  // Other course data...
];

// Define the props type for the CourseCard component
interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, description, image, link }) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const top = ref.current.getBoundingClientRect().top;
        const bottom = ref.current.getBoundingClientRect().bottom;
        const isVisible = top < window.innerHeight && bottom >= 0;

        if (isVisible) {
          controls.start({ opacity: 1, y: 0 });
        } else {
          controls.start({ opacity: 0, y: 20 });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check when the component mounts

    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      style={{ width: '100%' }}
    >
     <Box
    width="auto"
    height="auto"
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    borderColor="gray.200"
    shadow="md"
    backgroundColor="gray.300"
    _hover={{ boxShadow: '2xl' }}
    p={0}
  >
    <Center>
     
        <Image
          src={image}
          alt={title}
          width={1000}
          height={400}
          objectFit="cover"
          layout="responsive"
        />
     
    </Center>
    <Center>
      <Box p={4}>
        <Heading size="md" as="h3" mb={2}>
          {title}
        </Heading>
        <Text fontSize="sm">{description}</Text>
      </Box>
    </Center>
  </Box>
      
    </motion.div>
  );
};

const About: React.FC = () => {
  const bg = useColorModeValue('gray.100', 'gray.800');

  return (
    <Box bg={bg} p={8}>
      <Flex direction="column" alignItems="center">
        <Center>
        <Heading as="h1" size="2xl" mb={4}>
          Acerca de Nosotros
        </Heading>
        </Center>
        <Text mb={8}>
          En nuestro equipo de expertos en hiking, cada miembro comparte una pasión innegable por la naturaleza y la
          aventura al aire libre.
        </Text>
        <Flex
         sx={{
            '@media screen and (min-width: 768px)': {
              flexDirection: 'column',
             
            },
          }} // Switch direction to column on mobile devices
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
          gap={6}
        >
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default About;
