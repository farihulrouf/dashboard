import axios from "axios";
const querystring = require("querystring");

export const getCourses = async (filter) => {
  let query = querystring.stringify(filter);
  console.log(query);
  try{
    const { data } = await axios.get(`/api/courses?${query}`);
    return data;
  }catch(err){
    alert(err);
  }
};

export const getCourseById = async (courseId) => {
  const { data } = await axios.get(`/api/courses/${courseId}`);
  return data;
};

export const getMyCourses = async () => {
  const { data } = await axios.get("/api/courses/mycourses");
  return data;
};

export const getFavouriteCourse = async () => {
  const { data } = await axios.get("/api/courses/favourite");
  return data;
}

export const getMyTeachers = async () => {
  const { data } = await axios.get("/api/users/me/myteachers");
  return data;
};

export const getAllInstructors = async (q) => {
  const { data } = await axios.get(`/api/instructors?q=${escape(q)}`);
  return data;
};

export const getAllOrganizations = async (q) => {
  const { data } = await axios.get(`/api/organizations?q=${escape(q)}`);
  return data;
};

export const getCourseRequests = async (courseId, page) => {
  const { data } = await axios.get(
    `/api/courses/${courseId}/requests?page=${page}`
  );
  return data;
};

export const acceptCourseRequest = async (event) => {
  const body = {
    courseReqId: event.currentTarget.value,
  };
  const { data } = await axios.put(`/api/courses/acceptrequest`, body);
  if (data.status == "ok") {
    this.setState({ request: data.request });
  }
  return data;
};

export const getJoinedCourse = async () => {
  const { data } = await axios.get(`/api/courses/joinedcourses`);
  return data;
};

export const createCoursePost = async (courseId, post) => {
  const attachments = post.attachments.map((file) => {
    const obj = {
      key: file.key,
      name: file.name,
      url: file.url,
      type: file.type,
      size: file.size,
    };
    return obj;
  });
  post.attachments = attachments;
  const { data } = await axios.post(
    `/api/courses/${courseId}/posts/create`,
    post
  );
  return data;
};

export const updateCourse = async (course) => {
  const { data } = await axios.put(`/api/courses/${course._id}/edit`, course);
  return data;
};

export const createCourse = async (course) => {
  const { data } = await axios.post(`/api/courses`, course);
  return data;
};

export const getCoursePosts = async (courseId, params) => {
  let queryparams = querystring.stringify(params);
  console.log("Params");
  console.log(queryparams);
  const { data } = await axios.get(
    `/api/courses/${courseId}/posts?${queryparams}`
  );
  return data;
};

export const getPostById = async (postId) => {
  const { data } = await axios.get(`/api/posts/${postId}`);
  return data;
};

export const deletePost = async (postId, params) => {
  let queryparams = querystring.stringify(params);
  const { data } = await axios.delete(`/api/posts/${postId}?${queryparams}`);
  return data;
};

export const likeAPost = (postId, setData) => {
  return async function () {
    const { data } = await axios.put(`/api/posts/${postId}/like`);
    setData(data.post);
  };
};

export const postComment = (data, callback) => {
  const { postId, comment } = data;
  return async function () {
    const { data } = await axios.post(
      `/api/posts/${postId}/comment`,
      {
        content: comment,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    callback(data.post);
  };
};

export const getCourseDiscussions = async (courseId) => {
    const {data} = await axios.get(`/api/courses/${courseId}/discussions`);
    console.log(data);
    return data;
}

export const deleteCourseDiscussion = async (discussionId) =>{
  const {data} = await axios.delete(`/api/discussions/${discussionId}`)
  console.log(data);
  return data;
}

export const createCourseDiscussion = async (discussion) => {
    const {data} = await axios.post(
        `/api/courses/${discussion.postedOn}/discussions`, 
        discussion
    )
    return data;
}


export const updateCourseDiscussion = async (discussion) => {
    const {data} = await axios.put(
        `/api/discussions/${discussion._id}`,
        discussion
    )
    return data;
}

export const voteDiscussion = async (discussion) => {
    const {data} = await axios.put(
        `/api/discussions/${discussion._id}/vote`
    )
    return data;
}

export const createDiscussionAnswer = async (answer) => {
    const {data} = await axios.post(
        `api/discussions/${answer.discussionId}/answers`,
        answer
    )
    return data;
}

export const getOrganizations = async () => {
  const { data } = await axios.get("/api/users?type=org");
  return data;
};

export const getTeachers = async () => {
  const { data } = await axios.get(`/api/teacher-applications`);
  return data;
};

export const updateTeacherApplication = async (appId, action) => {
  if (action === "accept") {
    const { data } = await axios.put(
      `/api/teacher-applications/${appId}/accept`
    );
    return data;
  } else if (action === "reject") {
    const { data } = await axios.post(
      `/api/teacher-applications/${appId}/reject`
    );
    return data;
  }
};

export const createApplication = async (org) => {
  const { data } = await axios.post(`/api/teacher-applications/create`, org);
  return data;
};

export const cancelApplication = async (appId) => {
  const { data } = await axios.delete(`/api/teacher-applications/${appId}`);
  return data;
};

export const updateUserProfile = async (user) => {
  const { data } = await axios.put(`/api/users/updateprofile`, user);
  return data;
};

export const getMyProfile = async () => {
  const { data } = await axios.get(`/api/users/me`);
  return data;
};

export const readMyNotification = async (notificationId) => {
  const { data } = await axios.put(
    `/api/users/me/notifications/${notificationId}`
  );
  return data;
};

export const getUserById = async (userId) => {
  const { data } = await axios.get(`/api/users/${userId}`);
  return data;
};

export const getAllAttachments = async(postId) =>{
  const {data} = await axios.get(`/api/files/${postId}`);
  return data;
}

export const generatePutUrl = async (file) => {
  const payload = {
    FileName: file.name,
    ContentType: file.type,
  };
  const { data } = await axios.post("/api/files/generate-put-url", payload);
  return data;
};

export const uploadToS3 = async (file, progressCallback) => {
  const config = {
    canceltoken: (file.source || {}).token,
    params: {
      Key: file.url,
      ContentType: file.type,
    },
    headers: {
      "Content-Type": file.type,
    },
    onUploadProgress: function (progressEvent) {
      var percentCompleted =
        Math.round((progressEvent.loaded + Number.EPSILON) * 100) /
        progressEvent.total;
      if (!!progressCallback) progressCallback(percentCompleted.toFixed(2));
    },
  };
  try {
    const response = await axios.put(file.url, file, config);
    return response;
  } catch (error) {
    alert(error);
  }
};

export const updatePost = async (post) => {
  const attachments = post.attachments.map((file) => {
    const obj = {
      key: file.key,
      name: file.name,
      url: file.url,
      type: file.type,
      size: file.size,
    };
    return obj;
  });
  post.attachments = attachments;
  const { data } = await axios.put(`/api/posts/${post._id}`, post);
  return data;
};


export const createInvoice = async (invoice) => {
  try{
    const res = await axios.post(`/api/payment/create`, invoice);

    return res;
  }catch(error){
    alert(error);
  }

}

export const getMyInvoice = async () => {
  try {
    const {data} = await axios.get('/api/payment/mypayments');
    return data;
  }
  catch(err){
    console.error(err);
  }
}
