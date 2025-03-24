import styles from './forms.module.css';
import { AcceptButton, TextButton } from '../buttons/Button';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const LoginForm = ({ setActivePage }) => {
	const navigate = useNavigate();

	const [error, setError] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLoginBtn = async () => {
		if (email === '' || password === '') {
			setError('Należy wypełnić wszystkie pola formularza');
			return;
		}

		const loginDto = {
			email,
			password,
		};

		try {
			const response = await axios.post(
				'http://localhost:8080/api/accounts/login',
				loginDto
			);
			localStorage.setItem('jwt', response.data.token);
			localStorage.setItem('accountId', response.data.accountId);
			navigate('/dashboard');
		} catch (e) {
			setError('Błąd logowania');
		}
	};

	return (
		<div className={styles.content}>
			<h1>Logowanie.</h1>
			{error && <p className={styles.error}>{error}</p>}
			<label>
				Podaj email
				<input
					type='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</label>
			<label>
				Podaj hasło
				<input
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</label>
			<p>
				Nie masz jeszcze konta?{' '}
				<TextButton
					label='Zarejestruj się!'
					onClick={() => setActivePage('registration')}
				/>
			</p>
			<AcceptButton
				label='Zaloguj się'
				onClick={handleLoginBtn}
			/>
		</div>
	);
};
