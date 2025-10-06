from database import engine, Base
from models import User, Herb

Base.metadata.create_all(bind=engine)
print("Database tables created")
