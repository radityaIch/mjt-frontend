import { toast } from "react-toastify";
import { registerUserAccount } from "../api/AuthAPI";
import Notification from "../components/Notification/Notification";
import { notificationOptions } from "../components/utils/utils";

export const REGISTER_REQUEST = "REGISTER_REQUEST";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILURE = "REGISTER_FAILURE";

export function receiveRegister() {
  return {
    type: REGISTER_SUCCESS,
  };
}

export function registerError(payload) {
  return {
    type: REGISTER_FAILURE,
    payload,
  };
}

export function registerUser(payload) {
  return (dispatch) => {
    if (payload.creds.name.length > 0 && payload.creds.email.length > 0) {
      if (payload.creds.password.length >= 8) {
        if (payload.creds.password === payload.creds.repassword) {
          if (registerUserAccount(payload)) {
            toast(
              <Notification
                type="success"
                message="Akun berhasil dibuat!"
                withIcon
              />,
              notificationOptions
            );
            toast(
              <Notification
                type="info"
                message="Cek INBOX / SPAM untuk email verifikasi"
                withIcon
              />,
              notificationOptions
            );
            toast(
              <Notification
                type="info"
                message="Tunggu hingga admin memverifikasi akun anda!"
                withIcon
              />,
              notificationOptions
            );
            payload.history.push("/login");
          } else {
            toast(
              <Notification
                type="error"
                message="Error pada server!"
                withIcon
              />,
              notificationOptions
            );
          }
        } else {
          toast(
            <Notification
              type="warning"
              message="Password dan konfirmasi password tidak cocok!"
              withIcon
            />,
            notificationOptions
          );
          dispatch(
            registerError("Password dan konfirmasi password tidak cocok!")
          );
        }
      } else {
        toast(
          <Notification
            type="warning"
            message="Password minimal 8 karakter!"
            withIcon
          />,
          notificationOptions
        );
        dispatch(registerError("Password minimal 8 karakter!"));
      }
    } else {
      toast(
        <Notification
          type="warning"
          message="Nama & email tidak boleh kosong!"
          withIcon
        />,
        notificationOptions
      );
      dispatch(registerError("Nama & email tidak boleh kosong!"));
    }
  };
}
