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
import Widget from "../../components/Widget/Widget.js";
import Footer from "../../components/Footer/Footer.js";

// import loginImage from "../../assets/registerImage.svg";
import SofiaLogo from "../../components/Icons/SofiaLogo.js";
// import GoogleIcon from "../../components/Icons/AuthIcons/GoogleIcon.js";
// import TwitterIcon from "../../components/Icons/AuthIcons/TwitterIcon.js";
// import FacebookIcon from "../../components/Icons/AuthIcons/FacebookIcon.js";
// import GithubIcon from "../../components/Icons/AuthIcons/GithubIcon.js";
// import LinkedinIcon from "../../components/Icons/AuthIcons/LinkedinIcon.js";
import { registerUser } from "../../actions/register.js";
import hasToken from "../../services/authService";

const Register = (props) => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    repassword: "",
  });

  const changeCred = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const doRegister = (event) => {
    event.preventDefault();
    props.dispatch(
      registerUser({
        creds: state,
        history: props.history,
      })
    );
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
                <p className="auth-header mb-0">Register</p>
                <div className="logo-block">
                  <SofiaLogo />
                  <p className="mb-0">SOFIA</p>
                </div>
              </div>
              {/* <div className="auth-info my-2">
                <p>
                  This is a real app with Node.js backend - use{" "}
                  <b>"admin@flatlogic.com / password"</b> to login!
                </p>
              </div> */}
              <form onSubmit={(event) => doRegister(event)}>
                <FormGroup className="my-3">
                  <FormText>Nama</FormText>
                  <Input
                    id="name"
                    className="input-transparent pl-3"
                    value={state.name}
                    onChange={(event) => changeCred(event)}
                    type="text"
                    required
                    name="name"
                    placeholder="Nama Panjang"
                  />
                </FormGroup>
                <FormGroup className="my-3">
                  <FormText>Email</FormText>
                  <Input
                    id="email"
                    className="input-transparent pl-3"
                    value={state.email}
                    onChange={(event) => changeCred(event)}
                    type="email"
                    required
                    name="email"
                    placeholder="email@mjt-tlpartner.com"
                  />
                </FormGroup>
                <FormGroup className="my-3">
                  <div className="d-flex justify-content-between">
                    <FormText>Password</FormText>
                    {/* <Link to="/error">Forgot password?</Link> */}
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
                    Register
                  </Button>
                </div>
                <p className="dividing-line my-3">&#8195;Or&#8195;</p>
                {/* <div className="d-flex align-items-center my-3">
                  <p className="social-label mb-0">Login with</p>
                  <div className="socials">
                    <a href="https://flatlogic.com/"><GoogleIcon /></a>
                    <a href="https://flatlogic.com/"><TwitterIcon /></a>
                    <a href="https://flatlogic.com/"><FacebookIcon /></a>
                    <a href="https://flatlogic.com/"><GithubIcon /></a>
                    <a href="https://flatlogic.com/"><LinkedinIcon /></a>
                  </div>
                </div> */}
                <Link to="/login">Login ke akun</Link>
              </form>
            </Widget>
          </Col>
          {/* <Col xs={0} lg={6} className="right-column">
            <div>
              <img src={loginImage} alt="Error page" />
            </div>
          </Col> */}
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

Register.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    isAuthenticated: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage,
  };
}

export default withRouter(connect(mapStateToProps)(Register));
