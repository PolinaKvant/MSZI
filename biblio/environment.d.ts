declare global {
    namespace NodeJS {
        interface ProcessEnv {
            JWT_ACCESS_SECRET: string;
            JWT_REFRESH_SECRET: string;

            DB_HOST: string;
            DB_PORT: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_NAME: string;

            PORT: string;
        }
    }
}

export {}
