import axios from "axios";
import { config } from "./config";

export const getLoggedUser = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/auth/user`,
      {
        headers: {
          Authorization: localStorage.getItem("_token"),
        },
      }
    );
    localStorage.setItem("level", res.data.data.level);
    localStorage.setItem("userId", res.data.data.id);
    return res;
  } catch (error) {
    return error.response;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/auth/users`,
      config
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const getUserById = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/auth/user/${id}`,
      config
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const updateUser = (id, payload) => {
  try {
    const res = axios.post(
      `http://localhost:8000/api/auth/user/update/${id}`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const updateProfile = (payload) => {
  try {
    const res = axios.post(
      `http://localhost:8000/api/auth/user/update`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const deleteUser = (id) => {
  try {
    const res = axios.get(
      `http://localhost:8000/api/auth/user/delete/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const verifyUser = (id) => {
  try {
    const res = axios.get(
      `http://localhost:8000/api/auth/user/verify/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const sendVerificationCode = (payload) => {
  try {
    const res = axios.post(
      `http://localhost:8000/api/password/create`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const checkVerificationCode = (token) => {
  try {
    const res = axios.get(
      `http://localhost:8000/api/password/find/${token}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const resetPassword = (payload) => {
  const newPayload = payload;
  delete newPayload.repassword;
  try {
    const res = axios.post(
      `http://localhost:8000/api/password/reset`,
      newPayload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const sendVerificationEmail = (payload) => {
  try {
    const res = axios.post(
      `http://localhost:8000/api/email/verify/resend`,
      payload,
      config
    );

    return res;
  } catch (error) {
    return error.response;
  }
};
