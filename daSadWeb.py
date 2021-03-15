from flask import Flask, escape, request, render_template, url_for, redirect, session, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'hrcehiktsobitiuhenkhro'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///orders.db'

db = SQLAlchemy(app)

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    lastName = db.Column(db.String(50), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    postalNum = db.Column(db.Integer, nullable=False)
    street = db.Column(db.String(50), nullable=False)
    houseNum = db.Column(db.Integer, nullable=False)
    country = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Name %r>' % self.id

class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order = db.Column(db.String(1000), nullable=False)

    def __repr__(self):
        return '<Name %r>' % self.id

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/shop')
def shop():
    return render_template('shop.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/userdata', methods=['POST', 'GET'])
def usrdata():
    if request.method == "POST":
        ime = request.form.get("firstName")
        priimek = request.form.get("lastName")
        mesto = request.form.get("city")
        posta = request.form.get("postalNumber")
        ulica = request.form.get("street")
        hisnaSt = request.form.get("houseNumber")
        drzava = request.form.get("country")

        if not ime or not priimek or not mesto or not posta or not ulica or not hisnaSt or not drzava:
            error_statement = "All form fields required!"
            return render_template('/userdata.html', error_statement=error_statement)
        else:

            firstname = request.form["firstName"]
            surname = request.form["lastName"]
            location = request.form["city"]
            postalCode = request.form["postalNumber"]
            streets = request.form["street"]
            numberOfHouse = request.form["houseNumber"]
            nation = request.form["country"]

            userData = [firstname, surname, location, postalCode, streets, numberOfHouse, nation]
            session['user'] = userData

            return redirect(url_for('end'))
    else:
        return render_template('userdata.html')

@app.route('/finishOrder')
def end():
    if 'user' in session:
        user = session['user'][0]
        surname = session['user'][1]
        location = session['user'][2]
        postalCode = session['user'][3]
        streets = session['user'][4]
        numberOfHouse = session['user'][5]
        nation = session['user'][6]
        return render_template('/finishOrder.html', user=user, surname=surname, location=location, postalCode=postalCode, streets=streets, numberOfHouse=numberOfHouse, nation=nation)

    else:
        return redirect('/userdata')
    
@app.route('/update', methods=['POST', 'GET'])
def update():
    if 'user' in session:
        user = session.get('user')[0]
        surname = session.get('user')[1]
        location = session.get('user')[2]
        postalCode = session.get('user')[3]
        streets = session.get('user')[4]
        numberOfHouse = session.get('user')[5]
        nation = session.get('user')[6]

        if request.method == "POST":
            session.modified = True
            session['user'][0] = request.form['firstName']
            session['user'][1] = request.form['lastName']
            session['user'][2] = request.form['city']
            session['user'][3] = request.form['postalNumber']
            session['user'][4] = request.form['street']
            session['user'][5] = request.form['houseNumber']
            session['user'][6] = request.form['country']

            return redirect(url_for('end'))
        else:
            return render_template('/update.html', user=user, surname=surname, location=location, postalCode=postalCode, streets=streets, numberOfHouse=numberOfHouse, nation=nation)

    else: 
        return redirect(url_for('usrdata'))

@app.route('/finishOrder/thanks', methods=["POST"])
def thanks():

    # Saves user info in database
    if 'user' in session:
        user = session['user'][0]
        surname = session['user'][1]
        location = session['user'][2]
        postalCode = session['user'][3]
        streets = session['user'][4]
        numberOfHouse = session['user'][5]
        nation = session['user'][6]

        #ne dela, ker je v req string basicaly object in ma ""; invalid syntax
        #possibly morm iz js-a poslt sam inCart in Name za vsak item
        req = request.get_json()

        new_user = Customer(name=user, lastName=surname, city=location, postalNum=postalCode, street=streets, houseNum=numberOfHouse, country=nation)
        new_order = Orders(order=req)

        try:
            db.session.add(new_order)
            db.session.add(new_user)
            db.session.commit()
            return redirect('/accualthanks')
        except:
            return 'ERROR'
    else:
        return redirect(url_for('userdata'))

@app.route('/accualthanks')
def over():
    return render_template('thanks.html')

@app.errorhandler(404)
def page_not_found(e):
    return render_template('error404.html'), 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")