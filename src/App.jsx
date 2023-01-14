// -- React and related libs
import React from "react";
import { Switch, Route, Redirect } from "react-router";
import { BrowserRouter } from "react-router-dom";

// -- Redux
import { connect } from "react-redux";

// -- Custom Components
import LayoutComponent from "./components/Layout/Layout";
import ErrorPage from "./pages/error/ErrorPage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import VerifiedPage from "./pages/verified/Verified";
import ForgotPassword from "./pages/forgotpassword/ForgotPassword";
import VerifyCode from "./pages/forgotpassword/VerifyCode";
import ChangePassword from "./pages/forgotpassword/ChangePassword";
import ResendVerification from "./pages/users/ResendVerification";
import PermitTemplate from "./pages/travelpermit/PermitTemplate";

// -- Redux Actions
import { logoutUser } from "./actions/auth";

// -- Third Party Libs
import { ToastContainer } from "react-toastify";

// -- Services
import isAuthenticated from "./services/authService";

// -- Component Styles
import "./styles/app.scss";
import "react-toastify/dist/ReactToastify.css";

const PrivateRoute = ({ dispatch, component, ...rest }) => {
	if (!isAuthenticated(JSON.parse(localStorage.getItem("authenticated")))) {
		dispatch(logoutUser());
		return <Redirect to="/login" />;
	} else {
		return (
			<Route
				{...rest}
				render={(props) => React.createElement(component, props)}
			/>
		);
	}
};

const App = (props) => {
	return (
		<div>
			<ToastContainer />
			<BrowserRouter>
				<Switch>
					<Route path="/" exact render={() => <Redirect to="/dashboard" />} />
					<PrivateRoute
						path="/dashboard"
						dispatch={props.dispatch}
						component={LayoutComponent}
					/>
					<PrivateRoute
						path="/print/surat-jalan/:id/"
						dispatch={props.dispatch}
						component={PermitTemplate}
					/>
					<Route path="/login" exact component={Login} />
					<Route path="/error" exact component={ErrorPage} />
					<Route path="/register" exact component={Register} />
					<Route path="/forgot-password" exact component={ForgotPassword} />
					<Route
						path="/resend-verification"
						exact
						component={ResendVerification}
					/>
					<Route
						path="/forgot-password/verify-code"
						exact
						component={VerifyCode}
					/>
					<Route
						path="/forgot-password/change-password/:email/:token"
						exact
						component={ChangePassword}
					/>
					<Route
						path="/verified/:email/:token"
						exact
						component={VerifiedPage}
					/>
					<Route component={ErrorPage} />
					<Route
						path="*"
						exact={true}
						render={() => <Redirect to="/error" />}
					/>
				</Switch>
			</BrowserRouter>
		</div>
	);
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(App);
