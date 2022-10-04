import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import {
  notificationOptions,
  setFormData,
} from "../../components/utils/utils.js";
import { toast } from "react-toastify";
import Notification from "../../components/Notification/Notification.js";
import Swal from "sweetalert2";
import ImageUploading from "react-images-uploading";
import { Col, Row, Button, FormGroup, FormText } from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import Select from "react-select";

import s from "../components/Tables.module.scss";
import {
  addServiceGallery,
  getServiceGalleryById,
  updateServiceGallery,
} from "../../api/ServicesAPI.js";

const FormServiceGallery = function () {
  let history = useHistory();
  let { id } = useParams();
  id = parseInt(id);

  const [state, setState] = useStateWithCallbackLazy({
    image: undefined,
    category: "",
  });
  const [defaultSelected, setDefaultSelected] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const [oldImage, setOldImage] = useState();

  const options = [
    { value: "shipping", label: "Shipping" },
    { value: "warehouse_fulfillment", label: "Warehouse & Fulfillment" },
  ];

  const getDefaultSelectedOptions = (data) => {
    let res = {};
    options?.map((option, index) => {
      if (option.value === data) res = options[index];
    });
    setDefaultSelected(res);
    return res;
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

  const getServiceGallery = async (id) => {
    const res = await getServiceGalleryById(id);
    setState(res);
    getDefaultSelectedOptions(res.type);
    setOldImage(res.image);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const payload = setFormData(state);

    Swal.fire({
      title: "Menyimpan foto layanan",
      html: "Mohon tunggu, sedang menyimpan foto layanan",
      padding: "30px",
      didOpen: async () => {
        Swal.showLoading();
        let res = "";
        if (!id) {
          res = await addServiceGallery(payload);
          if (res.status === 200 || res.status === 201) {
            Swal.close();
            history.push("/dashboard/layanan");
            toast(
              <Notification
                type="success"
                message="Foto baru berhasil ditambahkan!"
                withIcon
              />,
              notificationOptions
            );
          } else {
            console.log(res);
          }
        } else {
          res = await updateServiceGallery(id, payload);
          if (res.status === 200 || res.status === 201) {
            Swal.close();
            history.push("/dashboard/layanan");
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
      getServiceGallery(id);
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
                    {id
                      ? "Update Foto (Maks 3 Foto / Kategori)"
                      : "Tambah Foto (Maks 3 Foto / Kategori)"}
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
                    )}
                    <FormGroup className="my-3">
                      <FormText className="mb-2">Foto Untuk</FormText>
                      <Select
                        options={options}
                        id="category"
                        className="input-transparent"
                        placeholder="Foto untuk ..."
                        defaultValue={defaultSelected}
                        name="category"
                        onChange={(event) => {
                          if (event.value === "shipping")
                            setState({
                              ...state,
                              category: event.value,
                            });
                          if (event.value === "warehouse_fulfillment")
                            setState({
                              ...state,
                              category: event.value,
                            });
                        }}
                      />
                    </FormGroup>
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

export default FormServiceGallery;
