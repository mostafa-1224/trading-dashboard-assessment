import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '../../context/AuthContext';
import { Header } from '../Header/Header';
import styles from './AppLayout.module.css';

export function AppLayout() {
	const { user } = useAuthContext();

	if (!user) return <Navigate to="/login" replace />;

	return (
		<div className={styles.shell}>
			<Header />
			<Outlet />
		</div>
	);
}
