import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { deleteTeam, getAllTeam } from "../../api/TeamAPI.js";
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

const Team = function () {
  const [team, setTeam] = useState([]);
  const [teamTableCurrentPage, setTeamTableCurrentPage] = useState(0);

  const pageSize = 10;
  const teamTablePagesCount = Math.ceil(team.length / pageSize);

  const setTeamTablePage = (e, index) => {
    e.preventDefault();
    setTeamTableCurrentPage(index);
  };

  const getTeam = async () => {
    const response = await getAllTeam();
    setTeam(response);
  };

  const handleDeleteTeam = async (id) => {
    const res = await deleteTeam(id);
    if (res.status === 200) {
      getTeam();
      toast(
        <Notification
          type="success"
          message="Tim berhasil dihapus!"
          withIcon
        />,
        notificationOptions
      );
    }
  };

  useEffect(() => {
    getTeam();
  }, []);

  const columns = ["", "Foto", "Nama", "Posisi/Jabatan"];

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">Daftar Tim</div>
                  <div className="d-flex">
                    <Link to="tim/tambah-tim">
                      <Button className="rounded-pill mr-3" color="primary">
                        Tambah Tim
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
                      {team.length === 0 ? (
                        <tr>
                          <td colSpan="8">
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        team
                          ?.slice(
                            teamTableCurrentPage * pageSize,
                            (teamTableCurrentPage + 1) * pageSize
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
                              <td>{item.position}</td>
                              <td className="float-right">
                                <Link to={`tim/edit-tim/${item.id}`}>
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
                                      "Apakah anda yakin ingin menghapus tim ini?"
                                    )
                                      ? handleDeleteTeam(item.id)
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
                    <PaginationItem disabled={teamTableCurrentPage <= 0}>
                      <PaginationLink
                        onClick={(e) =>
                          setTeamTablePage(e, teamTableCurrentPage - 1)
                        }
                        previous
                        href="#top"
                      />
                    </PaginationItem>
                    {[...Array(teamTablePagesCount)].map((page, i) => (
                      <PaginationItem
                        active={i === teamTableCurrentPage}
                        key={i}
                      >
                        <PaginationLink
                          onClick={(e) => setTeamTablePage(e, i)}
                          href="#top"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem
                      disabled={teamTableCurrentPage >= teamTablePagesCount - 1}
                    >
                      <PaginationLink
                        onClick={(e) =>
                          setTeamTablePage(e, teamTableCurrentPage + 1)
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

export default Team;
