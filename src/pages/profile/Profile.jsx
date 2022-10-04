import React, { useEffect, useState } from "react";
import { Col, Row, Button, FormGroup, FormText, Input } from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import user from "../../assets/user.svg";
import ImageUploading from "react-images-uploading";

import s from "./Profile.module.scss";
import { getLoggedUser, updateProfile } from "../../api/UserAPI.js";
import {
  notificationOptions,
  setFormData,
} from "../../components/utils/utils.js";
import Notification from "../../components/Notification/Notification.js";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useStateWithCallbackLazy } from "use-state-with-callback";

const Profile = () => {
  const [state, setState] = useStateWithCallbackLazy({
    name: "",
    email: "",
    position: "",
    image: undefined,
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [oldImage, setOldImage] = useState();

  const doUpdate = (e) => {
    e.preventDefault();
    const payload = setFormData(state);

    Swal.fire({
      title: "Menyimpan Informasi Profil",
      html: "Mohon tunggu, sedang menyimpan informasi Profil",
      padding: "30px",
      didOpen: async () => {
        Swal.showLoading();
        const res = await updateProfile(payload);
        if (res.status === 200 || res.status === 201) {
          Swal.close();
          toast(
            <Notification
              type="success"
              message="Profil berhasil diupdate!"
              withIcon
            />,
            notificationOptions
          );
          toast(
            <Notification
              type="info"
              message="Refresh halaman untuk melihat perubahan"
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

  const changeCreds = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const getUserData = async () => {
    const res = await getLoggedUser();
    setState(res.data.data, () => {
      const copyState = res.data.data;
      delete copyState.image;
      setState({ ...copyState });
    });
    setOldImage(res.data.data.image);
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div>
      <Row>
        <Col className="mt-4 mt-lg-0 pl-grid-col mx-auto" xs={12} lg={4}>
          <Widget className="widget-p-lg">
            <div className="d-flex">
              <img
                className={s.image}
                src={oldImage === null ? user : oldImage}
                alt="..."
              />
              <div className={s.userInfo}>
                <p className="headline-3">{state.name}</p>
                <p className="body-3 muted">
                  {state.position === null && "Admin"}
                </p>
              </div>
            </div>
            <p className="mt-5 headline-3">Form Ubah Profil</p>
            <div className="mt-3">
              <form
                onSubmit={(event) => doUpdate(event)}
                encType="multipart/form-data"
              >
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
                          style={isDragging ? { color: "red" } : undefined}
                          onClick={onImageUpload}
                          {...dragProps}
                        >
                          Klik atau taruh foto di sini
                        </Button>
                        &nbsp;
                        {imageList?.map((image, index) => (
                          <div key={index} className="image-item">
                            <img src={image["data_url"]} alt="a" width="150" />
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
                <FormGroup className="my-3">
                  <FormText>Nama</FormText>
                  <Input
                    id="name"
                    className="input-transparent pl-3"
                    value={state.name}
                    onChange={(event) => changeCreds(event)}
                    type="name"
                    required
                    name="name"
                    placeholder="Nama Lengkap"
                  />
                </FormGroup>
                <FormGroup className="my-3">
                  <FormText>Email</FormText>
                  <Input
                    id="email"
                    className="input-transparent pl-3"
                    value={state.email}
                    onChange={(event) => changeCreds(event)}
                    type="email"
                    required
                    name="email"
                    placeholder="Email"
                  />
                </FormGroup>
                <div className="bg-widget d-flex justify-content-center">
                  <Button
                    className="rounded-pill my-3"
                    type="submit"
                    color="secondary-red"
                  >
                    Update Profil
                  </Button>
                </div>
              </form>
            </div>
          </Widget>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
