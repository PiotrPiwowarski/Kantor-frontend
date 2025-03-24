import styles from './menus.module.css';
import { MenuButton } from '../buttons/Button';

export const AppMenu = () => {
    return (
        <div className={styles.menu}>
            <MenuButton label='Dashboard' />
            <MenuButton label='Dashboard' />
            <MenuButton label='Dashboard' />
        </div>
    );
}