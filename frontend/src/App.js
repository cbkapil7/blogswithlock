// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Login from './Login';
import BlogList from './BlogList';
import Signup from './SignUp';
import BlogEdit from './BlogEdit';
import { setUser } from './redux/actions';

const App = () => {
  const user = useSelector((state) => state.user);
  console.log(user,"user")
  const dispatch = useDispatch();

 
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token,"token")
    if (token) {
      
      const getUserInfo = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users/getUserInfo', {
            headers: { Authorization: `Bearer ${token}` },
          });
          dispatch(setUser(response.data)); 
        } catch (err) {
          console.error('Token verification failed', err);
          localStorage.removeItem('token');
        }
      };
      getUserInfo();
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
      
        <Route
          path="/login"
          element={user ? <Navigate to="/blogs" /> : <Login />}
        />
         <Route path="/signup" element={<Signup />} />

       
        <Route
          path="/blogs"
          element={user ? <BlogList /> : <Navigate to="/login" />}
        />
        <Route
          path="/blogs/:id"
          element={user ? <BlogEdit /> : <Navigate to="/login" />}
        />

      
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
