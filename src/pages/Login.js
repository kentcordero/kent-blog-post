import { useState, useEffect, useContext } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import { USER_ENDPOINTS } from '../API';

export default function Login() {
    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isActive, setIsActive] = useState(true);
    
    function authenticate(e) {

        // Prevents page redirection via form submission
        e.preventDefault();
        fetch(USER_ENDPOINTS.LOGIN,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {

            console.log(data);

            localStorage.setItem('token', data.access);
            retrieveUserDetails(data.access);

            Swal.fire({
                title: "Login Successful",
                icon: "success",
                text: "Welcome to Fitness Tracker!"
            });

            setEmail('');
            setPassword('');

            navigate('/');
        })
    }

    const retrieveUserDetails = (token) => {
        
        fetch(USER_ENDPOINTS.GET_PROFILE, {
            headers: {
                Authorization: `Bearer ${ token }`
            }
        })
        .then(res => res.json())
        .then(data => {

            setUser({
                id: data.user._id,
                isAdmin: data.user.isAdmin,
                username: data.user.userName,
            });

        })

    };

    useEffect(() => {

        if((email !== "" && password !=="")){

            setIsActive(true)

        } else {

            setIsActive(false)

        }

    }, [email, password]);

    return (
        <>
        <Form onSubmit={(e) => authenticate(e)}>
            <Card className='my-5'>
                <Card.Header style={{ backgroundColor: 'var(--grey)'}}>
                    <h4 className='text-center'>Login</h4>
                </Card.Header>
                <Card.Body>
                    <Form.Group controlId="email" className='my-2'>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control 
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="password" className='my-2'>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Card.Body>
                <Card.Footer className='text-center' style={{ backgroundColor: 'var(--grey)'}}>
                    <Button type='submit' disabled={!isActive} variant='dark'>Submit</Button>
                </Card.Footer>
            </Card>
        </Form>
        </>
    )
}