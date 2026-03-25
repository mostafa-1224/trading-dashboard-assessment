import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TickerList } from './TickerList';
import { TickerSummary } from '../../types/market';
import * as useTickerListModule from '../../hooks/useTickerList';

const tickers: TickerSummary[] = [
	{ ticker: 'AAPL', currentPrice: 182.5, previousPrice: 181.0 },
	{ ticker: 'TSLA', currentPrice: 245.0, previousPrice: 248.0 },
	{ ticker: 'BTC-USD', currentPrice: 65000.0, previousPrice: 65000.0 },
];

describe('TickerList', () => {
	beforeEach(() => {
		vi.spyOn(useTickerListModule, 'useTickerList').mockReturnValue({
			tickers,
			selectedTicker: null,
			onSelect: vi.fn(),
			isPending: false,
			isError: false,
		});
	});

	it('renders all tickers', () => {
		render(<TickerList />);
		expect(screen.getByText('AAPL')).toBeInTheDocument();
		expect(screen.getByText('TSLA')).toBeInTheDocument();
		expect(screen.getByText('BTC-USD')).toBeInTheDocument();
	});

	it('calls onSelect with the ticker when clicked', () => {
		const onSelect = vi.fn();
		vi.spyOn(useTickerListModule, 'useTickerList').mockReturnValue({
			tickers,
			selectedTicker: null,
			onSelect,
			isPending: false,
			isError: false,
		});
		render(<TickerList />);
		fireEvent.click(screen.getByText('TSLA'));
		expect(onSelect).toHaveBeenCalledWith('TSLA');
	});

	it('shows skeleton when loading', () => {
		vi.spyOn(useTickerListModule, 'useTickerList').mockReturnValue({
			tickers: [],
			selectedTicker: null,
			onSelect: vi.fn(),
			isPending: true,
			isError: false,
		});
		render(<TickerList />);
		expect(screen.getByText('Tickers')).toBeInTheDocument();
		expect(screen.queryByRole('list')).not.toBeInTheDocument();
	});

	it('shows error message on fetch failure', () => {
		vi.spyOn(useTickerListModule, 'useTickerList').mockReturnValue({
			tickers: [],
			selectedTicker: null,
			onSelect: vi.fn(),
			isPending: false,
			isError: true,
		});
		render(<TickerList />);
		expect(screen.getByText('Failed to load tickers.')).toBeInTheDocument();
	});
});
