import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { deletePriceList, getAllPriceList } from "../../api/PriceListAPI.js";
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

const PriceList = function () {
  const [prices, setPrices] = useState([]);
  const [pricesTableCurrentPage, setPricesTableCurrentPage] = useState(0);

  const pageSize = 10;
  const pricesTablePagesCount = Math.ceil(prices.length / pageSize);

  const setPricesTablePage = (e, index) => {
    e.preventDefault();
    setPricesTableCurrentPage(index);
  };

  const getPrices = async () => {
    const response = await getAllPriceList();
    setPrices(response);
  };

  const handleDeletePrice = async (id) => {
    const res = await deletePriceList(id);
    if (res.status === 200) {
      getPrices();
      toast(
        <Notification
          type="success"
          message="Daftar harga berhasil dihapus!"
          withIcon
        />,
        notificationOptions
      );
    }
  };

  useEffect(() => {
    getPrices();
  }, []);

  const columns = ["", "Foto", "Kategori", "title", "file"];

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">Daftar Harga</div>
                  <div className="d-flex">
                    <Link to="daftar-harga/tambah-harga">
                      <Button className="rounded-pill mr-3" color="primary">
                        Tambah Daftar Harga
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
                      {prices.length === 0 ? (
                        <tr>
                          <td colSpan="8">
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        prices
                          ?.slice(
                            pricesTableCurrentPage * pageSize,
                            (pricesTableCurrentPage + 1) * pageSize
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
                              <td>
                                {item.type === "shipping"
                                  ? "Shipping"
                                  : "Warehouse & Fulfillment"}
                              </td>
                              <td>{item.title}</td>
                              <td>
                                {item.file !== null ? (
                                  <a
                                    href={item.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                  >
                                    Download File
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td className="float-right">
                                <Link to={`daftar-harga/edit-harga/${item.id}`}>
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
                                      "Apakah anda yakin ingin menghapus daftar harga ini?"
                                    )
                                      ? handleDeletePrice(item.id)
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
                    <PaginationItem disabled={pricesTableCurrentPage <= 0}>
                      <PaginationLink
                        onClick={(e) =>
                          setPricesTablePage(e, pricesTableCurrentPage - 1)
                        }
                        previous
                        href="#top"
                      />
                    </PaginationItem>
                    {[...Array(pricesTablePagesCount)].map((page, i) => (
                      <PaginationItem
                        active={i === pricesTableCurrentPage}
                        key={i}
                      >
                        <PaginationLink
                          onClick={(e) => setPricesTablePage(e, i)}
                          href="#top"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem
                      disabled={
                        pricesTableCurrentPage >= pricesTablePagesCount - 1
                      }
                    >
                      <PaginationLink
                        onClick={(e) =>
                          setPricesTablePage(e, pricesTableCurrentPage + 1)
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

export default PriceList;
