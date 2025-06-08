from flask import Blueprint, request, jsonify
from functools import wraps
import os
import uuid
import time
from datetime import datetime, timedelta
import redis
import json

ad_blueprint = Blueprint("ads", __name__)

ad_sessions = redis.Redis.from_url(os.getenv("REDIS_URL"))


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


@ad_blueprint.route("/request-ad", methods=["POST"])
@auth_required
def request_ad():
    session_id = str(uuid.uuid4())

    session_data = {
        "created_at": datetime.now().isoformat(),
        "completed": False,
        "expires_at": (datetime.now() + timedelta(minutes=10)).isoformat(),
    }

    ad_sessions.setex(f"ad_session:{session_id}", 600, json.dumps(session_data))

    return jsonify({
        "success": True,
        "ad_session_id": session_id,
        "ad_unit_id"
