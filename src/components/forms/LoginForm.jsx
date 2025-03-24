import styles from './forms.module.css';
import { AcceptButton, TextButton } from '../buttons/Button';

export const LoginForm = ({ setActivePage }) => {
	return (
		<div className={styles.content}>
			<h1>Logowanie</h1>
			<label>
				Podaj email
				<input
					type='email'
					value={null}
					onChange={null}
				/>
			</label>
			<label>
				Podaj hasło
				<input
					type='password'
					value={null}
					onChange={null}
				/>
			</label>
			<p>
				Nie masz jeszcze konta?{' '}
				<TextButton
					label='Zarejestruj się!'
					onClick={() => setActivePage('registration')}
				/>
			</p>
			<AcceptButton label='Zaloguj się' />
		</div>
	);
};
