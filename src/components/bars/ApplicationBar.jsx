import styles from './bars.module.css';
import { ReactComponent as Logo } from '../../assets/Kantor.svg';
import { AppMenuIconButton, UserMenuIconButton } from '../buttons/Button';
import {useState} from 'react';
import { AppMenu } from '../menus/AppMenu';
import { UserMenu } from '../menus/UserMenu';

export const ApplicationBar = () => {

	const [activeMenu, setActiveMenu] = useState('app');
	return (
		<div className={styles.applicationBar}>
			<AppMenuIconButton onClick={() => setActiveMenu('app')} />
			<Logo className={styles.logo} />
			<UserMenuIconButton onClick={() => setActiveMenu('user')} />
			{activeMenu === 'app' ? <AppMenu /> : <UserMenu />}
		</div>
	);
};
