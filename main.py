from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from transformers import AutoTokenizer, AutoModelForCausalLM
import openai
import dotenv
import os
from transformers import pipeline

dotenv.load_dotenv()

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")
token = os.getenv("HUGGINGFACE_API_KEY")

docs=[]
for file in os.listdir('./data'):
    if file.endswith('.pdf'):
        pdf_path = os.path.join('./data', file)
        loader = PyPDFLoader(pdf_path)
        docs.extend(loader.load())

# print(docs[0])

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len,
    is_separator_regex=False,
)

texts = text_splitter.split_documents(docs)

# tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-R1-0528-Qwen3-8B")
# model = AutoModelForCausalLM.from_pretrained("deepseek-ai/DeepSeek-R1-0528-Qwen3-8B")

system_prompt = """
You are a helpful assistant that can answer questions about IBDP Chemistry at Standard and Higher Level. You will also be tasked at creating similar past paper questions only at the IB level.
These questions will be based on the content of the document provided to you. Use the past papers as a reference for the style and format, but do not copy any of the questions given. Only use the Subject Guide to make questions in the format of the past papers given. Don't make up any information that is not in the document. If you are unsure about something, please say "I don't know" or "I am not sure".
-----------------
The data:
{texts}
"""

# # Generate questions using the HuggingFace model
# prompt = system_prompt + "Make me a set of 5 MCQ questions on the topic of reaction mechanisms, with specific Sn1 and Sn2 reactions, electrophilic addition and substitution."
# inputs = tokenizer(prompt, return_tensors="pt")
# outputs = model.generate(**inputs, max_length=512, num_beams=4, early_stopping=True)
# hf_output = tokenizer.decode(outputs[0], skip_special_tokens=True)
# print(hf_output)

# print("HuggingFace Model Output:\n", hf_output)

client = openai.OpenAI()


response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": "Make me a set of 5 mCQ questions on the topic of chemical bonding."},
    ],
)

print(response.choices[0].message.content)