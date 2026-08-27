import os
from flask import Flask, request
import mysql.connector

app = Flask(__name__)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "emissiondatabase")

if not DB_PASSWORD:
    raise RuntimeError(
        "DB_PASSWORD environment variable is required. "
        "Copy python/.env.example to python/.env and set DB_PASSWORD."
    )

db_config = {
    "host": DB_HOST,
    "user": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_NAME,
}

@app.route('/insert', methods=['GET'])
def insert_data():
    voltage = request.args.get('voltage')
    current = request.args.get('current')
    power   = request.args.get('power')
    energy  = request.args.get('energy')
    freq    = request.args.get('freq')
    pf      = request.args.get('pf')
    ambient = request.args.get('ambient')
    obj     = request.args.get('object')
    CO2     = request.args.get('CO2')

    if None in [voltage, current, power, energy, freq, pf, ambient, obj, CO2]:
        return "Error: Parameter tidak lengkap", 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        sql = """
        INSERT INTO inputemission
        (voltage, current, power, energy, frequency, powerFactor, tempAmbient, tempObject, CO2)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s, %s)
        """
        cursor.execute(sql, (voltage, current, power, energy, freq, pf, ambient, obj, CO2))
        conn.commit()

        cursor.close()
        conn.close()

        return "Success save to MySQL", 200
    except Exception as e:
        return f"Error save to MySQL: {e}", 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
