import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import styles from './PriceChart.module.css';
import { usePriceChart } from '../../hooks/usePriceChart';
import { formatChartPrice, formatChartTime } from '../../utils/format';

export function PriceChart() {
	const { data, ticker, loading, yDomain } = usePriceChart();

	if (loading) {
		return (
			<div className={styles.container}>
				<div className={styles.skeleton} />
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div className={styles.container}>
				<p className={styles.empty}>Waiting for data…</p>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<h3 className={styles.title}>{ticker} — Price History</h3>
			<ResponsiveContainer width="100%" height={280}>
				<LineChart data={data} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
					<XAxis
						dataKey="timestamp"
						tickFormatter={formatChartTime}
						tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
						tickLine={false}
						minTickGap={60}
					/>
					<YAxis
						domain={yDomain}
						tickFormatter={formatChartPrice}
						tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
						tickLine={false}
						axisLine={false}
						width={72}
					/>
					<Tooltip
						formatter={(value: number) => [formatChartPrice(value), 'Price']}
						labelFormatter={(ts: number) => formatChartTime(ts)}
						contentStyle={{
							background: 'var(--surface)',
							border: '1px solid var(--border)',
							borderRadius: '6px',
							fontSize: '0.8125rem',
						}}
					/>
					<Line
						type="monotone"
						dataKey="price"
						stroke="var(--accent)"
						strokeWidth={1.5}
						dot={false}
						isAnimationActive={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
