import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
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

const dummyData = [
  {
    id: uuidv4(),
    no_resi: "MJT02010210",
    dari: "Tangerang",
    menuju: "Sidoarjo",
    updateTerakhir: "18.00 WIB - Dalam Perjalanan",
  },
  {
    id: uuidv4(),
    no_resi: "MJT02010210",
    dari: "Yogyakarta",
    menuju: "Malang",
    updateTerakhir: "18.45 WIB - Dalam Perjalanan",
  },
  {
    id: uuidv4(),
    no_resi: "MJT02010210",
    dari: "Surabaya",
    menuju: "Tulungagung",
    updateTerakhir: "16.00 WIB - Dalam Perjalanan",
  },
];

const TravelPermit = () => {
  const [permits, setPermits] = useState(dummyData);
  const [permitsTableCurrentPage, setPermitsTableCurrentPage] = useState(0);
  const columns = ["", "No Resi", "Tujuan", "Update Terakhir", "Aksi"];

  const pageSize = 10;
  const permitsTablePagesCount = Math.ceil(permits.length / pageSize);

  const setPermitsTablePage = (e, index) => {
    e.preventDefault();
    setPermitsTableCurrentPage(index);
  };

  const trimmedText = (text) => {
    return text.length > 28 ? `${text.slice(0, 28)}....` : text;
  };

  return (
    <div>
      <Row>
        <Col>
          <div className="btn-group mb-1">
            <Link to="#" className="btn btn-secondary fw-light active">
              Dalam Perjalanan
            </Link>
            <Link to="/dashboard/surat-jalan/selesai" className="btn bg-white fw-light">
              Selesai Perjalanan
            </Link>
          </div>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">Daftar Surat Jalan</div>
                  <div className="d-flex">
                    <Link to="/dashboard/surat-jalan/tambah-surat-jalan">
                      <Button className="rounded-pill mr-3" color="primary">
                        Tambah Data
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="widget-table-overfllow">
                  <Table className="table-striped table-borderless" responsive>
                    <thead>
                      <tr>
                        {columns.map((col, index) => (
                          <th key={index}>{col}</th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {permits.length === 0 ? (
                        <tr>
                          <td colSpan={columns.length}>
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        permits
                          ?.slice(
                            permitsTableCurrentPage * pageSize,
                            (permitsTableCurrentPage + 1) * pageSize
                          )
                          .map((permit) => (
                            <tr key={permit.id}>
                              <td></td>
                              <td>{permit.no_resi}</td>
                              <td>
                                {permit.dari} ===={">"} {permit.menuju}
                              </td>
                              <td>{trimmedText(permit.updateTerakhir)}</td>
                              <td>
                                <Link to={`/dashboard/surat-jalan/${permit.no_resi}`}>
                                <Button className="mr-2" color="primary">
                                  Detail
                                </Button>
                                </Link>
                                <Button color="success">Selesai</Button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </Table>

                  <Pagination className="pagination-with-border">
                    <PaginationItem disabled={permitsTableCurrentPage <= 0}>
                      <PaginationLink
                        onClick={(e) =>
                          setPermitsTablePage(e, permitsTableCurrentPage - 1)
                        }
                        previous
                        href="#top"
                      />
                    </PaginationItem>
                    {[...Array(permitsTablePagesCount)].map((page, i) => (
                      <PaginationItem
                        active={i === permitsTableCurrentPage}
                        key={i}
                      >
                        <PaginationLink
                          onClick={(e) => setPermitsTablePage(e, i)}
                          href="#top"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem
                      disabled={
                        permitsTableCurrentPage >= permitsTablePagesCount - 1
                      }
                    >
                      <PaginationLink
                        onClick={(e) =>
                          setPermitsTablePage(e, permitsTableCurrentPage + 1)
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

export default TravelPermit;
