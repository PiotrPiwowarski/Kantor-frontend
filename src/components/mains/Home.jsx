import styles from './mains.module.css';
import { HomeBar } from '../bars/HomeBar';
import { LoginForm } from '../forms/LoginForm';
import { RegistrationForm } from '../forms/RegistrationForm';
import { useState } from 'react';

export const Home = () => {
	const [activePage, setActivePage] = useState('login');

	return (
		<div className={styles.page}>
			<HomeBar />
			{activePage === 'login' ? (
				<LoginForm setActivePage={setActivePage} />
			) : (
				<RegistrationForm setActivePage={setActivePage} />
			)}
		</div>
	);
};
