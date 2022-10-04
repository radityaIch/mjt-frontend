import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter, Redirect, Link } from "react-router-dom";
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
import { loginUser } from "../../actions/auth";
import hasToken from "../../services/authService";

import SofiaLogo from "../../components/Icons/SofiaLogo.js";

const Login = (props) => {
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const doLogin = (e) => {
    e.preventDefault();
    props.dispatch(loginUser({ creds: state, history: props.history }));
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
                <p className="auth-header mb-0">Login</p>
                <div className="logo-block">
                  <SofiaLogo />
                  <p className="mb-0">SOFIA</p>
                </div>
              </div>
              <form onSubmit={(event) => doLogin(event)}>
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
                <FormGroup className="my-3">
                  <div className="d-flex justify-content-between">
                    <FormText>Password</FormText>
                    <Link to="/forgot-password">Lupa password?</Link>
                  </div>
                  <Input
                    id="password"
                    className="input-transparent pl-3"
                    value={state.password}
                    onChange={(event) => changeCreds(event)}
                    type="password"
                    required
                    name="password"
                    placeholder="Password"
                  />
                </FormGroup>
                <div className="bg-widget d-flex justify-content-center">
                  <Button
                    className="rounded-pill my-3"
                    type="submit"
                    color="secondary-red"
                  >
                    Login
                  </Button>
                </div>
                <Link to="/register" className="d-block mt-3">
                  Belum punya akun? Register di sini!
                </Link>
                <Link to="/resend-verification" className="d-block mt-3">
                  Kirim ulang email verifikasi
                </Link>
              </form>
            </Widget>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    isAuthenticated: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage,
  };
}

export default withRouter(connect(mapStateToProps)(Login));
