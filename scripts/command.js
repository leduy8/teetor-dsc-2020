function createUser(data) {
  if (data.role === "mentee") {
    return new Mentee(
      data.name,
      data.age,
      data.email,
      data.role,
      data.pendingConnection,
      data.connection,
      data.school
    );
  } else if (data.role === "mentor") {
    return new Mentor(
      data.name,
      data.age,
      data.email,
      data.role,
      data.pendingConnection,
      data.connection,
      data.jobTitle
    );
  }
}

function Command(execute) {
  this.execute = execute;
}

function ConnectCommand(mentor) {
  return new Command(function (initialData) {
    return new Promise(function (resolve, reject) {
      initialData.user.requestConnectionTo(mentor);
      resolve({ message: "Request sent successully" });
    });
  });
}

function DisconnectCommand(mentor) {
  return new Command(function (initialData) {
    return new Promise(function (resolve, reject) {
      initialData.user.requestDisconnectionTo(mentor);
      resolve({ message: "Request sent successully" });
    });
  });
}

function CancelCommand(mentor) {
  return new Command(function (initialData) {
    return new Promise(function (resolve, reject) {
      initialData.user.requestCancellingConnectionTo(mentor);
      resolve({ message: "Request sent successully" });
    });
  });
}

function HandleRequestedConnectionCommand(action) {
  return new Command(function (initialData) {
    return new Promise(function (resolve, reject) {
      initialData.user.handleRequestedConnection(action);
      resolve({ message: "Handle request successfully" });
    });
  });
}

function LogInCommand(username, password) {
  return new Command(function (initialData) {
    return new Promise(function (resolve, reject) {
      api
        .logIn(username, password)
        .then(function (data) {
          initialData.user = createUser(data);
          resolve({ message: "Logged in successfully" });
        })
        .catch(function (error) {
          reject(error);
        });
    });
  });
}

function SignUpCommand(username, password, data) {
  return new Command(function (initialData) {
    return new Promise(function (resolve, reject) {
      api
        .signUp(username, password, data)
        .then(function (message) {
          initialData.user = createUser(data);
          resolve(message);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  });
}

function LogOutCommand() {
  return new Command(function (initialData) {
    return api.logOut();
  });
}

function SearchCommand(name, jobTitle) {
  return new Command(function (initialData) {
    return new Promise(function (resolve, reject) {
      api
        .getMentorsFromDB(name, jobTitle)
        .then(function (mentors) {
          initialData.searchedMentors = mentors;
          resolve({ message: "Finish searching" });
        })
        .catch(function (error) {
          reject({ message: "Search unsuccessfully!" });
        });
    });
  });
}

function CheckLoggedInCommand() {
  return new Command(function (initialData) {
    return new Promise(function (resolve, reject) {
      api
        .isLoggedIn()
        .then(function (user) {
          initialData.user = user;
          resolve({ message: "User has logged in!" });
        })
        .catch(function (error) {
          reject(error);
        });
    });
  });
}

function EvaluateCommand(
  date,
  positivity,
  applicability,
  acquirability,
  comment = null
) {
  return new Command(function (initialData) {
    return new Promise(function (resolve, reject) {
      if (initialData.user.role === "mentee") {
        reject({ message: "Mentee cannot evaluate" });
      }

      initialData.user.evaluate(
        date,
        positivity,
        applicability,
        acquirability,
        comment
      );
      resolve({ message: "Evaluate esuccessfully!" });
    });
  });
}

function createCommandManager(initialData) {
  return {
    execute: function (command, ...args) {
      return command.execute(initialData, ...args);
    },
  };
}
