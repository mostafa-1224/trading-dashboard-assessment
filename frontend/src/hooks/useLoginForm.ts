import { useState, useCallback, FormEvent } from 'react';
import { useAuthContext } from '../context/AuthContext';

export function useLoginForm() {
	const { login } = useAuthContext();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = useCallback(
		async (e: FormEvent) => {
			e.preventDefault();
			setError(null);

			if (!username.trim()) {
				setError('Username is required.');
				return;
			}
			if (!password) {
				setError('Password is required.');
				return;
			}

			setIsSubmitting(true);
			const result = await login(username, password);
			setIsSubmitting(false);

			if (!result.ok) {
				setError(result.error);
			}
		},
		[username, password, login],
	);

	return {
		username,
		setUsername,
		password,
		setPassword,
		error,
		isSubmitting,
		handleSubmit,
	};
}
