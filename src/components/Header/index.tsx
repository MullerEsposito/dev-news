import Link from "next/link";
import { useRouter } from 'next/router';
import { SignInButton } from "./SignInButton";
import styles from "./styles.module.scss";


export function Header() {
  const { asPath } = useRouter();
  const path = asPath.match(/\/\w*/);
  const active = {
    [path[0]]: styles.active
  }

  return (
    <header className={styles.container}>
      <div className={styles.content}>
        {/* <img src={"/images/logo.svg"} alt="ig.news"/> */}
        <p className={styles.title}>Müller's Blog</p>
        <nav>
          <Link href="/">
            <a className={active['/']}>Home</a>
          </Link>
          <Link href="/posts">
            <a className={active['/posts']}>Posts</a>
          </Link>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}