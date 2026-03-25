import styles from './AlertsPanel.module.css';
import { useAlertsPanel } from '../../hooks/useAlertsPanel';
import { PriceAlert } from '../../types/alert';

export function AlertsPanel() {
	const {
		tickerOptions,
		ticker,
		setTicker,
		direction,
		setDirection,
		threshold,
		setThreshold,
		formError,
		handleSubmit,
		activeAlerts,
		triggeredAlerts,
		deleteAlert,
		clearTriggered,
	} = useAlertsPanel();

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Alerts</h2>

			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.row}>
					<select
						className={styles.select}
						value={ticker}
						onChange={(e) => setTicker(e.target.value)}
					>
						{tickerOptions.map((t) => (
							<option key={t} value={t}>
								{t}
							</option>
						))}
					</select>

					<select
						className={styles.select}
						value={direction}
						onChange={(e) => setDirection(e.target.value as 'above' | 'below')}
					>
						<option value="above">↑ Above</option>
						<option value="below">↓ Below</option>
					</select>
				</div>

				<div className={styles.row}>
					<input
						className={styles.input}
						type="number"
						min="0"
						step="any"
						placeholder="Price threshold"
						value={threshold}
						onChange={(e) => setThreshold(e.target.value)}
					/>
					<button className={styles.addButton} type="submit">
						Add
					</button>
				</div>

				{formError && <p className={styles.formError}>{formError}</p>}
			</form>

			{activeAlerts.length > 0 && (
				<div className={styles.section}>
					<span className={styles.sectionLabel}>Active ({activeAlerts.length})</span>
					<ul className={styles.list}>
						{activeAlerts.map((alert) => (
							<AlertRow key={alert.id} alert={alert} onDelete={deleteAlert} />
						))}
					</ul>
				</div>
			)}

			{triggeredAlerts.length > 0 && (
				<div className={styles.section}>
					<div className={styles.sectionHeader}>
						<span className={styles.sectionLabel}>
							Triggered ({triggeredAlerts.length})
						</span>
						<button className={styles.clearButton} onClick={clearTriggered}>
							Clear
						</button>
					</div>
					<ul className={styles.list}>
						{triggeredAlerts.map((alert) => (
							<AlertRow
								key={alert.id}
								alert={alert}
								onDelete={deleteAlert}
								triggered
							/>
						))}
					</ul>
				</div>
			)}

			{activeAlerts.length === 0 && triggeredAlerts.length === 0 && (
				<p className={styles.empty}>No alerts set.</p>
			)}
		</div>
	);
}

interface AlertRowProps {
	alert: PriceAlert;
	onDelete: (id: string) => void;
	triggered?: boolean;
}

function AlertRow({ alert, onDelete, triggered = false }: AlertRowProps) {
	const threshold = alert.threshold.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 2,
	});

	return (
		<li className={`${styles.alertRow} ${triggered ? styles.triggeredRow : ''}`}>
			<span className={styles.alertInfo}>
				<span className={styles.alertTicker}>{alert.ticker}</span>
				<span
					className={`${styles.alertDir} ${alert.direction === 'above' ? styles.up : styles.down}`}
				>
					{alert.direction === 'above' ? '↑' : '↓'}
				</span>
				<span className={styles.alertThreshold}>{threshold}</span>
			</span>
			<button
				className={styles.deleteButton}
				onClick={() => onDelete(alert.id)}
				aria-label="Delete alert"
			>
				×
			</button>
		</li>
	);
}
