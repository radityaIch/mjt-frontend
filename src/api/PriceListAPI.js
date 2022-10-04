import axios from "axios";
import { config } from "./config";

export const getAllPriceList = async () => {
  try {
    const res = await axios.get(`https://service.mjt-tlpartner.com/api/price`);
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const getPriceListById = async (id) => {
  try {
    const res = await axios.get(
      `https://service.mjt-tlpartner.com/api/price/${id}`
    );
    return res.data.data;
  } catch (error) {
    return error.response;
  }
};

export const addPriceList = (payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/price/create`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const updatePriceList = (id, payload) => {
  try {
    const res = axios.post(
      `https://service.mjt-tlpartner.com/api/price/update/${id}`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const deletePriceList = (id) => {
  try {
    const res = axios.get(
      `https://service.mjt-tlpartner.com/api/price/delete/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};
