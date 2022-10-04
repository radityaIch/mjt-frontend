import axios from "axios";
import { config } from "./config";

export const getAllCovers = async () => {
  try {
    const res = await axios.get(`https://service.mjt-tlpartner.com/api/cover`);
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const getCoverById = async (id) => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/cover/${id}`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const addCover = (payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/cover/create`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const updateCover = (id, payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/cover/update/${id}`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const deleteCover = (id) => {
  try {
    const res = axios.get(
      `https://service.mjt-tlpartner.com/api/cover/delete/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};
