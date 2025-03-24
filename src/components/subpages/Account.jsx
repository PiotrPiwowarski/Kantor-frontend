import styles from './subpages.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AcceptButton } from '../buttons/Button';

export const Account = () => {
	const navigate = useNavigate();

	const [account, setAccount] = useState({});
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			const id = localStorage.getItem('accountId');
			if (!id) {
				setError('Błąd pobierania danych konta');
				return;
			}
			const jwt = localStorage.getItem('jwt');
			if (!jwt) {
				localStorage.removeItem('accountId');
				navigate('/');
			}
			try {
				const response = await axios.get(
					`http://localhost:8080/api/accounts/${id}`,
					{ headers: { Authorization: `Bearer ${jwt}` } }
				);
				setAccount(response.data);
			} catch (e) {
				setError('Błąd pobierania danych konta');
				return;
			}
		};
		return fetchData;
	}, []);

	return (
		<div className={styles.subpage}>
			<div className={styles.content}>
				<h1>Twoje konto.</h1>
				{error && <p className={styles.error}>{error}</p>}
				<ul className={styles.list}>
					<li>
						<strong>Imię</strong> {account.firstName}
					</li>
					<li>
						<strong>Nazwisko</strong> {account.lastName}
					</li>
					<li>
						<strong>Email</strong> {account.email}
					</li>
				</ul>
                <AcceptButton label='Edytuj' />
			</div>
		</div>
	);
};
