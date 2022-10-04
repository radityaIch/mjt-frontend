import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import s from "./Sidebar.module.scss";
import LinksGroup from "./LinksGroup/LinksGroup.js";
import { changeActiveSidebarItem } from "../../actions/navigation.js";
import cn from "classnames";

const Sidebar = (props) => {
  const { activeItem = "", ...restProps } = props;

  const [burgerSidebarOpen, setBurgerSidebarOpen] = useState(false);

  const checkUserLevel = () => {
    const level = props?.userData?.level;
    return level === "2" ? true : false;
  };

  useEffect(() => {
    if (props.sidebarOpened) {
      setBurgerSidebarOpen(true);
    } else {
      setTimeout(() => {
        setBurgerSidebarOpen(false);
      }, 0);
    }
  }, [props.sidebarOpened]);

  return (
    <nav className={cn(s.root, { [s.sidebarOpen]: burgerSidebarOpen })}>
      <header className={s.logo}>
        <span className={s.title}>MJT Dashboard</span>
      </header>
      <ul className={s.nav}>
        <LinksGroup
          onActiveSidebarItemChange={(activeItem) =>
            props.dispatch(changeActiveSidebarItem(activeItem))
          }
          activeItem={props.activeItem}
          header="Dashboard"
          isHeader
          iconName={<i className={"eva eva-home-outline"} />}
          link="/dashboard"
          index="dashboard"
        // badge="9"
        />
        <h5 className={s.navTitle}>MENU</h5>
        <LinksGroup
          onActiveSidebarItemChange={(activeItem) =>
            props.dispatch(changeActiveSidebarItem(activeItem))
          }
          activeItem={props.activeItem}
          header="Layanan"
          isHeader
          iconName={<i className={"eva eva-keypad-outline"} />}
          link="/dashboard/layanan"
          index="layanan"
        />
        <LinksGroup
          onActiveSidebarItemChange={(activeItem) =>
            props.dispatch(changeActiveSidebarItem(activeItem))
          }
          activeItem={props.activeItem}
          header="Armada"
          isHeader
          iconName={<i className={"eva eva-car-outline"} />}
          link="/dashboard/armada"
          index="armada"
        />
        <LinksGroup
          onActiveSidebarItemChange={(activeItem) =>
            props.dispatch(changeActiveSidebarItem(activeItem))
          }
          activeItem={props.activeItem}
          header="Klien"
          isHeader
          iconName={<i className={"eva eva-link-2-outline"} />}
          link="/dashboard/klien"
          index="klien"
        />
        <LinksGroup
          onActiveSidebarItemChange={(activeItem) =>
            props.dispatch(changeActiveSidebarItem(activeItem))
          }
          activeItem={props.activeItem}
          header="Artikel/Blog"
          isHeader
          iconName={<i className={"eva eva-file-text-outline"} />}
          link="/dashboard/artikel"
          index="artikel"
        />
        <LinksGroup
          onActiveSidebarItemChange={(activeItem) =>
            props.dispatch(changeActiveSidebarItem(activeItem))
          }
          activeItem={props.activeItem}
          header="Daftar Harga"
          isHeader
          iconName={<i className={"eva eva-pricetags-outline"} />}
          link="/dashboard/daftar-harga"
          index="daftar-harga"
        />
        <LinksGroup
          onActiveSidebarItemChange={(activeItem) =>
            props.dispatch(changeActiveSidebarItem(activeItem))
          }
          activeItem={props.activeItem}
          header="Halaman Web"
          isHeader
          iconName={<i className={"eva eva-browser-outline"} />}
          link="/dashboard/website-pages"
          index="website-pages"
          childrenLinks={[
            {
              header: "Brand",
              link: "/dashboard/brand",
            },
            {
              header: "Pros",
              link: "/dashboard/pros",
            },
            {
              header: "Cover Landing",
              link: "/dashboard/cover",
            },
            {
              header: "Jangkauan",
              link: "/dashboard/jangkauan-kota",
            },
            {
              header: "Tim",
              link: "/dashboard/tim",
            },
            {
              header: "Tentang Kami",
              link: "/dashboard/tentang-kami",
            },
          ]}
        />
        <LinksGroup
          onActiveSidebarItemChange={(activeItem) =>
            props.dispatch(changeActiveSidebarItem(activeItem))
          }
          activeItem={props.activeItem}
          header="Kontak Website"
          isHeader
          iconName={<i className={"eva eva-phone-outline"} />}
          link="/dashboard/kontak-website"
          index="kontak-website"
        />
        {checkUserLevel() ? (
          <>
            <h5 className={s.navTitle}>Lainnya</h5>
            <LinksGroup
              onActiveSidebarItemChange={(activeItem) =>
                props.dispatch(changeActiveSidebarItem(activeItem))
              }
              activeItem={props.activeItem}
              header="Akun Pengguna"
              isHeader
              iconName={<i className={"eva eva-people-outline"} />}
              link="/dashboard/akun-pengguna"
              index="akun-pengguna"
            />
          </>
        ) : (
          ""
        )}
      </ul>
    </nav>
  );
};

Sidebar.propTypes = {
  sidebarOpened: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  activeItem: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    activeItem: store.navigation.activeItem,
  };
}

export default withRouter(connect(mapStateToProps)(Sidebar));
