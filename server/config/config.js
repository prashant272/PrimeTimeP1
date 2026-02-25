import dotenv from "dotenv";
dotenv.config();

export const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1/primetime_awards",
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET || "dev_primetime_secret_change_me",
    FRONTEND_URL: process.env.FRONTEND_URL || "https://www.globalhealthcareawards.com",
    ADMIN: {
        EMAIL: process.env.ADMIN_EMAIL,
        PASSWORD: process.env.ADMIN_PASSWORD,
        CREATE_SECRET: process.env.ADMIN_CREATE_SECRET,
    },
    AWS: {
        ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        REGION: process.env.AWS_REGION || "eu-north-1",
        BUCKET_NAME: process.env.AWS_S3_BUCKET || "pdf-storage-prime",
    },
    EMAIL: {
        HOST: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
        PORT: parseInt(process.env.BREVO_SMTP_PORT, 10) || 587,
        USER: process.env.BREVO_SMTP_USER || "apikey",
        PASS: process.env.BREVO_SMTP_PASS,
        FROM: process.env.BREVO_FROM_EMAIL || "noreply@globalhealthcareawards.com",
    },
    GOOGLE: {
        CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    },
    NODE_ENV: process.env.NODE_ENV || "development"
};

export default config;
