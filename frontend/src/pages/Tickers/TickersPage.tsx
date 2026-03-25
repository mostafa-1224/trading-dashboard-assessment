import { useNavigate } from 'react-router';
import { useTickerInfo, useTickers } from '../../hooks/useMarketData';
import { formatPrice } from '../../utils/format';
import styles from './TickersPage.module.css';

export function TickersPage() {
	const navigate = useNavigate();
	const { data: infoList = [], isPending, isError } = useTickerInfo();
	const { data: summaries = [] } = useTickers();

	const priceMap = Object.fromEntries(summaries.map((s) => [s.ticker, s]));

	function handleRowClick(ticker: string) {
		navigate(`/dashboard?ticker=${ticker}`);
	}

	return (
		<main className={styles.main}>
			<header className={styles.pageHeader}>
				<h2 className={styles.title}>All Tickers</h2>
				<p className={styles.subtitle}>
					{infoList.length} instruments — click any row to open on the dashboard
				</p>
			</header>

			{isError && <p className={styles.error}>Failed to load ticker information.</p>}

			<div className={styles.tableWrapper}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Ticker</th>
							<th>Name</th>
							<th>Exchange</th>
							<th>Asset Class</th>
							<th>Sector</th>
							<th>Price</th>
							<th className={styles.right}>Change</th>
						</tr>
					</thead>
					<tbody>
						{isPending
							? Array.from({ length: 8 }).map((_, i) => (
									<tr key={i} className={styles.skeletonRow}>
										{Array.from({ length: 7 }).map((__, j) => (
											<td key={j}>
												<span className={styles.skeletonCell} />
											</td>
										))}
									</tr>
								))
							: infoList.map((info) => {
									const summary = priceMap[info.ticker];
									const delta = summary
										? summary.currentPrice - summary.previousPrice
										: null;
									const deltaPct =
										delta !== null && summary
											? (delta / summary.previousPrice) * 100
											: null;
									const isUp = delta !== null && delta > 0;
									const isDown = delta !== null && delta < 0;
									const changeClass = isUp
										? styles.up
										: isDown
											? styles.down
											: '';

									return (
										<tr
											key={info.ticker}
											className={styles.row}
											onClick={() => handleRowClick(info.ticker)}
										>
											<td>
												<span className={styles.tickerBadge}>
													{info.ticker}
												</span>
											</td>
											<td className={styles.name}>{info.name}</td>
											<td className={styles.meta}>{info.exchange}</td>
											<td className={styles.meta}>{info.assetClass}</td>
											<td className={styles.meta}>{info.sector}</td>
											<td className={`${styles.meta} ${changeClass}`}>
												{summary
													? formatPrice(summary.currentPrice, info.ticker)
													: '—'}
											</td>
											<td className={`${styles.right} ${changeClass}`}>
												{deltaPct !== null
													? `${isUp ? '+' : ''}${deltaPct.toFixed(2)}%`
													: '—'}
											</td>
										</tr>
									);
								})}
					</tbody>
				</table>
			</div>
		</main>
	);
}
