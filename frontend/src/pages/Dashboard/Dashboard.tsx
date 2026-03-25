import { ToastProvider } from '../../context/ToastContext';
import { AlertsProvider } from '../../context/AlertsContext';
import { DashboardProvider } from '../../context/DashboardContext';
import { TickerList } from '../../components/TickerList/TickerList';
import { AlertsPanel } from '../../components/AlertsPanel/AlertsPanel';
import { PriceDisplay } from '../../components/PriceDisplay/PriceDisplay';
import { PriceChart } from '../../components/PriceChart/PriceChart';
import { ToastContainer } from '../../components/ToastContainer/ToastContainer';
import styles from './Dashboard.module.css';

export function Dashboard() {
	return (
		<ToastProvider>
			<AlertsProvider>
				<DashboardProvider>
					<main className={styles.main}>
						<div className={styles.layout}>
							<aside className={styles.sidebar}>
								<AlertsPanel />
								<TickerList />
							</aside>
							<section className={styles.content}>
								<PriceDisplay />
								<PriceChart />
							</section>
						</div>
					</main>
					<ToastContainer />
				</DashboardProvider>
			</AlertsProvider>
		</ToastProvider>
	);
}
