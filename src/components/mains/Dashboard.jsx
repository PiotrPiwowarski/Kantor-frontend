import styles from './mains.module.css';
import { ApplicationBar } from '../bars/ApplicationBar';
import {useState} from 'react';
import { AppMenu } from '../menus/AppMenu';
import { UserMenu } from '../menus/UserMenu';

export const Dashboard = () => {

    const [activeMenu, setActiveMenu] = useState('app');

    return (
        <div className={styles.background}>
            <ApplicationBar setActiveMenu={setActiveMenu} />
            {activeMenu === 'app' ? <AppMenu /> : <UserMenu />}
        </div>
    );
} 