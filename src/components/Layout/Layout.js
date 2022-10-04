// -- React and related libs
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Redirect } from "react-router";

// -- Third Party Libs
import PropTypes from "prop-types";

// -- Custom Components
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import Breadcrumbs from "../Breadbrumbs/Breadcrumbs";
import Dashboard from "../../pages/dashboard/Dashboard";
import Armada from "../../pages/armada/Armada";
import FormArmada from "../../pages/armada/FormArmada";
import Clients from "../../pages/clients/Clients";
import FormClient from "../../pages/clients/FormClient";
import Services from "../../pages/services/Services";
import FormService from "../../pages/services/FormService";
import Areas from "../../pages/areas/Areas";
import FormArea from "../../pages/areas/FormArea";
import Team from "../../pages/team/Team";
import FormTeam from "../../pages/team/FormTeam";
import PriceList from "../../pages/pricelist/PriceList";
import FormPriceList from "../../pages/pricelist/FormPriceList";
import Contacts from "../../pages/contacts/Contacts";
import FormContact from "../../pages/contacts/FormContact";
import Users from "../../pages/users/Users";
import FormUser from "../../pages/users/FormUser";
import AboutUs from "../../pages/aboutus/AboutUs";
import FormAboutUs from "../../pages/aboutus/FormAboutUs";
import FormMission from "../../pages/aboutus/FormMission";
import Profile from "../../pages/profile/Profile";
import Articles from "../../pages/articles/Articles";
import FormArticle from "../../pages/articles/FormArticle";
import Brand from "../../pages/brand/Brand";
import { getLoggedUser } from "../../api/UserAPI";
import { logoutUser } from "../../actions/auth";
import { toast } from "react-toastify";
import Notification from "../Notification/Notification";
import { notificationOptions } from "../utils/utils";
import FormPhoto from "../../pages/aboutus/FormPhoto";
import FormServiceGallery from "../../pages/services/FormServiceGallery";

// -- Component Styles
import s from "./Layout.module.scss";
import Covers from "../../pages/covers/Covers";
import FormCover from "../../pages/covers/FormCover";
import Pros from "../../pages/pros/Pros";
import FormPros from "../../pages/pros/FormPros";

const Layout = (props) => {
  const userLevel = parseInt(localStorage.getItem("level"));
  const [userData, setUserData] = useState();

  const doLogout = () => {
    props.dispatch(logoutUser());
  };

  useEffect(async () => {
    const response = await getLoggedUser();
    setUserData(response.data.data);
    if (response.status === 401) {
      doLogout();
      if (response.data.message === "Unauthorized")
        toast(
          <Notification
            type="warning"
            message="Sesi telah habis! Mohon login kembali"
            withIcon
          />,
          notificationOptions
        );
    }
  }, []);

  return (
    <div className={s.root}>
      <div className={s.wrap}>
        <Header userData={userData} />
        <Sidebar userData={userData} />
        <main className={s.content}>
          <Breadcrumbs url={props.location.pathname} />
          <Switch>
            <Route path="/dashboard" exact component={Dashboard} />

            {/* Armada Routes */}
            <Route path="/dashboard/armada" exact component={Armada} />
            <Route
              path="/dashboard/armada/tambah-armada"
              exact
              component={FormArmada}
            />
            <Route
              path="/dashboard/armada/edit-armada/:id"
              exact
              component={FormArmada}
            />

            {/* Client Routes */}
            <Route path="/dashboard/klien" exact component={Clients} />
            <Route
              path="/dashboard/klien/tambah-klien"
              exact
              component={FormClient}
            />
            <Route
              path="/dashboard/klien/edit-klien/:id"
              exact
              component={FormClient}
            />

            {/* Cover Routes */}
            <Route path="/dashboard/cover" exact component={Covers} />
            <Route
              path="/dashboard/cover/tambah-cover"
              exact
              component={FormCover}
            />
            <Route
              path="/dashboard/cover/edit-cover/:id"
              exact
              component={FormCover}
            />

            {/* Services Routes */}
            <Route path="/dashboard/layanan" exact component={Services} />
            <Route
              path="/dashboard/layanan/tambah-layanan"
              exact
              component={FormService}
            />
            <Route
              path="/dashboard/layanan/tambah-foto"
              exact
              component={FormServiceGallery}
            />
            <Route
              path="/dashboard/layanan/edit-layanan/:id"
              exact
              component={FormService}
            />
            <Route
              path="/dashboard/layanan/edit-foto/:id"
              exact
              component={FormServiceGallery}
            />

            {/* Area Routes */}
            <Route path="/dashboard/jangkauan-kota" exact component={Areas} />
            <Route
              path="/dashboard/jangkauan-kota/tambah-kota"
              exact
              component={FormArea}
            />
            <Route
              path="/dashboard/jangkauan-kota/edit-kota/semua-kota"
              exact
              component={FormArea}
            />

            {/* Team Routes */}
            <Route path="/dashboard/tim" exact component={Team} />
            <Route
              path="/dashboard/tim/tambah-tim"
              exact
              component={FormTeam}
            />
            <Route
              path="/dashboard/tim/edit-tim/:id"
              exact
              component={FormTeam}
            />

            {/* Price List Routes */}
            <Route path="/dashboard/daftar-harga" exact component={PriceList} />
            <Route
              path="/dashboard/daftar-harga/tambah-harga"
              exact
              component={FormPriceList}
            />
            <Route
              path="/dashboard/daftar-harga/edit-harga/:id"
              exact
              component={FormPriceList}
            />

            {/* Website Contact Routes */}
            <Route
              path="/dashboard/kontak-website"
              exact
              component={Contacts}
            />
            <Route
              path="/dashboard/kontak-website/tambah-kontak"
              exact
              component={FormContact}
            />
            <Route
              path="/dashboard/kontak-website/edit-kontak/:id"
              exact
              component={FormContact}
            />

            {/* About Us Routes */}
            <Route path="/dashboard/tentang-kami" exact component={AboutUs} />
            <Route
              path="/dashboard/tentang-kami/tambah-tentang-kami"
              exact
              component={FormAboutUs}
            />
            <Route
              path="/dashboard/tentang-kami/edit-tentang-kami/:id"
              exact
              component={FormAboutUs}
            />
            <Route
              path="/dashboard/tentang-kami/edit-foto/:id"
              exact
              component={FormPhoto}
            />

            {/* Mission Routes */}
            <Route
              path="/dashboard/tentang-kami/tambah-misi/:id"
              exact
              render={(props) => <FormMission {...props} isEdit={false} />}
            />
            <Route
              path="/dashboard/tentang-kami/edit-visi/:id"
              exact
              render={(props) => <FormAboutUs {...props} editVisi={true} />}
            />
            <Route
              path="/dashboard/tentang-kami/edit-misi/:id"
              exact
              render={(props) => <FormMission {...props} isEdit={true} />}
            />

            {/* Profile Routes */}
            <Route path="/dashboard/profile" exact component={Profile} />

            {/* Artikel Routes */}
            <Route path="/dashboard/artikel" exact component={Articles} />
            <Route
              path="/dashboard/artikel/tambah-artikel"
              exact
              component={FormArticle}
            />
            <Route
              path="/dashboard/artikel/edit-artikel/:id"
              exact
              component={FormArticle}
            />

            {/* Brand Settings Routes */}
            <Route
              path="/dashboard/brand"
              exact
              component={Brand}
            />

            {/* Pros Routes */}
            <Route
              path="/dashboard/pros"
              exact
              component={Pros}
            />
            <Route
              path="/dashboard/pros/tambah-pros"
              exact
              component={FormPros}
            />
            <Route
              path="/dashboard/pros/edit-pros/:id"
              exact
              component={FormPros}
            />

            {/* User Account Routes */}
            {userLevel === 2 && (
              <Switch>
                <Route
                  path="/dashboard/akun-pengguna"
                  exact
                  component={Users}
                />
                <Route
                  path="/dashboard/akun-pengguna/edit-pengguna/:id"
                  exact
                  component={FormUser}
                />
              </Switch>
            )}
            <Route path="*" exact render={() => <Redirect to="/error" />} />
          </Switch>
        </main>
        <Footer />
      </div>
    </div>
  );
};

Layout.propTypes = {
  sidebarOpened: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
  };
}

export default withRouter(connect(mapStateToProps)(Layout));
