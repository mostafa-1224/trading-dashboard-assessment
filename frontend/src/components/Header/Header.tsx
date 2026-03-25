import { NavLink } from 'react-router';
import { useAuthContext } from '../../context/AuthContext';
import styles from './Header.module.css';

export function Header() {
	const { user, logout } = useAuthContext();

	return (
		<header className={styles.header}>
			<div className={styles.inner}>
				<div className={styles.left}>
					<h1 className={styles.logo}>Trading Dashboard</h1>
					{user && (
						<nav className={styles.nav}>
							<NavLink
								to="/dashboard"
								className={({ isActive }) =>
									`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
								}
							>
								Dashboard
							</NavLink>
							<NavLink
								to="/tickers"
								className={({ isActive }) =>
									`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
								}
							>
								Tickers
							</NavLink>
						</nav>
					)}
				</div>
				{user && (
					<div className={styles.userArea}>
						<span className={styles.displayName}>{user.displayName}</span>
						<button className={styles.logoutButton} onClick={logout}>
							Sign out
						</button>
					</div>
				)}
			</div>
		</header>
	);
}
