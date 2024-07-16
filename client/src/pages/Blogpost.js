import { useContext, useEffect, useState } from 'react';
import { Button, Row, Col, Table, Modal, Form, Card, ListGroup } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';
import { BLOGPOST_ENDPOINTS, USER_ENDPOINTS } from '../API';

export default function MovieCatalog() {
    const params = useParams();
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    const [ blogPost, setBlogPost ] = useState({});
    const [ comments, setComments] = useState([]);
    const [ author, setAuthor ] = useState({});
    const [ showModal, setShowModal ] = useState(false);

    const [ title, setTitle ] = useState("");
    const [ content, setContent ] = useState("");
    const [ newComment, setNewComment ] = useState("");

    function setOpenModal() {
        setShowModal(true);
        setTitle(blogPost.title);
        setContent(blogPost.content);
    }

    function setCloseModal() {
        setShowModal(false);
        setTitle("");
        setContent("");
    }

    function getBlogDetails() {
        fetch(BLOGPOST_ENDPOINTS.GET_BLOG + `/${params.id}`, {
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            }
        }).then(res => res.json()).then(async (data) => {
            const author = await getUserDetails(data.authorInformation.toString())
            setAuthor(author);

            const comments = await changeCommentDetails(data.comments);
            setComments(comments);

            setBlogPost(data);
        });
    }

    async function getUserDetails(authorId) {
        const res = await fetch(USER_ENDPOINTS.GET_PROFILE + `/${authorId}`, {
                headers: {
                    Authorization: `Bearer ${ localStorage.getItem('token') }`
                }
            })
            .then(res => res.json())
            .then(data => data);
        const [user] = await Promise.all([res.user]);
        return user;
    }

    function updateBlog(e) {
        e.preventDefault();

        const formattedBody = {
            title,
            content,
        }
        fetch(BLOGPOST_ENDPOINTS.UPDATE_BLOG + `/${params.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            },
            body: JSON.stringify(formattedBody)
        }).then(res => res.json()).then((data) => {
            setCloseModal();

            console.log({ updatedBlog: data });

            if (data.message === 'BlogPost updated successfully') {
                Swal.fire({
                    title: data.message,
                    icon: "success",
                });
            } else {
                Swal.fire({
                    title: "Failed to update movie",
                    icon: "error",
                });
            }
            
            getBlogDetails();
        });
    }

    function deleteBlog() {
        fetch(BLOGPOST_ENDPOINTS.DELETE_BLOG + `/${params.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            },
        }).then(res => res.json()).then((data) => {
            if (data.message === 'BlogPost deleted successfully') {
                Swal.fire({
                    title: data.message,
                    icon: "success",
                });

                navigate('/blogs');
            } else {
                Swal.fire({
                    title: "Failed to delete movie",
                    icon: "error",
                });
            }
        });
    }

    function addComment(e) {
        e.preventDefault();

        const formattedBody = {
            comment: newComment,
        }
        fetch(BLOGPOST_ENDPOINTS.ADD_COMMENT + `/${params.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            },
            body: JSON.stringify(formattedBody)
        }).then(res => res.json()).then((data) => {
            setNewComment("");
            getBlogDetails();
        });
    }

    function deleteComment(commentId) {
        const formattedBody = {
            commentId,
        }
        fetch(BLOGPOST_ENDPOINTS.DELETE_COMMENT + `/${params.id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            },
            body: JSON.stringify(formattedBody)
        }).then(res => res.json()).then((data) => {
            getBlogDetails();
        });
    }

    function generateActionBtn() {
        if (user.id === blogPost.authorInformation?.toString()) {
            return (
                <>
                    <Col lg={9} className='mt-3'>
                        <Link className='btn btn-secondary' to='/blogs'>Back</Link>
                    </Col>
                    <Col lg={3} className='mt-3 d-flex flex-row-reverse justify-content-between'>
                        <Button className='btn btn-danger' onClick={(e) => deleteBlog()}>Delete</Button>
                        <Button className='btn btn-success' onClick={(e) => setOpenModal()}>Update</Button>
                    </Col>
                </>
            )
        } else if (user.isAdmin) {
            return (
                <>
                    <Col lg={12} className='mt-3 d-flex flex-row justify-content-between'>
                        <Link className='btn btn-secondary' to='/blogs'>Back</Link>
                        <Button className='btn btn-danger' onClick={(e) => deleteBlog()}>Delete</Button>
                    </Col>
                </>
            )
        } else {
            return (
                <Col className='mt-3'>
                    <Link className='btn btn-secondary' to='/blogs'>Back</Link>
                </Col>
            )
        }
    }

    async function changeCommentDetails(commentList) {
        const res = await commentList.map(async (comment) => {
            const { userName } = await getUserDetails(comment.userId);
            return {
                username: userName,
                ...comment
            }
        });
        const comments = await Promise.all(res || []);
        return comments;
    }

    useEffect(() => {
        getBlogDetails();
    }, []);

	return (
		<>
        <Row>
            {generateActionBtn()}
        </Row>
        <Row className='mt-3'>
            <Col sm={12}>
                <Card className='align-middle'>
                    <Card.Header className='text-center align-middle'><h4>{blogPost.title}</h4></Card.Header>
                    <Card.Body>
                        <Card.Text>{blogPost.content}</Card.Text>
                        <Card.Text>Created By: {author.userName}</Card.Text>
                        <Card.Text>Created On: {new Date(blogPost.createdOn).toDateString()}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className='my-3'>
            <Col sm={12}>
                <Card className='align-middle'>
                    <Card.Header>Comments</Card.Header>
                    {blogPost.comments &&
                        <ListGroup className="list-group-flush">
                            {comments.map((comment) => {
                                return (
                                    <ListGroup.Item key={comment._id}>
                                        <Row className='align-middle'>
                                            {user.isAdmin ?
                                                <>
                                                    <Col xs={8}>
                                                        {comment.username}: {comment.comment}
                                                    </Col>
                                                    <Col xs={4} className='d-flex flex-row-reverse justify-content-between'>
                                                        <Button variant='danger' onClick={(e) => deleteComment(comment._id)}>Delete</Button>
                                                    </Col>
                                                </>
                                                :
                                                <Col xs={12}>
                                                    {comment.username}: {comment.comment}
                                                </Col>
                                            }
                                            
                                        </Row>
                                    </ListGroup.Item>
                                )
                            })}
                            <ListGroup.Item className='bg-grey'>
                                <Form onSubmit={(e) => addComment(e)}> 
                                    <Form.Group controlId="comment">
                                        <Form.Control 
                                            type="text"
                                            placeholder="Enter your comment here"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" disabled={newComment === ""} className='mt-2'>Post</Button>
                                </Form>
                            </ListGroup.Item>
                        </ListGroup>
                    }
                </Card>
            </Col>
        </Row>
        <Modal show={showModal} onHide={setCloseModal}>
            <Modal.Header closeButton>
            <Modal.Title>Update Blog</Modal.Title>
            </Modal.Header>
            <Form onSubmit={(e) => updateBlog(e)}>
            <Modal.Body>
                <Form.Group controlId="title">
                    <Form.Label>Movie Title:</Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="content" className='mt-3'>
                    <Form.Label>Content:</Form.Label>
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