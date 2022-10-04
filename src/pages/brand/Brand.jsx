import React, { useEffect, useState } from "react";
import { useStateWithCallbackLazy } from "use-state-with-callback";
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
import { getBrand, updateBrand } from "../../api/BrandAPI.js";

const Brand = function () {
    const [state, setState] = useStateWithCallbackLazy({
        logo_dark: undefined,
        logo_light: undefined,
        brand_name: "",
    });

    const [logoLightPreview, setLogoLightPreview] = useState([]);
    const [logoDarkPreview, setlogoDarkPreview] = useState([]);
    const [oldImage, setOldImage] = useState({
        logo_dark: undefined,
        logo_light: undefined,
    });

    const changeCred = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    };

    const onChangeLogoDark = (imageList, _addUpdateIndex) => {
        if (imageList[0].file.size <= 2097152) {
            setlogoDarkPreview(imageList);
            setState({ ...state, logo_dark: imageList[0]?.file });
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

    const onChangeLogoLight = (imageList, _addUpdateIndex) => {
        if (imageList[0].file.size <= 2097152) {
            setLogoLightPreview(imageList);
            setState({ ...state, logo_light: imageList[0]?.file });
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

    const onImageRemove = (isDark) => {
        if (isDark) {
            setlogoDarkPreview([]);
        } else {
            setLogoLightPreview([]);
        }
    };

    const getBrandData = async () => {
        const res = await getBrand()
        setState(res, () => {
            const copyState = res;
            delete copyState.logo_dark;
            delete copyState.logo_light;
            setState({ ...copyState });
        });
        setOldImage({ logo_dark: res.logo_dark, logo_light: res.logo_light });
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const payload = setFormData(state);

        Swal.fire({
            title: "Menyimpan Informasi Brand",
            html: "Mohon tunggu, sedang menyimpan informasi brand",
            padding: "30px",
            didOpen: async () => {
                Swal.showLoading();
                let res = "";
                res = await updateBrand(payload);
                if (res.status === 200 || res.status === 201) {
                    Swal.close();
                    toast(
                        <Notification
                            type="success"
                            message="Brand berhasil diupdate!"
                            withIcon
                        />,
                        notificationOptions
                    );
                } else {
                    console.log(res.status);
                }
            },
            allowOutsideClick: false,
        });
    };

    useEffect(() => {
        getBrandData();
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
                                        Brand Settings
                                    </div>
                                </div>
                                <form
                                    onSubmit={(e) => onSubmitHandler(e)}
                                    encType="multipart/form-data"
                                    method="POST"
                                >
                                    <div className="px-4">
                                        <FormGroup className="my-3">
                                            <FormText className="mb-2">Nama Brand</FormText>
                                            <Input
                                                id="brand_name"
                                                className="input-transparent py-4 pl-3"
                                                type="text"
                                                required
                                                name="brand_name"
                                                placeholder="Nama Brand"
                                                value={state.brand_name}
                                                onChange={(event) => changeCred(event)}
                                            />
                                        </FormGroup>

                                        <div className="d-lg-flex justify-content-between align-items-center">
                                            <FormGroup>
                                                <FormText className="mb-2 text-center">
                                                    Logo Brand Light Lama
                                                </FormText>
                                                <div className="image-item text-center text-lg-left">
                                                    <img src={oldImage.logo_light} alt="logo_light" width="150" />
                                                </div>
                                            </FormGroup>
                                            <FormGroup className="my-3 ml-xl-5">
                                                <FormText className="mb-2 text-center">
                                                    Logo Brand Light Baru (Maks. 2 MB)
                                                </FormText>
                                                <ImageUploading
                                                    multiple={false}
                                                    value={logoLightPreview}
                                                    onChange={onChangeLogoLight}
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
                                                                                onClick={() => onImageRemove(false)}
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
                                            <FormGroup>
                                                <FormText className="mb-2 text-center">
                                                    Logo Brand Dark Lama
                                                </FormText>
                                                <div className="image-item text-center text-lg-left">
                                                    <img src={oldImage.logo_dark} alt="" width="150" />
                                                </div>
                                            </FormGroup>
                                            <FormGroup className="my-3 ml-lg-5">
                                                <FormText className="mb-2 text-center">
                                                    Logo Brand Dark Baru (Maks. 2 MB)
                                                </FormText>
                                                <ImageUploading
                                                    multiple={false}
                                                    value={logoDarkPreview}
                                                    onChange={onChangeLogoDark}
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
                                                                                onClick={() => onImageRemove(true)}
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

                                        <Button
                                            className="rounded-pill float-right mt-3 mb-4"
                                            color="primary"
                                        >
                                            Simpan
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

export default Brand;
