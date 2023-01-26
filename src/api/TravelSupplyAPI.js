import axios from "axios";
import { config } from "./config";

export const getAllSupply = async (id) => {
  try {
    const res = await axios.get(
      // https://service.mjt-tlpartner.com/api/
      `http://localhost:8000/api/supply/${id}`,
      config
    );
    return await res.data.data;
  } catch (err) {
    return err.response;
  }
};

export const addSupply = async (payload) => {
  try {
    const res = await axios.post(
      // https://service.mjt-tlpartner.com/api/
      `http://localhost:8000/api/supply/create`,
      payload,
      config
    );

    return res;
  } catch (err) {
    return err.response;
  }
};

export const updateSupply = async (id, payload) => {
  try {
    const res = await axios.post(
      // https://service.mjt-tlpartner.com/api/
      `http://localhost:8000/api/supply/item/${id}`,
      payload,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};

export const deleteSupply = async (id) => {
  try {
    const res = await axios.delete(
      // https://service.mjt-tlpartner.com/api/
      `http://localhost:8000/api/supply/${id}`,
      config
    );
    return res;
  } catch (error) {
    return error.response;
  }
};
