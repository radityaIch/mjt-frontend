import React from "react";
import FooterIcon from "../Icons/FooterIcon";
import s from "./Footer.module.scss";

const Footer = () => {
  const d = new Date();
  let year = d.getFullYear();

  return (
    <div className={s.footer}>
      <span className={s.footerLabel}>
        {year} &copy; Flatlogic. Hand-crafted & Made with
      </span>
      <FooterIcon />
    </div>
  );
};

export default Footer;
