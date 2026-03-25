import { createContext, useContext, ReactNode } from 'react';
import { useAlerts } from '../hooks/useAlerts';

type AlertsContextValue = ReturnType<typeof useAlerts>;

const AlertsContext = createContext<AlertsContextValue | null>(null);

export function AlertsProvider({ children }: { children: ReactNode }) {
	const value = useAlerts();
	return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export function useAlertsContext(): AlertsContextValue {
	const ctx = useContext(AlertsContext);
	if (ctx === null) {
		throw new Error('useAlertsContext must be used within an AlertsProvider');
	}
	return ctx;
}
