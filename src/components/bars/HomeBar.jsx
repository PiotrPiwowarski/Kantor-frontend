import styles from './bars.module.css';
import { ReactComponent as Logo } from '../../assets/Kantor.svg';

export const HomeBar = () => {
	return (
		<div className={`${styles.bar} ${styles.home}`}>
			<Logo className={styles.logo} />
		</div>
	);
};
