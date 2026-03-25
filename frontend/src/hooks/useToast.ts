import { useState, useCallback } from 'react';

export type ToastType = 'alert' | 'info';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

const DISMISS_AFTER_MS = 5000;

export function useToast() {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const dismiss = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const addToast = useCallback(
		(message: string, type: ToastType = 'info') => {
			const id = crypto.randomUUID();
			setToasts((prev) => [...prev, { id, message, type }]);
			setTimeout(() => dismiss(id), DISMISS_AFTER_MS);
		},
		[dismiss],
	);

	return { toasts, addToast, dismiss };
}
