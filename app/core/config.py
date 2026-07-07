from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SEC_USER_AGENT = os.getenv("SEC_USER_AGENT", "FinancialIntelligenceSystem contact@example.com")