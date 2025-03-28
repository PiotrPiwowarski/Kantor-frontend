import { ReactComponent as Logo } from "../../assets/Kantor.svg";
import { AppMenuIconButton, UserMenuIconButton } from "../buttons/Button";
import { AppMenu } from "../menus/AppMenu";
import { UserMenu } from "../menus/UserMenu";
import styles from "./bars.module.css";
import { useState } from "react";

export const ApplicationBar = () => {
  const [activeMenu, setActiveMenu] = useState("app");
  return (
    <div className={`${styles.applicationBar} mb-[100px]`}>
      <AppMenuIconButton onClick={() => setActiveMenu("app")} />
      <Logo className={styles.logo} />
      <UserMenuIconButton onClick={() => setActiveMenu("user")} />
      {activeMenu === "app" ? <AppMenu /> : <UserMenu />}
    </div>
  );
};
