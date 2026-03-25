import { Navigate } from 'react-router';
import { useAuthContext } from '../../context/AuthContext';
import { useLoginForm } from '../../hooks/useLoginForm';
import styles from './LoginPage.module.css';

export function LoginPage() {
	const { user } = useAuthContext();
	const { username, setUsername, password, setPassword, error, isSubmitting, handleSubmit } =
		useLoginForm();

	if (user) return <Navigate to="/dashboard" replace />;

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<div className={styles.brand}>
					<h1 className={styles.title}>Trading Dashboard</h1>
					<p className={styles.subtitle}>Sign in to your account</p>
				</div>

				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.field}>
						<label className={styles.label} htmlFor="username">
							Username
						</label>
						<input
							id="username"
							className={styles.input}
							type="text"
							autoComplete="username"
							autoFocus
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							disabled={isSubmitting}
							placeholder="Enter username"
						/>
					</div>

					<div className={styles.field}>
						<label className={styles.label} htmlFor="password">
							Password
						</label>
						<input
							id="password"
							className={styles.input}
							type="password"
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={isSubmitting}
							placeholder="Enter password"
						/>
					</div>

					{error && <p className={styles.error}>{error}</p>}

					<button className={styles.button} type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Signing in…' : 'Sign in'}
					</button>
				</form>

				<p className={styles.hint}>
					Demo — <strong>admin</strong> / password123 &nbsp;·&nbsp;{' '}
					<strong>trader</strong> / trade456
				</p>
			</div>
		</div>
	);
}
