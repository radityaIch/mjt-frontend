import { toast } from "react-toastify";

export const setFormData = (data) => {
  let formData = new FormData();
  Object.entries(data).map(([key, value]) => formData.append(key, value));
  return formData;
};

export const setFormDataArrayOfFile = (data) => {
  let formData = new FormData();
  Object.entries(data).map(([_key, value]) =>
    formData.append("images[]", value)
  );
  return formData;
};

export const notificationOptions = {
  autoClose: 4000,
  closeButton: false,
  hideProgressBar: true,
  position: toast.POSITION.TOP_CENTER,
};
