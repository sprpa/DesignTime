export interface AppConfig {
    apiBaseUrl: string;
    defaultTimeout: number;
}

const config: AppConfig = {
    apiBaseUrl: "http://10.26.1.52:5150/",
    defaultTimeout: 10000,
};

export default config;
