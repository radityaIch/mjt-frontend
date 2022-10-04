import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  deleteService,
  getAllServiceGallery,
  getAllServices,
} from "../../api/ServicesAPI.js";
import { toast } from "react-toastify";
import { notificationOptions } from "../../components/utils/utils.js";
import Notification from "../../components/Notification/Notification.js";
import {
  Col,
  Row,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";

import s from "../components/Tables.module.scss";

const Services = function () {
  const [services, setServices] = useState([]);
  const [serviceGallery, setServiceGallery] = useState([]);
  const [servicesTableCurrentPage, setServicesTableCurrentPage] = useState(0);

  const pageSize = 10;
  const servicesTablePagesCount = Math.ceil(services.length / pageSize);

  const setServicesTablePage = (e, index) => {
    e.preventDefault();
    setServicesTableCurrentPage(index);
  };

  const getServices = async () => {
    const response = await getAllServices();
    setServices(response);
  };

  const getServiceGallery = async () => {
    const response = await getAllServiceGallery();
    setServiceGallery(response);
  };

  const handleDeleteService = async (id) => {
    const res = await deleteService(id);
    if (res.status === 200) {
      getServices();
      toast(
        <Notification
          type="success"
          message="Layanan berhasil dihapus!"
          withIcon
        />,
        notificationOptions
      );
    }
  };

  useEffect(() => {
    getServices();
    getServiceGallery();
  }, []);

  const columns = ["", "Foto", "Title", "Subtitle", "Deskripsi"];

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">Daftar Layanan</div>
                  <div className="d-flex">
                    <Link to="layanan/tambah-layanan">
                      <Button className="rounded-pill mr-3" color="primary">
                        Tambah Layanan
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="widget-table-overflow">
                  <Table className="table-striped table-borderless" responsive>
                    <thead>
                      <tr>
                        {columns?.map((col, index) => (
                          <th key={index}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {services.length === 0 ? (
                        <tr>
                          <td colSpan="8">
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        services
                          ?.slice(
                            servicesTableCurrentPage * pageSize,
                            (servicesTableCurrentPage + 1) * pageSize
                          )
                          ?.map((item) => (
                            <tr key={uuidv4()}>
                              <td width={10}></td>
                              <td>
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className={`${s.imageCustom}`}
                                />
                              </td>
                              <td>{item.title}</td>
                              <td>{item.subtitle}</td>
                              <td
                                className="text-truncate"
                                style={{ maxWidth: "400px" }}
                              >
                                {item.description}
                              </td>
                              <td className="float-right">
                                <Link to={`layanan/edit-layanan/${item.id}`}>
                                  <Button
                                    className="rounded-pill my-1 mr-2"
                                    color="dark-gray"
                                  >
                                    Edit
                                  </Button>
                                </Link>
                                <Button
                                  className="rounded-pill my-1"
                                  color="danger"
                                  onClick={() =>
                                    window.confirm(
                                      "Apakah anda yakin ingin menghapus layanan ini?"
                                    )
                                      ? handleDeleteService(item.id)
                                      : ""
                                  }
                                >
                                  Hapus
                                </Button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </Table>
                  <Pagination className="pagination-with-border">
                    <PaginationItem disabled={servicesTableCurrentPage <= 0}>
                      <PaginationLink
                        onClick={(e) =>
                          setServicesTablePage(e, servicesTableCurrentPage - 1)
                        }
                        previous
                        href="#top"
                      />
                    </PaginationItem>
                    {[...Array(servicesTablePagesCount)].map((page, i) => (
                      <PaginationItem
                        active={i === servicesTableCurrentPage}
                        key={i}
                      >
                        <PaginationLink
                          onClick={(e) => setServicesTablePage(e, i)}
                          href="#top"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem
                      disabled={
                        servicesTableCurrentPage >= servicesTablePagesCount - 1
                      }
                    >
                      <PaginationLink
                        onClick={(e) =>
                          setServicesTablePage(e, servicesTableCurrentPage + 1)
                        }
                        next
                        href="#top"
                      />
                    </PaginationItem>
                  </Pagination>
                </div>
              </Widget>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col xl={12}>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">Foto-foto di Halaman Layanan</div>
                  {/* <div className="d-flex">
                    <Link to={`layanan/tambah-foto`}>
                      <Button className="rounded-pill mr-3" color="primary">
                        Tambah Foto
                      </Button>
                    </Link>
                  </div> */}
                </div>
                <div className="widget-table-overflow">
                  <Table className="table-striped table-borderless" responsive>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Foto</th>
                        <th>Foto Untuk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceGallery.length === 0 ? (
                        <tr>
                          <td colSpan="8">
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        serviceGallery?.map((item) => (
                          <tr key={uuidv4()}>
                            <td width={10}></td>
                            <td>
                              <img
                                src={item.image}
                                alt={item.category}
                                style={{ width: "150px" }}
                              />
                            </td>
                            <td>
                              {item.category === "shipping"
                                ? "Shipping"
                                : "Warehouse & Fulfillment"}
                            </td>
                            <td className="float-right">
                              <Link to={`layanan/edit-foto/${item.id}`}>
                                <Button
                                  className="rounded-pill my-1 mr-2"
                                  color="dark-gray"
                                >
                                  Ubah
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Widget>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Services;
