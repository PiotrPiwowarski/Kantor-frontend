import styles from './buttons.module.css';

export const AcceptButton = ({label, onClick}) => <button className={styles.acceptBtn} onClick={onClick}>{label}</button>

export const TextButton = ({label, onClick}) => <button className={styles.textBtn} onClick={onClick}>{label}</button>