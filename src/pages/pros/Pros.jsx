import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
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
import { deletePros, getAllPros } from "../../api/ProsAPI.js";

const Pros = function () {
    const [pros, setPros] = useState([]);
    const [prosTableCurrentPage, setProsTableCurrentPage] = useState(0);

    const pageSize = 10;
    const prosTablePagesCount = Math.ceil(pros.length / pageSize);

    const setProsTablePage = (e, index) => {
        e.preventDefault();
        setProsTableCurrentPage(index);
    };

    const getProsData = async () => {
        const response = await getAllPros();
        setPros(response);
    };

    const handleDeletePros = async (id) => {
        const res = await deletePros(id);
        if (res.status === 200) {
            getProsData();
            toast(
                <Notification
                    type="success"
                    message="Pros berhasil dihapus!"
                    withIcon
                />,
                notificationOptions
            );
        }
    };

    useEffect(() => {
        getProsData();
    }, []);

    const columns = ["", "Icon", "Nama", "Deskripsi"];

    return (
        <div>
            <Row>
                <Col>
                    <Row className="mb-4">
                        <Col>
                            <Widget>
                                <div className={s.tableTitle}>
                                    <div className="headline-2">Daftar Pros</div>
                                    <div className="d-flex">
                                        <Link to="pros/tambah-pros">
                                            <Button className="rounded-pill mr-3" color="primary">
                                                Tambah Pros
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
                                            {pros.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8">
                                                        <h5 className=" text-center my-3">
                                                            Belum ada data
                                                        </h5>
                                                    </td>
                                                </tr>
                                            ) : (
                                                pros
                                                    ?.slice(
                                                        prosTableCurrentPage * pageSize,
                                                        (prosTableCurrentPage + 1) * pageSize
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
                                                            <td>{item.description}</td>
                                                            <td className="float-right">
                                                                <Link to={`pros/edit-pros/${item.id}`}>
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
                                                                            "Apakah anda yakin ingin menghapus pros ini?"
                                                                        )
                                                                            ? handleDeletePros(item.id)
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
                                        <PaginationItem disabled={prosTableCurrentPage <= 0}>
                                            <PaginationLink
                                                onClick={(e) =>
                                                    setProsTablePage(e, prosTableCurrentPage - 1)
                                                }
                                                previous
                                                href="#top"
                                            />
                                        </PaginationItem>
                                        {[...Array(prosTablePagesCount)].map((page, i) => (
                                            <PaginationItem
                                                active={i === prosTableCurrentPage}
                                                key={i}
                                            >
                                                <PaginationLink
                                                    onClick={(e) => setProsTablePage(e, i)}
                                                    href="#top"
                                                >
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem
                                            disabled={prosTableCurrentPage >= prosTablePagesCount - 1}
                                        >
                                            <PaginationLink
                                                onClick={(e) =>
                                                    setProsTablePage(e, prosTableCurrentPage + 1)
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

export default Pros;
