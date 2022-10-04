import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { deleteClient, getAllClients } from "../../api/ClientsAPI.js";
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

const Clients = function () {
  const [clients, setClients] = useState([]);
  const [clientsTableCurrentPage, setClientsTableCurrentPage] = useState(0);

  const pageSize = 10;
  const clientsTablePagesCount = Math.ceil(clients.length / pageSize);

  const setClientsTablePage = (e, index) => {
    e.preventDefault();
    setClientsTableCurrentPage(index);
  };

  const getClients = async () => {
    const response = await getAllClients();
    setClients(response);
  };

  const handleDeleteClient = async (id) => {
    const res = await deleteClient(id);
    if (res.status === 200) {
      getClients();
      toast(
        <Notification
          type="success"
          message="Klien berhasil dihapus!"
          withIcon
        />,
        notificationOptions
      );
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  const columns = ["", "Foto", "title"];

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">Daftar Klien</div>
                  <div className="d-flex">
                    <Link to="klien/tambah-klien">
                      <Button className="rounded-pill mr-3" color="primary">
                        Tambah Klien
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
                      {clients.length === 0 ? (
                        <tr>
                          <td colSpan="8">
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        clients
                          ?.slice(
                            clientsTableCurrentPage * pageSize,
                            (clientsTableCurrentPage + 1) * pageSize
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
                              <td className="float-right">
                                <Link to={`klien/edit-klien/${item.id}`}>
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
                                      "Apakah anda yakin ingin menghapus klien ini?"
                                    )
                                      ? handleDeleteClient(item.id)
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
                    <PaginationItem disabled={clientsTableCurrentPage <= 0}>
                      <PaginationLink
                        onClick={(e) =>
                          setClientsTablePage(e, clientsTableCurrentPage - 1)
                        }
                        previous
                        href="#top"
                      />
                    </PaginationItem>
                    {[...Array(clientsTablePagesCount)].map((page, i) => (
                      <PaginationItem
                        active={i === clientsTableCurrentPage}
                        key={i}
                      >
                        <PaginationLink
                          onClick={(e) => setClientsTablePage(e, i)}
                          href="#top"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem
                      disabled={
                        clientsTableCurrentPage >= clientsTablePagesCount - 1
                      }
                    >
                      <PaginationLink
                        onClick={(e) =>
                          setClientsTablePage(e, clientsTableCurrentPage + 1)
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

export default Clients;
