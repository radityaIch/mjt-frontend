import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import {
  addClient,
  updateClient,
  getClientById,
} from "../../api/ClientsAPI.js";
import ImageUploading from "react-images-uploading";
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

const FormClient = function () {
  let history = useHistory();
  let { id } = useParams();
  id = parseInt(id);

  const [state, setState] = useStateWithCallbackLazy({
    image: undefined,
    title: "",
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [oldImage, setOldImage] = useState();

  const changeCred = (event) => {
    if (event.target.name !== "image")
      setState({ ...state, [event.target.name]: event.target.value });
    else {
      setState({ ...state, image: event.target.files[0] });
    }
  };

  const onChangeImage = (imageList, _addUpdateIndex) => {
    if (imageList[0].file.size <= 2097152) {
      setImagePreview(imageList);
      setState({ ...state, image: imageList[0]?.file });
    } else {
      toast(
        <Notification
          type="error"
          message="Ukuran foto maksimal 2 MB!"
          withIcon
        />,
        notificationOptions
      );
    }
  };

  const onImageRemove = (deletedIndex) => {
    setImagePreview([]);
  };

  const getClientsData = async (id) => {
    const res = await getClientById(id);
    setState(res, () => {
      const copyState = res;
      delete copyState.image;
      setState({ ...copyState });
    });
    setOldImage(res.image);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const payload = setFormData(state);

    Swal.fire({
      title: "Menyimpan Informasi klien",
      html: "Mohon tunggu, sedang menyimpan informasi klien",
      padding: "30px",
      didOpen: async () => {
        Swal.showLoading();
        let res = "";
        if (!id) {
          res = await addClient(payload);
          if (res.status === 200 || res.status === 201) {
            Swal.close();
            history.push("/dashboard/klien");
            toast(
              <Notification
                type="success"
                message="Klien baru berhasil ditambahkan!"
                withIcon
              />,
              notificationOptions
            );
          } else {
            console.log(res);
          }
        } else {
          res = await updateClient(id, payload);
          if (res.status === 200 || res.status === 201) {
            Swal.close();
            history.push("/dashboard/klien");
            toast(
              <Notification
                type="success"
                message="Klien berhasil diupdate!"
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
      getClientsData(id);
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
                    {id ? "Update Klien" : "Tambah Klien"}
                  </div>
                </div>
                <form
                  onSubmit={(e) => onSubmitHandler(e)}
                  encType="multipart/form-data"
                  method="POST"
                >
                  <div className="px-4">
                    {id ? (
                      <div className="d-flex justify-content-center align-items-center">
                        <FormGroup>
                          <FormText className="mb-2 text-center">
                            Foto Lama
                          </FormText>
                          <div className="image-item">
                            <img src={oldImage} alt="b" width="150" />
                          </div>
                        </FormGroup>
                        <FormGroup className="my-3 ml-5">
                          <FormText className="mb-2 text-center">
                            Foto Baru (Maks. 2 MB)
                          </FormText>
                          <ImageUploading
                            multiple={false}
                            value={imagePreview}
                            onChange={onChangeImage}
                            maxNumber={1}
                            dataURLKey="data_url"
                          >
                            {({
                              imageList,
                              onImageUpload,
                              onImageUpdate,
                              isDragging,
                              dragProps,
                            }) => (
                              // write your building UI
                              <div className="upload__image-wrapper text-center">
                                <Button
                                  className="rounded-pill mt-3 mb-4 mr-2"
                                  color="secondary"
                                  type="button"
                                  style={
                                    isDragging ? { color: "red" } : undefined
                                  }
                                  onClick={onImageUpload}
                                  {...dragProps}
                                >
                                  Klik atau taruh foto di sini
                                </Button>
                                &nbsp;
                                {imageList.length > 0
                                  ? imageList?.map((image, index) => (
                                      <div key={index} className="image-item">
                                        <img
                                          src={image["data_url"]}
                                          alt="a"
                                          width="150"
                                        />
                                        <div className="image-item__btn-wrapper">
                                          <Button
                                            className="rounded-pill mt-3 mb-4 mr-2"
                                            color="primary"
                                            type="button"
                                            onClick={() => onImageUpdate(index)}
                                          >
                                            Update
                                          </Button>
                                          <Button
                                            className="rounded-pill mt-3 mb-4"
                                            color="danger"
                                            type="button"
                                            onClick={() => onImageRemove(index)}
                                          >
                                            Remove
                                          </Button>
                                        </div>
                                      </div>
                                    ))
                                  : ""}
                              </div>
                            )}
                          </ImageUploading>
                        </FormGroup>
                      </div>
                    ) : (
                      <FormGroup className="my-3">
                        <FormText className="mb-2 text-center">
                          Foto (Maks. 2 MB)
                        </FormText>
                        <ImageUploading
                          multiple={false}
                          value={imagePreview}
                          onChange={onChangeImage}
                          maxNumber={1}
                          dataURLKey="data_url"
                        >
                          {({
                            imageList,
                            onImageUpload,
                            onImageUpdate,
                            isDragging,
                            dragProps,
                          }) => (
                            // write your building UI
                            <div className="upload__image-wrapper text-center">
                              <Button
                                className="rounded-pill mt-3 mb-4 mr-2"
                                color="secondary"
                                type="button"
                                style={
                                  isDragging ? { color: "red" } : undefined
                                }
                                onClick={onImageUpload}
                                {...dragProps}
                              >
                                Klik atau taruh foto di sini
                              </Button>
                              &nbsp;
                              {imageList?.map((image, index) => (
                                <div key={index} className="image-item">
                                  <img
                                    src={image["data_url"]}
                                    alt="a"
                                    width="150"
                                  />
                                  <div className="image-item__btn-wrapper">
                                    <Button
                                      className="rounded-pill mt-3 mb-4 mr-2"
                                      color="primary"
                                      type="button"
                                      onClick={() => onImageUpdate(index)}
                                    >
                                      Update
                                    </Button>
                                    <Button
                                      className="rounded-pill mt-3 mb-4"
                                      color="danger"
                                      type="button"
                                      onClick={() => onImageRemove(index)}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </ImageUploading>
                      </FormGroup>
                    )}
                    <FormGroup className="my-3">
                      <FormText className="mb-2">Brand/Nama Klien</FormText>
                      <Input
                        id="title"
                        className="input-transparent py-4 pl-3"
                        type="text"
                        required
                        name="title"
                        placeholder="Contoh: Frisian Flag, Mangkokku, dll"
                        value={state?.title}
                        onChange={(event) => changeCred(event)}
                      />
                    </FormGroup>
                    <Button
                      className="rounded-pill float-right mt-3 mb-4"
                      color="primary"
                    >
                      {id ? "Update Klien" : "Tambah Klien"}
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

export default FormClient;
