from flask import Flask
import os
from dotenv import load_dotenv

load_dotenv()


def main():
    app = Flask(__name__)

    from api.ai import api_blueprint

    app.register_blueprint(api_blueprint)

    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    app.run(debug=True)


if __name__ == "__main__":
    main()
