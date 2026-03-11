import styles from './Loader.module.css'

export default function Loader() {
  return (
    <div className={styles.wrap}>
      <div className={styles.ring}></div>
      <p className={styles.text}>Loading...</p>
    </div>
  )
}