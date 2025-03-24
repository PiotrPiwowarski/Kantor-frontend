import styles from './buttons.module.css';
import { MenuIcon, UserIcon } from '../../assets/Icons';

export const AcceptButton = ({label, onClick}) => <button className={styles.acceptBtn} onClick={onClick}>{label}</button>

export const TextButton = ({label, onClick}) => <button className={styles.textBtn} onClick={onClick}>{label}</button>

export const MenuButton = ({label, onClick}) => <button className={styles.menuBtn} onClick={onClick}>{label}</button>

export const AppMenuIconButton = ({onClick}) => <button className={styles.iconBtn} onClick={onClick}><MenuIcon /></button>

export const UserMenuIconButton = ({onClick}) => <button className={styles.iconBtn} onClick={onClick}><UserIcon /></button>