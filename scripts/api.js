var api = (function (firebase, localforage) {
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCrjQ8iG_BB7CTbEfsHWQM8tS5p0tcNjyI",
    authDomain: "teetor-dsc-2020.firebaseapp.com",
    databaseURL: "https://teetor-dsc-2020.firebaseio.com",
    projectId: "teetor-dsc-2020",
    storageBucket: "teetor-dsc-2020.appspot.com",
    messagingSenderId: "657948619265",
    appId: "1:657948619265:web:6c89d3b26f265dd78c4600",
    measurementId: "G-1QEEHRR4NT",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var db = firebase.firestore();
  var auth = firebase.auth();

  var _addUserToDB = function (email, user) {
    return new Promise(function (resolve, reject) {
      if (auth.currentUser) {
        resolve(
          db
            .collection("users")
            .doc(email)
            .set(user)
            .then(function () {
              return { message: "Added to db" };
            })
        );
      } else {
        reject({ message: "User hasn't logged in or signed up yet" });
      }
    });
  };

  var _getUserFromDB = function (email) {
    return new Promise(function (resolve, reject) {
      if (auth.currentUser) {
        resolve(
          db
            .collection("users")
            .doc(email)
            .get()
            .then(function (doc) {
              return doc.data();
            })
        );
      } else {
        reject({ message: "User hasn't logged in or signed up yet" });
      }
    });
  };

  var _getMentors = function (querySnapshot) {
    var mentors = [];
    querySnapshot.forEach(function (doc) {
      mentors.push(doc.data());
    });

    return mentors;
  };

  return {
    isLoggedIn: function () {
      return new Promise(function (resolve, reject) {
        if (auth.currentUser !== null) {
          resolve(localforage.getItem("user"));
        } else {
          reject({ message: "User has not logged in!" });
        }
      });
    },

    signUp: function (email, password, user) {
      return auth
        .createUserWithEmailAndPassword(email, password)
        .then(function (cred) {
          return _addUserToDB(email, user)
            .then(function (success) {
              localforage
                .setItem("user", user)
                .then(function (value) {
                  console.log(value + " cached");
                })
                .catch(function (error) {
                  console.log("Caching unsuccessfully");
                });
              return success.message;
            })
            .catch(function (error) {
              return error.message;
            });
        })
        .catch(function (error) {
          return error.message;
        });
    },

    logIn: function (email, password) {
      return auth
        .signInWithEmailAndPassword(email, password)
        .then(function () {
          return _getUserFromDB(email)
            .then(function (user) {
              localforage
                .setItem("user", user)
                .then(function (value) {
                  console.log(value + " cached");
                })
                .catch(function (error) {
                  console.log("Caching unsuccessfully");
                });
              return user;
            })
            .catch(function (error) {
              return error.message;
            });
        })
        .catch(function (error) {
          return error.message;
        });
    },

    logOut: function (initialData) {
      localforage
        .clear()
        .then(function () {
          console.log("Cache is now empty.\nUser has logged out!");
        })
        .catch(function (err) {
          console.log(err);
        });

      initialData.user = null;
      initialData.searchedMentors = null;
      return auth.signOut();
    },

    saveUserToDB: function (user) {
      return new Promise(function (resolve, reject) {
        if (auth.currentUser) {
          resolve(
            db.collection("users").doc(user.email).set(user, { merge: true })
          );
        } else {
          reject({ message: "User hasn't logged in or signed up yet" });
        }
      });
    },

    searchUserFromDB: function (email) {
      return _getUserFromDB(email);
    },

    getRecommendedMentorsFromDB: function () {
      return new Promise(function (resolve, reject) {
        if (auth.currentUser) {
          resolve(
            db
              .collection("users")
              .where("role", "==", "mentor")
              .get()
              .then(function (querySnapshot) {
                return _getMentors(querySnapshot);
              })
          );
        } else {
          reject({ message: "User hasn't logged in or signed up yet" });
        }
      });
    },

    getMentorsFromDB: function (name, jobTitle) {
      if (name !== "" && jobTitle === "") {
        return new Promise(function (resolve, reject) {
          if (auth.currentUser) {
            resolve(
              db
                .collection("users")
                .where("role", "==", "mentor")
                .where("name", "==", name)
                .get()
                .then(function (querySnapshot) {
                  return _getMentors(querySnapshot);
                })
            );
          } else {
            reject({ message: "User hasn't logged in or signed up yet" });
          }
        });
      } else if (name === "" && jobTitle !== "") {
        return new Promise(function (resolve, reject) {
          if (auth.currentUser) {
            resolve(
              db
                .collection("users")
                .where("role", "==", "mentor")
                .where("job", "==", jobTitle)
                .get()
                .then(function (querySnapshot) {
                  return _getMentors(querySnapshot);
                })
            );
          } else {
            reject({ message: "User hasn't logged in or signed up yet" });
          }
        });
      } else {
        return new Promise(function (resolve, reject) {
          if (auth.currentUser) {
            resolve(
              db
                .collection("users")
                .where("role", "==", "mentor")
                .where("name", "==", name)
                .where("job", "==", jobTitle)
                .get()
                .then(function (querySnapshot) {
                  return _getMentors(querySnapshot);
                })
            );
          } else {
            reject({ message: "User hasn't logged in or signed up yet" });
          }
        });
      }
    },
  };
})(firebase, localforage);
