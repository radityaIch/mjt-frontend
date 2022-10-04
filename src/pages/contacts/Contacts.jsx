import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { getAllContacts } from "../../api/ContactsAPI.js";
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

const Contacts = function () {
  const [contacts, setContacts] = useState([]);
  const [contactsTableCurrentPage, setContactsTableCurrentPage] = useState(0);

  const pageSize = 10;
  const contactsTablePagesCount = Math.ceil(contacts.length / pageSize);

  const setContactsTablePage = (e, index) => {
    e.preventDefault();
    setContactsTableCurrentPage(index);
  };

  const getContacts = async () => {
    const response = await getAllContacts();
    setContacts(response);
  };

  useEffect(() => {
    getContacts();
  }, []);

  const columns = ["", "Tipe", "Judul", "Kontak"];

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <div className="headline-2">Daftar Kontak</div>
                  <div className="d-flex">
                    {/* <Link to="kontak-website/tambah-kontak">
                      <Button className="rounded-pill mr-3" color="primary">
                        Tambah Kontak
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
                      {contacts.length === 0 ? (
                        <tr>
                          <td colSpan="8">
                            <h5 className=" text-center my-3">
                              Belum ada data
                            </h5>
                          </td>
                        </tr>
                      ) : (
                        contacts
                          ?.slice(
                            contactsTableCurrentPage * pageSize,
                            (contactsTableCurrentPage + 1) * pageSize
                          )
                          ?.map((item) => (
                            <tr key={uuidv4()}>
                              <td width={10}></td>
                              <td>{item.type}</td>
                              <td>{item.title}</td>
                              <td>{item.contact}</td>
                              <td className="float-right">
                                <Link
                                  to={`kontak-website/edit-kontak/${item.id}`}
                                >
                                  <Button
                                    className="rounded-pill my-1 mr-2"
                                    color="dark-gray"
                                  >
                                    Edit
                                  </Button>
                                </Link>
                                {/* <Button
                                  className="rounded-pill my-1"
                                  color="danger"
                                  onClick={() =>
                                    window.confirm(
                                      "Apakah anda yakin ingin menghapus kontak ini?"
                                    )
                                      ? handleDeleteContact(item.id)
                                      : ""
                                  }
                                >
                                  Hapus
                                </Button> */}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </Table>
                  <Pagination className="pagination-with-border">
                    <PaginationItem disabled={contactsTableCurrentPage <= 0}>
                      <PaginationLink
                        onClick={(e) =>
                          setContactsTablePage(e, contactsTableCurrentPage - 1)
                        }
                        previous
                        href="#top"
                      />
                    </PaginationItem>
                    {[...Array(contactsTablePagesCount)].map((page, i) => (
                      <PaginationItem
                        active={i === contactsTableCurrentPage}
                        key={i}
                      >
                        <PaginationLink
                          onClick={(e) => setContactsTablePage(e, i)}
                          href="#top"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem
                      disabled={
                        contactsTableCurrentPage >= contactsTablePagesCount - 1
                      }
                    >
                      <PaginationLink
                        onClick={(e) =>
                          setContactsTablePage(e, contactsTableCurrentPage + 1)
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

export default Contacts;
