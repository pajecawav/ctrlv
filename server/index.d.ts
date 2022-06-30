declare namespace NodeJS {
	export interface ProcessEnv {
		DATABASE_URL?: string;
		PORT?: string | undefined;
		HOST?: string | undefined;
	}
}
