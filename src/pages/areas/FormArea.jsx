import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import {
  addArea,
  updateAllArea,
  getAreaById,
  getAllAreas,
} from "../../api/AreasAPI.js";
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

const FormArea = function () {
  let history = useHistory();
  // let { id } = useParams();
  const url = history.location.pathname;
  let id = url.split("/").pop();
  if (id) {
    if (id !== "semua-kota") id = parseInt(id);
  }

  const [state, setState] = useStateWithCallbackLazy({
    title: [],
  });

  const [cities, setCities] = useStateWithCallbackLazy({
    title: "",
  });

  const changeCred = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const getAreasData = async (id) => {
    let res = "";
    if (id && id !== "semua-kota") {
      res = await getAreaById(id);
      setState(res);
    } else {
      res = await getAllAreas();
      setState(res, () => {
        const mapCities = res?.map((city) => city.title);
        const strCities = mapCities.join("");
        setCities(strCities);
      });
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const payload = setFormData(state);

    Swal.fire({
      title: "Menyimpan Informasi kota",
      html: "Mohon tunggu, sedang menyimpan informasi kota",
      padding: "30px",
      didOpen: async () => {
        Swal.showLoading();
        let res = "";
        if (!id) {
          res = await addArea(payload);
          if (res.status === 200 || res.status === 201) {
            Swal.close();
            history.push("/dashboard/jangkauan-kota");
            toast(
              <Notification
                type="success"
                message="Kota baru berhasil ditambahkan!"
                withIcon
              />,
              notificationOptions
            );
          } else {
            console.log(res);
          }
        } else if (id === "semua-kota") {
          res = await updateAllArea(payload);
          if (res.status === 200 || res.status === 201) {
            Swal.close();
            history.push("/dashboard/jangkauan-kota");
            toast(
              <Notification
                type="success"
                message="Semua kota berhasil diupdate!"
                withIcon
              />,
              notificationOptions
            );
          } else {
            console.log(res);
          }
        }
      },
      allowOutsideClick: false,
    });
  };

  useEffect(() => {
    if (id) {
      getAreasData(id);
    }
  }, []);

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">
                    {id ? "Update Kota" : "Tambah Kota"}
                  </div>
                </div>
                <form
                  onSubmit={(e) => onSubmitHandler(e)}
                  encType="multipart/form-data"
                  method="POST"
                >
                  <div className="px-4">
                    {!id || id === "semua-kota" ? (
                      <FormGroup className="my-3">
                        <FormText className="mb-2">Kota</FormText>
                        <Input
                          id="title"
                          className="input-transparent py-2 pl-3"
                          type="textarea"
                          required
                          name="title"
                          placeholder="Tekan enter setelah nama kota untuk memasukkan kota baru"
                          defaultValue={
                            id === "semua-kota" ? cities : state?.title
                          }
                          onChange={(event) => changeCred(event)}
                        />
                      </FormGroup>
                    ) : (
                      <FormGroup className="my-3">
                        <FormText className="mb-2">Kota</FormText>
                        <Input
                          id="title"
                          className="input-transparent py-4 pl-3"
                          type="text"
                          required
                          name="title"
                          placeholder="Nama Kota"
                          value={state?.title}
                          onChange={(event) => changeCred(event)}
                        />
                      </FormGroup>
                    )}
                    <Button
                      className="rounded-pill float-right mt-3 mb-4"
                      color="primary"
                    >
                      {id ? "Update Kota" : "Tambah Kota"}
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

export default FormArea;
