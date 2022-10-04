import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";

import {
  Navbar,
  Nav,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { logoutUser } from "../../actions/auth";
import { closeSidebar, openSidebar } from "../../actions/navigation";
import MenuIcon from "../Icons/HeaderIcons/MenuIcon";

import ProfileIcon from "../../assets/navbarMenus/pfofileIcons/ProfileIcon";

import logoutIcon from "../../assets/navbarMenus/pfofileIcons/logoutOutlined.svg";
import userImg from "../../assets/user.svg";

import s from "./Header.module.scss";
import "animate.css";
import { Link } from "react-router-dom";

const Header = (props) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const loggedUser = props.userData;

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const toggleSidebar = () => {
    if (props.sidebarOpened) {
      props.dispatch(closeSidebar());
    } else {
      const paths = props.location.pathname.split("/");
      paths.pop();
      props.dispatch(openSidebar());
    }
  };

  const doLogout = () => {
    props.dispatch(logoutUser());
  };

  return (
    <Navbar className={`${s.root} d-print-none`}>
      <div>
        <NavLink
          onClick={() => toggleSidebar()}
          className={`d-md-none mr-3 ${s.navItem}`}
          href="#"
        >
          <MenuIcon className={s.menuIcon} />
        </NavLink>
      </div>
      <Nav className="ml-auto">
        <Dropdown
          isOpen={notificationsOpen}
          toggle={() => toggleNotifications()}
          nav
          id="basic-nav-dropdown"
          className="ml-3"
        >
          <DropdownToggle nav caret className="navbar-dropdown-toggle">
            <span className={`${s.avatar} rounded-circle float-left mr-2`}>
              <img src={loggedUser?.image ?? userImg} alt="User" />
            </span>
            <span className="small d-none d-sm-block ml-1 mr-2 body-1">
              {loggedUser?.name}
            </span>
          </DropdownToggle>
          <DropdownMenu
            className="navbar-dropdown profile-dropdown"
            style={{ width: "194px" }}
          >
            <Link to="/dashboard/profile">
              <DropdownItem className={s.dropdownProfileItem}>
                <ProfileIcon />
                <span>Profile</span>
              </DropdownItem>
            </Link>
            {/* <NavItem> */}
            <NavLink onClick={() => doLogout()} href="#">
              <button
                className="btn btn-primary rounded-pill mx-auto logout-btn"
                type="submit"
              >
                <img src={logoutIcon} alt="Logout" />
                <span className="ml-1">Logout</span>
              </button>
            </NavLink>
            {/* </NavItem> */}
          </DropdownMenu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
};

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
  sidebarOpened: PropTypes.bool,
};

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
  };
}

export default withRouter(connect(mapStateToProps)(Header));
