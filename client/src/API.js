const API_URL = 'http://localhost:4000';

export const USER_ENDPOINTS = Object.freeze({
    REGISTER: `${API_URL}/users/register`,
    LOGIN: `${API_URL}/users/login`,
    GET_PROFILE: `${API_URL}/users/details`,
})

export const BLOGPOST_ENDPOINTS = Object.freeze({
    ADD_BLOG: `${API_URL}/blogs/addBlog`,
    GET_BLOGS: `${API_URL}/blogs/getBlogs`,
    GET_BLOG: `${API_URL}/blogs/getBlog`,
    UPDATE_BLOG: `${API_URL}/blogs/updateBlog`,
    DELETE_BLOG: `${API_URL}/blogs/deleteBlog`,
    ADD_COMMENT: `${API_URL}/blogs/addComment`,
    DELETE_COMMENT: `${API_URL}/blogs/deleteComment`,
})