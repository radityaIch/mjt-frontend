import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getAllCovers } from "../../api/LandingAPI.js";
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

const Covers = function () {
  const [covers, setCovers] = useState([]);
  const [coversTableCurrentPage, setCoversTableCurrentPage] = useState(0);

  const pageSize = 10;
  const coversTablePagesCount = Math.ceil(covers.length / pageSize);

  const setCoversTablePage = (e, index) => {
    e.preventDefault();
    setCoversTableCurrentPage(index);
  };

  const getCovers = async () => {
    const response = await getAllCovers();
    setCovers(response);
  };

  const translateCategory = (category) => {
    if (category === "service-card") return "Card Layanan Halaman Utama";
    if (category === "hero-banner") return "Banner/Hero Halaman Utama";
    if (category === "bg-area")
      return "Background untuk Jangkauan Layanan Halaman Utama";
    if (category === "bg-footer") return "Background untuk Footer";
  };

  useEffect(() => {
    getCovers();
  }, []);

  const columns = ["", "Foto", "Cover untuk"];

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">Daftar Cover</div>
                  <div className="d-flex">
                    {/* <Link to="cover/tambah-cover">
                      <Button className="rounded-pill mr-3" color="primary">
                        Tambah Cover
                      </Button>
                    </Link> */}
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
                      {covers.length === 0 ? (
                        <tr>
                          <td colSpan="8">
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        covers
                          ?.slice(
                            coversTableCurrentPage * pageSize,
                            (coversTableCurrentPage + 1) * pageSize
                          )
                          ?.map((item) => (
                            <tr key={uuidv4()}>
                              <td width={10}></td>
                              <td>
                                <img
                                  src={item?.image}
                                  alt={item?.category}
                                  className={`${s.imageCustom}`}
                                />
                              </td>
                              <td>{translateCategory(item?.category)}</td>
                              <td className="float-right">
                                <Link to={`cover/edit-cover/${item?.id}`}>
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
                    <PaginationItem disabled={coversTableCurrentPage <= 0}>
                      <PaginationLink
                        onClick={(e) =>
                          setCoversTablePage(e, coversTableCurrentPage - 1)
                        }
                        previous
                        href="#top"
                      />
                    </PaginationItem>
                    {[...Array(coversTablePagesCount)].map((page, i) => (
                      <PaginationItem
                        active={i === coversTableCurrentPage}
                        key={i}
                      >
                        <PaginationLink
                          onClick={(e) => setCoversTablePage(e, i)}
                          href="#top"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem
                      disabled={
                        coversTableCurrentPage >= coversTablePagesCount - 1
                      }
                    >
                      <PaginationLink
                        onClick={(e) =>
                          setCoversTablePage(e, coversTableCurrentPage + 1)
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

export default Covers;
