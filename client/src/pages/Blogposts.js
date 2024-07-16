import { useContext, useEffect, useState } from 'react';
import { Button, Row, Col, Table, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import BlogpostCard from '../components/BlogpostCard';
import { BLOGPOST_ENDPOINTS } from '../API';

export default function Blogposts() {
    const {user} = useContext(UserContext);

    const [ blogPosts, setBlogPosts ] = useState([]);
    const [ showModal, setShowModal ] = useState(false);

    const [ title, setTitle ] = useState("");
    const [ content, setContent ] = useState("");

    function setOpenModal() {
        setShowModal(true);
    }

    function setCloseModal() {
        setShowModal(false);
        setTitle("");
        setContent("");
    }

    function fetchBlogs() {
        fetch(BLOGPOST_ENDPOINTS.GET_BLOGS, {
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            }
        }).then(res => res.json()).then((data) => {
            setBlogPosts(data.blogs);
        });
    }

    function addBlog(e) {
        e.preventDefault();

        const formattedBody = {
            title,
            content,
        }
        fetch(BLOGPOST_ENDPOINTS.ADD_BLOG, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            },
            body: JSON.stringify(formattedBody)
        }).then(res => res.json()).then((data) => {
            setCloseModal();

            if (data) {
                Swal.fire({
                    title: "Blogpost added successfully!",
                    icon: "success",
                });
            } else {
                Swal.fire({
                    title: "Failed to add blog",
                    icon: "error",
                });
            }
            
            fetchBlogs();
        });
    }

    useEffect(() => {
        fetchBlogs();
    }, []);

	return (
		<>
        <Row className='mt-3'>
            <Col className='text-center'>
                <h3>Shared Blogs</h3>
            </Col>
        </Row>
        <Row className='mt-3'>
            <Col>
                <Button className='btn btn-success' onClick={(e) => setOpenModal()}>Add Blog</Button>
            </Col>
        </Row>
        <Row className='mt-3'>
            {blogPosts.length ?
                <>
                    {blogPosts.map((blogPost) => {
                        return (
                            <Col md={6} className='mb-3'>   
                                <BlogpostCard blogPost={blogPost} />
                            </Col>
                        )
                    })}
                </>
                :
                <h5>No blogs yet.</h5>
            }
        </Row>
        <Modal show={showModal} onHide={setCloseModal}>
            <Modal.Header closeButton>
            <Modal.Title>Add Blog</Modal.Title>
            </Modal.Header>
            <Form onSubmit={(e) => addBlog(e)}>
            <Modal.Body>
                <Form.Group controlId="title">
                    <Form.Label>Title:</Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="content" className='mt-3'>
                    <Form.Label>Description:</Form.Label>
                    <Form.Control 
                        as="textarea" rows={5}
                        placeholder="Enter content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={(e) => setCloseModal()}>
                Close
            </Button>
            <Button variant="primary" type="submit">
                Save Changes
            </Button>
            </Modal.Footer>
            </Form>
        </Modal>
		</>
	)
}