import styles from "./menus.module.css";
import { MenuButton } from "../buttons/Button";
import { useNavigate } from "react-router-dom";

export const AppMenu = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.menu}>
      <MenuButton onClick={() => navigate("/my-wallet")} label="Mój portfel" />
      <MenuButton label="Zakup waluty" />
      <MenuButton label="Moje transakcje" />
      <MenuButton label="Kursy walut" />
    </div>
  );
};
