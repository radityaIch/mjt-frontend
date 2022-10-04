import React from "react";
import { useParams } from "react-router";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import s from "./Verified.module.scss";

const VerifiedPage = () => {
  let params = useParams();

  return (
    <div className={s.pageContainer}>
      <div className={s.errorContainer}>
        <h1 className={s.errorCode}>Terverifikasi!</h1>
        <p className={s.errorInfo}>{params.email} telah diverifikasi</p>
        <p className={s.errorHelp}>
          Pastikan admin juga telah memverifikasi akun Anda agar dapat melakukan
          login
        </p>
        <Link to="/login">
          <Button
            className={`${s.errorBtn} rounded-pill`}
            type="submit"
            color="secondary-red"
          >
            Ke Halaman Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default VerifiedPage;
