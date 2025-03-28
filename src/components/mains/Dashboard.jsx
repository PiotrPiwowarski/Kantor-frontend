import { ApplicationBar } from "../bars/ApplicationBar";
import { Account } from "../subpages/Account";
import styles from "./mains.module.css";

export const Dashboard = () => {
  return (
    <div className={styles.background}>
      <ApplicationBar />
      <Account />
    </div>
  );
};
