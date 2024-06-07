import React, { useState, useMemo, useCallback ,useEffect} from 'react';
import {
  Box,
  Button,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  Radio,
  RadioGroup,
  Center,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  
  useMediaQuery,
  Heading,
} from '@chakra-ui/react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface CarouselQuestionnaireProps {
  questions: Question[];
  apiEndpoint: string;
}

const CarouselQuestionnaire: React.FC<CarouselQuestionnaireProps> = ({ questions, apiEndpoint }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [isFinished, setIsFinished] = useState(false);
  const toast = useToast();

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? questions.length - 1 : prevIndex - 1));
  }, [questions.length]);

  const handleNext = useCallback(() => {
    if (currentIndex === questions.length - 1) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex === questions.length - 1 ? 0 : prevIndex + 1));
    }
  }, [currentIndex, questions.length]);

  const handleAnswerChange = useCallback(async (answer: string) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentIndex] = answer;
      return newAnswers;
    });

    if (currentIndex === questions.length - 1) {
      try {
        await axios.post(apiEndpoint, { answers });
        toast({
          title: "Answers submitted.",
          description: "Your answers have been submitted successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error submitting answers.",
          description: "There was an error submitting your answers. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      setIsFinished(true);
    } else {
      handleNext();
    }
  }, [currentIndex, questions.length, apiEndpoint, answers, toast, handleNext]);

  const handleReset = () => {
    setAnswers(Array(questions.length).fill(''));
    setCurrentIndex(0);
    setIsFinished(false);
  };

  const handleGetResults = () => {
    // Implement result fetching logic here if needed
    toast({
      title: "Get Results",
      description: "Fetching results...",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const currentQuestion = useMemo(() => questions[currentIndex], [currentIndex, questions]);

  const [isMobile] = useMediaQuery('(max-width: 320px)');
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });
  const spacing = useBreakpointValue({ base: 2, md: 4 });

  return (
    <Center>
    <Box position="relative"  width={isMobile ? "160%" : "100%"} overflow="hidden" p={4}>
      {isFinished ? (
        <Center>
          <Stack spacing={spacing} w="100%" align="center">
            <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
              Finished!
            </Text>
            <Button colorScheme="teal" size={buttonSize} onClick={handleGetResults}>
              Get Results
            </Button>
            <Button colorScheme="teal" size={buttonSize} onClick={handleReset}>
              Repeat Questionnaire
            </Button>
          </Stack>
        </Center>
      ) : (
        <Center>
          <Box display="flex" alignItems="center" justifyContent="center" position="relative" w={isMobile ? "160%" : "100%"} >
            <Stack spacing={spacing} w="100%">
              <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold">
                {currentQuestion.text}
              </Text>
              <RadioGroup onChange={handleAnswerChange} value={answers[currentIndex]}>
                <Stack spacing={spacing}>
                  {currentQuestion.options.map((option, index) => (
                    <Radio key={index} value={option} colorScheme="teal">
                      {option}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </Stack>
          </Box>
        </Center>
      )}
    </Box>
    </Center>
  );
};
interface ResponsiveSEOButtonModalProps {
  buttonText: string;

  children: React.ReactNode;
}



const ResponsiveSEOButtonModal: React.FC<ResponsiveSEOButtonModalProps> = ({ buttonText, children }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMobile] = useMediaQuery('(max-width: 768px)');
  const [isComponentVisible, setIsComponentVisible] = useState<boolean>(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setIsComponentVisible(true);
  }, []);

  return (
    <Center>
      <Box>
        {isComponentVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box mb={4}>
              <Heading as="h1" size="lg" textAlign="center">
                Your Title Here
              </Heading>
            </Box>
            <Button
              colorScheme="teal"
              onClick={handleButtonClick}
              size={isMobile ? 'sm' : 'md'}
              fontSize={isMobile ? 'sm' : 'md'}
              py={isMobile ? 2 : 3}
              px={isMobile ? 4 : 6}
              borderRadius="md"
              mb={4}
            >
              {buttonText}
            </Button>
          </motion.div>
        )}

        <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="full">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{buttonText}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{children}</ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Center>
  );
};

const Cuestionario: React.FC = () => {
  const questions = [
    { id: 1, text: "What is your favorite color?", options: ["Red", "Blue", "Green", "Yellow"] },
    { id: 2, text: "What is your favorite animal?", options: ["Dog", "Cat", "Bird", "Fish"] },
    { id: 3, text: "What is your favorite food?", options: ["Pizza", "Burger", "Pasta", "Salad"] },
  ];
  return (
    <Box>
     
      <ResponsiveSEOButtonModal buttonText="Hacer Cuestionario">
        <Center>
       <CarouselQuestionnaire questions={questions} apiEndpoint={'/api/submit-answer'}/>
       </Center>
      </ResponsiveSEOButtonModal>
    </Box>
  );
};

export default Cuestionario;

