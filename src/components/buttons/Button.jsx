import styles from './buttons.module.css'

export const AcceptButton = ({label}) => <button className={styles.acceptBtn}>{label}</button>

export const TextButton = ({label}) => <button className={styles.textBtn}>{label}</button>