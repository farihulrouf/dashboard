import axios from "axios";
const querystring = require("querystring");

export const getCourses = async (user) => {
    const {data} = await axios.get('/api/courses')
    return data;
}

export const getCourseById = async (courseId) => {
    const {data} = await axios.get(`/api/courses/${courseId}`)
    return data;
}

export const getCourseByInstructor = async () => {
    const {data} = await axios.get('/api/courses/mycourses')
    return data;
}

export const createCoursePost = async (courseId,post) =>{
    const {data} = await axios.post(`/api/courses/${courseId}/posts/create`,post)
    return data;
}

export const getCoursePosts = async (courseId,params) => {
    let queryparams = querystring.stringify(params);
    const {data} = await axios.get(`/api/courses/${courseId}/posts?${queryparams}`)
    return data;
}

export const likeAPost = (postId, setData) => {
    return async function(){
        const {data} = await axios.put(`/api/posts/${postId}/like`)
        setData(data.post);
    }
}

export const postComment = (data, callback) => {
    const{postId,comment} = data;
    return async function(){
        const {data} = await axios.post(`/api/posts/${postId}/comment`,{
            'content': comment
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        })
        callback(data.post);
    }
}