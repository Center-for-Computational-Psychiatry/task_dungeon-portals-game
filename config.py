import os

class Config:
    # Common configurations
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
    FLASK_RUN_PORT = 5000

class DevelopmentConfig(Config):
    FLASK_DEBUG = True
    FLASK_RUN_HOST = 'localhost'
    API_BASE_URL = 'http://localhost:5000'

class ProductionConfig(Config):
    FLASK_DEBUG = False
    FLASK_RUN_HOST = '0.0.0.0'
    API_BASE_URL = 'https://dungeons-and-portals.onrender.com/'

# Dictionary to map environment names to configurations
config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}

# Get the environment from the environment variable or default to 'development'
def get_config():
    env = os.getenv('FLASK_ENV', 'development')
    return config_by_name.get(env, DevelopmentConfig)

