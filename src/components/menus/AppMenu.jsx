import { MenuButton } from "../buttons/Button";
import styles from "./menus.module.css";
import { useLocation, useNavigate } from "react-router-dom";

export const AppMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className={styles.menu}>
      <MenuButton
        onClick={() => navigate("/my-wallet")}
        label="Mój portfel"
        isActive={path === "/my-wallet"}
      />
      <MenuButton
        onClick={() => navigate("/currency-deposit")}
        label="Zakup waluty"
        isActive={path === "/currency-deposit"}
      />
      <MenuButton
        label="Moje transakcje"
        onClick={() => navigate("/my-transactions")}
        isActive={path === "/my-transactions"}
      />
      <MenuButton
        label="Kursy walut"
        onClick={() => navigate("/exchange-rates")}
        isActive={path === "/exchange-rates"}
      />
    </div>
  );
};
