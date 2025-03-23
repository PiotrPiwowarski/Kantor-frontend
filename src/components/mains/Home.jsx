import styles from './mains.module.css';
import { HomeBar } from '../bars/HomeBar';
import { LoginForm } from '../forms/LoginForm';

export const Home = () => {
    return (
        <div className={styles.background}>
            <HomeBar />
            <LoginForm />
        </div>
    );
}