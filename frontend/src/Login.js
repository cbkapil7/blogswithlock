import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from './redux/actions';
import { Box, Input, Button, FormControl, FormLabel, Heading, VStack, useToast } from '@chakra-ui/react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const toast = useToast();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
      dispatch(setUser(response.data));
      localStorage.setItem('token', response.data.token);
      toast({
        title: "Login successful.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Login failed.",
        description: "Please check your credentials.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="100%" maxW="400px" mx="auto" mt="100px" p={6} boxShadow="lg" borderRadius="md" bg="gray.50">
      <VStack spacing={4}>
        <Heading size="lg" mb={6}>Login</Heading>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="teal" width="full" onClick={handleLogin}>
          Login
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
