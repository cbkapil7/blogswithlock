import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
       
        localStorage.setItem('token', data.token);
        toast({
          title: 'Signup successful!',
          description: 'You have been registered successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/login'); 
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt="50px"
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading as="h2" size="xl" textAlign="center" mb={6}>
        Signup
      </Heading>
      <form onSubmit={handleSignup}>
        <VStack spacing={4}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            width="full"
            isLoading={isSubmitting}
          >
            Signup
          </Button>

          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}
        </VStack>
      </form>
    </Box>
  );
};

export default Signup;
