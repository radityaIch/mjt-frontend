import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { updateUser, getUserById } from "../../api/UserAPI.js";
import {
  notificationOptions,
  setFormData,
} from "../../components/utils/utils.js";
import { toast } from "react-toastify";
import Notification from "../../components/Notification/Notification.js";
import Swal from "sweetalert2";

import { Col, Row, Button, FormGroup, FormText, Input } from "reactstrap";
import Widget from "../../components/Widget/Widget.js";

import s from "../components/Tables.module.scss";
import { useCallback } from "react";

const FormUser = function () {
  let history = useHistory();
  let { id } = useParams();
  id = parseInt(id);

  const [state, setState] = useStateWithCallbackLazy({
    name: "",
    position: "",
    level: 0,
  });

  const changeCred = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const getUsersData = useCallback(async (id) => {
    const res = await getUserById(id);
    setState({ name: res.name, position: res.position, level: res.level });
  }, [setState]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const payload = setFormData(state);

    Swal.fire({
      title: "Menyimpan Informasi pengguna",
      html: "Mohon tunggu, sedang menyimpan informasi pengguna",
      padding: "30px",
      didOpen: async () => {
        Swal.showLoading();
        let res = "";
        res = await updateUser(id, payload);
        if (res.status === 200 || res.status === 201) {
          Swal.close();
          history.push("/dashboard/akun-pengguna");
          toast(
            <Notification
              type="success"
              message="Pengguna berhasil diupdate!"
              withIcon
            />,
            notificationOptions
          );
        } else {
          console.log(res);
        }
      },
      allowOutsideClick: false,
    });
  };

  useEffect(() => {
    if (id) {
      getUsersData(id);
    }
  }, [getUsersData, id]);

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">
                    {id ? "Update Pengguna" : "Tambah Pengguna"}
                  </div>
                </div>
                <form
                  onSubmit={(e) => onSubmitHandler(e)}
                  encType="multipart/form-data"
                  method="POST"
                >
                  <div className="px-4">
                    <FormGroup className="my-3">
                      <FormText className="mb-2">Nama Pengguna</FormText>
                      <Input
                        id="name"
                        className="input-transparent py-4 pl-3"
                        type="text"
                        required
                        name="name"
                        placeholder="Nama Pengguna"
                        value={state?.name}
                        onChange={(event) => changeCred(event)}
                      />
                    </FormGroup>
                    <FormGroup className="my-3">
                      <FormText className="mb-2">Posisi/Jabatan</FormText>
                      <Input
                        id="position"
                        className="input-transparent py-4 pl-3"
                        type="text"
                        required
                        name="position"
                        placeholder="Posisi/Jabatan"
                        value={state?.position === null ? "" : state.position}
                        onChange={(event) => changeCred(event)}
                      />
                    </FormGroup>
                    <Button
                      className="rounded-pill float-right mt-3 mb-4"
                      color="primary"
                    >
                      {id ? "Update Pengguna" : "Tambah Pengguna"}
                    </Button>
                  </div>
                </form>
              </Widget>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default FormUser;
