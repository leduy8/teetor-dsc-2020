var commandController = (function () {
  var initialData = {
    user: null,
    searchedMentors: null,
  };

  // vi du
  // commandManager.execute(new SearchCommand("", "")).then(function (values) {
  //   initialData.searchedMentors.forEach(function (value) {
  //     createMyMentor(value); // dai loai the
  //   });
  // });

  var command = createCommandManager(initialData);

  return {
    initialData: initialData,
    command: command,
  };
})();

var UIController = (function (commandCtrl) {
  var DOMStrings = {
    view: {
      authorizationView: {
        generalView: "#authorization",
        logInView: {
          generalView: "#login",
          form: "#login .auth-card__form",
        },
        signUpView: {
          generalView: "#signup",
          form: "#signup .auth-card__form",
          schoolRadioBtn: "#signup #signup-mentee",
          jobRadioBtn: "#signup #signup-mentor",
          school: "#signup .auth-card__school",
          job: "#signup .auth-card__job",
        },
      },

      mainActivityView: {
        generalView: "#main-activity",
        navView: ".fa",
        newsFeedView: {
          generalView: "#newsfeed",
          menteeView: {
            generalView: "#newsfeed .mentee",
          },
          mentorView: {
            generalView: "#newsfeed .mentor",
          },
        },
        profileView: {
          generalView: "#profile",
          menteeView: {
            generalView: "#profile .mentee",
            basicInfo: {
              fullname:
                "#profile .mentee .profile-card__form #mentee__fullname",
              age: "#profile .mentee .profile-card__form #mentee__age",
              cellphone:
                "#profile .mentee .profile-card__form #mentee__cellphone",
              position:
                "#profile .mentee .profile-card__form #mentee__position",
              bio: "#profile .mentee .profile-card__form #mentee__bio",
            },
            myMentorView: "#profile .mentee .profile-card__content-my-mentor",
          },
          mentorView: {
            generalView: "#profile .mentor",
            basicInfo: {
              fullname:
                "#profile .mentor .profile-card__form #mentor__fullname",
              age: "#profile .mentor .profile-card__form #mentor__age",
              cellphone:
                "#profile .mentor .profile-card__form #mentor__cellphone",
              position:
                "#profile .mentor .profile-card__form #mentor__position",
              bio: "#profile .mentor .profile-card__form #mentor__bio",
            },
            myMenteesView: "#profile .mentor .profile-card__my-mentees",
            pendingMenteesView:
              "#profile .mentor .profile-card__pending-mentees",
          },
        },
        evaluationView: {
          generalView: "#evaluation",
          menteeView: {
            generalView: "#evaluation .mentee",
            generalEvaluationView:
              "#evaluation .mentee .evaluation-card__general",
            evaluationHistoryView: "#evaluation .mentee .evaluation__history",
            connectingStatus: {
              notConnected: "#evaluation .mentee--not-connected",
              request:
                "#evaluation .mentee--not-connected .evaluation-card__request",
              pending:
                "#evaluation .mentee--not-connected .evaluation-card__pending",
              connected: "#evaluation .mentee--connected",
              disconnect:
                "#evaluation .mentee--connected .evaluation-card__disconnect",
            },
          },
          mentorView: {
            generalView: "#evaluation .mentor",
            addEntryView: "#evaluation .mentor .evaluation-card__add-history",
            generalEvaluationView:
              "#evaluation .mentor .evaluation-card__general",
            evaluationHistoryView:
              "#evaluation .mentor .evaluation-card__history",
          },
        },
        searchView: {
          generalView: "#search",
          searchFieldView: "#search .mentee .search-card__input-field",
          searchResultsView: "#search .mentee .search-card__results",
          applicationFormView: {
            generalView: "#search .mentee .search-card__application-form",
            form: "#search .mentee .search-card__form",
          },
          mentorView: {
            generalView: "#search .search-card__mentor-profile",
            requestView: "#search .profile-card__request",
            pendingView: "#search .profile-card__pending",
            disconnectView: "#search .profile-card__disconnect",
          },
        },
      },
    },

    event: {
      contentLoaded: "DOMContentLoaded",
      signUp: {
        signUpClick: "#signup .auth-card__auth",
        signUpViewSwitch: "#login .auth-card__signup-btn",
      },
      logIn: {
        logInClick: "#login .auth-card__auth",
        logInViewSwitch: "#signup .auth-card__login-btn",
      },
      viewProfile: {
        logOutClick: ".profile-card__logout-btn",
      },
      navChange: ".nav",
      search: {
        searchMentorProfile: {
          backClick: ".search-card__mentor-profile .profile-card__back-btn",
          connectClick: ".profile-card__connect-btn",
          cancelClick: ".profile-card__cancel-btn",
          disconnectClick: ".profile-card__disconnect-btn",
        },
        searchClick: ".search-card__search-btn",
      },
      evaluate: {
        addClick: "#evaluation .mentor .fa-plus-circle",
        cancelClick: "#evaluation .mentor .btn__left",
        saveClick: "#evaluation .mentor .btn__right",
      },
    },
  };

  // For general
  var _createGeneralEval = function () {
    var generalChart = document.createElement("canvas");
    var title = document.createElement("p");
    var lastestComment = document.createElement("p");

    generalChart.setAttribute("class", "evaluation-card__chart-history");
    generalChart.setAttribute("width", "960");
    generalChart.setAttribute("height", "500");
    title.setAttribute("class", "evaluation-card__title");
    lastestComment.setAttribute("class", "evaluation-card__description");

    title.textContent = "General Evaluation from mentor";

    var labels = [],
      positivity = [],
      applicability = [],
      acquirability = [];

    if (commandCtrl.initialData.user.role === "mentee") {
      document
        .querySelector(
          DOMStrings.view.mainActivityView.evaluationView.menteeView
            .generalEvaluationView
        )
        .appendChild(title);
      document
        .querySelector(
          DOMStrings.view.mainActivityView.evaluationView.menteeView
            .generalEvaluationView
        )
        .appendChild(generalChart);
      document
        .querySelector(
          DOMStrings.view.mainActivityView.evaluationView.menteeView
            .generalEvaluationView
        )
        .appendChild(lastestComment);
      commandCtrl.initialData.user.connection.evals.forEach(function (
        evaluation
      ) {
        labels.push(evaluation.date);
        positivity.push(evaluation.positivity);
        applicability.push(evaluation.applicability);
        acquirability.push(evaluation.acquirability);
      });
    } else if (commandCtrl.initialData.user.role === "mentor") {
      document
        .querySelector(
          DOMStrings.view.mainActivityView.evaluationView.mentorView
            .generalEvaluationView
        )
        .appendChild(title);
      document
        .querySelector(
          DOMStrings.view.mainActivityView.evaluationView.mentorView
            .generalEvaluationView
        )
        .appendChild(generalChart);
      document
        .querySelector(
          DOMStrings.view.mainActivityView.evaluationView.mentorView
            .generalEvaluationView
        )
        .appendChild(lastestComment);
      commandCtrl.initialData.user.connection.evals.forEach(function (
        evaluation
      ) {
        labels.push(evaluation.date);
        positivity.push(evaluation.positivity);
        applicability.push(evaluation.applicability);
        acquirability.push(evaluation.acquirability);
      });
    }
  };

  var _createEvalResult = function (evaluation, pos, initialData) {
    var historyItem = document.createElement("div");
    var historyChart = document.createElement("canvas");
    var historyDate = document.createElement("p");
    var historyComment = document.createElement("p");
    var historyLine = document.createElement("hr");

    historyChart.setAttribute(
      "class",
      "evaluation-card__chart-history item-" + pos
    );
    historyChart.setAttribute("width", "960");
    historyChart.setAttribute("height", "500");
    historyDate.setAttribute("class", "evaluation-card__date");
    historyComment.setAttribute("class", "evaluation-card__description");
    historyLine.setAttribute("class", "evaluation-card__line");
    historyItem.setAttribute("class", "evaluation-card__item");

    historyDate.textContent = evaluation.date;
    historyComment.textContent = evaluation.comment;

    historyItem.appendChild(historyChart);
    historyItem.appendChild(historyDate);
    historyItem.appendChild(historyComment);
    historyItem.appendChild(historyLine);

    if (initialData.user.role === "mentee") {
      document
        .querySelector(
          DOMStrings.view.mainActivityView.evaluationView.menteeView
            .evaluationHistoryView
        )
        .appendChild(historyItem);
    } else if (initialData.user.role === "mentor") {
      document
        .querySelector(
          DOMStrings.view.mainActivityView.evaluationView.mentorView
            .evaluationHistoryView
        )
        .appendChild(historyItem);
    }

    var ctx = historyChart.getContext("2d");

    new Chart(ctx, {
      type: "horizontalBar",
      data: {
        labels: ["positivity", "applicability", "acquirability"],
        datasets: [
          {
            label: "Evaluation on each skill",
            backgroundColor: "steelblue",
            categoryPercentage: 0.5,
            barThickness: 1,
            maxBarThickness: 1,
            minBarLength: 1,
            data: [
              evaluation.positivity,
              evaluation.applicability,
              evaluation.acquirability,
            ],
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "Evaluation on " + evaluation.date,
        },
      },
    });
  };
  var _removeAllSearchResults = function () {};
  var _createSearchResult = function () {};

  // For mentee
  var _updateMyMentor = function () {};
  var _createMyMentor = function (mentor) {
    var myMentorCard = document.createElement("div");
    var myMentorImage = document.createElement("img");
    var myMentorInfo = document.createElement("div");
    var myMentorName = document.createElement("p");
    var myMentorJob = document.createElement("p");
    var myMentorButtonContainer = document.createElement("div");
    var myMentorEvaluate = document.createElement("button");

    myMentorImage.setAttribute("class", "profile-card__avatar m-l-5p");
    myMentorImage.setAttribute(
      "src",
      "https://icatcare.org/app/uploads/2018/06/Layer-1704-1920x840.jpg"
    );
    myMentorInfo.setAttribute("class", "block m-l-5p");
    myMentorName.setAttribute(
      "class",
      "profile-card__info profile-card__info--bold"
    );
    myMentorJob.setAttribute("class", "profile-card__info");
    myMentorButtonContainer.setAttribute("class", "center-block");
    myMentorEvaluate.setAttribute("class", "profile-card__btn btn__right");
    myMentorCard.setAttribute("class", "flex profile-card__my-mentor");

    myMentorName.textContent = mentor.name;
    myMentorJob.textContent = mentor.jobTitle;
    myMentorEvaluate.textContent = "See Evaluation";

    myMentorButtonContainer.appendChild(myMentorEvaluate);
    myMentorInfo.appendChild(myMentorName);
    myMentorInfo.appendChild(myMentorJob);
    myMentorCard.appendChild(myMentorImage);
    myMentorCard.appendChild(myMentorInfo);
    myMentorInfo.appendChild(myMentorButtonContainer);

    myMentorEvaluate.addEventListener("click", function (e) {
      e.preventDefault();

      var evalBar = document.querySelector(".fa-line-chart");
      var profileBar = document.querySelector(".fa-user-circle");
      console.log(
        DOMStrings.view.mainActivityView.evaluationView.menteeView.generalView
      );
      evalBar.setAttribute("class", evalBar.className + " nav--active");
      profileBar.setAttribute(
        "class",
        profileBar.className.replace("nav--active", "")
      );
      document.querySelector(
        DOMStrings.view.mainActivityView.profileView.generalView
      ).style.display = "none";
      document.querySelector(
        DOMStrings.view.mainActivityView.evaluationView.generalView
      ).style.display = "block";
      document.querySelector(
        DOMStrings.view.mainActivityView.evaluationView.mentorView.generalView
      ).style.display = "none";
      document.querySelector(
        DOMStrings.view.mainActivityView.evaluationView.menteeView.generalView
      ).style.display = "block";
    });

    console.log(myMentorCard);
    document
      .querySelector(
        DOMStrings.view.mainActivityView.profileView.menteeView.myMentorView
      )
      .appendChild(myMentorCard);
  };
  var _renderMyMentor = function () {
    var mentorEmail = commandCtrl.initialData.user.connection.mentor;
    var mentorSplit = mentorEmail.split("@");
    var mentorName = mentorSplit[0];
    commandCtrl.command
      .execute(new SearchCommand(mentorName, ""))
      .then(function (value) {
        console.log(commandCtrl.initialData.searchedMentors[0]);
        _createMyMentor(commandCtrl.initialData.searchedMentors[0]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // For mentor
  var _updatePendingMentee = function () {};
  var _createPendingMentee = function () {};
  var _updateMyMentee = function () {};
  var _createMyMentee = function (mentee) {
    console.log(mentee);
    console.log(mentee.name);
    var myMenteeCard = document.createElement("div");
    var myMenteeImage = document.createElement("img");
    var myMenteeInfo = document.createElement("div");
    var myMenteeName = document.createElement("p");
    var myMenteeSchool = document.createElement("p");
    var myMenteeButtonContainer = document.createElement("div");
    var myMenteeEvaluate = document.createElement("button");

    myMenteeEvaluate.setAttribute("class", "profile-card__btn btn__right");
    myMenteeButtonContainer.setAttribute("class", "m-l-10p");
    myMenteeSchool.setAttribute("class", "profile-card__info");
    myMenteeName.setAttribute(
      "class",
      "profile-card__info profile-card__info--bold"
    );
    myMenteeInfo.setAttribute("class", "block m-l-5p");
    myMenteeImage.setAttribute("class", "profile-card__avatar m-l-5p");
    myMenteeImage.setAttribute(
      "src",
      "https://icatcare.org/app/uploads/2018/06/Layer-1704-1920x840.jpg"
    );
    myMenteeCard.setAttribute("class", "flex profile-card__my-mentee");

    myMenteeButtonContainer.appendChild(myMenteeEvaluate);
    myMenteeInfo.appendChild(myMenteeName);
    myMenteeInfo.appendChild(myMenteeSchool);
    myMenteeInfo.appendChild(myMenteeButtonContainer);
    myMenteeCard.appendChild(myMenteeImage);
    myMenteeCard.appendChild(myMenteeInfo);

    myMenteeEvaluate.textContent = "Evaluate";
    myMenteeName.textContent = mentee.name;
    myMenteeSchool.textContent = mentee.school;

    myMenteeEvaluate.addEventListener("click", function (e) {
      e.preventDefault();

      var evalBar = document.querySelector(".fa-line-chart");
      var profileBar = document.querySelector(".fa-user-circle");
      console.log(
        DOMStrings.view.mainActivityView.evaluationView.mentorView.generalView
      );
      evalBar.setAttribute("class", evalBar.className + " nav--active");
      profileBar.setAttribute(
        "class",
        profileBar.className.replace("nav--active", "")
      );
      document.querySelector(
        DOMStrings.view.mainActivityView.profileView.generalView
      ).style.display = "none";
      document.querySelector(
        DOMStrings.view.mainActivityView.evaluationView.generalView
      ).style.display = "block";
      document.querySelector(
        DOMStrings.view.mainActivityView.evaluationView.mentorView.generalView
      ).style.display = "block";
      document.querySelector(
        DOMStrings.view.mainActivityView.evaluationView.menteeView.generalView
      ).style.display = "none";
    });

    console.log(myMenteeCard);
    document
      .querySelector(app.mainActivityView.profileView.mentorView.myMenteesView)
      .appendChild(myMenteeCard);
  };
  var _renderMyMentee = function () {
    var menteeEmail = commandCtrl.initialData.user.connection.mentee;
    var menteeSplit = menteeEmail.split("@");
    var menteeName = menteeSplit[0];
    commandCtrl.command
      .execute(new SearchCommand(menteeName, ""))
      .then(function (value) {
        console.log(commandCtrl.initialData.searchedMentors[0]);
        _createMyMentee(commandCtrl.initialData.searchedMentors[0]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  var _renderPendingMentee = function () {};

  return {
    toggleAuthorizationScreen: function (screen) {
      if (screen === "log-in") {
        document.querySelector(
          DOMStrings.view.authorizationView.logInView.generalView
        ).style.display = "block";
        document.querySelector(
          DOMStrings.view.authorizationView.signUpView.generalView
        ).style.display = "none";
      } else if (screen === "sign-up") {
        document.querySelector(
          DOMStrings.view.authorizationView.logInView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.authorizationView.signUpView.generalView
        ).style.display = "block";
      }
    },
    setDefaultScreen: function (screen) {
      if (screen === "main-activity") {
        if (commandCtrl.initialData.user.role === "mentee") {
          document.querySelector(
            DOMStrings.view.mainActivityView.evaluationView.menteeView
              .generalView
          ).style.display = "block";
        } else if (commandCtrl.initialData.user.role === "mentor") {
          document.querySelector(
            DOMStrings.view.mainActivityView.evaluationView.mentorView
              .generalView
          ).style.display = "block";
        }
        document.querySelector(".fa-line-chart").click();
        document.querySelector(
          DOMStrings.view.mainActivityView.profileView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.mainActivityView.newsFeedView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.mainActivityView.searchView.generalView
        ).style.display = "none";
      } else if (screen === "authorization") {
        document.querySelector(
          DOMStrings.view.authorizationView.generalView
        ).style.display = "block";
        document.querySelector(
          DOMStrings.view.authorizationView.logInView.generalView
        ).style.display = "block";
        document.querySelector(
          DOMStrings.view.authorizationView.signUpView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.mainActivityView.generalView
        ).style.display = "none";
      }
    },
    setMainActivityActiveTab: function (e) {
      console.log(e.target);
      document
        .querySelectorAll(DOMStrings.view.mainActivityView.navView)
        .forEach(function (item) {
          var itemClass = item.getAttribute("class");
          if (itemClass.includes(" nav--active")) {
            item.setAttribute("class", itemClass.replace(" nav--active", ""));
          }
        });

      if (e.target.className.includes("fa-user")) {
        document.querySelector(
          DOMStrings.view.mainActivityView.profileView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.mainActivityView.profileView.generalView
        ).style.display = "block";
        document.querySelector(
          DOMStrings.view.mainActivityView.newsFeedView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.mainActivityView.evaluationView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.mainActivityView.searchView.generalView
        ).style.display = "none";
      } else if (e.target.className.includes("fa-home")) {
        document.querySelector(
          DOMStrings.view.mainActivityView.newsFeedView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.mainActivityView.newsFeedView.generalView
        ).style.display = "block";
        document.querySelector(
          DOMStrings.view.mainActivityView.profileView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.mainActivityView.evaluationView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.mainActivityView.searchView.generalView
        ).style.display = "none";
      } else if (e.target.className.includes("fa-line-chart")) {
        document.querySelector(
          DOMStrings.view.mainActivityView.evaluationView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.mainActivityView.evaluationView.generalView
        ).style.display = "block";
        document.querySelector(
          DOMStrings.view.mainActivityView.newsFeedView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.mainActivityView.profileView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.mainActivityView.searchView.generalView
        ).style.display = "none";
      } else if (e.target.className.includes("fa-search")) {
        document.querySelector(
          DOMStrings.view.mainActivityView.searchView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.mainActivityView.searchView.generalView
        ).style.display = "block";
        document.querySelector(
          DOMStrings.view.mainActivityView.newsFeedView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.mainActivityView.evaluationView.generalView
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.mainActivityView.profileView.generalView
        ).style.display = "none";
      }

      var classList = e.target.className.split(" ");
      var eClass = "." + classList[classList.length - 1];

      document
        .querySelector(eClass)
        .setAttribute("class", e.target.className + " nav--active");
    },
    reset: function (initialData) {
      initialData.user = null;
      initialData.searchedMentors = null;
      document.querySelector(
        DOMStrings.view.mainActivityView.generalView
      ).style.display = "none";
      document.querySelector(
        DOMStrings.view.mainActivityView.profileView.generalView
      ).style.display = "none";
      document.querySelector(
        DOMStrings.view.authorizationView.generalView
      ).style.display = "block";
      document.querySelector(
        DOMStrings.view.authorizationView.logInView.generalView
      ).style.display = "block";
    },

    setUpEvaluation: function (initialData) {
      document.querySelector(
        DOMStrings.view.mainActivityView.evaluationView.menteeView
          .connectingStatus.notConnected
      ).style.display = "none";
      document.querySelector(
        DOMStrings.view.mainActivityView.evaluationView.menteeView
          .connectingStatus.request
      ).style.display = "none";
      document.querySelector(
        DOMStrings.view.mainActivityView.evaluationView.menteeView
          .connectingStatus.pending
      ).style.display = "none";
      document.querySelector(
        DOMStrings.view.mainActivityView.evaluationView.menteeView
          .connectingStatus.connected
      ).style.display = "none";
      document.querySelector(
        DOMStrings.view.mainActivityView.evaluationView.menteeView
          .connectingStatus.disconnect
      ).style.display = "none";

      console.log(initialData.pendingConnection);
      console.log(typeof initialData.pendingConnection === "undefined");
      console.log(initialData.connection);

      if (
        initialData.pendingConnection === "undefined" &&
        (initialData.connection.mentee === "undefined" ||
          initialData.connection.mentor === "undefined")
      ) {
        document.querySelector(
          DOMStrings.view.mainActivityView.evaluationView.menteeView
            .connectingStatus.notConnected
        ).style.display = "block";
        document.querySelector(
          DOMStrings.view.mainActivityView.evaluationView.menteeView
            .connectingStatus.request
        ).style.display = "block";
      } else if (
        initialData.pendingConnection !== "undefined" &&
        (initialData.connection.mentee === "undefined" ||
          initialData.connection.mentor === "undefined")
      ) {
        document.querySelector(
          DOMStrings.view.mainActivityView.evaluationView.menteeView
            .connectingStatus.notConnected
        ).style.display = "block";
        document.querySelector(
          DOMStrings.view.mainActivityView.evaluationView.menteeView
            .connectingStatus.pending
        ).style.display = "block";
      } else if (
        initialData.pendingConnection === "undefined" &&
        (initialData.connection.mentee !== "undefined" ||
          initialData.connection.mentor !== "undefined")
      ) {
        document.querySelector(
          DOMStrings.view.mainActivityView.evaluationView.menteeView
            .connectingStatus.connected
        ).style.display = "block";
        document.querySelector(
          DOMStrings.view.mainActivityView.evaluationView.menteeView
            .connectingStatus.disconnect
        ).style.display = "block";

        if (initialData.user.role === "mentor") {
          for (var i = 0; i < initialData.user.connection.evals.length; i++) {
            _createEvalResult(
              initialData.user.connection.evals[i],
              i,
              initialData
            );
          }
        } else if (initialData.user.role === "mentee") {
          for (var i = 0; i < initialData.user.connection.evals.length; i++) {
            _createEvalResult(
              initialData.user.connection.evals[i],
              i,
              initialData
            );
          }
        }

        if (initialData.user.role === "mentee") {
          while (
            DOMStrings.view.mainActivityView.evaluationView.menteeView
              .generalEvaluationView.firstChild
          ) {
            DOMStrings.view.mainActivityView.evaluationView.menteeView.generalEvaluationView.removeChild(
              DOMStrings.view.mainActivityView.evaluationView.menteeView
                .generalEvaluationView.lastChild
            );
          }
        } else if (initialData.user.role === "mentor") {
          while (
            DOMStrings.view.mainActivityView.evaluationView.mentorView
              .generalEvaluationView.firstChild
          ) {
            DOMStrings.view.mainActivityView.evaluationView.mentorView.generalEvaluationView.removeChild(
              DOMStrings.view.mainActivityView.evaluationView.mentorView
                .generalEvaluationView.lastChild
            );
          }
        }
      }
    },

    setUpUserInfo: function (initialData) {
      if (initialData.user.role === "mentee") {
        document.querySelector(
          DOMStrings.view.mainActivityView.profileView.menteeView.generalView
        ).style.display = "block";

        document.querySelector(
          DOMStrings.view.mainActivityView.profileView.mentorView.generalView
        ).style.display = "none";

        document
          .querySelector(
            DOMStrings.view.mainActivityView.profileView.menteeView.basicInfo
              .fullname
          )
          .setAttribute("placeholder", initialData.user.name);

        document
          .querySelector(
            DOMStrings.view.mainActivityView.profileView.menteeView.basicInfo
              .age
          )
          .setAttribute("placeholder", initialData.user.age);

        // document
        //   .querySelector(
        //     DOMStrings.view.mainActivityView.profileView.menteeView.basicInfo
        //       .cellphone
        //   )
        //   .setAttribute("placeholder", initialData.user.cellphone);

        document
          .querySelector(
            DOMStrings.view.mainActivityView.profileView.menteeView.basicInfo
              .position
          )
          .setAttribute("placeholder", initialData.user.school);

        if (initialData.connection) {
        }
        _renderMyMentor();
        console.log(initialData.user);
      } else if (initialData.user.role === "mentor") {
        document.querySelector(
          DOMStrings.view.mainActivityView.profileView.menteeView.generalView
        ).style.display = "none";

        document.querySelector(
          DOMStrings.view.mainActivityView.profileView.mentorView.generalView
        ).style.display = "block";

        document
          .querySelector(
            DOMStrings.view.mainActivityView.profileView.mentorView.basicInfo
              .fullname
          )
          .setAttribute("placeholder", initialData.user.name);

        document
          .querySelector(
            DOMStrings.view.mainActivityView.profileView.mentorView.basicInfo
              .age
          )
          .setAttribute("placeholder", initialData.user.age);

        // document
        //   .querySelector(
        //     DOMStrings.view.mainActivityView.profileView.mentorView.basicInfo
        //       .cellphone
        //   )
        //   .setAttribute("placeholder", initialData.user.cellphone);

        document
          .querySelector(
            DOMStrings.view.mainActivityView.profileView.mentorView.basicInfo
              .position
          )
          .setAttribute("placeholder", initialData.user.jobTitle);

        //app.renderPendingMentees();
        _renderMyMentee();
        console.log(initialData.user);
      }
    },
    setUpRecommendedMentors: function (initialData) {},
    getDOMStrings: function () {
      return DOMStrings;
    },
    position_display: function (role) {
      if (role === "mentee") {
        document.querySelector(
          DOMStrings.view.authorizationView.signUpView.school
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.authorizationView.signUpView.school
        ).style.display = "block";
        document.querySelector(
          DOMStrings.view.authorizationView.signUpView.job
        ).style.display = "none";
      } else if (role === "mentor") {
        document.querySelector(
          DOMStrings.view.authorizationView.signUpView.job
        ).style.display = "none";
        document.querySelector(
          DOMStrings.view.authorizationView.signUpView.job
        ).style.display = "block";
        document.querySelector(
          DOMStrings.view.authorizationView.signUpView.school
        ).style.display = "none";
      }
    },
  };
})(commandController);

var controller = (function (UICtrl, commandCtrl) {
  var setUpEventListeners = function () {
    var DOM = UICtrl.getDOMStrings();

    document.addEventListener(DOM.event.contentLoaded, function () {
      commandCtrl.command
        .execute(new CheckLoggedInCommand())
        .then(function (value) {
          console.log(value);
          UICtrl.setDefaultScreen("main-activity");
        })
        .catch(function (error) {
          console.log(error);
          UICtrl.setDefaultScreen("authorization");
        });
    });

    document
      .querySelector(DOM.event.signUp.signUpClick)
      .addEventListener("click", function (e) {
        e.preventDefault();
        var data = {};

        var email = document.querySelector(
          DOM.view.authorizationView.signUpView.form
        ).email.value;
        var password = document.querySelector(
          DOM.view.authorizationView.signUpView.form
        ).password.value;

        data.fullname = document.querySelector(
          DOM.view.authorizationView.signUpView.form
        ).fullname.value;
        data.age = document.querySelector(
          DOM.view.authorizationView.signUpView.form
        ).age.value;
        data.email = email;
        //data.cellphone = document.querySelector(DOM.view.authorizationView.signUpView.form).cellphone.value;
        if (document.querySelector("#signup-mentee").checked) {
          data.role = "mentee";
          data.pendingConnection = null;
          data.connection = null;
          data.school = document.querySelector(
            DOM.view.authorizationView.signUpView.form
          ).school.value;
        } else if (document.querySelector("#signup-mentor").checked) {
          data.role = "mentor";
          data.pendingConnection = null;
          data.connection = null;
          data.jobTitle = document.querySelector(
            DOM.view.authorizationView.signUpView.form
          ).job.value;
        }

        console.log(data);

        commandCtrl.command
          .execute(new SignUpCommand(email, password, data))
          .then(function (value) {
            console.log(value);
            console.log(commandCtrl.initialData);
            document.querySelector(
              DOM.view.authorizationView.generalView
            ).style.display = "none";
            document.querySelector(
              DOM.view.mainActivityView.generalView
            ).style.display = "block";
            UICtrl.setDefaultScreen("main-activity");

            UICtrl.setUpUserInfo(commandCtrl.initialData);
            UICtrl.setUpEvaluation(commandCtrl.initialData);
            UICtrl.setUpRecommendedMentors(commandCtrl.initialData);
          })
          .catch(function (error) {
            console.log(error);
          });
      });

    document
      .querySelector(DOM.event.signUp.signUpViewSwitch)
      .addEventListener("click", function () {
        UICtrl.toggleAuthorizationScreen("sign-up");
      });

    document
      .querySelector(DOM.event.logIn.logInClick)
      .addEventListener("click", function (e) {
        e.preventDefault();

        var email = document.querySelector(
          DOM.view.authorizationView.logInView.form
        ).email.value;
        var password = document.querySelector(
          DOM.view.authorizationView.logInView.form
        ).password.value;

        commandCtrl.command
          .execute(new LogInCommand(email, password))
          .then(function (value) {
            console.log(value);
            console.log(commandCtrl.initialData);
            document.querySelector(
              DOM.view.authorizationView.generalView
            ).style.display = "none";
            document.querySelector(
              DOM.view.mainActivityView.generalView
            ).style.display = "block";
            UICtrl.setDefaultScreen("main-activity");

            UICtrl.setUpUserInfo(commandCtrl.initialData);
            UICtrl.setUpEvaluation(commandCtrl.initialData);
            UICtrl.setUpRecommendedMentors(commandCtrl.initialData);
          })
          .catch(function (error) {
            console.log(error);
          });
      });

    document
      .querySelector(DOM.event.logIn.logInViewSwitch)
      .addEventListener("click", function () {
        UICtrl.toggleAuthorizationScreen("log-in");
      });

    document
      .querySelector(DOM.event.navChange)
      .addEventListener("click", function (event) {
        UICtrl.setMainActivityActiveTab(event);
      });

    document
      .querySelector(DOM.event.viewProfile.logOutClick)
      .addEventListener("click", function () {
        commandCtrl.command
          .execute(new LogOutCommand())
          .then(function (value) {
            UICtrl.reset(commandCtrl.initialData);
            //console.log(value);
            //console.log(commandCtrl.initialData);
          })
          .catch(function (error) {
            console.log(error);
          });
      });

    document.querySelector(DOM.event.search.searchClick, function () {});

    document.querySelector(
      DOM.event.search.searchMentorProfile.connectClick,
      function () {}
    );

    document.querySelector(
      DOM.event.search.searchMentorProfile.disconnectClick,
      function () {}
    );

    document.querySelector(
      DOM.event.search.searchMentorProfile.cancelClick,
      function () {}
    );

    document.querySelector(
      DOM.event.search.searchMentorProfile.backClick,
      function () {}
    );

    document.querySelector(DOM.event.evaluate.addClick, function () {});

    document.querySelector(DOM.event.evaluate.cancelClick, function () {});

    document.querySelector(DOM.event.evaluate.saveClick, function () {});
  };

  return {
    init: function () {
      setUpEventListeners();
    },
    testSearchMentor: function () {
      commandCtrl.command
        .execute(new SearchCommand("vandijk", ""))
        .then(function (value) {
          console.log(commandCtrl.initialData.searchedMentors);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    testSearchMentee: function () {
      commandCtrl.command
        .execute(new SearchCommand("andy", ""))
        .then(function (value) {
          console.log(commandCtrl.initialData.searchedMentors);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  };
})(UIController, commandController);

controller.init();
