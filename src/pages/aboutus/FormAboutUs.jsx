import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import ImageUploading from "react-images-uploading";
import {
  addAboutUs,
  updateAboutUs,
  getAboutUsById,
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
import { useCallback } from "react";

const FormAboutUs = (props) => {
  let history = useHistory();
  let { id } = useParams();
  id = parseInt(id);

  const [imagePreview, setImagePreview] = useState([]);
  const [state, setState] = useStateWithCallbackLazy({
    tagline: "",
    visi: "",
    nib: "",
    description: "",
    image_1: undefined,
    image_2: undefined,
  });

  const changeCred = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const onChangeImage = (imageList, _addUpdateIndex) => {
    if (imageList[0].file.size <= 2097152) {
      setImagePreview(imageList);
      setState({
        ...state,
        image_1: imageList[0]?.file,
        image_2: imageList[1]?.file,
      });
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
    const newImages = [...imagePreview];
    if (deletedIndex !== -1) {
      newImages.splice(deletedIndex, 1);
      setImagePreview(newImages);
    }
  };

  const getAboutUsData = useCallback(async (id) => {
    const res = await getAboutUsById(id);
    const newRes = res;
    delete newRes.image_1;
    delete newRes.image_2;
    setState(newRes);
  }, [setState]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const payload = setFormData(state);

    Swal.fire({
      title: "Menyimpan Informasi tentang kami",
      html: "Mohon tunggu, sedang menyimpan informasi tentang kami",
      padding: "30px",
      didOpen: async () => {
        Swal.showLoading();
        let res = "";
        if (!id) {
          res = await addAboutUs(payload);
          if (res.status === 200 || res.status === 201) {
            Swal.close();
            history.push("/dashboard/tentang-kami");
            toast(
              <Notification
                type="success"
                message="Tentang Kami baru berhasil ditambahkan!"
                withIcon
              />,
              notificationOptions
            );
          } else {
            console.log(res);
          }
        } else {
          res = await updateAboutUs(id, payload);
          if (res.status === 200 || res.status === 201) {
            Swal.close();
            history.push("/dashboard/tentang-kami");
            toast(
              <Notification
                type="success"
                message="Tentang Kami berhasil diupdate!"
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
      getAboutUsData(id);
    }
  }, [getAboutUsData, id]);

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">
                    {id
                      ? props.editVisi
                        ? "Update Visi"
                        : "Update Tentang Kami"
                      : "Tambah Tentang Kami"}
                  </div>
                </div>
                <form
                  onSubmit={(e) => onSubmitHandler(e)}
                  encType="multipart/form-data"
                  method="POST"
                >
                  {props.editVisi ? (
                    <div className="px-4">
                      <FormGroup className="my-3">
                        <FormText className="mb-2">Visi</FormText>
                        <Input
                          id="visi"
                          className="input-transparent py-4 pl-3"
                          type="textarea"
                          required
                          name="visi"
                          placeholder="Visi"
                          value={state?.visi}
                          onChange={(event) => changeCred(event)}
                        />
                      </FormGroup>
                      <Button
                        className="rounded-pill float-right mt-3 mb-4"
                        color="primary"
                      >
                        {id ? "Update Tentang Kami" : "Tambah Tentang Kami"}
                      </Button>
                    </div>
                  ) : (
                    <div className="px-4">
                      <FormGroup className="my-3 ml-5">
                        <FormText className="mb-2 text-center">
                          Maks 2 Foto (Maks. 2 MB/Foto)
                        </FormText>
                        <ImageUploading
                          multiple
                          value={imagePreview}
                          onChange={onChangeImage}
                          maxNumber={2}
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
                              <div className="d-flex align-items-end justify-content-around flex-wrap">
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
                            </div>
                          )}
                        </ImageUploading>
                      </FormGroup>
                      <FormGroup className="my-3">
                        <FormText className="mb-2">Tagline</FormText>
                        <Input
                          id="tagline"
                          className="input-transparent py-4 pl-3"
                          type="text"
                          required
                          name="tagline"
                          placeholder="Tagline"
                          value={state?.tagline}
                          onChange={(event) => changeCred(event)}
                        />
                      </FormGroup>
                      <FormGroup className="my-3">
                        <FormText className="mb-2">Visi</FormText>
                        <Input
                          id="visi"
                          className="input-transparent py-4 pl-3"
                          type="textarea"
                          required
                          name="visi"
                          placeholder="Visi"
                          value={state?.visi}
                          onChange={(event) => changeCred(event)}
                        />
                      </FormGroup>
                      <FormGroup className="my-3">
                        <FormText className="mb-2">
                          Nomor Izin Berusaha (NIB)
                        </FormText>
                        <Input
                          id="nib"
                          className="input-transparent py-4 pl-3"
                          type="text"
                          required
                          name="nib"
                          placeholder="Nomor Izin Berusaha (NIB)"
                          value={state?.nib}
                          onChange={(event) => changeCred(event)}
                        />
                      </FormGroup>
                      <FormGroup className="my-3">
                        <FormText className="mb-2">Deskripsi</FormText>
                        <Input
                          id="description"
                          className="input-transparent py-4 pl-3"
                          type="textarea"
                          required
                          name="description"
                          placeholder="Deskripsi tentang kami"
                          value={state?.description}
                          onChange={(event) => changeCred(event)}
                        />
                      </FormGroup>
                      <Button
                        className="rounded-pill float-right mt-3 mb-4"
                        color="primary"
                      >
                        {id ? "Update Tentang Kami" : "Tambah Tentang Kami"}
                      </Button>
                    </div>
                  )}
                </form>
              </Widget>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default FormAboutUs;
