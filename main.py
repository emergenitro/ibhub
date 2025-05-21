from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import openai
import dotenv
import os

dotenv.load_dotenv()

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

loader = PyPDFLoader('./chemsg.pdf')
docs = loader.load()
# print(docs[0])

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
    is_separator_regex=False,
)

texts = text_splitter.split_documents(docs)

client = openai.OpenAI()

system_prompt = """
You are a helpful assistant that can answer questions about IBDP Chemistry at Standard and Higher Level. You will also be tasked at creating similar past paper questions only at the IB level.
These questions will be based on the content of the document provided to you. Don't make up any information that is not in the document. If you are unsure about something, please say "I don't know" or "I am not sure".
-----------------
The data:
{texts}
"""

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "Make me a set of 5 mCQ questions on the topic of reaction mechanisms, with specific Sn1 and Sn2 reactions, electrophilic addition and substitution."},
    ],
)

print(response.choices[0].message.content)