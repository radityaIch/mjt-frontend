import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { deleteArticle, getAllArticles } from "../../api/ArticlesAPI.js";
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

const Articles = function () {
  const [article, setArticles] = useState([]);
  const [articleTableCurrentPage, setArticlesTableCurrentPage] = useState(0);

  const pageSize = 10;
  const articleTablePagesCount = Math.ceil(article.length / pageSize);

  const setArticlesTablePage = (e, index) => {
    e.preventDefault();
    setArticlesTableCurrentPage(index);
  };

  const getArticles = async () => {
    const response = await getAllArticles();
    setArticles(response);
  };

  const handleDeleteArticle = async (id) => {
    const res = await deleteArticle(id);
    if (res.status === 200) {
      getArticles();
      toast(
        <Notification
          type="success"
          message="Artikel berhasil dihapus!"
          withIcon
        />,
        notificationOptions
      );
    }
  };

  useEffect(() => {
    getArticles();
  }, []);

  const columns = ["", "cover", "judul", "klien", "dipublish oleh"];

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">Daftar Artikel</div>
                  <div className="d-flex">
                    <Link to="artikel/tambah-artikel">
                      <Button className="rounded-pill mr-3" color="primary">
                        Buat Artikel
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
                            articleTableCurrentPage * pageSize,
                            (articleTableCurrentPage + 1) * pageSize
                          )
                          ?.map((item) => (
                            <tr key={uuidv4()}>
                              <td width={10}></td>
                              <td>
                                <img
                                  src={item?.image}
                                  alt={item?.title}
                                  className={`${s.imageCustom}`}
                                />
                              </td>
                              <td>{item?.title}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img
                                    src={item?.client?.image}
                                    alt={item?.client?.title}
                                    className={`${s.imageCustom} mr-2`}
                                  />
                                  {item?.client?.title}
                                </div>
                              </td>
                              <td>{item?.created_by?.name}</td>
                              <td className="float-right">
                                <Link to={`artikel/edit-artikel/${item.id}`}>
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
                                      "Apakah anda yakin ingin menghapus artikel ini?"
                                    )
                                      ? handleDeleteArticle(item.id)
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
      </Row>
    </div>
  );
};

export default Articles;
