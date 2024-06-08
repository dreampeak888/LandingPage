import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Select,
  CheckboxGroup,
  Checkbox,
  Stack,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { mexicanStates, activities } from '../data';
import Layout from '@/components/Tools/Layout';
import { createClient } from '@/utils/supabase/component'; // Import createClient function
import { useFormik } from 'formik';

const Register: React.FC = () => {
  const toast = useToast();
  const router = useRouter();
  const supabase = createClient(); // Initialize Supabase client
  const [step, setStep] = useState(1);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '',
      firstName: '',
      otherNames: '',
      residency: '',
      activities: [] as string[],
      phone: undefined,
      birthdate: undefined
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
      name: Yup.string().required('Required'),
      firstName: Yup.string().required('Required'),
      otherNames: Yup.string().required('Required'),
      residency: Yup.string().required('Required'),
      activities: Yup.array().min(1, 'At least one activity must be selected'),
    }),
    onSubmit: async (values: {
      birthdate: any;
      phone: any; email: any; password: any; name: any; firstName: any; otherNames: any; residency: any; activities: any; 
}) => {
      try {
        // Sign up user with email and password
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });

        if (error) {
          throw error;
        }

        // Wait for authentication state to change
        await supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            // Insert profile information after successful signup
            await supabase.from('profiles').insert([{ 
              authid: session.user.id,
              name: values.name,
              first_name: values.firstName,
              other_names: values.otherNames,
              residency: values.residency,
              activities: values.activities,
              phone: values.phone,
              birthdate: values.birthdate,
            }]);
            
            toast({
              title: "Registration successful.",
              description: "You've successfully registered.",
              status: "success",
              duration: 9000,
              isClosable: true,
            });

            // Redirect to login page after successful registration
            router.push('/login');
          }
        });
      } catch (error) {
        console.error('Error registering user:', error);
        toast({
          title: "Registration failed.",
          
        });
      }
    },
  });
  const handleNext = () => {
    if (formik.values.email && formik.values.password) {
      setStep(2);
    } else {
      toast({
        title: "Error",
        description: "Please fill in the email and password fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }
 function RegisterForm() {
 
    return (
      <div>
          <Container maxW="md" mt={1} mb={10} p={6} boxShadow="lg" borderRadius="md" bg="white">
          <Heading as="h1" size="lg" textAlign="center" mb={6}>
            Register
          </Heading>
          <Box as="form" onSubmit={formik.handleSubmit}>
          {step === 1 && (
            <>
              <FormControl id="email" mb={4}>
                <FormLabel>Email</FormLabel>
                <Input required type="email" {...formik.getFieldProps('email')} />
              </FormControl>

              <FormControl id="password" mb={4}>
                <FormLabel>Password</FormLabel>
                <Input  type="password" {...formik.getFieldProps('password')} />
              </FormControl>

              <Button
                colorScheme="teal"
                width="full"
                mt={4}
                
                onClick={handleNext}
              >
                Next
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <FormControl id="name" mb={4}>
                <FormLabel>Name</FormLabel>
                <Input  required type="text" {...formik.getFieldProps('name')} />
              </FormControl>

              <FormControl id="primerApellido" mb={4}>
                <FormLabel>Primer Apellido</FormLabel>
                <Input  required type="text" {...formik.getFieldProps('primerApellido')} />
              </FormControl>

              <FormControl id="segundoApellido" mb={4}>
                <FormLabel>Segundo Apellido</FormLabel>
                <Input required type="text" {...formik.getFieldProps('segundoApellido')} />
              </FormControl>

              <FormControl id="birthdate" mb={4}>
                <FormLabel>Birthdate</FormLabel>
                <Input required type="date" {...formik.getFieldProps('birthdate')} />
              </FormControl>

              <FormControl id="phone" mb={4}>
                <FormLabel>Phone</FormLabel>
                <Input required type="text" {...formik.getFieldProps('phone')} />
              </FormControl>

              <FormControl id="estado" mb={4}>
                <FormLabel>Estado</FormLabel>
                <Select required placeholder="Select state" {...formik.getFieldProps('estado')}>
                  {mexicanStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl id="activities" mb={4}>
                <FormLabel >Actividades</FormLabel>
                <CheckboxGroup
                  colorScheme="teal"
                  {...formik.getFieldProps('activities')}
                  onChange={(val) => formik.setFieldValue('activities', val)}
                 
                >
                  <Stack spacing={2}>
                    {activities.map((activity) => (
                      <Checkbox key={activity} value={activity}>
                        {activity}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              </FormControl>

              <Button type="submit" colorScheme="teal" width="full" mt={4}>
                Register
              </Button>
            </>
          )}
          </Box>
        </Container>
      </div>
    )
  }
  return (
    <>
 
    <Layout user={null}>
        
        <RegisterForm/>
        
      
    </Layout>
    </>
  );
};

export default Register;
