import axios from "axios";

export const registerUserAccount = async (payload) => {
  try {
    const res = await axios.post(
      `https://service.mjt-tlpartner.com/api/auth/register`,
      {
        name: payload.creds.name,
        email: payload.creds.email,
        password: payload.creds.password,
        position: "Admin",
        level: 1,
      }
    );
    return res.status;
  } catch (error) {
    return error;
  }
};

export const loginUserAccount = async (payload) => {
  try {
    const res = await axios.post(
      `https://service.mjt-tlpartner.com/api/auth/login`,
      {
        email: payload.creds.email,
        password: payload.creds.password,
      }
    );
    return res;
  } catch (error) {
    return error.response;
  }
};
