import os
from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv

# cargar variables de entorno
load_dotenv()
app = Flask(__name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    if not user_message:
        return jsonify({"respuesta": "Por favor escribe algo para poder ayudarte."})

    try:
        # Llamada a OpenAI
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": (
                    "Eres el Asistente Virtual del Instituto Tecnológico CICA. "
                    "Ayudas a aspirantes, estudiantes y egresados en temas de matrícula, "
                    "carreras, horarios, trámites y servicios institucionales. "
                    "Responde de forma clara y cordial, y sugiere preguntas relacionadas al final."
                )},
                {"role": "user", "content": user_message}
            ],
            max_tokens=300,
            temperature=0.7
        )

        respuesta = response.choices[0].message.content.strip()
        return jsonify({"respuesta": respuesta})

    except Exception as e:
        return jsonify({"respuesta": f"Error en el servidor: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True)
