import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  deleteMission,
  getAllAboutUs,
  getAllMissions,
} from "../../api/AboutUsAPI.js";
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

const AboutUs = function () {
  const [aboutus, setAboutUs] = useState([]);
  const [aboutusId, setAboutUsId] = useState("");
  const [missions, setMissions] = useState([]);
  const [aboutusTableCurrentPage, setAboutUsTableCurrentPage] = useState(0);
  const [missionsTableCurrentPage, setMissionsTableCurrentPage] = useState(0);

  const pageSize = 10;
  const aboutusTablePagesCount = Math.ceil(aboutus.length / pageSize);
  const missionsTablePagesCount = Math.ceil(missions.length / pageSize);

  const setAboutUsTablePage = (e, index) => {
    e.preventDefault();
    setAboutUsTableCurrentPage(index);
  };

  const setMissionsTablePage = (e, index) => {
    e.preventDefault();
    setMissionsTableCurrentPage(index);
  };

  const getAboutUs = async () => {
    const response = await getAllAboutUs();
    setAboutUs(response);
    setAboutUsId(response[0]?.id);
  };

  const getMissions = async () => {
    const response = await getAllMissions();
    setMissions(response);
  };

  const handleDeleteMission = async (id) => {
    const res = await deleteMission(id);
    if (res.status === 200 || res.status === 201) {
      getMissions();
      toast(
        <Notification
          type="success"
          message="Tentang Kami berhasil dihapus!"
          withIcon
        />,
        notificationOptions
      );
    }
  };

  useEffect(() => {
    getAboutUs();
    getMissions();
  }, []);

  const columns = ["", "Tagline", "Deskripsi", "NIB"];
  const missionColumns = ["", "Misi"];

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">Tentang Kami</div>
                  <div className="d-flex">
                    {aboutus?.length <= 0 ? (
                      <Link to={`tentang-kami/tambah-tentang-kami`}>
                        <Button className="rounded-pill mr-3" color="primary">
                          Tambah Data
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
                        {columns.map((col, index) => (
                          <th key={index}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {aboutus.length === 0 ? (
                        <tr>
                          <td colSpan="8">
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        aboutus
                          ?.slice(
                            aboutusTableCurrentPage * pageSize,
                            (aboutusTableCurrentPage + 1) * pageSize
                          )
                          ?.map((item) => (
                            <tr key={uuidv4()}>
                              <td width={10}></td>
                              <td
                                className="text-truncate"
                                style={{ maxWidth: "350px" }}
                              >
                                {item.tagline}
                              </td>
                              <td
                                className="text-truncate"
                                style={{ maxWidth: "350px" }}
                              >
                                {item.description}
                              </td>
                              <td
                                className="text-truncate"
                                style={{ maxWidth: "450px" }}
                              >
                                {item.nib}
                              </td>
                              <td className="float-right">
                                <Link
                                  to={`tentang-kami/edit-tentang-kami/${item.id}`}
                                >
                                  <Button
                                    className="rounded-pill my-1 mr-2"
                                    color="dark-gray"
                                  >
                                    Edit
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </Table>
                  <Pagination className="pagination-with-border">
                    <PaginationItem disabled={aboutusTableCurrentPage <= 0}>
                      <PaginationLink
                        onClick={(e) =>
                          setAboutUsTablePage(e, aboutusTableCurrentPage - 1)
                        }
                        previous
                        href="#top"
                      />
                    </PaginationItem>
                    {[...Array(aboutusTablePagesCount)].map((page, i) => (
                      <PaginationItem
                        active={i === aboutusTableCurrentPage}
                        key={i}
                      >
                        <PaginationLink
                          onClick={(e) => setAboutUsTablePage(e, i)}
                          href="#top"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem
                      disabled={
                        aboutusTableCurrentPage >= aboutusTablePagesCount - 1
                      }
                    >
                      <PaginationLink
                        onClick={(e) =>
                          setAboutUsTablePage(e, aboutusTableCurrentPage + 1)
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
          <Row>
            <Col xl={5} className="mb-4">
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">Visi</div>
                  <div className="d-flex">
                    <Link to={`tentang-kami/edit-visi/${aboutusId}`}>
                      <Button className="rounded-pill mr-3" color="dark-gray">
                        Edit Visi
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="widget-table-overflow">
                  <Table className="table-striped table-borderless" responsive>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Visi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aboutus.length === 0 ? (
                        <tr>
                          <td colSpan="8">
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        aboutus
                          ?.slice(
                            aboutusTableCurrentPage * pageSize,
                            (aboutusTableCurrentPage + 1) * pageSize
                          )
                          ?.map((item) => (
                            <tr key={uuidv4()}>
                              <td width={10}></td>
                              <td>{item.visi}</td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Widget>
            </Col>
            <Col xl={7} className="mb-4">
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">Misi</div>
                  <div className="d-flex">
                    <Link to={`tentang-kami/tambah-misi/${aboutusId}`}>
                      <Button className="rounded-pill mr-3" color="primary">
                        Tambah Misi
                      </Button>
                    </Link>
                    <Link to={`tentang-kami/edit-misi/${aboutusId}`}>
                      <Button className="rounded-pill mr-3" color="dark-gray">
                        Edit Misi
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="widget-table-overflow">
                  <Table className="table-striped table-borderless" responsive>
                    <thead>
                      <tr>
                        {missionColumns.map((col, index) => (
                          <th key={index}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {missions.length === 0 ? (
                        <tr>
                          <td colSpan="8">
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        missions
                          ?.slice(
                            missionsTableCurrentPage * pageSize,
                            (missionsTableCurrentPage + 1) * pageSize
                          )
                          ?.map((item) => (
                            <tr key={uuidv4()}>
                              <td width={10}></td>
                              <td>{item.misi}</td>
                              <td className="float-right">
                                <Button
                                  className="rounded-pill my-1"
                                  color="danger"
                                  onClick={() =>
                                    window.confirm(
                                      "Apakah anda yakin ingin menghapus tentang kami ini?"
                                    )
                                      ? handleDeleteMission(item.id)
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
                    <PaginationItem disabled={missionsTableCurrentPage <= 0}>
                      <PaginationLink
                        onClick={(e) =>
                          setMissionsTablePage(e, missionsTableCurrentPage - 1)
                        }
                        previous
                        href="#top"
                      />
                    </PaginationItem>
                    {[...Array(missionsTablePagesCount)].map((page, i) => (
                      <PaginationItem
                        active={i === missionsTableCurrentPage}
                        key={i}
                      >
                        <PaginationLink
                          onClick={(e) => setMissionsTablePage(e, i)}
                          href="#top"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem
                      disabled={
                        missionsTableCurrentPage >= missionsTablePagesCount - 1
                      }
                    >
                      <PaginationLink
                        onClick={(e) =>
                          setMissionsTablePage(e, missionsTableCurrentPage + 1)
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
                  <div className="headline-2">Foto Tentang Kami</div>
                  <div className="d-flex">
                    <Link to={`tentang-kami/edit-foto/${aboutusId}`}>
                      <Button className="rounded-pill mr-3" color="dark-gray">
                        Ubah Foto
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="widget-table-overflow">
                  <Table className="table-striped table-borderless" responsive>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Foto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aboutus.length === 0 ? (
                        <tr>
                          <td colSpan="8">
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        aboutus
                          ?.slice(
                            aboutusTableCurrentPage * pageSize,
                            (aboutusTableCurrentPage + 1) * pageSize
                          )
                          ?.map((item) => (
                            <tr key={uuidv4()}>
                              <td width={10}></td>
                              <td>
                                <img
                                  src={item.image_1}
                                  alt={item.title}
                                  style={{ width: "150px" }}
                                />
                              </td>
                              <td>
                                <img
                                  src={item.image_2}
                                  alt={item.title}
                                  style={{ width: "150px" }}
                                />
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

export default AboutUs;
