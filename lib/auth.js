import Router from "next/router";
import axios from "axios";

const WINDOW_USER_SCRIPT_VARIABLE = "__USER__";

export const signInUser = async user => {
    const { data } = await axios.post("/api/auth/signin", user);
    if (typeof window !== "undefined") {
        window[WINDOW_USER_SCRIPT_VARIABLE] = data || {};
    }
}

export const signupUser = async user => {
    const { data } = await axios.post("/api/auth/signup", user);
    console.log('data:'+data);
    return data;
  };

