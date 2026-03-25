import styles from './ToastContainer.module.css';
import { useToastContext } from '../../context/ToastContext';

export function ToastContainer() {
	const { toasts, dismiss } = useToastContext();

	if (toasts.length === 0) return null;

	return (
		<div className={styles.container} aria-live="polite">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={`${styles.toast} ${toast.type === 'alert' ? styles.alertToast : styles.infoToast}`}
					onClick={() => dismiss(toast.id)}
					role="alert"
				>
					<span className={styles.icon}>{toast.type === 'alert' ? '🔔' : 'ℹ'}</span>
					<span className={styles.message}>{toast.message}</span>
					<button className={styles.close} aria-label="Dismiss">
						×
					</button>
				</div>
			))}
		</div>
	);
}
