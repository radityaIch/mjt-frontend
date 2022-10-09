import {
  Col,
  Row,
  // Button,
  // FormGroup,
  // FormText,
  // Input,
  // InputGroup,
  // InputGroupText,
} from "reactstrap";
import Widget from "../../components/Widget/Widget.js";
import s from "../components/Tables.module.scss";

const TrackingForm = () => {
  return (
    <div>
      <Row>
        <Col>
          <Row className="mb-4">
            <Col>
              <Widget>
                <div className={s.tableTitle}>
                  <h2 className="headline-2">Masih Dalam Pengembangan</h2>
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
