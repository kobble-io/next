 export type User = {
	id: string;
	email: string;
	name: string | null;
	pictureUrl: string | null;
	isVerified: boolean;
	stripeId: string | null;
	updatedAt: Date;
	createdAt: Date;
};
