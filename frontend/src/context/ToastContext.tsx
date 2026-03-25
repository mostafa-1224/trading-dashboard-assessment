import { createContext, useContext, ReactNode } from 'react';
import { useToast } from '../hooks/useToast';

type ToastContextValue = ReturnType<typeof useToast>;

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
	const value = useToast();
	return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToastContext(): ToastContextValue {
	const ctx = useContext(ToastContext);
	if (ctx === null) {
		throw new Error('useToastContext must be used within a ToastProvider');
	}
	return ctx;
}
