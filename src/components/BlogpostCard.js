import { useEffect, useState } from 'react';
import { Button, Row, Col, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { USER_ENDPOINTS } from '../API';

export default function MovieCard({ blogPost }) {
    const { _id: blogPostId, title, content, authorInformation, createdOn } = blogPost;

    return (
        <Card>
            <Card.Header className='text-center align-middle text-white' style={{ backgroundColor: 'var(--teal)' }}><h4>{title}</h4></Card.Header>
            <Card.Body>
                <Card.Text>{content}</Card.Text>
            </Card.Body>
            <Card.Footer className='text-center text-white' style={{ backgroundColor: 'var(--teal)' }}>
                <Link className='btn btn-light' to={`/blogs/${blogPostId}`}>See More</Link>
            </Card.Footer>
        </Card>
    )
}