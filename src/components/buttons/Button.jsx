import { MenuIcon, UserIcon } from "../../assets/Icons";
import styles from "./buttons.module.css";

export const AcceptButton = ({ label, onClick }) => (
  <button className={styles.acceptBtn} onClick={onClick}>
    {label}
  </button>
);

export const TextButton = ({ label, onClick }) => (
  <button className={styles.textBtn} onClick={onClick}>
    {label}
  </button>
);

export const MenuButton = ({ label, onClick, isActive }) => (
  <button
    className={`${styles.menuBtn} ${
      isActive ? "rounded-md py-1 !bg-white !text-purple-600" : ""
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export const AppMenuIconButton = ({ onClick }) => (
  <button className={styles.iconBtn} onClick={onClick}>
    <MenuIcon />
  </button>
);

export const UserMenuIconButton = ({ onClick }) => (
  <button className={styles.iconBtn} onClick={onClick}>
    <UserIcon />
  </button>
);
