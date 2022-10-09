import React, { useState, useEffect, useCallback } from "react";
// import { useHistory, useParams } from "react-router";
// import { useStateWithCallbackLazy } from "use-state-with-callback";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  // notificationOptions,
  setFormData,
} from "../../components/utils/utils.js";
// import { toast } from "react-toastify";
// import Notification from "../../components/Notification/Notification.js";
// import Swal from "sweetalert2";
import {
  Col,
  Row,
  Button,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import s from "../components/Tables.module.scss";

const TravelForm = (props) => {
  const goodsDummy = [
    {
      good_unit: "Armaflex",
      qty: 12,
      keterangan: "buah",
    },
    {
      good_unit: "Koido",
      qty: 1,
      keterangan: "Box",
    },
    {
      good_unit: "Pipa Roll",
      qty: 30,
      keterangan: "Buah",
    },
  ];

  const [goods, setGoods] = useState(
    !props.isEdit
      ? [
          {
            good_unit: "",
            qty: 0,
            keterangan: "",
          },
        ]
      : goodsDummy
  );

  const permitDummy = {
    no_do: "MJT512080422",
    pengirim: "Andi",
    alamat_muat: "Tanah Tinggi, Tangerang",
    alamat_kirim: "Jumputrejo, Sidoarjo",
    no_telp: "08123456789",
    armada: {
      nopol: "B 2067 UKB",
      driver: "Budi",
      unit: "Blind Van",
      pengiriman: "KONSUL",
      harga_beli: 100000,
      harga_jual: 100000,
    },
    barang: goods,
  };

  const [permit, setPermit] = useState(
    !props.isEdit
      ? {
          no_do: "",
          pengirim: "",
          alamat_muat: "",
          alamat_kirim: "",
          no_telp: "",
          armada: {
            nopol: "",
            driver: "",
            unit: "",
            pengiriman: "",
            harga_beli: 0,
            harga_jual: 0,
          },
          barang: goods,
        }
      : permitDummy
  );

  const changeInput = (event) => {
    setPermit({ ...permit, [event.target.name]: event.target.value });
  };

  const changeArmadaInput = (event) => {
    setPermit({
      ...permit,
      armada: { ...permit.armada, [event.target.name]: event.target.value },
    });
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    const payload = setFormData(permit);
    console.log(permit);
  };

  const deleteByIndex = useCallback(
    (i) => {
      const newData = goods.filter((g, index) => index !== i);
      setGoods(newData);
    },
    [goods]
  );

  const addGoodies = () => {
    const newData = {
      good_unit: "",
      qty: 0,
      keterangan: "",
    };

    setGoods((oldData) => [...oldData, newData]);
    setPermit({ ...permit, barang: goods });
  };

  useEffect(() => {
    setPermit({ ...permit, barang: goods });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goods]);

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <h2 className="headline-2">
                    {props.isEdit ? "Detail Surat Jalan" : "Tambah Surat Jalan"}
                  </h2>

                  {props.isEdit ? (
                    <div className="d-flex">
                      <Link to="#">
                        <Button className="rounded-pill mr-3" color="primary">
                          Export ke PDF
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <form
                  onSubmit={(e) => onSubmitHandler(e)}
                  encType="multipart/form-data"
                  method="POST"
                >
                  <div className="px-4">
                    <FormGroup className="my-3">
                      <FormText className="mb-2">No. Do</FormText>
                      <Input
                        id="no-do"
                        name="no_do"
                        className="input-transparent py-4 pl-3"
                        type="text"
                        required
                        value={permit?.no_do}
                        onChange={(e) => changeInput(e)}
                      />
                    </FormGroup>

                    <FormGroup className="my-3">
                      <FormText className="mb-2">Pengirim</FormText>
                      <Input
                        id="pengirim"
                        name="pengirim"
                        className="input-transparent py-4 pl-3"
                        type="text"
                        required
                        value={permit?.pengirim}
                        onChange={(e) => changeInput(e)}
                      />
                    </FormGroup>

                    <FormGroup className="my-3">
                      <Row>
                        <Col md="6">
                          <FormGroup className="my-3">
                            <FormText className="mb-2">Alamat Muat</FormText>
                            <Input
                              id="alamat-muat"
                              name="alamat_muat"
                              className="input-transparent py-4 pl-3"
                              type="text"
                              required
                              value={permit?.alamat_muat}
                              onChange={(e) => changeInput(e)}
                            />
                          </FormGroup>
                        </Col>

                        <Col md="6">
                          <FormGroup className="my-3">
                            <FormText className="mb-2">Alamat Kirim</FormText>
                            <Input
                              id="alamat-kirim"
                              name="alamat_kirim"
                              className="input-transparent py-4 pl-3"
                              type="text"
                              required
                              value={permit?.alamat_kirim}
                              onChange={(e) => changeInput(e)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </FormGroup>

                    <FormGroup className="my-3">
                      <FormText className="mb-2">No. Telp</FormText>
                      <Input
                        id="no-telp"
                        name="no_telp"
                        className="input-transparent py-4 pl-3"
                        type="text"
                        required
                        value={permit?.no_telp}
                        onChange={(e) => changeInput(e)}
                      />
                    </FormGroup>

                    {/* Armada Form */}
                    <h6 className="mt-5 mb-3">Keterangan Armada</h6>
                    <FormGroup className="my-3">
                      <Row>
                        <Col md="6">
                          <FormGroup className="my-3">
                            <FormText className="mb-2">
                              Nopol / No. Plat
                            </FormText>
                            <Input
                              id="nopol"
                              name="nopol"
                              className="input-transparent py-4 pl-3"
                              type="text"
                              required
                              value={permit?.armada?.nopol}
                              onChange={(e) => changeArmadaInput(e)}
                            />
                          </FormGroup>
                        </Col>

                        <Col md="6">
                          <FormGroup className="my-3">
                            <FormText className="mb-2">Driver</FormText>
                            <Input
                              id="driver"
                              name="driver"
                              className="input-transparent py-4 pl-3"
                              type="text"
                              required
                              value={permit?.armada?.driver}
                              onChange={(e) => changeArmadaInput(e)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </FormGroup>

                    <FormGroup className="my-3">
                      <Row>
                        <Col md="6">
                          <FormGroup className="my-3">
                            <FormText className="mb-2">Unit</FormText>
                            <Input
                              id="unit"
                              name="unit"
                              className="input-transparent py-4 pl-3"
                              type="text"
                              required
                              value={permit?.armada?.unit}
                              onChange={(e) => changeArmadaInput(e)}
                            />
                          </FormGroup>
                        </Col>

                        <Col md="6">
                          <FormGroup className="my-3">
                            <FormText className="mb-2">Pengiriman</FormText>
                            <Input
                              id="no-do"
                              name="pengiriman"
                              className="input-transparent py-4 pl-3"
                              type="text"
                              required
                              value={permit?.armada?.pengiriman}
                              onChange={(e) => changeArmadaInput(e)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </FormGroup>

                    <FormGroup className="my-3">
                      <Row>
                        <Col md="6">
                          <FormGroup className="my-3">
                            <FormText className="mb-2">Harga Jual</FormText>
                            <InputGroup>
                              <InputGroupText>Rp.</InputGroupText>
                              <Input
                                id="harga-jual"
                                name="harga_jual"
                                className="input-transparent py-4 pl-3"
                                type="number"
                                required
                                value={permit?.armada?.harga_jual}
                                onChange={(e) => changeArmadaInput(e)}
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>

                        <Col md="6">
                          <FormGroup className="my-3">
                            <FormText className="mb-2">
                              Harga Beli / Uang Jalan
                            </FormText>
                            <InputGroup>
                              <InputGroupText>Rp.</InputGroupText>
                              <Input
                                id="harga-beli"
                                name="harga_beli"
                                className="input-transparent py-4 pl-3"
                                type="number"
                                required
                                value={permit?.armada?.harga_beli}
                                onChange={(e) => changeArmadaInput(e)}
                              />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                    </FormGroup>

                    {/* Goods Form */}
                    <h6 className="mt-5 mb-3">Keterangan Barang</h6>
                    {goods.map((good, index) => (
                      <FormGroup className="my-3" key={index}>
                        <Row>
                          <Col md="4">
                            <FormGroup className="my-3">
                              <FormText className="mb-2">Unit</FormText>
                              <Input
                                id="good-unit"
                                name="good_unit"
                                className="input-transparent py-4 pl-3"
                                type="text"
                                required
                                onChange={(e) => {
                                  const newData = goods.filter((good, i) => {
                                    if (index === i) {
                                      return (good.good_unit = e.target.value);
                                    }
                                    return good;
                                  });

                                  setGoods(newData);
                                }}
                                value={good?.good_unit}
                              />
                            </FormGroup>
                          </Col>

                          <Col md="2">
                            <FormGroup className="my-3">
                              <FormText className="mb-2">Qty</FormText>
                              <Input
                                id="qty"
                                name="qty"
                                className="input-transparent py-4 pl-3"
                                type="number"
                                required
                                onChange={(e) => {
                                  const newData = goods.filter((good, i) => {
                                    if (index === i) {
                                      return (good.qty = e.target.value);
                                    }
                                    return good;
                                  });

                                  setGoods(newData);
                                }}
                                value={good?.qty}
                              />
                            </FormGroup>
                          </Col>

                          <Col md="5">
                            <FormGroup className="my-3">
                              <FormText className="mb-2">Keterangan</FormText>
                              <Input
                                id="keterangan"
                                name="keterangan"
                                className="input-transparent py-4 pl-3"
                                type="text"
                                required
                                onChange={(e) => {
                                  const newData = goods.filter((good, i) => {
                                    if (index === i) {
                                      return (good.keterangan = e.target.value);
                                    }
                                    return good;
                                  });

                                  setGoods(newData);
                                }}
                                value={good?.keterangan}
                              />
                            </FormGroup>
                          </Col>

                          <Col
                            className="mt-4 d-flex align-items-center"
                            md="1"
                          >
                            <Button
                              type="button"
                              onClick={() => deleteByIndex(index)}
                              className="w-100 px-0"
                              size="lg"
                              color="danger"
                              disabled={goods.length === 1}
                            >
                              X
                            </Button>
                          </Col>
                        </Row>
                      </FormGroup>
                    ))}

                    <Button
                      onClick={() => addGoodies()}
                      type="button"
                      className="d-flex my-5"
                      color="primary"
                      size="lg"
                    >
                      Tambah Barang
                    </Button>

                    <div className="d-flex justify-content-end">
                      {props.isEdit ? (
                        <Button
                          type="button"
                          className="mr-auto"
                          color="danger"
                        >
                          Batalkan Pengiriman
                        </Button>
                      ) : (
                        ""
                      )}

                      <Button type="reset" color="danger" className="mr-2">
                        Batal
                      </Button>
                      <Button type="submit" color="success">
                        {props.isEdit ? "Simpan Perubahan" : "Simpan"}
                      </Button>
                    </div>
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

export default TravelForm;
