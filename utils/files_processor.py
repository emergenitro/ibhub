import os
import json
import PyPDF2
from docx import Document
from io import BytesIO


def extract_text_from_file(file, file_ext):
    if file_ext == ".txt":
        return file.read().decode("utf-8")
    elif file_ext == ".pdf":
        return extract_text_from_file_pdf(file)
    elif file_ext in {".docx", ".doc"}:
        return extract_text_from_file_docx(file)
    else:
        return ValueError("Unsupported file type :(")


def extract_text_from_file_pdf(file):
    try:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
        return text.strip()
    except Exception as e:
        raise ValueError(f"Failed to extract from PDF: {str(e)} :(")


def extract_text_from_file_docx(file):
    try:
        doc = Document(BytesIO(file.read()))
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text.strip()
    except Exception as e:
        raise ValueError(f"Failed to extract from DOCX: {str(e)} :(")


def load_sample_essays():
    sample_essays = []
    if "tok" in __file__:
        datasets_dir = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), "datasets", "sample_essays_tok"
        )
    elif "ee" in __file__:
        datasets_dir = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), "datasets", "sample_essays_ee"
        )

    if not os.path.exists(datasets_dir):
        raise FileNotFoundError(
            f"Sample essays directory not found: {datasets_dir} (go make it pls)"
        )

    try:
        for filename in os.listdir(datasets_dir):
            if filename.endswith(".json"):
                with open(
                    os.path.join(datasets_dir, filename), "r", encoding="utf-8"
                ) as f:
                    essay_data = json.load(f)
                    sample_essays.append(essay_data)

        sample_essays.sort(key=lambda x: x.get("score", 0), reverse=True)
        return sample_essays
    except Exception as e:
        print(f"Failed to load sample essays: {str(e)}")
        return []
