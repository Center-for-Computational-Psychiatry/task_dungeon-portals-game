import os

class Config:
    # Common aspects across all configurations
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'data')

class DevelopmentConfig(Config):
    DEBUG = True
    API_BASE_URL = 'http://localhost:5000'

class ProductionConfig(Config):
    DEBUG = False
    API_BASE_URL = 'https://dungeons-and-portals.onrender.com/'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}

def get_config():
    env = os.getenv('FLASK_ENV', 'development')
    return config.get(env, DevelopmentConfig)
