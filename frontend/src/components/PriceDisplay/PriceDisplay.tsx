import styles from './PriceDisplay.module.css';
import { usePriceDisplay } from '../../hooks/usePriceDisplay';
import { formatPrice, formatTime } from '../../utils/format';

export function PriceDisplay() {
	const { ticker, currentPrice, delta, deltaPct, lastTimestamp, connected } = usePriceDisplay();

	if (!ticker) {
		return null;
	}

	const deltaClass = delta == null ? '' : delta > 0 ? styles.up : delta < 0 ? styles.down : '';

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<span className={styles.ticker}>{ticker}</span>
				<span className={`${styles.badge} ${connected ? styles.live : styles.offline}`}>
					{connected ? 'LIVE' : 'OFFLINE'}
				</span>
			</div>

			{currentPrice != null ? (
				<div className={styles.priceRow}>
					<span className={`${styles.price} ${deltaClass}`}>
						{formatPrice(currentPrice, ticker)}
					</span>
					{deltaPct != null && (
						<span className={`${styles.delta} ${deltaClass}`}>
							{delta! >= 0 ? '+' : ''}
							{deltaPct.toFixed(2)}%
						</span>
					)}
				</div>
			) : (
				<div className={styles.skeleton} />
			)}

			{lastTimestamp != null && (
				<p className={styles.timestamp}>Last update: {formatTime(lastTimestamp)}</p>
			)}
		</div>
	);
}
