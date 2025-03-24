import styles from './menus.module.css';
import { MenuButton } from '../buttons/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const UserMenu = () => {
	const navigate = useNavigate();

	const handleMyAccountBtn = () => {
        
    };

	const handleLogoutBtn = async () => {
		const jwt = localStorage.getItem('jwt');
        if(!jwt) {
			localStorage.removeItem('accountId');
            navigate('/');
            return;
        }
		await axios.post(
            'http://localhost:8080/api/accounts/logout',
            {},
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );
        localStorage.removeItem('accountId');
        localStorage.removeItem('jwt');
		navigate('/');
	};

	return (
		<div className={styles.menu}>
			<MenuButton
				label='Moje konto'
				onClick={handleMyAccountBtn}
			/>
			<MenuButton
				label='Wyloguj się'
				onClick={handleLogoutBtn}
			/>
		</div>
	);
};
