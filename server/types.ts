export interface Response<T> {
	data: T;
}

export interface Note {
	id: string;
	text: string;
	createdAt: number;
	expiresAt?: number | null;
}
