import styles from './TickerList.module.css';
import { useTickerList } from '../../hooks/useTickerList';
import { formatPrice } from '../../utils/format';

export function TickerList() {
	const { tickers, selectedTicker, onSelect, isPending, isError } = useTickerList();

	if (isError) {
		return (
			<div className={styles.container}>
				<p className={styles.error}>Failed to load tickers.</p>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Tickers</h2>
			{isPending ? (
				<div className={styles.skeletonList}>
					{[1, 2, 3].map((i) => (
						<div key={i} className={styles.skeletonItem} />
					))}
				</div>
			) : (
				<ul className={styles.list}>
					{tickers.map(({ ticker, currentPrice, previousPrice }) => (
						<li
							key={ticker}
							className={`${styles.item} ${selectedTicker === ticker ? styles.selected : ''}`}
							onClick={() => onSelect(ticker)}
						>
							<span className={styles.ticker}>{ticker}</span>
							<span
								className={`${styles.price} ${priceChangeClass(currentPrice, previousPrice, styles)}`}
							>
								{formatPrice(currentPrice, ticker)}
							</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

function priceChangeClass(current: number, previous: number, s: Record<string, string>): string {
	if (current > previous) return s.up;
	if (current < previous) return s.down;
	return '';
}
