import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { deleteArmada, getAllArmada } from "../../api/ArmadaAPI.js";
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

const Armada = function () {
  const [armada, setArmada] = useState([]);
  const [armadaTableCurrentPage, setArmadaTableCurrentPage] = useState(0);

  const pageSize = 10;
  const armadaTablePagesCount = Math.ceil(armada.length / pageSize);

  const setArmadaTablePage = (e, index) => {
    e.preventDefault();
    setArmadaTableCurrentPage(index);
  };

  const getArmada = async () => {
    const response = await getAllArmada();
    setArmada(response);
  };

  const handleDeleteArmada = async (id) => {
    const res = await deleteArmada(id);
    if (res.status === 200) {
      getArmada();
      toast(
        <Notification
          type="success"
          message="Armada berhasil dihapus!"
          withIcon
        />,
        notificationOptions
      );
    }
  };

  useEffect(() => {
    getArmada();
  }, []);

  const columns = ["", "Foto", "Type", "P", "L", "T", "CBM", "Tonase (Kg)"];

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">Daftar Armada</div>
                  <div className="d-flex">
                    <Link to="armada/tambah-armada">
                      <Button className="rounded-pill mr-3" color="primary">
                        Tambah Armada
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
                      {armada.length === 0 ? (
                        <tr>
                          <td colSpan="8">
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        armada
                          ?.slice(
                            armadaTableCurrentPage * pageSize,
                            (armadaTableCurrentPage + 1) * pageSize
                          )
                          ?.map((item) => (
                            <tr key={uuidv4()}>
                              <td width={10}></td>
                              <td>
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className={`${s.imageCustom}`}
                                />
                              </td>
                              <td>{item.name}</td>
                              <td>{item.width}</td>
                              <td>{item.long}</td>
                              <td>{item.height}</td>
                              <td>{item.cbm}</td>
                              <td>{item.tonase}</td>
                              <td className="float-right">
                                <Link to={`armada/edit-armada/${item.id}`}>
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
                                      "Apakah anda yakin ingin menghapus armada ini?"
                                    )
                                      ? handleDeleteArmada(item.id)
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
                    <PaginationItem disabled={armadaTableCurrentPage <= 0}>
                      <PaginationLink
                        onClick={(e) =>
                          setArmadaTablePage(e, armadaTableCurrentPage - 1)
                        }
                        previous
                        href="#top"
                      />
                    </PaginationItem>
                    {[...Array(armadaTablePagesCount)].map((page, i) => (
                      <PaginationItem
                        active={i === armadaTableCurrentPage}
                        key={i}
                      >
                        <PaginationLink
                          onClick={(e) => setArmadaTablePage(e, i)}
                          href="#top"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem
                      disabled={
                        armadaTableCurrentPage >= armadaTablePagesCount - 1
                      }
                    >
                      <PaginationLink
                        onClick={(e) =>
                          setArmadaTablePage(e, armadaTableCurrentPage + 1)
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

export default Armada;
