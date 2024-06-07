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

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '',
      firstName: '',
      otherNames: '',
      residency: '',
      activities: [] as string[],
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
    onSubmit: async (values: { email: any; password: any; name: any; firstName: any; otherNames: any; residency: any; activities: any; }) => {
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
              activities: values.activities
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
 function RegisterForm() {
    return (
      <div>
          <Container maxW="md" mt={1} mb={10} p={6} boxShadow="lg" borderRadius="md" bg="white">
          <Heading as="h1" size="lg" textAlign="center" mb={6}>
            Register
          </Heading>
          <Box as="form" onSubmit={formik.handleSubmit}>
            <FormControl id="email" mb={4} >
              <FormLabel>Email</FormLabel>
              <Input type="email" {...formik.getFieldProps('email')} />
            </FormControl>
  
            <FormControl id="password" mb={4} >
              <FormLabel>Password</FormLabel>
              <Input type="password" {...formik.getFieldProps('password')} />
            </FormControl>
  
            <FormControl id="name" mb={4} >
              <FormLabel>Name</FormLabel>
              <Input type="text" {...formik.getFieldProps('name')} />
            </FormControl>
  
            <FormControl id="firstName" mb={4} >
              <FormLabel>First Name</FormLabel>
              <Input type="text" {...formik.getFieldProps('firstName')} />
            </FormControl>
  
            <FormControl id="otherNames" mb={4} >
              <FormLabel>Other Names</FormLabel>
              <Input type="text" {...formik.getFieldProps('otherNames')} />
            </FormControl>
  
            <FormControl id="residency" mb={4} >
              <FormLabel>Residency</FormLabel>
              <Select placeholder="Select state" {...formik.getFieldProps('residency')}>
                {mexicanStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
            </FormControl>
  
            <FormControl id="activities" mb={4} >
              <FormLabel>Activities</FormLabel>
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
          </Box>
        </Container>
      </div>
    )
  }
  return (
    <>
 
    <Layout>
        
        <RegisterForm/>
        
      
    </Layout>
    </>
  );
};

export default Register;
