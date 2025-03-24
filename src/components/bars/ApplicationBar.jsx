import styles from './bars.module.css';
import { ReactComponent as Logo } from '../../assets/Kantor.svg';
import { AppMenuIconButton, UserMenuIconButton } from '../buttons/Button';


export const ApplicationBar = ({ setActiveMenu }) => {
	return (
		<div className={`${styles.bar} ${styles.application}`}>
			<AppMenuIconButton onClick={() => setActiveMenu('app')} />
			<Logo className={styles.logo} />
			<UserMenuIconButton onClick={() => setActiveMenu('user')} />
		</div>
	);
};
