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

export const generatePutUrl = async (file) => {
    const payload = {
        Key: file.name,
        ContentType: file.type
    };
    const {data} = await axios.post('/api/files/generate-put-url',payload)
    return data;
}

export const uploadToS3 = async (url, file, progressCallback) => {
    const config = {
        params: {
            Key: file.name,
            ContentType: file.type
        },
        headers: {
            'Content-Type': file.type
        },
        onUploadProgress: function(progressEvent) {
          var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          progressCallback(percentCompleted)
        }
    }
    axios.put(url,file,config).then((res)=>{
        return(res.data)
    }).catch((err)=>{
        alert(err);
    })
}