import { useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat"

import {
  Col,
  Row,
  Button,
  FormGroup,
  FormText,
  Input,
  Table,
} from "reactstrap";
import {
  // notificationOptions,
  setFormData,
} from "../../components/utils/utils.js";
import Widget from "../../components/Widget/Widget.js";
import { v4 as uuidv4 } from "uuid";
import s from "../components/Tables.module.scss";

dayjs.extend(localizedFormat);

const TrackingForm = () => {
  const columns = ["Update Terakhir", "Keterangan", "Kendala", ""]

  const [tracking, setTracking] = useState({
    id: uuidv4(),
    tanggal: dayjs().locale('id').format('LLLL'),
    keterangan: "",
    kendala: "",
    historyId: "",
  });

  const [trackHistory, setTrackHistory] = useState([
    {
      id: uuidv4(),
      tanggal: dayjs().locale('id').format('LLLL'),
      keterangan: "Barang sedang berangkat dari gudang (Gresik, Jawa Barat 802010)",
      kendala: "Tidak Ada",
      permitId: "",
    },
    {
      id: uuidv4(),
      tanggal: dayjs().locale('id').format('LLLL'),
      keterangan: "Barang sedang dalam perjalanan (Bogor, Jawa Barat 802011)",
      kendala: "Tidak Ada",
      permitId: "",
    }
  ])

  const changeInput = (event) => {
    setTracking({ ...tracking, [event.target.name]: event.target.value });
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    const payload = setFormData(tracking);
    console.log(tracking);
  };

  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <h2 className="headline-2">Update Perjalanan</h2>
                </div>

                <form
                  onSubmit={(e) => onSubmitHandler(e)}
                  encType="multipart/form-data"
                  method="POST"
                >
                  <div className="px-4">
                    <FormGroup className="my-3">
                      <FormText className="mb-2">Keterangan</FormText>
                      <Input
                        id="keterangan"
                        name="keterangan"
                        className="input-transparent py-4 pl-3"
                        type="textarea"
                        required
                        value={tracking?.keterangan}
                        onChange={(e) => changeInput(e)}
                      />
                    </FormGroup>

                    <FormGroup className="mt-5 my-3">
                      <FormText className="mb-2">Kendala</FormText>
                      <Input
                        id="kendala"
                        name="kendala"
                        className="input-transparent py-4 pl-3"
                        type="textarea"
                        required
                        value={tracking?.kendala}
                        onChange={(e) => changeInput(e)}
                      />
                    </FormGroup>

                    <div className="my-5 d-flex justify-content-end">
                      <Button type="reset" color="secondary" className="mr-2">
                        Batal
                      </Button>
                      <Button type="submit" color="success">
                        Update Tracking
                      </Button>
                    </div>
                  </div>
                </form>

                <div className="mb-5 px-4" style={{ marginTop: "200px" }}>
                  <h2 className="headline-2">Riwayat Perjalanan</h2>

                  <div className="widget-table-overfllow mt-4">
                    <Table
                      className="table-striped table-borderless"
                      responsive
                    >
                      <thead>
                        <tr>
                          {columns.map((col, index) => (
                            <th key={index}>{col}</th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {trackHistory.length === 0 ? (
                          <tr>
                            <td colSpan={columns.length}>
                              <h5 className=" text-center my-3">
                                Belum ada data
                              </h5>
                            </td>
                          </tr>
                        ) : (
                          trackHistory.map((history, index) => (
                              <tr key={history.id}>
                                
                                <td width={225}>{history.tanggal}</td>
                                <td width={350}>
                                  {history.keterangan}
                                </td>
                                <td width={350}>{history.kendala}</td>
                                <td>
                                  <i className={"eva eva-checkmark-circle-outline"} 
                                    style={{color: index === 0? "#39CE77": "#C4C4C4"}}
                                  />
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Widget>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default TrackingForm;
