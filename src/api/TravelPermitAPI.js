import axios from "axios";
import { config } from "./config";

export const getAllPermit = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/permit", config);
    return res.data.data;
  } catch (err) {
    return err.response;
  }
};

export const getPermitById = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/permit/${id}`,
      config
    );
    return res.data.data;
  } catch (err) {
    return err.response;
  }
};

export const addPermit = async (payload) => {
  try {
    const res = await axios.post(
      `http://localhost:8000/api/permit/create`,
      payload,
      config
    );

    return res;
  } catch (error) {
    return error.response;
  }
};

export const updatePermit = async (id, payload) => {
  try {
    const res = await axios.put(
      `http://localhost:8000/api/permit/${id}`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const deletePermit = async (id) => {
  try {
    const res = await axios.delete(
      `http://localhost:8000/api/permit/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};
