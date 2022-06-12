import styles from './styles.module.scss'

export function Header() {
  return (
    <header className={styles.container}>
      <img src="/images/logo.png" alt="Logo" />
      <h1>spacetraveling</h1>
      <span>.</span>
    </header>
  )
}
