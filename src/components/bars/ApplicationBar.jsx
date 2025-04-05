import { ReactComponent as Logo } from "../../assets/Kantor.svg";
import { AppMenuIconButton, UserMenuIconButton } from "../buttons/Button";
import { AppMenu } from "../menus/AppMenu";
import { UserMenu } from "../menus/UserMenu";
import styles from "./bars.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const ApplicationBar = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("app");
  return (
    <div className={`${styles.applicationBar} mb-[100px]`}>
      <AppMenuIconButton onClick={() => setActiveMenu("app")} />
      <Logo
        onClick={() => {
          navigate("/dashboard");
          setActiveMenu("user");
        }}
        className={`${styles.logo} cursor-pointer`}
      />
      <UserMenuIconButton onClick={() => setActiveMenu("user")} />
      {activeMenu === "app" ? <AppMenu /> : <UserMenu />}
    </div>
  );
};
