import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { getAllPermit } from "../../api/TravelPermitAPI.js";
import { getAllTracking } from "../../api/TravelTrackingAPI.js";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const TravelPermit = () => {
  const [permits, setPermits] = useState([]);
  const [permitsTableCurrentPage, setPermitsTableCurrentPage] = useState(0);
  const columns = ["", "No Resi", "Tujuan", "Update Terakhir", "Aksi"];

  const pageSize = 10;
  const permitsTablePagesCount = Math.ceil(permits.length / pageSize);

  const setPermitsTablePage = (e, index) => {
    e.preventDefault();
    setPermitsTableCurrentPage(index);
  };

  const getPermit = async () => {
    const response = await getAllPermit();
    const permitData = Promise.all(
      response.map(async (permit) => {
        const track = await getAllTracking(permit.id).then((res) => {
          const latestTrack = res[0];

          return {
            id: permit.id,
            no_resi: permit.no_do,
            dari: permit.alamat_muat,
            menuju: permit.alamat_kirim,
            updateTerakhir: `${dayjs(latestTrack.updated_at)
              .tz("Asia/Jakarta")
              .format("DD MMM YYYY | HH:mm WIB")}  - ${latestTrack.keterangan}`,
          };
        });

        return track;
      })
    );

    return permitData;
  };

  useEffect(() => {
    getPermit().then((results) => setPermits(results));
  }, []);

  return (
    <div>
      <Row>
        <Col>
          <div className="btn-group mb-1">
            <Link to="#" className="btn btn-secondary fw-light active">
              Dalam Perjalanan
            </Link>
            <Link
              to="/dashboard/surat-jalan/selesai"
              className="btn bg-white fw-light"
            >
              Selesai Perjalanan (belum selesai)
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
                          .map((permit, index) => (
                            <tr key={permit?.id || index}>
                              <td></td>
                              <td>{permit.no_resi}</td>
                              <td>
                                <strong>{permit.dari}</strong> Menuju{" "}
                                <strong>{permit.menuju}</strong>
                              </td>
                              <td
                                style={{ width: 280, wordWrap: "break-word" }}
                              >
                                {permit.updateTerakhir}
                              </td>
                              <td>
                                <Link
                                  to={`/dashboard/surat-jalan/${permit.id}`}
                                >
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
