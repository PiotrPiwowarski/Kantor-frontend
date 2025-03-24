import styles from './mains.module.css';
import { ApplicationBar } from '../bars/ApplicationBar';
import { Account } from '../subpages/Account';

export const Dashboard = () => {

    return (
        <div className={styles.background}>
            <ApplicationBar />
            <Account />
        </div>
    );
} 