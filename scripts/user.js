function User(name, age, email, role, pendingConnection, connection) {
	this.name = name;
	this.age = age;
	this.email = email;
	this.role = role;
	this.pendingConnection = pendingConnection;
	this.connection = connection;
}

/***********************************************************
 *
 * Mentee model
 *
 ***********************************************************/

function Mentee(name, age, email, role, pendingConnection, connection, school) {
	User.call(this, name, age, email, role, pendingConnection, connection);
	this.school = school;
}

Mentee.prototype.contructor = Mentee;
Mentee.prototype = Object.create(User.prototype);

Mentee.prototype.getJSON = function () {
	var self = this;
	return {
		name: self.name,
		age: self.age,
		email: self.email,
		role: self.role,
		pendingConnection: self.pendingConnection,
		connection: self.connection,
		school: self.school,
	};
};

Mentee.prototype.requestConnectionTo = function (mentor) {
	this.pendingConnection = mentor.email;
	mentor.pendingConnection = this.email;

	api.saveUserToDB(this.getJSON());
	api.saveUserToDB(mentor);
};

Mentee.prototype.requestDisconnectionTo = function (mentor) {
	this.connection = null;
	mentor.connection = null;

	api.saveUserToDB(this.getJSON());
	api.saveUserToDB(mentor);
};

/***********************************************************
 *
 * Mentor model
 *
 ***********************************************************/

function Mentor(
	name,
	age,
	email,
	role,
	pendingConnection,
	connection,
	jobTitle
) {
	User.call(this, name, age, email, role, pendingConnection, connection);
	this.jobTitle = jobTitle;
}

Mentor.prototype.contructor = Mentor;
Mentor.prototype = Object.create(User.prototype);

Mentor.prototype.getJSON = function () {
	var self = this;
	return {
		name: self.name,
		age: self.age,
		email: self.email,
		role: self.role,
		pendingConnection: self.pendingConnection,
		connection: self.connection,
		jobTitle: self.jobTitle,
	};
};

Mentor.prototype.handleRequestedConnection = function (action) {
	if (action === 'accept') {
		this._accept();
	} else if (action === 'decline') {
		this._decline();
	}
};

Mentor.prototype._accept = function () {
	var self = this;

	var newMenteeConnection = {
		mentee: self.pendingConnection,
		evals: [],
	};

	var newMentorConnection = {
		mentor: self.email,
		evals: [],
	};

	this.connection = newMenteeConnection;
	this.pendingConnection = null;

	api
		.searchUserFromDB(this.connection.mentee)
		.then(function (data) {
			data.connection = newMentorConnection;
			data.pendingConnection = null;
			api.saveUserToDB(self.getJSON());
			api.saveUserToDB(data);
		})
		.catch(function (error) {
			console.log(error);
		});
};

Mentor.prototype._decline = function (mentee) {
	this.pendingConnection = null;
};

Mentor.prototype.evaluate = function (
	date,
	positivity,
	applicability,
	acquirability,
	comment = null
) {
	if (!this.connection) {
		return { message: 'There is no connection with this user! ' };
	}

	var self = this;

	var evaluation = {
		date: date,
		positivity: positivity,
		applicability: applicability,
		acquirability: acquirability,
		comment: comment,
	};

	this.connection.evals.push(evaluation);

	api
		.searchUserFromDB(this.connection.mentee)
		.then(function (data) {
			data.connection.evals.push(evaluation);
			api.saveUserToDB(self.getJSON());
			api.saveUserToDB(data);
			console.log('Evaluated');
		})
		.catch(function (error) {
			console.log(error);
		});

	return evaluation;
};
