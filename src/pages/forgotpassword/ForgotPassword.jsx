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
import { sendVerificationCode } from "../../api/UserAPI";
import { setFormData } from "../../components/utils/utils";

const ForgotPassword = (props) => {
  const [state, setState] = useState({
    email: "",
  });

  const getVerificationCode = async (e) => {
    e.preventDefault();
    const payload = setFormData(state);
    const res = await sendVerificationCode(payload);
    if (res.status === 200 || res.status === 201)
      props.history.push("/forgot-password/verify-code");
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
                <p className="auth-header mb-0">Lupa Password</p>
                <div className="logo-block">
                  <SofiaLogo />
                  <p className="mb-0">SOFIA</p>
                </div>
              </div>
              <div className="auth-info my-2">
                <p>
                  Sistem akan mengirim kode verifikasi ke email,{" "}
                  <b>pastikan email yang anda masukkan benar</b>
                </p>
              </div>
              <form onSubmit={(event) => getVerificationCode(event)}>
                <FormGroup className="my-3">
                  <FormText>Email</FormText>
                  <Input
                    id="email"
                    className="input-transparent pl-3"
                    value={state.email}
                    onChange={(event) => changeCreds(event)}
                    type="email"
                    required
                    name="email"
                    placeholder="Email"
                  />
                </FormGroup>
                <div className="bg-widget d-flex justify-content-center">
                  <Button
                    className="rounded-pill my-3"
                    type="submit"
                    color="secondary-red"
                  >
                    Kirim Kode
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

ForgotPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    isAuthenticated: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage,
  };
}

export default withRouter(connect(mapStateToProps)(ForgotPassword));
