import Router from "next/router";
import axios from "axios";
import Cookies from "js-cookie";

const WINDOW_USER_SCRIPT_VARIABLE = "__USER__";

export const signInUser = async user => {
    const { data } = await axios.post("/api/auth/signin", user);
    if (typeof window !== "undefined") {
        Cookies.set(WINDOW_USER_SCRIPT_VARIABLE,data|| {})
    }
}

export const signupUser = async user => {
    const { data } = await axios.post("/api/auth/signup", user);
    return data;
};

export const requestOTP = async email => {
    const {data} = await axios.get('/api/auth/otp',{
        params: {
            email: email
        }
    })
    return data;
}

export const validateEmail = async body => {
    const {data} = await axios.post('/api/auth/validate',body)
    return data;
}

export const signoutUser = async () => {
    if (typeof window !== "undefined") {
        Cookies.set(WINDOW_USER_SCRIPT_VARIABLE, {})
    }
    await axios.get("/api/auth/signout");
    Router.push("/");
};


export const getSessionFromServer = req => {
    if (req.user) {
        return { user: req.user };
    }
    return {};
};

export const getSessionFromClient = () => {
    if (typeof window !== "undefined") {
        const user = JSON.parse(Cookies.get(WINDOW_USER_SCRIPT_VARIABLE) || "{}");
        return { user };
    }
    return { user: {} };
};

const redirectUser = (res, path) => {
    if (res) {
        res.redirect(302, path);
        res.finished = true;
        return {};
    }
    Router.push(path);
    return {};
};


export const authInitialProps = isProtectedRoute => ({
    req,
    res,
    query: { userId }
    }) => {
    const auth = req ? getSessionFromServer(req) : getSessionFromClient();
    const currentPath = req ? req.url : window.location.pathname;
    const user = auth.user;
    const isAnonymous = !user || !Object.keys(user).length;
    if (isProtectedRoute && isAnonymous) {
        return redirectUser(res, "/signin");
    }
    if(req){
        if(req.path === "/signin" || req.path === "/signup"){
            if(!!user) return redirectUser(res,"/")
        }
        //Set session-cookies everytime open the web page
        const current_user = JSON.parse(req.cookies[WINDOW_USER_SCRIPT_VARIABLE] || '{}')
        if(user && !Object.keys(current_user).length){
            //If login next-connect.sid available but session cookie is not set, set it!!
            res.cookie(WINDOW_USER_SCRIPT_VARIABLE, JSON.stringify(user))
        }
    }
    return { auth, userId };
};

