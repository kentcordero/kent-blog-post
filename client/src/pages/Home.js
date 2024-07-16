import { useContext } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';
import { USER_ENDPOINTS, BLOGPOST_ENDPOINTS } from '../API';

export default function Home() {
    const {user} = useContext(UserContext);

	return (
		<>
        <Row>
            <Col className="p-4 text-center">
                {user?.id ?
                    <>
                        <h1>Welcome to Witty Writings, {user?.username}!</h1>
                        <p>Create and share your witty writings here.</p>
                        <Link className="btn btn-primary" to={'/blogs'}>Explore Blogs!</Link>
                    </>
                    :
                    <>
                        <h1>Welcome to Witty Writings!</h1>
                        <p>Login/Register to create and share your blogs.</p>
                        <Link className="btn btn-primary" to={'/blogs'}>Explore Blogs!</Link>
                    </>
                }
            </Col>
        </Row>
		</>
	)
}