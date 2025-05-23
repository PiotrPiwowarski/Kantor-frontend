import { MenuButton } from "../buttons/Button";
import styles from "./menus.module.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export const UserMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const handleMyAccountBtn = () => {
    navigate("/dashboard");
  };

  const handleLogoutBtn = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      localStorage.removeItem("accountId");
      navigate("/");
      return;
    }
    await axios.post(
      "http://localhost:8080/api/accounts/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    localStorage.removeItem("accountId");
    localStorage.removeItem("jwt");
    navigate("/");
  };

  return (
    <div className={styles.menu}>
      <MenuButton
        label="Moje konto"
        onClick={handleMyAccountBtn}
        isActive={path === "/dashboard"}
      />
      <MenuButton
        label="Wyloguj się"
        onClick={handleLogoutBtn}
        isActive={path === "/"}
      />
    </div>
  );
};
