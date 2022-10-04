import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import {
  addMissions,
  updateAllMissions,
  getAllMissions,
} from "../../api/AboutUsAPI.js";
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

const FormMission = (props) => {
  let history = useHistory();
  let { id } = useParams();
  id = parseInt(id);

  const [state, setState] = useStateWithCallbackLazy({
    about_us_id: id,
    misi: [],
  });
  const [missions, setMissions] = useStateWithCallbackLazy({
    about_us_id: id,
    misi: [],
  });

  const changeCred = (event) => {
    setMissions({ ...missions, [event.target.name]: event.target.value });
  };

  const getMissions = async () => {
    const res = await getAllMissions();
    setState({ ...state, misi: res }, () => {
      const mapMissions = res?.map((mission) => mission.misi);
      const strMissions = mapMissions.join("");
      setMissions({ ...missions, misi: strMissions });
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const payload = setFormData(missions);

    Swal.fire({
      title: "Menyimpan Informasi tentang kami",
      html: "Mohon tunggu, sedang menyimpan informasi tentang kami",
      padding: "30px",
      didOpen: async () => {
        Swal.showLoading();
        let res = "";
        if (!props.isEdit) {
          res = await addMissions(payload);
          if (res.status === 200 || res.status === 201) {
            Swal.close();
            history.push("/dashboard/tentang-kami");
            toast(
              <Notification
                type="success"
                message="Misi-misi baru berhasil ditambahkan!"
                withIcon
              />,
              notificationOptions
            );
          } else {
            console.log(res);
          }
        } else {
          res = await updateAllMissions(id, payload);
          if (res.status === 200 || res.status === 201) {
            Swal.close();
            history.push("/dashboard/tentang-kami");
            toast(
              <Notification
                type="success"
                message="Misi-misi berhasil diupdate!"
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
      getMissions(id);
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
                    {id ? "Update Misi" : "Tambah Misi"}
                  </div>
                </div>
                <form
                  onSubmit={(e) => onSubmitHandler(e)}
                  encType="multipart/form-data"
                  method="POST"
                >
                  <div className="px-4">
                    <FormGroup className="my-3">
                      <FormText className="mb-2">Misi-misi</FormText>
                      <Input
                        id="misi"
                        className="input-transparent py-4 pl-3"
                        type="textarea"
                        required
                        name="misi"
                        placeholder="Tekan enter untuk menambahkan misi baru pada list"
                        // value={id !== "" ? missions?.misi : ""}
                        defaultValue={props.isEdit ? missions?.misi : ""}
                        onChange={(event) => changeCred(event)}
                      />
                    </FormGroup>
                    <Button
                      className="rounded-pill float-right mt-3 mb-4"
                      color="primary"
                    >
                      Update Misi
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

export default FormMission;
