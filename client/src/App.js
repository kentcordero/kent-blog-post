import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider } from './UserContext';

import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Blogposts from './pages/Blogposts';
import Blogpost from './pages/Blogpost';

import { USER_ENDPOINTS } from './API';
import './App.css';

function App() {

    //Add a global user state
    const [user, setUser] = useState({
      id: null,
      isAdmin: null,
      username: null,
    });

    useEffect(() => {

      if (localStorage.getItem('token')) {
        fetch(USER_ENDPOINTS.GET_PROFILE, {
          headers: {
            Authorization: `Bearer ${ localStorage.getItem('token') }`
          }
        })
        .then(res => res.json())
        .then(data => {
  
          if (typeof data.user !== "undefined") {
    
            setUser({
              id: data.user._id,
              isAdmin: data.user.isAdmin,
              username: data.user.userName,
            });

          } else {
    
            setUser({
              id: null,
              isAdmin: null,
              username: null,
            });
    
          }
    
        })
      }

    }, []);

  return (
    <UserProvider value={{user, setUser}}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/blogs" element={<Blogposts />} />
            <Route path="/blogs/:id" element={<Blogpost />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;