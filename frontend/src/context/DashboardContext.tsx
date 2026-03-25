import { createContext, useContext, ReactNode } from 'react';
import { useDashboard } from '../hooks/useDashboard';

type DashboardContextValue = ReturnType<typeof useDashboard>;

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
	const value = useDashboard();
	return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboardContext(): DashboardContextValue {
	const ctx = useContext(DashboardContext);
	if (ctx === null) {
		throw new Error('useDashboardContext must be used within a DashboardProvider');
	}
	return ctx;
}
