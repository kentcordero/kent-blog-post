import { useContext } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../UserContext';

export default function AppNavbar() {
    const {user} = useContext(UserContext);

	return(
		<Navbar bg="dark" data-bs-theme="dark" expand="lg">
			<Container fluid>
			    <Navbar.Brand as={Link} to="/">Witty Writings</Navbar.Brand>
			    <Navbar.Toggle aria-controls="basic-navbar-nav" />
			    <Navbar.Collapse id="basic-navbar-nav">
					<Navbar.Text>{user.username}</Navbar.Text>
				    <Nav className="ms-auto">
				        <Nav.Link as={NavLink} to="/" exact="true">Home</Nav.Link>
						{user?.id ?
							<Nav.Link as={Link} to="/logout">Logout</Nav.Link>
							:
							<>
								<Nav.Link as={Link} to="/login">Login</Nav.Link>
								<Nav.Link as={Link} to="/register">Register</Nav.Link>
							</>
						}
				    </Nav>
			    </Navbar.Collapse>
			</Container>
		</Navbar>
    )
}