import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { deleteUser, getAllUsers, verifyUser } from "../../api/UserAPI.js";
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
  Badge,
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";

import s from "../components/Tables.module.scss";
import userImg from "../../assets/user.svg";

const Users = function () {
  const [users, setUsers] = useState([]);
  const [usersTableCurrentPage, setUsersTableCurrentPage] = useState(0);
  const userId = parseInt(localStorage.getItem("userId"));

  const pageSize = 10;
  const usersTablePagesCount = Math.ceil(users.length / pageSize);

  const setUsersTablePage = (e, index) => {
    e.preventDefault();
    setUsersTableCurrentPage(index);
  };

  const getUsers = async () => {
    const response = await getAllUsers();
    setUsers(response);
  };

  const handleDeleteUser = async (id) => {
    const res = await deleteUser(id);
    if (res.status === 200 || res.status === 201) {
      getUsers();
      toast(
        <Notification
          type="success"
          message="Pengguna berhasil dihapus!"
          withIcon
        />,
        notificationOptions
      );
    }
  };

  const handleUserVerification = async (id) => {
    const res = await verifyUser(id);
    if (res.status === 200 || res.status === 201) {
      getUsers();
      toast(
        <Notification
          type="success"
          message="Pengguna berhasil diverifikasi!"
          withIcon
        />,
        notificationOptions
      );
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    "",
    "Foto",
    "nama",
    "email",
    "verifikasi admin",
    "verifikasi email",
  ];

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">Daftar Pengguna</div>
                  <div className="d-flex"></div>
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
                      {users?.length === 1 ? (
                        <tr>
                          <td colSpan="8">
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        users
                          ?.slice(
                            usersTableCurrentPage * pageSize,
                            (usersTableCurrentPage + 1) * pageSize
                          )
                          ?.map((item) => {
                            if (item.id !== userId) {
                              return (
                                <tr key={uuidv4()}>
                                  <td width={10}></td>
                                  <td>
                                    <img
                                      src={
                                        item.image === null
                                          ? userImg
                                          : item.image
                                      }
                                      alt={item.name}
                                      className={`${s.imageCustom}`}
                                    />
                                  </td>
                                  <td>{item.name}</td>
                                  <td>{item.email}</td>
                                  <td>
                                    {item.verified === null ? (
                                      <Badge color="warning">
                                        Belum Terverifikasi
                                      </Badge>
                                    ) : (
                                      <Badge color="success">
                                        Terverifikasi
                                      </Badge>
                                    )}
                                  </td>
                                  <td>
                                    {item.email_verified_at === null ? (
                                      <Badge color="warning">
                                        Belum Terverifikasi
                                      </Badge>
                                    ) : (
                                      <Badge color="success">
                                        Terverifikasi
                                      </Badge>
                                    )}
                                  </td>
                                  <td className="float-right">
                                    {item.verified === null ? (
                                      <Button
                                        className="rounded-pill my-1 mr-2"
                                        color="success"
                                        onClick={() =>
                                          window.confirm(
                                            "Apakah anda yakin ingin verifikasi pengguna ini?"
                                          )
                                            ? handleUserVerification(item.id)
                                            : ""
                                        }
                                      >
                                        Verifikasi
                                      </Button>
                                    ) : (
                                      ""
                                    )}
                                    <Link
                                      to={`akun-pengguna/edit-pengguna/${item.id}`}
                                    >
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
                                          "Apakah anda yakin ingin menghapus pengguna ini?"
                                        )
                                          ? handleDeleteUser(item.id)
                                          : ""
                                      }
                                    >
                                      Hapus
                                    </Button>
                                  </td>
                                </tr>
                              );
                            } else return false;
                          })
                      )}
                    </tbody>
                  </Table>
                  <Pagination className="pagination-with-border">
                    <PaginationItem disabled={usersTableCurrentPage <= 0}>
                      <PaginationLink
                        onClick={(e) =>
                          setUsersTablePage(e, usersTableCurrentPage - 1)
                        }
                        previous
                        href="#top"
                      />
                    </PaginationItem>
                    {[...Array(usersTablePagesCount)].map((page, i) => (
                      <PaginationItem
                        active={i === usersTableCurrentPage}
                        key={i}
                      >
                        <PaginationLink
                          onClick={(e) => setUsersTablePage(e, i)}
                          href="#top"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem
                      disabled={
                        usersTableCurrentPage >= usersTablePagesCount - 1
                      }
                    >
                      <PaginationLink
                        onClick={(e) =>
                          setUsersTablePage(e, usersTableCurrentPage + 1)
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

export default Users;
