import axios from "axios";
import { config } from "./config";

export const getAllAreas = async () => {
  try {
    const res = await axios.get(`https://service.mjt-tlpartner.com/api/city`);
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const getAreaById = async (id) => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/city/${id}`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const addArea = (payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/city/create`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const updateAllArea = (payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/city/update`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const deleteArea = (id) => {
  try {
    const res = axios.get(
      `https://service.mjt-tlpartner.com/api/city/delete/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};
