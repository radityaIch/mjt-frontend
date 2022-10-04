import axios from "axios";
import { config } from "./config";

export const getAllArmada = async () => {
  try {
    const res = await axios.get(`https://service.mjt-tlpartner.com/api/armada`);
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const getArmadaById = async (id) => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/armada/${id}`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const addArmada = (payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/armada/create`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const updateArmada = (id, payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/armada/update/${id}`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const deleteArmada = (id) => {
  try {
    const res = axios.get(
      `https://service.mjt-tlpartner.com/api/armada/delete/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};
