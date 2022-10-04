import axios from "axios";
import { config } from "./config";

export const addPros = async (payload) => {
    try {
        const res = await axios.post(`https://service.mjt-tlpartner.com/api/pros/create`, payload, config)
        return res;
    } catch (error) {
        return error.response;
    }
}

export const getAllPros = async () => {
    try {
        const res = await axios.get(`https://service.mjt-tlpartner.com/api/pros`)
        return res.data.data;
    } catch (error) {
        return error.response;
    }
}

export const getProsById = async (id) => {
    try {
        const res = await axios.get(`https://service.mjt-tlpartner.com/api/pros/${id}`)
        return res.data.data;
    } catch (error) {
        return error.response;
    }
}

export const updatePros = async (id, payload) => {
    try {
        const res = await axios.post(`https://service.mjt-tlpartner.com/api/pros/update/${id}`, payload, config)
        return res;
    } catch (error) {
        return error.response;
    }
}

export const deletePros = async (id) => {
    try {
        const res = await axios.get(`https://service.mjt-tlpartner.com/api/pros/delete/${id}`, config)
        return res;
    } catch (error) {
        return error.response;
    }
}