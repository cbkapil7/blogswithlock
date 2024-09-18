import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {jwtDecode }from 'jwt-decode';
import { Box, Heading, Input, Textarea, Button, Alert, AlertIcon, VStack, HStack } from '@chakra-ui/react';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockedBy, setLockedBy] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditable, setIsEditable] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentUser = jwtDecode(token).username;

    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTitle(response.data.title);
        setContent(response.data.content);
        setIsLocked(response.data.isLocked);
        setLockedBy(response.data.lockedBy);

        if (response.data.isLocked && response.data.lockedBy !== currentUser) {
          setErrorMessage(`This blog is currently being edited by ${response.data.lockedBy}.`);
          setIsEditable(false); 
        } else {
          setErrorMessage('');
          await lockBlog(currentUser); 
        }
      } catch (err) {
        alert('Failed to fetch blog');
      }
    };

    const lockBlog = async (username) => {
      try {
        await axios.post(`http://localhost:5000/api/blogs/${id}/lock`, { lockedBy: username }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        alert('Failed to lock the blog');
      }
    };

    fetchBlog();

    return () => {
      if (isEditable) {
        unlockBlog(); 
      }
    };
  }, [id, isEditable]);

  const unlockBlog = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/blogs/${id}/unlock`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      alert('Failed to unlock the blog');
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/blogs/${id}`, { title, content }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Blog updated successfully');
      navigate('/'); 
    } catch (err) {
      alert('Failed to update blog');
    }
  };

  const handleCancel = async () => {
    await unlockBlog(); 
    navigate('/'); 
  };

  return (
    <Box maxW="800px" mx="auto" mt="50px" p={5} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Heading as="h2" size="xl" mb={6} textAlign="center">Edit Blog</Heading>

      {errorMessage && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {errorMessage}
        </Alert>
      )}

      <VStack spacing={4} align="stretch">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          size="lg"
          isDisabled={!isEditable} 
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          size="lg"
          rows={10}
          isDisabled={!isEditable} 
        />
        <HStack spacing={4} mt={4}>
          <Button colorScheme="teal" onClick={handleSave} isDisabled={!isEditable}>Save</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default EditBlogPage;
