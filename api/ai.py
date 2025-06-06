from flask import Blueprint, request, jsonify
from functools import wraps
import os
import json
from config import openai_client
from utils.files_processor import (
    extract_text_from_file,
    load_sample_essays,
)

api_blueprint = Blueprint("api", __name__)


def auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_required = request.headers.get("Authorization")
        if not auth_required:
            return jsonify({"error": "Authorization token is missing"}), 401
        if auth_required != os.getenv("AUTH_TOKEN"):
            return jsonify({"error": "Invalid authorization token"}), 403
        return f(*args, **kwargs)

    return decorated_function


try:
    from prompts.prompt_builder import create_evaluation_prompt, fix_entered_text
except ImportError:

    def create_evaluation_prompt(essay_text, sample_essays):
        return f"""You are an expert TOK essay evaluator following IB assessment criteria.

Please evaluate this TOK essay and provide detailed feedback.

Essay to evaluate:
{essay_text}

Please respond in JSON format with:
- overall_score (1-10)
- detailed_feedback
- criteria_scores (focus_understanding, knowledge_examples, analysis_evaluation, organization_clarity, tok_concepts)
- strengths (array)
- improvements (array)
- word_count (estimated)"""


@api_blueprint.route("/tokcheck", methods=["POST"])
@auth_required
def tokcheck():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400
        allowed_extensions = {".pdf", ".docx", ".txt"}
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            return jsonify(
                {
                    "error": f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
                }
            ), 400
        try:
            essay_text = extract_text_from_file(file, file_ext)
            essay_text = fix_entered_text(essay_text)
            if not essay_text.strip():
                return jsonify(
                    {"error": "No text could be extracted from the file"}
                ), 400
        except Exception as e:
            return jsonify({"error": f"Error processing file: {str(e)}"}), 500

        try:
            sample_essays = load_sample_essays()
        except Exception as e:
            return jsonify(
                {"error": f"Error loading reference materials: {str(e)}"}
            ), 500

        prompt = create_evaluation_prompt(essay_text, sample_essays)

        completion = openai_client.chat.completions.create(
            model=os.getenv("MODEL_NAME"),
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert IB TOK essay evaluator. Provide detailed, constructive feedback following IB assessment criteria. Always respond with valid JSON.",
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=4096,
            temperature=0.3,
            top_p=0.9,
            stream=False,
        )

        response_content = completion.choices[0].message.content

        try:
            evaluation_result = json.loads(response_content)
        except json.JSONDecodeError:
            evaluation_result = {
                "overall_score": "N/A",
                "detailed_feedback": response_content,
                "error": "Could not parse structured response",
            }

        return jsonify(
            {
                "success": True,
                "evaluation": evaluation_result,
                "essay_preview": essay_text[:200] + "..."
                if len(essay_text) > 200
                else essay_text,
            }
        ), 200

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@api_blueprint.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "service": "TOK Essay Evaluator"}), 200
