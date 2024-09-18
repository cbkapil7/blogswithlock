import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Box, Heading, Text, Button, List, ListItem, Alert, AlertIcon, VStack } from '@chakra-ui/react';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsTokenValid(false);
        return;
      }

      try {
        await axios.get('http://localhost:5000/api/users/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsTokenValid(true);
      } catch (err) {
        setIsTokenValid(false);
      }
    };

    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/blogs/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlogs(response.data);
      } catch (err) {
        alert('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    validateToken().then(() => {
      if (isTokenValid) {
        fetchBlogs();
      } else {
        navigate('/login');
      }
    });
  }, [isTokenValid, navigate]);

  const handleEditClick = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.isLocked && response.data.lockedBy !== jwtDecode(token).username) {
        setErrorMessages((prevMessages) => ({
          ...prevMessages,
          [blogId]: `The blog is currently being edited by ${response.data.lockedBy}.`,
        }));
      } else {
        setErrorMessages((prevMessages) => ({
          ...prevMessages,
          [blogId]: '',
        }));
        navigate(`/blogs/${blogId}`);
      }
    } catch (err) {
      alert('Failed to check blog status');
    }
  };

  if (loading) return <p>....</p>;

  return (
    <Box maxW="800px" mx="auto" mt="50px" p={5}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">Blog List</Heading>
      <VStack spacing={6} align="stretch">
        <List spacing={4}>
          {blogs.map((blog) => (
            <ListItem key={blog._id} p={4} boxShadow="md" borderWidth="1px" borderRadius="lg">
              <Heading as="h2" size="md" mb={2}>{blog.title}</Heading>
              <Text mb={4}>{blog.content}</Text>
              <Button colorScheme="teal" onClick={() => handleEditClick(blog._id)}>Edit</Button>
              {errorMessages[blog._id] && (
                <Alert status="error" mt={4}>
                  <AlertIcon />
                  {errorMessages[blog._id]}
                </Alert>
              )}
            </ListItem>
          ))}
        </List>
      </VStack>
    </Box>
  );
};

export default BlogList;
