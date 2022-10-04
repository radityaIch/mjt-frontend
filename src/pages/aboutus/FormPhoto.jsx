import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import {
  addAboutUs,
  updateAboutUs,
  getAboutUsById,
} from "../../api/AboutUsAPI.js";
import ImageUploading from "react-images-uploading";
import {
  notificationOptions,
  setFormData,
} from "../../components/utils/utils.js";
import { toast } from "react-toastify";
import Notification from "../../components/Notification/Notification.js";
import Swal from "sweetalert2";

import { Col, Row, Button, FormGroup, FormText } from "reactstrap";
import Widget from "../../components/Widget/Widget.js";

import s from "../components/Tables.module.scss";
import { useCallback } from "react";

const FormPhoto = function () {
  let history = useHistory();
  let { id } = useParams();
  id = parseInt(id);

  const [state, setState] = useStateWithCallbackLazy({
    tagline: "",
    visi: "",
    nib: "",
    description: "",
    image_1: undefined,
    image_2: undefined,
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [imagePreviewSecond, setImagePreviewSecond] = useState([]);
  const [oldImage, setOldImage] = useState();
  const [oldImageSecond, setOldImageSecond] = useState();

  const onChangeImage1 = (imageList, _addUpdateIndex) => {
    if (imageList[0].file.size <= 2097152) {
      setImagePreview(imageList);
      setState({ ...state, image_1: imageList[0]?.file });
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

  const onChangeImage2 = (imageList, _addUpdateIndex) => {
    if (imageList[0].file.size <= 2097152) {
      setImagePreviewSecond(imageList);
      setState({ ...state, image_2: imageList[0]?.file });
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

  const onImageRemove1 = (deletedIndex) => {
    setImagePreview([]);
  };
  const onImageRemove2 = (deletedIndex) => {
    setImagePreviewSecond([]);
  };

  const getAboutUsData = useCallback(async (id) => {
    const res = await getAboutUsById(id);
    setState({
      visi: res.visi,
      tagline: res.tagline,
      description: res.description,
      nib: res.nib,
    });
    setOldImage(res.image_1);
    setOldImageSecond(res.image_2);
  },[setState]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const payload = setFormData(state);

    Swal.fire({
      title: "Menyimpan Informasi Foto",
      html: "Mohon tunggu, sedang menyimpan informasi foto",
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
                message="Foto berhasil diupdate!"
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
                    {id ? "Update Foto" : "Tambah Foto"}
                  </div>
                </div>
                <form
                  onSubmit={(e) => onSubmitHandler(e)}
                  encType="multipart/form-data"
                  method="POST"
                >
                  <div className="px-4">
                    {id ? (
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <div className="d-flex align-items-end">
                          <FormGroup className="mr-5">
                            <FormText className="mb-2 text-center">
                              Foto Lama
                            </FormText>
                            <div className="image-item">
                              <img src={oldImage} alt="b" width="150" />
                            </div>
                          </FormGroup>
                          <FormGroup>
                            <FormText className="mb-2 text-center">
                              Foto Lama
                            </FormText>
                            <div className="image-item">
                              <img src={oldImageSecond} alt="b" width="150" />
                            </div>
                          </FormGroup>
                        </div>
                        <div className="d-flex align-items-end">
                          <FormGroup className="my-3 ml-5">
                            <FormText className="mb-2 text-center">
                              Foto Baru (Maks. 2 MB)
                            </FormText>
                            <ImageUploading
                              multiple={false}
                              value={imagePreview}
                              onChange={onChangeImage1}
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
                                              onClick={() =>
                                                onImageUpdate(index)
                                              }
                                            >
                                              Update
                                            </Button>
                                            <Button
                                              className="rounded-pill mt-3 mb-4"
                                              color="danger"
                                              type="button"
                                              onClick={() =>
                                                onImageRemove1(index)
                                              }
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
                          <FormGroup className="my-3 ml-5">
                            <FormText className="mb-2 text-center">
                              Foto Baru (Maks. 2 MB)
                            </FormText>
                            <ImageUploading
                              multiple={false}
                              value={imagePreviewSecond}
                              onChange={onChangeImage2}
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
                                              onClick={() =>
                                                onImageUpdate(index)
                                              }
                                            >
                                              Update
                                            </Button>
                                            <Button
                                              className="rounded-pill mt-3 mb-4"
                                              color="danger"
                                              type="button"
                                              onClick={() =>
                                                onImageRemove2(index)
                                              }
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
                      </div>
                    ) : (
                      ""
                    )}
                    <Button
                      className="rounded-pill float-right mt-3 mb-4"
                      color="primary"
                    >
                      {id ? "Update Foto" : "Tambah Foto"}
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

export default FormPhoto;
