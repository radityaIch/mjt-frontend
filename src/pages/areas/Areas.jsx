import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { deleteArea, getAllAreas } from "../../api/AreasAPI.js";
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

const Areas = function () {
  const [areas, setAreas] = useState([]);
  const [areasTableCurrentPage, setAreasTableCurrentPage] = useState(0);

  const pageSize = 10;
  const areasTablePagesCount = Math.ceil(areas.length / pageSize);

  const setAreasTablePage = (e, index) => {
    e.preventDefault();
    setAreasTableCurrentPage(index);
  };

  const getAreas = async () => {
    const response = await getAllAreas();
    setAreas(response);
  };

  const handleDeleteArea = async (id) => {
    const res = await deleteArea(id);
    if (res.status === 200 || res.status === 201) {
      getAreas();
      toast(
        <Notification
          type="success"
          message="Kota berhasil dihapus!"
          withIcon
        />,
        notificationOptions
      );
    }
  };

  useEffect(() => {
    getAreas();
  }, []);

  const columns = ["", "Nama Kota"];

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">Daftar Jangkauan Kota</div>
                  <div className="d-flex">
                    <Link to="jangkauan-kota/tambah-kota">
                      <Button className="rounded-pill mr-3" color="primary">
                        Tambah Kota
                      </Button>
                    </Link>
                    {areas.length > 0 ? (
                      <Link to="jangkauan-kota/edit-kota/semua-kota">
                        <Button className="rounded-pill mr-3" color="dark-gray">
                          Edit Semua Kota
                        </Button>
                      </Link>
                    ) : (
                      ""
                    )}
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
                      {areas.length === 0 ? (
                        <tr>
                          <td colSpan="8">
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        areas
                          ?.slice(
                            areasTableCurrentPage * pageSize,
                            (areasTableCurrentPage + 1) * pageSize
                          )
                          ?.map((item) => (
                            <tr key={uuidv4()}>
                              <td width={10}></td>
                              <td>{item.title}</td>
                              <td className="float-right">
                                <Button
                                  className="rounded-pill my-1"
                                  color="danger"
                                  onClick={() =>
                                    window.confirm(
                                      "Apakah anda yakin ingin menghapus kota ini?"
                                    )
                                      ? handleDeleteArea(item.id)
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
                    <PaginationItem disabled={areasTableCurrentPage <= 0}>
                      <PaginationLink
                        onClick={(e) =>
                          setAreasTablePage(e, areasTableCurrentPage - 1)
                        }
                        previous
                        href="#top"
                      />
                    </PaginationItem>
                    {[...Array(areasTablePagesCount)].map((page, i) => (
                      <PaginationItem
                        active={i === areasTableCurrentPage}
                        key={i}
                      >
                        <PaginationLink
                          onClick={(e) => setAreasTablePage(e, i)}
                          href="#top"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem
                      disabled={
                        areasTableCurrentPage >= areasTablePagesCount - 1
                      }
                    >
                      <PaginationLink
                        onClick={(e) =>
                          setAreasTablePage(e, areasTableCurrentPage + 1)
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
        </Col>
      </Row>
    </div>
  );
};

export default Areas;
