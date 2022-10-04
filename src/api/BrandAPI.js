import axios from "axios";
import { config } from "./config";

export const getBrand = async () => {
    try {
        const res = await axios.get(`https://service.mjt-tlpartner.com/api/brand/1`)
        console.log(res);
        return res.data.data;
    } catch (error) {
        return error.response;
    }
}

export const updateBrand = async (payload) => {
    try {
        const res = await axios.post(`https://service.mjt-tlpartner.com/api/brand/update/1`, payload, config)
        return res;
    } catch (error) {

    }
}