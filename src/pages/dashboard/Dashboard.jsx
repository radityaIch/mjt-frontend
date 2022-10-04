import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Col,
  Row,
  Button,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import { getAllArmada } from "../../api/ArmadaAPI.js";
import { getAllClients } from "../../api/ClientsAPI.js";
import { getAllArticles } from "../../api/ArticlesAPI.js";
import { getAllServices } from "../../api/ServicesAPI.js";
import { Link } from "react-router-dom";

import s from "./Dashboard.module.scss";
import t from "../components/Tables.module.scss";

const Dashboard = () => {
  const articlesPageSize = 5;
  const clientsPageSize = 10;
  const [article, setArticles] = useState([]);
  const [clients, setClients] = useState([]);
  const [articleTableCurrentPage, setArticlesTableCurrentPage] = useState(0);
  const [clientsTableCurrentPage, setClientsTableCurrentPage] = useState(0);
  const articleTablePagesCount = Math.ceil(article.length / articlesPageSize);
  const clientsTablePagesCount = Math.ceil(clients.length / clientsPageSize);
  const [dataLength, setDataLength] = useState({
    armada: 0,
    client: 0,
    article: 0,
    service: 0,
  });

  const setClientsTablePage = (e, index) => {
    e.preventDefault();
    setClientsTableCurrentPage(index);
  };

  const setArticlesTablePage = (e, index) => {
    e.preventDefault();
    setArticlesTableCurrentPage(index);
  };

  const getArticles = async () => {
    const response = await getAllArticles();
    setArticles(response);
  };

  const getClients = async () => {
    const response = await getAllClients();
    setClients(response);
  };

  const getDataLength = async () => {
    const armadas = await getAllArmada();
    const clients = await getAllClients();
    const articles = await getAllArticles();
    const services = await getAllServices();

    setDataLength({
      armada: armadas.length,
      client: clients.length,
      article: articles.length,
      service: services.length,
    });
  };

  const columns = ["", "cover", "judul", "klien", "dipublish oleh"];

  useEffect(() => {
    getDataLength();
    getArticles();
    getClients();
  }, []);

  return (
    <div>
      <Row>
        <Col className="pr-grid-col" xs={12}>
          <Row className="gutter">
            <Col xs={6} sm={6} xl={3} className="mb-4">
              <Widget className="widget-p-sm">
                <div className={s.smallWidget}>
                  <div
                    className={`${s.dashboardCardIcon} ${s.bgBlue} mr-2 mb-2`}
                  >
                    <i className="eva eva-car-outline"></i>
                  </div>
                  <div className="d-flex flex-column">
                    <p className="headline-3">Armada</p>
                    <p className="body-2">
                      {dataLength.armada}
                      <span className="body-3 muted"> Jenis Mobil/Truk</span>
                    </p>
                  </div>
                </div>
              </Widget>
            </Col>
            <Col xs={6} sm={6} xl={3} className="mb-4">
              <Widget className="widget-p-sm">
                <div className={s.smallWidget}>
                  <div
                    className={`${s.dashboardCardIcon} ${s.bgYellow} mr-2 mb-2`}
                  >
                    <i className="eva eva-link-2-outline"></i>
                  </div>
                  <div className="d-flex flex-column">
                    <p className="headline-3">Klien</p>
                    <p className="body-2">
                      {dataLength.client}
                      <span className="body-3 muted"> Instansi/Perusahaan</span>
                    </p>
                  </div>
                </div>
              </Widget>
            </Col>
            <Col xs={6} sm={6} xl={3} className="mb-4">
              <Widget className="widget-p-sm">
                <div className={s.smallWidget}>
                  <div
                    className={`${s.dashboardCardIcon} ${s.bgTeal} mr-2 mb-2`}
                  >
                    <i className="eva eva-file-text-outline"></i>
                  </div>
                  <div className="d-flex flex-column">
                    <p className="headline-3">Artikel</p>
                    <p className="body-2">
                      {dataLength.article}
                      <span className="body-3 muted"> Artikel/Blog</span>
                    </p>
                  </div>
                </div>
              </Widget>
            </Col>
            <Col xs={6} sm={6} xl={3} className="mb-4">
              <Widget className="widget-p-sm">
                <div className={s.smallWidget}>
                  <div
                    className={`${s.dashboardCardIcon} ${s.bgHeart} mr-2 mb-2`}
                  >
                    <i className="eva eva-keypad-outline"></i>
                  </div>
                  <div className="d-flex flex-column">
                    <p className="headline-3">Layanan</p>
                    <p className="body-2">
                      {dataLength.service}
                      <span className="body-3 muted"> Jenis Layanan</span>
                    </p>
                  </div>
                </div>
              </Widget>
            </Col>
          </Row>
        </Col>
        <Col className="pr-grid-col" xs={12} lg={8}>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={t.tableTitle}>
                  <div className="headline-2">Daftar Artikel Terbaru</div>
                  <div className="d-flex">
                    <Link to="dashboard/artikel">
                      <Button className="rounded-pill mr-3" color="primary">
                        Lihat Semua
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
                      {article.length === 0 ? (
                        <tr>
                          <td colSpan="8">
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        article
                          ?.slice(
                            articleTableCurrentPage * articlesPageSize,
                            (articleTableCurrentPage + 1) * articlesPageSize
                          )
                          ?.map((item) => (
                            <tr key={uuidv4()}>
                              <td width={10}></td>
                              <td>
                                <img
                                  src={item?.image}
                                  alt={item?.title}
                                  className={`${s.imageCustom}`}
                                  width={50}
                                />
                              </td>
                              <td>{item?.title}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img
                                    src={item?.client?.image}
                                    alt={item?.client?.title}
                                    className={`${s.imageCustom} mr-2`}
                                    width={50}
                                  />
                                  {item?.client?.title}
                                </div>
                              </td>
                              <td>{item?.created_by?.name}</td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </Table>
                  <Pagination className="pagination-with-border">
                    <PaginationItem disabled={articleTableCurrentPage <= 0}>
                      <PaginationLink
                        onClick={(e) =>
                          setArticlesTablePage(e, articleTableCurrentPage - 1)
                        }
                        previous
                        href="#top"
                      />
                    </PaginationItem>
                    {[...Array(articleTablePagesCount)].map((page, i) => (
                      <PaginationItem
                        active={i === articleTableCurrentPage}
                        key={i}
                      >
                        <PaginationLink
                          onClick={(e) => setArticlesTablePage(e, i)}
                          href="#top"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem
                      disabled={
                        articleTableCurrentPage >= articleTablePagesCount - 1
                      }
                    >
                      <PaginationLink
                        onClick={(e) =>
                          setArticlesTablePage(e, articleTableCurrentPage + 1)
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
        <Col className="mt-4 mt-lg-0 pl-grid-col" xs={12} lg={4}>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={t.tableTitle}>
                  <div className="headline-2">Daftar Klien</div>
                  <div className="d-flex">
                    <Link to="/dashboard/klien">
                      <Button className="rounded-pill mr-3" color="primary">
                        Lihat Semua
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
                        <th>Instansi/Perusahaan</th>
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
                            clientsTableCurrentPage * clientsPageSize,
                            (clientsTableCurrentPage + 1) * clientsPageSize
                          )
                          ?.map((item) => (
                            <tr key={uuidv4()}>
                              <td width={10}></td>
                              <td>
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className={`${s.imageCustom}`}
                                  width={50}
                                />
                              </td>
                              <td>{item.title}</td>
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

export default Dashboard;
