import { createBrowserRouter, Navigate } from 'react-router';
import { AppLayout } from '../components/AppLayout/AppLayout';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { TickersPage } from '../pages/Tickers/TickersPage';
import { LoginPage } from '../pages/Login/LoginPage';

export const router = createBrowserRouter([
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{ index: true, element: <Navigate to="/dashboard" replace /> },
			{ path: 'dashboard', element: <Dashboard /> },
			{ path: 'tickers', element: <TickersPage /> },
		],
	},
]);
