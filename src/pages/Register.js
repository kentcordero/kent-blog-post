import { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { USER_ENDPOINTS } from '../API';

export default function Register() {
    const navigate = useNavigate();

	const [username, setUsername] = useState("");
	const [email,setEmail] = useState("");
	const [password,setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

    const [isActive, setIsActive] = useState(false);
    
    function registerUser(e) {
		e.preventDefault();
		fetch(USER_ENDPOINTS.REGISTER,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userName: username,
                email,
                password,
            })
		})
		.then(res => res.json())
		.then(data => {

            //determine the returned data. Especially useful when the given API is online.
            console.log(data);

            //data will only contain an email property if we can properly save our user.
            if(data.message === "Registered Successfully"){

                setEmail('');
                setPassword('');
                setConfirmPassword('');

                Swal.fire({
                    title: "Registration Successful",
                    icon: "success",
                    text: "Thank you for registering!"
                });

                navigate('/login');
            } 

		})
	}

	useEffect(()=>{

        if((username !== "" && email !== "" && password !=="" && confirmPassword !=="") && (password === confirmPassword)){

            setIsActive(true)

        } else {

            setIsActive(false)

        }

	},[username, email, password, confirmPassword])
    

	return (
        <>
        <Form onSubmit={(e) => registerUser(e)}>
            <Card className='my-5'>
                <Card.Header style={{ backgroundColor: 'var(--grey)'}}>
                    <h4 className='text-center'>Register</h4>
                </Card.Header>
                <Card.Body>
                    <Form.Group className='my-1'>
                        <Form.Label>Username:</Form.Label>
                        <Form.Control 
                        type="text"
                        placeholder="Enter Username" 
                        required 
                        value={username} 
                        onChange={e => {setUsername(e.target.value)}}/>
                    </Form.Group>
                    <Form.Group className='my-2'>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control 
                        type="email"
                        placeholder="Enter Email" 
                        required 
                        value={email} 
                        onChange={e => {setEmail(e.target.value)}}/>
                    </Form.Group>
                    <Form.Group className='my-2'>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control 
                        type="password" 
                        placeholder="Enter Password" 
                        required 
                        value={password} 
                        onChange={e => {setPassword(e.target.value)}}/>
                    </Form.Group>
                    <Form.Group className='my-2'>
                        <Form.Label>Confirm Password:</Form.Label>
                        <Form.Control 
                        type="password" 
                        placeholder="Confirm Password" 
                        required 
                        value={confirmPassword} 
                        onChange={e => {setConfirmPassword(e.target.value)}}/>
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