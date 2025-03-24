import styles from './menus.module.css';
import { MenuButton } from '../buttons/Button';

export const AppMenu = () => {
    return (
        <div className={styles.menu}>
            <MenuButton label='Mój portfel' />
            <MenuButton label='Zakup waluty' />
            <MenuButton label='Moje transakcje' />
            <MenuButton label='Kursy walut' />
        </div>
    );
}