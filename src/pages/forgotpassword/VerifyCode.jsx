import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  FormText,
  Input,
} from "reactstrap";
import Widget from "../../components/Widget/Widget";
import Footer from "../../components/Footer/Footer";
import hasToken from "../../services/authService";

import SofiaLogo from "../../components/Icons/SofiaLogo.js";
import { checkVerificationCode } from "../../api/UserAPI";

const VerifyCode = (props) => {
  const [state, setState] = useState({
    token: "",
  });

  const doCheckVerificationCode = async (e) => {
    e.preventDefault();
    const res = await checkVerificationCode(state.token);
    if (res.status === 200)
      props.history.push(
        `/forgot-password/change-password/${res.data.email}/${state.token}`
      );
    // props.dispatch(loginUser({ creds: state, history: props.history }));
  };

  const changeCreds = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const { from } = props.location.state || { from: { pathname: "/dashboard" } };
  if (hasToken(JSON.parse(localStorage.getItem("authenticated")))) {
    return <Redirect to={from} />;
  }

  return (
    <div className="auth-page">
      <Container className="col-12">
        <Row className="d-flex align-items-center min-vh-100">
          <Col xs={12} lg={12} className="left-column">
            <Widget className="widget-auth widget-p-lg">
              <div className="d-flex align-items-center justify-content-between py-3">
                <p className="auth-header mb-0">Verifikasi Kode</p>
                <div className="logo-block">
                  <SofiaLogo />
                  <p className="mb-0">SOFIA</p>
                </div>
              </div>
              <div className="auth-info my-2">
                <p>
                  Sistem telah mengirim kode verifikasi ke email,{" "}
                  <b>
                    cek INBOX atau SPAM pada email yang anda masukkan sebelumnya
                  </b>
                </p>
              </div>
              <form onSubmit={(event) => doCheckVerificationCode(event)}>
                <FormGroup className="my-3">
                  <FormText>Token</FormText>
                  <Input
                    id="token"
                    className="input-transparent pl-3"
                    value={state.token}
                    onChange={(event) => changeCreds(event)}
                    type="text"
                    required
                    name="token"
                    placeholder="Token"
                  />
                </FormGroup>
                <div className="bg-widget d-flex justify-content-center">
                  <Button
                    className="rounded-pill my-3"
                    type="submit"
                    color="secondary-red"
                  >
                    Cek Kode
                  </Button>
                </div>
              </form>
            </Widget>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

VerifyCode.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    isAuthenticated: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage,
  };
}

export default withRouter(connect(mapStateToProps)(VerifyCode));
