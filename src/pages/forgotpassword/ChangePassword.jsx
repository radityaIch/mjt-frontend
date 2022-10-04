import React, { useState } from "react";
import { useParams } from "react-router";
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
import Widget from "../../components/Widget/Widget.js";
import Footer from "../../components/Footer/Footer.js";

import SofiaLogo from "../../components/Icons/SofiaLogo.js";
import hasToken from "../../services/authService";
import { toast } from "react-toastify";
import Notification from "../../components/Notification/Notification.js";
import {
  notificationOptions,
  setFormData,
} from "../../components/utils/utils.js";
import { resetPassword } from "../../api/UserAPI.js";

const ChangePassword = (props) => {
  let params = useParams();
  const [state, setState] = useState({
    email: params.email,
    token: params.token,
    password: "",
    repassword: "",
  });

  const changeCred = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const doResetPassword = async (event) => {
    event.preventDefault();
    if (state.password.length >= 8) {
      if (state.password === state.repassword) {
        const payload = setFormData(state);
        const res = await resetPassword(payload);
        if (res.status === 200 || res.status === 201) {
          props.history.push("/login");
          toast(
            <Notification
              type="success"
              message="Password berhasil diubah!"
              withIcon
            />,
            notificationOptions
          );
        }
      } else {
        toast(
          <Notification
            type="warning"
            message="Password dan konfirmasi password tidak cocok!"
            withIcon
          />,
          notificationOptions
        );
      }
    } else {
      toast(
        <Notification
          type="warning"
          message="Password minimal 8 karakter!"
          withIcon
        />,
        notificationOptions
      );
    }
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
                <p className="auth-header mb-0">Ubah Password</p>
                <div className="logo-block">
                  <SofiaLogo />
                  <p className="mb-0">SOFIA</p>
                </div>
              </div>
              <div className="auth-info my-2">
                <p>
                  Anda akan menggunakan password baru untuk login pada email
                  <b> {params.email}</b>
                </p>
              </div>
              <form onSubmit={(event) => doResetPassword(event)}>
                <FormGroup className="my-3">
                  <div className="d-flex justify-content-between">
                    <FormText>Password Baru</FormText>
                  </div>
                  <Input
                    id="password"
                    className="input-transparent pl-3"
                    value={state.password}
                    onChange={(event) => changeCred(event)}
                    type="password"
                    required
                    name="password"
                    placeholder="Password"
                  />
                </FormGroup>
                <FormGroup className="my-3">
                  <Input
                    id="repassword"
                    className="input-transparent pl-3"
                    value={state.repassword}
                    onChange={(event) => changeCred(event)}
                    type="password"
                    required
                    name="repassword"
                    placeholder="Konfirmasi password"
                  />
                </FormGroup>
                <div className="bg-widget d-flex justify-content-center">
                  <Button
                    className="rounded-pill my-3"
                    type="submit"
                    color="secondary-red"
                  >
                    Ubah Password
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

ChangePassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    isAuthenticated: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage,
  };
}

export default withRouter(connect(mapStateToProps)(ChangePassword));
