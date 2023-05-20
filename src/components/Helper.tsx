import styles from '../styles/Helper.module.css';

export default function Helper({ children }: { children: string }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.helper}>
        <span>{children}</span>
      </div>
    </div>
  );
}
