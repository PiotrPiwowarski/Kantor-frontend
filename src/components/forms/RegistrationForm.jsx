import styles from './forms.module.css';
import { AcceptButton, TextButton } from '../buttons/Button';
import { useState } from 'react';
import axios from 'axios';

export const RegistrationForm = ({ setActivePage }) => {
	const [error, setError] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeatedPassword, setRepeatedPassword] = useState('');

	const handleRegisterBtn = async () => {
		if (
			firstName === '' ||
			lastName === '' ||
			email === '' ||
			password === '' ||
			repeatedPassword === ''
		) {
			setError('Należy wypełnić wszystkie pola formularza');
			return;
		}

		if (password !== repeatedPassword) {
			setError('Hasła muszą być takie same');
			return;
		}

		const addAccountDto = {
			firstName,
			lastName,
			email,
			password,
		};

		try {
			await axios.post(
				'http://localhost:8080/api/accounts/register',
				addAccountDto
			);
			setActivePage('login');
		} catch (e) {
			setError('Błąd rejestracji');
		}
	};

	return (
		<div className={styles.content}>
			<h1>Rejestracja.</h1>
			{error && <p className={styles.error}>{error}</p>}
			<label>
				Podaj imię
				<input
					type='text'
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
				/>
			</label>
			<label>
				Podaj nazwisko
				<input
					type='text'
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
				/>
			</label>
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
			<label>
				Powtórz hasło
				<input
					type='password'
					value={repeatedPassword}
					onChange={(e) => setRepeatedPassword(e.target.value)}
				/>
			</label>
			<p>
				Masz już konto?{' '}
				<TextButton
					label='Zaloguj się!'
					onClick={() => setActivePage('login')}
				/>
			</p>
			<AcceptButton
				label='Zarejestruj się'
				onClick={handleRegisterBtn}
			/>
		</div>
	);
};
