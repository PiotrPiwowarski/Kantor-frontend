import { MenuButton } from '../buttons/Button';
import styles from './menus.module.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export const UserMenu = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const path = location.pathname;

	const handleMyAccountBtn = () => {
		navigate('/dashboard');
	};

	const handleLogoutBtn = async () => {
		try {
			const jwt = localStorage.getItem('jwt');
			if (!jwt) {
				return;
			}

			await axios.post(
				'http://localhost:8080/api/accounts/logout',
				{},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${jwt}`,
					},
				}
			);
		} catch (e) {
			console.error(e.message);
		}
		try {
			localStorage.removeItem('jwt');
			localStorage.removeItem('accountId');
		} catch (e) {
			console.log(e.message);
		}
		navigate('/');
	};

	return (
		<div className={styles.menu}>
			<MenuButton
				label='Moje konto'
				onClick={handleMyAccountBtn}
				isActive={path === '/dashboard'}
			/>
			<MenuButton
				label='Wyloguj się'
				onClick={handleLogoutBtn}
				isActive={path === '/'}
			/>
		</div>
	);
};
