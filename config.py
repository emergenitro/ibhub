from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

openai_client = OpenAI(base_url=os.getenv("BASE_URL"), api_key=os.getenv("API_KEY"))
