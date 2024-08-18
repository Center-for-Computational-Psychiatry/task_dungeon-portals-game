const ENV = window.ENV || 'development'; // Default to 'development' if ENV is not set

const config = {
    development: {
        apiBaseUrl: 'http://localhost:5000'
    },
    production: {
        apiBaseUrl: 'https://dungeons-and-portals.onrender.com/'
    },
    // Add more environments as needed
};

export const currentConfig = config[ENV];
