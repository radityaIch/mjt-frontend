import React, { useMemo, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import {
  addContact,
  updateContact,
  getContactById,
} from "../../api/ContactsAPI.js";
import {
  notificationOptions,
  setFormData,
} from "../../components/utils/utils.js";
import { toast } from "react-toastify";
import Notification from "../../components/Notification/Notification.js";
import Swal from "sweetalert2";

import { Col, Row, Button, FormGroup, FormText, Input } from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import Select from "react-select";

import s from "../components/Tables.module.scss";
import { useCallback } from "react";

const FormContact = function () {
  let history = useHistory();
  let { id } = useParams();
  id = parseInt(id);

  const [state, setState] = useStateWithCallbackLazy({
    type: "",
    title: "",
    contact: "",
  });
  const [defaultSelected, setDefaultSelected] = useState("");

  const options = useMemo(() => [
    { value: "call", label: "Telepon" },
    { value: "location", label: "Lokasi" },
    { value: "mail", label: "Email" },
    { value: "whatsapp", label: "Whatsapp" },
  ], []);

  const getDefaultSelectedOptions = useCallback((data) => {
    let res = {};
    options?.map((option, index) => {
      if (option.value === data) {
        res = options[index];
      }
      //useless return
      return [];
    });
    setDefaultSelected(res);
    return res;
  }, [options]);

  const changeCred = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const getContactsData = useCallback(async (id) => {
    const res = await getContactById(id);
    setState(res);
    getDefaultSelectedOptions(res.type);
  }, [getDefaultSelectedOptions, setState]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let data = state;
    if (data.type === "whatsapp")
      data = { ...data, contact: "62" + data.contact.substring(1) };

    const payload = setFormData(data);

    Swal.fire({
      title: "Menyimpan Informasi kontak",
      html: "Mohon tunggu, sedang menyimpan informasi kontak",
      padding: "30px",
      didOpen: async () => {
        Swal.showLoading();
        let res = "";
        if (!id) {
          res = await addContact(payload);
          if (res.status === 200 || res.status === 201) {
            Swal.close();
            history.push("/dashboard/kontak-website");
            toast(
              <Notification
                type="success"
                message="Kontak baru berhasil ditambahkan!"
                withIcon
              />,
              notificationOptions
            );
          } else {
            console.log(res);
          }
        } else {
          res = await updateContact(id, payload);
          if (res.status === 200 || res.status === 201) {
            Swal.close();
            history.push("/dashboard/kontak-website");
            toast(
              <Notification
                type="success"
                message="Kontak berhasil diupdate!"
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
      getContactsData(id);
    }
  }, [getContactsData, id]);

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">
                    {id ? "Update Kontak" : "Tambah Kontak"}
                  </div>
                </div>
                <form
                  onSubmit={(e) => onSubmitHandler(e)}
                  encType="multipart/form-data"
                  method="POST"
                >
                  <div className="px-4">
                    <FormGroup className="my-3">
                      <FormText className="mb-2">
                        Tipe Kontak (per Tipe kontak tidak boleh dipakai lebih
                        dari sekali)
                      </FormText>
                      <Select
                        options={options}
                        id="type"
                        className="input-transparent"
                        placeholder="Tipe Kontak"
                        defaultValue={defaultSelected}
                        name="type"
                        onChange={(event) => {
                          if (event.value === "location")
                            setState({
                              ...state,
                              title: "Lokasi",
                              type: event.value,
                            });
                          if (event.value === "call")
                            setState({
                              ...state,
                              title: "Telepon",
                              type: event.value,
                            });
                          if (event.value === "mail")
                            setState({
                              ...state,
                              title: "Email",
                              type: event.value,
                            });
                          if (event.value === "whatsapp")
                            setState({
                              ...state,
                              title: "Whatsapp",
                              type: event.value,
                            });
                        }}
                      />
                    </FormGroup>
                    {/* <FormGroup className="my-3">
                      <FormText className="mb-2">Judul Kontak</FormText>
                      <Input
                        id="title"
                        className="input-transparent py-4 pl-3"
                        type="text"
                        required
                        name="title"
                        placeholder="Judul untuk kontak pada footer"
                        value={state?.title}
                        onChange={(event) => changeCred(event)}
                      />
                    </FormGroup> */}
                    <FormGroup className="my-3">
                      <FormText className="mb-2">
                        Kontak/Nomor/Email/Lokasi
                      </FormText>
                      <Input
                        id="contact"
                        className="input-transparent py-4 pl-3"
                        type="text"
                        required
                        name="contact"
                        placeholder="Kontak/Nomor/Email/Lokasi sesuai dengan tipe kontak"
                        value={state?.contact}
                        onChange={(event) => changeCred(event)}
                      />
                    </FormGroup>
                    <Button
                      className="rounded-pill float-right mt-3 mb-4"
                      color="primary"
                    >
                      {id ? "Update Kontak" : "Tambah Kontak"}
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

export default FormContact;
