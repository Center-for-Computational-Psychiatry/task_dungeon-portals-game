const ENV = process.env.NODE_ENV || 'development'; // Default to 'development' if NODE_ENV is not set

const config = {
    development: {
        apiBaseUrl: 'http://localhost:5000'
    },
    production: {
        apiBaseUrl: 'https://dungeons-and-portals.onrender.com/'
    },
    // Add more environments as needed
};

export default config[ENV];
