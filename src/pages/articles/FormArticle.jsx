import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import {
  addArticle,
  updateArticle,
  getArticleById,
  addArticleGallery,
  getArticleGalleryById,
  updateAllArticleGallery,
} from "../../api/ArticlesAPI.js";
import ImageUploading from "react-images-uploading";
import {
  notificationOptions,
  setFormData,
  setFormDataArrayOfFile,
} from "../../components/utils/utils.js";
import { toast } from "react-toastify";
import Notification from "../../components/Notification/Notification.js";
import Swal from "sweetalert2";

import { Col, Row, Button, FormGroup, FormText, Input } from "reactstrap";
import Select from "react-select";
import Widget from "../../components/Widget/Widget.js";

import s from "../components/Tables.module.scss";
import { getAllClients } from "../../api/ClientsAPI.js";

const FormArticle = function () {
  let history = useHistory();
  let { id } = useParams();
  id = id ? parseInt(id) : 0;

  const [imagePreview, setImagePreview] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [images, setImages] = useState([]);
  const [flag, setFlag] = useState(0);
  const [oldImage, setOldImage] = useState();
  const [oldImageGallery, setOldImageGallery] = useState([]);
  const [clientOptions, setClientOptions] = useStateWithCallbackLazy();
  const [state, setState] = useStateWithCallbackLazy({
    image: null,
    title: "",
    description: "",
    category: "mantap",
    user_id: localStorage.getItem("userId"),
  });

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

  const onChangeImageGallery = (imageList, _addUpdateIndex) => {
    if (imageList[0].file.size <= 2097152) {
      setGalleryPreview(imageList);
      setImages([...images, imageList]);
      setFlag(flag + 1);
      mapImageList(imageList);
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

  const mapImageList = (imageList) => {
    let imageArr = [];
    imageList?.map((image) => (imageArr = [...imageArr, image.file]));
    // const imageFormData = setFormDataArrayOfFile(imageArr);
    setImages(imageArr);
  };

  const onImageGalleryRemove = (deletedIndex) => {
    const newGallery = [...galleryPreview];
    if (deletedIndex !== -1) {
      newGallery.splice(deletedIndex, 1);
      setGalleryPreview(newGallery);
      setImages(newGallery);
    }
  };

  const getArticlesData = async (id) => {
    const res = await getArticleById(id);
    setOldImage(res.image);
    setOldImageGallery(res.gallery);
    const copyState = res;
    delete copyState.image;
    delete copyState.gallery;
    if (res.client_id === null) delete copyState.client_id;
    setState({ ...copyState });
  };

  const getArticleGalleryData = async (id) => {
    const res = await getArticleGalleryById(id);
  };

  const getClients = async () => {
    const res = await getAllClients();
    let options = [];
    res?.map((client) => {
      options = [...options, { value: client.id, label: client.title }];
    });
    setClientOptions(options, () => {
      getDefaultClient();
    });
  };

  const getDefaultClient = () => {
    clientOptions?.map((client, index) => {
      if (client.value === state.client.id) return index;
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let payload = undefined;
    payload = setFormData(state);

    Swal.fire({
      title: "Menyimpan Informasi artikel",
      html: "Mohon tunggu, sedang menyimpan informasi artikel",
      padding: "30px",
      didOpen: async () => {
        Swal.showLoading();
        let res = "";
        if (!id) {
          res = await addArticle(payload);
          if (res.status === 200 || res.status === 201) {
            payload = setFormDataArrayOfFile(images);
            let res = await addArticleGallery(payload);
            if (res.status === 200 || res.status === 201) {
              Swal.close();
              history.push("/dashboard/artikel");
              toast(
                <Notification
                  type="success"
                  message="Artikel baru berhasil dipublish!"
                  withIcon
                />,
                notificationOptions
              );
            } else {
              console.log(res);
            }
          } else {
            console.log(res);
          }
        } else {
          res = await updateArticle(id, payload);
          if (res.status === 200 || res.status === 201) {
            if (images !== []) {
              payload = setFormDataArrayOfFile(images);
              res = await updateAllArticleGallery(id, payload);
              if (res.status === 200 || res.status === 201) {
                Swal.close();
                history.push("/dashboard/artikel");
                toast(
                  <Notification
                    type="success"
                    message="Artikel berhasil diupdate!"
                    withIcon
                  />,
                  notificationOptions
                );
              }
            } else {
              Swal.close();
              history.push("/dashboard/artikel");
              toast(
                <Notification
                  type="success"
                  message="Artikel berhasil diupdate!"
                  withIcon
                />,
                notificationOptions
              );
            }
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
      getArticlesData(id);
      getArticleGalleryData(id);
    }
    getClients();
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
                    {id ? "Update Artikel" : "Buat Artikel"}
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
                              {imageList.map((image, index) => (
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
                      <FormText className="mb-2">Judul Artikel</FormText>
                      <Input
                        id="title"
                        className="input-transparent py-4 pl-3"
                        type="text"
                        required
                        name="title"
                        placeholder="Judul Artikel"
                        value={state?.title}
                        onChange={(event) => changeCred(event)}
                      />
                    </FormGroup>
                    <FormGroup className="my-3">
                      <FormText className="mb-2">
                        Bekerja Sama dengan (Opsional)
                      </FormText>
                      <Select
                        options={clientOptions}
                        id="client_id"
                        className="input-transparent"
                        placeholder="Pilih Klien"
                        // defaultValue={clientOptions[getDefaultClient()]}
                        name="client_id"
                        onChange={(event) =>
                          setState({ ...state, client_id: event.value })
                        }
                      />
                    </FormGroup>
                    <FormGroup className="my-3">
                      <FormText className="mb-2">Isi Artikel</FormText>
                      <Input
                        id="description"
                        className="input-transparent py-4 pl-3"
                        type="textarea"
                        required
                        name="description"
                        placeholder="Isi atau deskripsi artikel"
                        value={state?.description}
                        onChange={(event) => changeCred(event)}
                      />
                    </FormGroup>
                    {id ? (
                      <>
                        <p className="headline-2 mt-5">
                          Foto-foto Lama Artikel
                        </p>
                        <FormGroup>
                          <FormText className="mb-5 mt-5 text-center">
                            Foto Lama
                          </FormText>
                          <div className="d-flex justify-content-center align-items-center">
                            {oldImageGallery?.map((image, index) => (
                              <div className="image-item mx-2" key={index}>
                                <img
                                  src={image.image}
                                  alt="image"
                                  width="250"
                                />
                              </div>
                            ))}
                          </div>
                        </FormGroup>
                        <p className="headline-2 mt-5">
                          Tambahkan foto baru yang akan mengganti semua foto
                          lama (Maks. 10 Foto)
                        </p>
                        <FormGroup className="my-3">
                          <FormText className="mb-2 text-center">
                            Maksimal 10 Foto (Maks. 2 MB/foto)
                          </FormText>
                          <ImageUploading
                            multiple
                            value={galleryPreview}
                            onChange={onChangeImageGallery}
                            maxNumber={10}
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
                                <div className="d-flex align-items-end justify-content-around flex-wrap">
                                  {imageList?.map((image, index) => (
                                    <div
                                      key={index}
                                      className="image-item mb-2 mx-2"
                                    >
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
                                          onClick={() =>
                                            onImageGalleryRemove(index)
                                          }
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </ImageUploading>
                        </FormGroup>
                      </>
                    ) : (
                      <>
                        <p className="headline-2 mt-5">
                          Foto-foto Pendukung Artikel (Maks. 10 Foto)
                        </p>
                        <FormGroup className="my-3">
                          <FormText className="mb-2 text-center">
                            Maksimal 10 Foto (Maks. 2 MB/foto)
                          </FormText>
                          <ImageUploading
                            multiple
                            value={galleryPreview}
                            onChange={onChangeImageGallery}
                            maxNumber={10}
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
                                <div className="d-flex align-items-end justify-content-around flex-wrap">
                                  {imageList?.map((image, index) => (
                                    <div
                                      key={index}
                                      className="image-item mb-2 mx-2"
                                    >
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
                                          onClick={() =>
                                            onImageGalleryRemove(index)
                                          }
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </ImageUploading>
                        </FormGroup>
                      </>
                    )}
                    <Button
                      className="rounded-pill float-right mt-3 mb-4"
                      color="primary"
                    >
                      {id ? "Update Artikel" : "Buat Artikel"}
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

export default FormArticle;
