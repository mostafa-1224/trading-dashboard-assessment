export type AlertDirection = 'above' | 'below';

export interface PriceAlert {
	id: string;
	ticker: string;
	direction: AlertDirection;
	threshold: number;
	createdAt: number;
	triggered: boolean;
	triggeredAt?: number;
}
