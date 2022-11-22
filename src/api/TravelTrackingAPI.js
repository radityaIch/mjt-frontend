import axios from "axios";
import { config } from "./config";

export const getAllTracking = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/tracking/${id}`,
      config
    );
    return res.data.data;
  } catch (err) {
    return err.response;
  }
};

export const addTracking = async (payload) => {
  try {
    const res = await axios.post(
      `http://localhost:8000/api/tracking/create`,
      payload,
      config
    );

    return res;
  } catch (err) {
    return err.response;
  }
};
