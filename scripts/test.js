// (function () {
//   'use strict';

//   var app = {
//     user: null,
//     selectedMentor: null,
//     authorizationView: {
//       generalView: document.querySelector('#authorization'),
//       logInView: {
//         generalView: document.querySelector('#login'),
//         form: document.querySelector('#login .auth-card__form')
//       },
//       signUpView: {
//         generalView: document.querySelector('#signup'),
//         form: document.querySelector('#signup .auth-card__form')
//       }
//     },
//     mainActivityView: {
//       generalView: document.querySelector('#main-activity'),
//       navView: document.querySelectorAll('.fa'),
//       newsFeedView: {
//         generalView: document.querySelector('#newsfeed'),
//         menteeView: {
//           generalView: document.querySelector('#newsfeed .mentee')
//         },
//         mentorView: {
//           generalView: document.querySelector('#newsfeed .mentor')
//         }
//       },
//       profileView: {
//         generalView: document.querySelector('#profile'),
//         menteeView: {
//           generalView: document.querySelector('#profile .mentee'),
//           basicInfo: document.querySelector('#profile .mentee .profile-card__form'),
//           myMentorView: document.querySelector('#profile .mentee .profile-card__content-my-mentor')
//         },
//         mentorView: {
//           generalView: document.querySelector('#profile .mentor'),
//           basicInfo: document.querySelector('#profile .mentor .profile-card__form'),
//           myMenteesView: document.querySelector('#profile .mentor .profile-card__my-mentees'),
//           pendingMenteesView: document.querySelector('#profile .mentor .profile-card__pending-mentees')
//         }
//       },
//       evaluationView: {
//         generalView: document.querySelector('#evaluation'),
//         menteeView: {
//           generalView: document.querySelector('#evaluation .mentee'),
//           generalEvaluationView: document.querySelector('#evaluation .mentee .evaluation-card__general'),
//           evaluationHistoryView: document.querySelector('#evaluation .mentee .evaluation__history')
//         },
//         mentorView: {
//           generalView: document.querySelector('#evaluation .mentor'),
//           addEntryView: document.querySelector('#evaluation .mentor .evaluation-card__add-history'),
//           generalEvaluationView: document.querySelector('#evaluation .mentor .evaluation-card__general'),
//           evaluationHistoryView: document.querySelector('#evaluation .mentor .evaluation-card__history')
//         }
//       },
//       searchView: {
//         generalView: document.querySelector('#search'),
//         searchFieldView: document.querySelector('#search .mentee .search-card__input-field'),
//         searchResultsView: document.querySelector('#search .mentee .search-card__results'),
//         applicationFormView: {
//           generalView: document.querySelector('#search .mentee .search-card__application-form'),
//           form: document.querySelector('#search .mentee .search-card__form')
//         },
//         mentorView: {
//           generalView: document.querySelector('#search .search-card__mentor-profile'),
//           requestView: document.querySelector('#search .profile-card__request'),
//           pendingView: document.querySelector('#search .profile-card__pending'),
//           disconnectView: document.querySelector('#search .profile-card__disconnect')
//         }
//       }
//     }
//   };

//   /*****************************************************************************
//    *
//    * Initialize App
//    *
//    ****************************************************************************/

//   document.addEventListener('DOMContentLoaded', function () {
//     auth.onAuthStateChanged(function (user) {
//       if (user) {
//         app.setDefaultScreen('main-activity');
//       } else {
//         app.setDefaultScreen('authorization');
//       }
//     });
//   });

//   /*****************************************************************************
//    *
//    * Event listeners for UI elements
//    *
//    ****************************************************************************/

//   /* Event listener for sign up */
//   document.querySelector('#signup .auth-card__auth').addEventListener('click', function (e) {
//     e.preventDefault();

//     var email = app.authorizationView.signUpView.form.email.value;
//     var password = app.authorizationView.signUpView.form.password.value;
//     var fullname = app.authorizationView.signUpView.form.fullname.value;
//     var age = app.authorizationView.signUpView.form.age.value;
//     var cellphone = app.authorizationView.signUpView.form.cellphone.value;

//     app.user = {
//       basicInfo: {
//         fullname: fullname,
//         age: age,
//         cellphone: cellphone,
//         email: email
//       },
//       certificates: [],
//       honors: [],
//       experiences: []
//     };

//     if (app.authorizationView.signUpView.form.mentee.checked) {
//       var school = app.authorizationView.signUpView.form.school.value;

//       app.user.role = 'mentee';
//       app.user.school = school;
//       app.user.mentors = [];
//     } else {
//       var job = app.authorizationView.signUpView.form.job.value;

//       app.user.role = 'mentor';
//       app.user.job = job;
//       app.user.activities = [];
//       app.user.mentees = [];
//       app.user.pending = [];
//     }

//     auth.createUserWithEmailAndPassword(email, password).then(function (cred) {
//       db.collection('users').doc(email).set(app.user);
//       app.setUpUserInfo();
//       app.setUpRecommendedMentors();
//     }).catch(function (error) {
//       console.log(error.message);
//     });

//   });

//   /* Event listener for change the view to sign up */
//   document.querySelector('#login .auth-card__signup-btn').addEventListener('click', function () {
//     app.toggleAuthorizationScreen('log-in');
//   });

//   /* Event listener for change the view to log in */
//   document.querySelector('#signup .auth-card__login-btn').addEventListener('click', function () {
//     app.toggleAuthorizationScreen('sign-up');
//   });

//   /* Event listener for sign in */
//   document.querySelector('#login .auth-card__auth').addEventListener('click', function (e) {
//     e.preventDefault();

//     var email = app.authorizationView.logInView.form.email.value;
//     var password = app.authorizationView.logInView.form.password.value;

//     auth.signInWithEmailAndPassword(email, password).then(function () {
//       console.log('signed in');
//       app.getUserInfo(email).then(function (doc) {
//         app.user = doc.data();

//         if (app.user.role === 'mentee') {
//           app.mainActivityView.newsFeedView.menteeView.generalView.style.display = 'block';
//           app.mainActivityView.newsFeedView.mentorView.generalView.style.display = 'none';
//         } else if (app.user.role === 'mentor') {
//           app.mainActivityView.newsFeedView.menteeView.generalView.style.display = 'none';
//           app.mainActivityView.newsFeedView.mentorView.generalView.style.display = 'block';
//         }

//         app.setUpUserInfo();
//         app.setUpRecommendedMentors();
//       }).catch(function (error) {
//         auth.signOut();
//         app.reset();
//       });
//     }).catch(function (error) {
//       console.log(error.message);
//     });

//   });

//   document.querySelector('.profile-card__logout-btn').addEventListener('click', function () {
//     auth.signOut();
//     app.reset();
//   });

//   /* Event listener for change the state of nav bar */
//   document.querySelector('.nav').addEventListener('click', function (e) {
//     app.setMainActivityActiveTab(e);
//   });

//   /* Event listener for toggle the role when sign up */
//   document.querySelector('#signup-mentee').addEventListener('click', function () {
//     app.toggleSignUpRoleInputField('mentee');
//   });

//   document.querySelector('#signup-mentor').addEventListener('click', function () {
//     app.toggleSignUpRoleInputField('mentor');
//   });

//   document.querySelector('.search-card__mentor-profile .profile-card__back-btn').addEventListener('click', function (e) {
//     e.preventDefault();

//     app.mainActivityView.searchView.mentorView.generalView.style.display = 'none';
//     app.mainActivityView.searchView.searchFieldView.style.display = 'block';
//     app.mainActivityView.searchView.searchResultsView.style.display = 'block';

//     document.querySelectorAll('.profile-card__info').forEach(function (value) {
//       if (value.textContent.includes('Full name')) {
//         value.textContent = 'Full name: ';
//       } else if (value.textContent.includes('Age')) {
//         value.textContent = 'Age: ';
//       } else if (value.textContent.includes('Cellphone')) {
//         value.textContent = 'Cellphone: ';
//       } else if (value.textContent.includes('Bio')) {
//         value.textContent = 'Bio: ';
//       }
//     });

//     app.selectedMentor = null;
//   });

//   /* Event listener for request connection */
//   document.querySelector('.profile-card__connect-btn').addEventListener('click', function (e) {
//     e.preventDefault();

//     app.mainActivityView.searchView.mentorView.generalView.style.display = 'none';
//     app.mainActivityView.searchView.applicationFormView.generalView.style.display = 'block';
//   });

//   /* Event listener for discard application form */
//   document.querySelector('.search-card__discard-btn').addEventListener('click', function (e) {
//     e.preventDefault();

//     app.mainActivityView.searchView.applicationFormView.generalView.style.display = 'none';
//     app.mainActivityView.searchView.searchFieldView.style.display = 'block';
//     app.mainActivityView.searchView.searchResultsView.style.display = 'block';

//     app.selectedMentor = null;
//   });

//   /* Event listener for submit application form */
//   document.querySelector('.search-card__submit-btn').addEventListener('click', function (e) {
//     e.preventDefault();

//     var essay = app.mainActivityView.searchView.applicationFormView.form.essay.value;
//     app.user.requestConnection(essay);
//     app.mainActivityView.searchView.mentorView.generalView.style.display = 'block';
//     app.mainActivityView.searchView.mentorView.requestView.style.display = 'none';
//     app.mainActivityView.searchView.mentorView.disconnectView.style.display = 'none';
//     app.mainActivityView.searchView.mentorView.pendingView.style.display = 'block';
//     app.mainActivityView.searchView.applicationFormView.generalView.style.display = 'none';
//   });

//   /* Event listener for search */
//   document.querySelector('.search-card__search-btn').addEventListener('click', function (e) {
//     e.preventDefault();

//     var searchQuery = document.querySelector('.search-card__search-form');
//     app.search(searchQuery).then(function (querySnapshot) {
//       app.removeAllSearchResults();

//       querySnapshot.forEach(function (doc) {
//         app.createSearchResult(doc.data());
//       });
//     }).catch(function (error) {
//       console.log(error.message);
//     });
//   });

//   /* Event listener for add history entry */
//   document.querySelector('#evaluation .mentor .fa-plus-circle').addEventListener('click', function () {
//     app.mainActivityView.evaluationView.mentorView.addEntryView.style.display = 'block';
//   });

//   /* Event listener for cancel adding history entry */
//   document.querySelector('#evaluation .mentor .btn__left').addEventListener('click', function (e) {
//     e.preventDefault();

//     app.mainActivityView.evaluationView.mentorView.addEntryView.style.display = 'none';
//   });

//   /* Event listener for save adding history entry */
//   document.querySelector('#evaluation .mentor .btn__right').addEventListener('click', function (e) {
//     e.preventDefault();

//     var date = app.mainActivityView.evaluationView.mentorView.addEntryView['history-date'].value;
//     var positivity = app.mainActivityView.evaluationView.mentorView.addEntryView['positivity'].value;
//     var applicability = app.mainActivityView.evaluationView.mentorView.addEntryView['applicability'].value;
//     var acquirability = app.mainActivityView.evaluationView.mentorView.addEntryView['acquirability'].value;
//     var comment = app.mainActivityView.evaluationView.mentorView.addEntryView['history-comment'].value;

//     var evaluation = {
//       date: date,
//       positivity: positivity,
//       applicability: applicability,
//       acquirability: acquirability,
//       comment: comment
//     }

//     app.user.mentees[0].mentors[0].evaluations.push(evaluation);

//     var self = app.user;
//     delete self.getConnections;
//     delete self.handlePendingConnectionRequest;
//     delete self._accept;
//     delete self._reject;

//     db.collection('users').doc(app.user.basicInfo.email).set(app.user, { merge: true }).then(function () {
//       db.collection('users').doc(self.mentees[0].basicInfo.email).set(self.mentees[0], { merge: true }).then(function () {
//         console.log('Success');
//         app.mainActivityView.evaluationView.mentorView.addEntryView['history-date'].value = null;
//         app.mainActivityView.evaluationView.mentorView.addEntryView['positivity'].value = 1;
//         app.mainActivityView.evaluationView.mentorView.addEntryView['applicability'].value = 1;
//         app.mainActivityView.evaluationView.mentorView.addEntryView['acquirability'].value = 1;
//         app.mainActivityView.evaluationView.mentorView.addEntryView['history-comment'].value = '';
//       }).catch(function (error) {
//         console.log(error);
//       });
//     }).catch(function (error) {
//       console.log(error);
//     });
//   });

//   /*****************************************************************************
//    *
//    * Method to update/refresh the UI
//    *
//    ****************************************************************************/

//   /* Toggle authorization screen */
//   app.toggleAuthorizationScreen = function (screen) {
//     if (screen === 'log-in') {
//       app.authorizationView.logInView.generalView.style.display = 'none';
//       app.authorizationView.signUpView.generalView.style.display = 'block';
//     } else if (screen == 'sign-up') {
//       app.authorizationView.logInView.generalView.style.display = 'block';
//       app.authorizationView.signUpView.generalView.style.display = 'none';
//     }
//   };

//   /* Toggle the default screen */
//   app.setDefaultScreen = function (screen) {
//     if (screen === 'main-activity') {
//       if (!app.user) {
//         localforage.getItem('user').then(function (value) {
//           app.user = value;

//           if (app.user.role === 'mentee') {
//             app.mainActivityView.newsFeedView.menteeView.generalView.style.display = 'block';
//             app.mainActivityView.newsFeedView.mentorView.generalView.style.display = 'none';
//             app.mainActivityView.profileView.menteeView.generalView.style.display = 'block';
//             app.mainActivityView.evaluationView.menteeView.generalView.style.display = 'block';
//             app.mainActivityView.profileView.mentorView.generalView.style.display = 'none';
//             app.mainActivityView.evaluationView.mentorView.generalView.style.display = 'none';
//           } else if (app.user.role === 'mentor') {
//             app.mainActivityView.newsFeedView.menteeView.generalView.style.display = 'none';
//             app.mainActivityView.newsFeedView.mentorView.generalView.style.display = 'block';
//             app.mainActivityView.profileView.menteeView.generalView.style.display = 'none';
//             app.mainActivityView.evaluationView.menteeView.generalView.style.display = 'none';
//             app.mainActivityView.profileView.mentorView.generalView.style.display = 'block';
//             app.mainActivityView.evaluationView.mentorView.generalView.style.display = 'block';
//             app.mainActivityView.evaluationView.mentorView.addEntryView.style.display = 'none';
//           }

//           app.setUpUserInfo();
//           app.setUpRecommendedMentors();
//           app.setUpEvaluation();
//         }).catch(function (error) {
//           console.log(error);
//         });
//       }

//       app.authorizationView.generalView.style.display = 'none';

//       app.mainActivityView.generalView.style.display = 'block';
//       app.mainActivityView.newsFeedView.generalView.style.display = 'block';
//       app.mainActivityView.profileView.generalView.style.display = 'none';
//       app.mainActivityView.evaluationView.generalView.style.display = 'none';
//       app.mainActivityView.searchView.generalView.style.display = 'none';
//       app.mainActivityView.searchView.applicationFormView.generalView.style.display = 'none';
//       app.mainActivityView.searchView.mentorView.generalView.style.display = 'none';
//     } else if (screen === 'authorization') {
//       app.authorizationView.generalView.style.display = 'block';
//       app.authorizationView.logInView.generalView.style.display = 'block';
//       app.authorizationView.signUpView.generalView.style.display = 'none';

//       app.mainActivityView.generalView.style.display = 'none';
//     }
//   };

//   /* Toggle the active tab */
//   app.setMainActivityActiveTab = function (e) {
//     app.mainActivityView.navView.forEach(function (item) {
//       var itemClass = item.getAttribute('class');
//       if (itemClass.includes('nav--active')) {
//         item.setAttribute('class', itemClass.replace('nav--active', ''));
//       }
//     });

//     if (e.target.className.includes('fa-user')) {
//       app.mainActivityView.profileView.generalView.style.display = 'block';
//       app.mainActivityView.newsFeedView.generalView.style.display = 'none';
//       app.mainActivityView.evaluationView.generalView.style.display = 'none';
//       app.mainActivityView.searchView.generalView.style.display = 'none';
//     } else if (e.target.className.includes('fa-home')) {
//       app.mainActivityView.newsFeedView.generalView.style.display = 'block';
//       app.mainActivityView.profileView.generalView.style.display = 'none';
//       app.mainActivityView.evaluationView.generalView.style.display = 'none';
//       app.mainActivityView.searchView.generalView.style.display = 'none';
//     } else if (e.target.className.includes('fa-line-chart')) {
//       app.mainActivityView.evaluationView.generalView.style.display = 'block';
//       app.mainActivityView.newsFeedView.generalView.style.display = 'none';
//       app.mainActivityView.profileView.generalView.style.display = 'none';
//       app.mainActivityView.searchView.generalView.style.display = 'none';
//     } else if (e.target.className.includes('fa-search')) {
//       app.mainActivityView.searchView.generalView.style.display = 'block';
//       app.mainActivityView.newsFeedView.generalView.style.display = 'none';
//       app.mainActivityView.evaluationView.generalView.style.display = 'none';
//       app.mainActivityView.profileView.generalView.style.display = 'none';
//     }

//     e.target.setAttribute('class', e.target.className + ' nav--active');
//   };

//   /* Reset to the log in screen */
//   app.reset = function () {
//     app.mainActivityView.navView.forEach(function (item) {
//       var itemClass = item.getAttribute('class');
//       if (itemClass.includes('nav--active')) {
//         item.setAttribute('class', itemClass.replace('nav--active', ''));
//       }
//     });

//     app.mainActivityView.newsFeedView.generalView.style.display = 'block';
//     app.mainActivityView.profileView.generalView.style.display = 'none';

//     while (app.mainActivityView.profileView.menteeView.myMentorView.firstChild) {
//       app.mainActivityView.profileView.menteeView.myMentorView
//         .removeChild(app.mainActivityView.profileView.menteeView.myMentorView.lastChild);
//     }

//     var newsFeedNav = document.querySelector('.fa-home');
//     if (newsFeedNav.className.includes('nav--active')) {
//       return;
//     } else {
//       newsFeedNav.setAttribute('class', newsFeedNav.className + ' nav--active');
//     }

//     app.user = null;
//     app.recommededMentors = [];

//     localforage.clear().then(function () {
//       console.log('Database is now empty.');
//     }).catch(function (error) {
//       console.log(error);
//     });

//     app.setDefaultScreen('authorization');
//   };

//   /* Toggle sign up role input field for mentee/mentor */
//   app.toggleSignUpRoleInputField = function (role) {
//     if (role === 'mentee') {
//       document.querySelector('.auth-card__school').style.display = 'block';
//       document.querySelector('.auth-card__job').style.display = 'none';
//       app.authorizationView.signUpView.form.mentee.checked = true;
//       app.authorizationView.signUpView.form.mentor.checked = false;
//     } else {
//       document.querySelector('.auth-card__school').style.display = 'none';
//       document.querySelector('.auth-card__job').style.display = 'block';
//       app.authorizationView.signUpView.form.mentee.checked = false;
//       app.authorizationView.signUpView.form.mentor.checked = true;
//     }
//   }

//   /* Update history */
//   app.setUpEvaluation = function () {
//     // if (app.user.role === 'mentee') {
//     //   for (var i = 0; i < app.user.mentors[0].evaluations.length; i++) {
//     //     app.createEvalResult(app.user.mentors[0].evaluations[i], i);
//     //   }
//     // } else if (app.user.role === 'mentor') {
//     //   for (var i = 0; i < app.user.mentees[0].mentors[0].evaluations.length; i++) {
//     //     app.createEvalResult(app.user.mentees[0].mentors[0].evaluations[i], i);
//     //   }
//     // }

//     if (app.user.role === 'mentor') {
//       for (var i = 0; i < app.user.mentees[0].mentors[0].evaluations.length; i++) {
//         app.createEvalResult(app.user.mentees[0].mentors[0].evaluations[i], i);
//       }
//     } else if (app.user.role === 'mentee') {
//       for (var i = 0; i < app.user.mentors[0].evaluations.length; i++) {
//         app.createEvalResult(app.user.mentors[0].evaluations[i], i);
//       }
//     }

//     db.collection('users').doc(app.user.basicInfo.email).onSnapshot(function (doc) {
//       if (app.user.role === 'mentee') {
//         while (app.mainActivityView.evaluationView.menteeView.generalEvaluationView.firstChild) {
//           app.mainActivityView.evaluationView.menteeView.generalEvaluationView
//             .removeChild(app.mainActivityView.evaluationView.menteeView.generalEvaluationView.lastChild);
//         }
//       } else if (app.user.role === 'mentor') {
//         while (app.mainActivityView.evaluationView.mentorView.generalEvaluationView.firstChild) {
//           app.mainActivityView.evaluationView.mentorView.generalEvaluationView
//             .removeChild(app.mainActivityView.evaluationView.mentorView.generalEvaluationView.lastChild);
//         }
//       }

//       var updatedMenteeEval = app.user.role === 'mentee' ? doc.data().mentors[0] : doc.data().mentees[0].mentors[0];
//       var updatedLength = updatedMenteeEval.evaluations.length;
//       var currentLength = app.user.role === 'mentee' ? app.user.mentors[0].evaluations.length : app.user.mentees[0].mentors[0].evaluations.length;

//       if (updatedLength === currentLength) {
//         app.createEvalResult(updatedMenteeEval.evaluations[updatedLength - 1], updatedLength - 1);

//         if (app.user.role === 'mentee') {
//           app.user.mentors[0].evaluations.push(updatedMenteeEval.evaluations[updatedLength - 1]);
//         } else if (app.user.role === 'mentor') {
//           app.user.mentees[0].mentors[0].evaluations.push(updatedMenteeEval.evaluations[updatedLength - 1]);
//         }

//         app.createGeneralEval();

//         return;
//       }

//       for (var i = currentLength; i < updatedLength; i++) {
//         app.createEvalResult(updatedMenteeEval.evaluations[i], i);

//         if (app.user.role === 'mentee') {
//           app.user.mentors[0].evaluations.push(updatedMenteeEval.evaluations[i]);
//         } else if (app.user.role === 'mentor') {
//           app.user.mentees[0].mentors[0].evaluations.push(updatedMenteeEval.evaluations[i]);
//         }
//       }

//       app.createGeneralEval();

//     });
//   };

//   /* Create general evaluation */
//   app.createGeneralEval = function () {
//     var generalChart = document.createElement('canvas');
//     var title = document.createElement('p');
//     var lastestComment = document.createElement('p');

//     generalChart.setAttribute('class', 'evaluation-card__chart-history');
//     generalChart.setAttribute('width', '960');
//     generalChart.setAttribute('height', '500');
//     title.setAttribute('class', 'evaluation-card__title');
//     lastestComment.setAttribute('class', 'evaluation-card__description');

//     title.textContent = 'General Evaluation from mentor'

//     var labels = [], positivity = [], applicability = [], acquirability = [];

//     if (app.user.role === 'mentee') {
//       app.mainActivityView.evaluationView.menteeView.generalEvaluationView.appendChild(title);
//       app.mainActivityView.evaluationView.menteeView.generalEvaluationView.appendChild(generalChart);
//       app.mainActivityView.evaluationView.menteeView.generalEvaluationView.appendChild(lastestComment);
//       app.user.mentors[0].evaluations.forEach(function (evaluation) {
//         labels.push(evaluation.date);
//         positivity.push(evaluation.positivity);
//         applicability.push(evaluation.applicability);
//         acquirability.push(evaluation.acquirability);
//       });
//     } else if (app.user.role === 'mentor') {
//       app.mainActivityView.evaluationView.mentorView.generalEvaluationView.appendChild(title);
//       app.mainActivityView.evaluationView.mentorView.generalEvaluationView.appendChild(generalChart);
//       app.mainActivityView.evaluationView.mentorView.generalEvaluationView.appendChild(lastestComment);
//       app.user.mentees[0].mentors[0].evaluations.forEach(function (evaluation) {
//         labels.push(evaluation.date);
//         positivity.push(evaluation.positivity);
//         applicability.push(evaluation.applicability);
//         acquirability.push(evaluation.acquirability);
//       });
//     }

//     var ctx = generalChart.getContext('2d');

//     new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: labels,
//         datasets: [
//           {
//             label: 'Positivity',
//             fill: false,
//             backgroundColor: 'red',
//             borderColor: 'red',
//             data: positivity
//           },
//           {
//             label: 'Applicability',
//             fill: false,
//             backgroundColor: 'blue',
//             borderColor: 'blue',
//             data: applicability
//           },
//           {
//             label: 'Acquirability',
//             fill: false,
//             backgroundColor: 'green',
//             borderColor: 'green',
//             data: acquirability
//           }
//         ]
//       }
//     })
//   };

//   /* Create evaluation result */
//   app.createEvalResult = function (evaluation, pos) {
//     var historyItem = document.createElement('div');
//     var historyChart = document.createElement('canvas');
//     var historyDate = document.createElement('p');
//     var historyComment = document.createElement('p');
//     var historyLine = document.createElement('hr');

//     historyChart.setAttribute('class', 'evaluation-card__chart-history item-' + pos);
//     historyChart.setAttribute('width', '960');
//     historyChart.setAttribute('height', '500');
//     historyDate.setAttribute('class', 'evaluation-card__date');
//     historyComment.setAttribute('class', 'evaluation-card__description');
//     historyLine.setAttribute('class', 'evaluation-card__line');
//     historyItem.setAttribute('class', 'evaluation-card__item');

//     historyDate.textContent = evaluation.date;
//     historyComment.textContent = evaluation.comment;

//     historyItem.appendChild(historyChart);
//     historyItem.appendChild(historyDate);
//     historyItem.appendChild(historyComment);
//     historyItem.appendChild(historyLine);

//     if (app.user.role === 'mentee') {
//       app.mainActivityView.evaluationView.menteeView.evaluationHistoryView.appendChild(historyItem);
//     } else if (app.user.role === 'mentor') {
//       app.mainActivityView.evaluationView.mentorView.evaluationHistoryView.appendChild(historyItem);
//     }

//     var ctx = historyChart.getContext('2d');

//     new Chart(ctx, {
//       type: 'horizontalBar',
//       data: {
//         labels: ['positivity', 'applicability', 'acquirability'],
//         datasets: [{
//           label: 'Evaluation on each skill',
//           backgroundColor: 'steelblue',
//           categoryPercentage: 0.5,
//           barThickness: 1,
//           maxBarThickness: 1,
//           minBarLength: 1,
//           data: [evaluation.positivity, evaluation.applicability, evaluation.acquirability]
//         }]
//       },
//       options: {
//         title: {
//           display: true,
//           text: 'Evaluation on ' + evaluation.date
//         }
//       }
//     });
//   };

//   /* Update user info */
//   app.setUpUserInfo = function () {
//     console.log('Set up', app.user);
//     if (app.user.role === 'mentee') {
//       app.mainActivityView.profileView.menteeView.generalView.style.display = 'block';
//       app.mainActivityView.profileView.mentorView.generalView.style.display = 'none';

//       app.mainActivityView.profileView.menteeView.basicInfo.fullname.setAttribute('placeholder', app.user.basicInfo.fullname);
//       app.mainActivityView.profileView.menteeView.basicInfo.age.setAttribute('placeholder', app.user.basicInfo.age);
//       app.mainActivityView.profileView.menteeView.basicInfo.cellphone.setAttribute('placeholder', app.user.basicInfo.cellphone);
//       app.mainActivityView.profileView.menteeView.basicInfo.position.setAttribute('placeholder', app.user.school);

//       app.renderMyMentor();
//       console.log(app.user);
//     } else if (app.user.role === 'mentor') {
//       app.mainActivityView.profileView.menteeView.generalView.style.display = 'none';
//       app.mainActivityView.profileView.mentorView.generalView.style.display = 'block';

//       app.mainActivityView.profileView.mentorView.basicInfo.fullname.setAttribute('placeholder', app.user.basicInfo.fullname);
//       app.mainActivityView.profileView.mentorView.basicInfo.age.setAttribute('placeholder', app.user.basicInfo.age);
//       app.mainActivityView.profileView.mentorView.basicInfo.cellphone.setAttribute('placeholder', app.user.basicInfo.cellphone);
//       app.mainActivityView.profileView.mentorView.basicInfo.position.setAttribute('placeholder', app.user.job);

//       app.renderPendingMentees();
//       app.renderMyMentees();
//     }

//     localforage.setItem('user', app.user).then(function (value) {
//       console.log('Save ', value, ' to the local storage');
//       app.setUserPrivilege();
//     }).catch(function (error) {
//       console.log(error);
//     });
//   };

//   /* Render my mentor */
//   app.renderMyMentor = function () {
//     app.user.mentors.forEach(function (value) {
//       app.createMyMentor(value);
//     });
//   };

//   /* Render pending mentees */
//   app.renderPendingMentees = function () {
//     console.log(app.user.pending);
//     app.user.pending.forEach(function (value, index) {
//       app.createPendingMentee(value, index);
//     });
//   };

//   /* Create my mentor */
//   app.createMyMentor = function (mentor) {
//     db.collection('users').doc(mentor.email).get().then(function (doc) {
//       var myMentor = doc.data();
//       var myMentorCard = document.createElement('div');
//       var myMentorImage = document.createElement('img');
//       var myMentorInfo = document.createElement('div');
//       var myMentorName = document.createElement('p');
//       var myMentorJob = document.createElement('p');
//       var myMentorButtonContainer = document.createElement('div');
//       var myMentorEvaluate = document.createElement('button');

//       myMentorImage.setAttribute('class', 'profile-card__avatar m-l-5p');
//       myMentorImage.setAttribute('src', 'https://icatcare.org/app/uploads/2018/06/Layer-1704-1920x840.jpg');
//       myMentorInfo.setAttribute('class', 'block');
//       myMentorName.setAttribute('class', 'profile-card__info profile-card__info--bold');
//       myMentorJob.setAttribute('class', 'profile-card__info');
//       myMentorButtonContainer.setAttribute('class', 'center-block');
//       myMentorEvaluate.setAttribute('class', 'profile-card__btn btn__right');
//       myMentorCard.setAttribute('class', 'flex profile-card__my-mentor');

//       myMentorName.textContent = myMentor.basicInfo.fullname;
//       myMentorJob.textContent = myMentor.job;
//       myMentorEvaluate.textContent = 'See Evaluation';

//       myMentorButtonContainer.appendChild(myMentorEvaluate);
//       myMentorInfo.appendChild(myMentorName);
//       myMentorInfo.appendChild(myMentorJob);
//       myMentorCard.appendChild(myMentorImage);
//       myMentorCard.appendChild(myMentorInfo);
//       myMentorCard.appendChild(myMentorButtonContainer);

//       myMentorEvaluate.addEventListener('click', function (e) {
//         e.preventDefault();

//         var evalBar = document.querySelector('.fa-line-chart');
//         var profileBar = document.querySelector('.fa-user-circle');
//         console.log(app.mainActivityView.evaluationView.menteeView.generalView);
//         evalBar.setAttribute('class', evalBar.className + ' nav--active');
//         profileBar.setAttribute('class', profileBar.className.replace('nav--active', ''));
//         app.mainActivityView.profileView.generalView.style.display = 'none';
//         app.mainActivityView.evaluationView.generalView.style.display = 'block';
//         app.mainActivityView.evaluationView.mentorView.generalView.style.display = 'none';
//         app.mainActivityView.evaluationView.menteeView.generalView.style.display = 'block';
//       });

//       app.mainActivityView.profileView.menteeView.myMentorView.appendChild(myMentorCard);
//     }).catch(function (error) {
//       console.log(error.message);
//     });
//   };

//   /* Create pending mentee */
//   app.createPendingMentee = function (value, index) {
//     var pendingMenteeCard = document.createElement('div');
//     var pendingMenteeCardHeader = document.createElement('div');
//     var pendingMenteeImage = document.createElement('img');
//     var pendingMenteeIntro = document.createElement('div');
//     var pendingMenteeIntroName = document.createElement('p');
//     var pendingMenteeIntroSchool = document.createElement('p');
//     var pendingMenteeQuestion = document.createElement('p');
//     var pendingMenteeAnswer = document.createElement('p');
//     var pendingMenteeButtons = document.createElement('div');
//     var pendingMenteeDecline = document.createElement('button');
//     var pendingMenteeAccept = document.createElement('button');

//     pendingMenteeDecline.setAttribute('class', 'profile-card__btn btn__left');
//     pendingMenteeAccept.setAttribute('class', 'profile-card__btn btn__right');
//     pendingMenteeButtons.setAttribute('class', 'center-block');
//     pendingMenteeAnswer.setAttribute('class', 'profile-card__pending-mentee__info');
//     pendingMenteeQuestion.setAttribute('class', 'profile-card__pending-mentee__info profile-card__pending-mentee__info--bold');
//     pendingMenteeIntroName.setAttribute('class', 'profile-card__info profile-card__info--bold');
//     pendingMenteeIntroSchool.setAttribute('class', 'profile-card__info');
//     pendingMenteeIntro.setAttribute('class', 'block');
//     pendingMenteeImage.setAttribute('class', 'profile-card__avatar m-l-5p');
//     pendingMenteeImage.setAttribute('src', 'https://icatcare.org/app/uploads/2018/06/Layer-1704-1920x840.jpg');
//     pendingMenteeCardHeader.setAttribute('class', 'flex');
//     pendingMenteeCard.setAttribute('class', 'profile-card__pending-mentee');

//     pendingMenteeButtons.appendChild(pendingMenteeDecline);
//     pendingMenteeButtons.appendChild(pendingMenteeAccept);
//     pendingMenteeIntro.appendChild(pendingMenteeIntroName);
//     pendingMenteeIntro.appendChild(pendingMenteeIntroSchool);
//     pendingMenteeCardHeader.appendChild(pendingMenteeImage);
//     pendingMenteeCardHeader.appendChild(pendingMenteeIntro);
//     pendingMenteeCard.appendChild(pendingMenteeCardHeader);
//     pendingMenteeCard.appendChild(pendingMenteeQuestion);
//     pendingMenteeCard.appendChild(pendingMenteeAnswer);
//     pendingMenteeCard.appendChild(pendingMenteeButtons);

//     pendingMenteeAccept.textContent = 'Accept';
//     pendingMenteeDecline.textContent = 'Decline';
//     pendingMenteeQuestion.textContent = 'Why do you need this mentor?';
//     pendingMenteeAnswer.textContent = value.essay;
//     pendingMenteeIntroName.textContent = value.mentee.basicInfo.fullname;
//     pendingMenteeIntroSchool.textContent = value.mentee.school;

//     pendingMenteeDecline.addEventListener('click', function (e) {
//       e.preventDefault();

//       app.user.handlePendingConnectionRequest('decline', { mentee: value.mentee, index: index });

//       app.mainActivityView.profileView.mentorView.pendingMenteesView.removeChild(pendingMenteeCard);
//     });

//     pendingMenteeAccept.addEventListener('click', function (e) {
//       e.preventDefault();

//       delete value.requestConnection;
//       delete value.requestDisconnection;

//       app.user.handlePendingConnectionRequest('accept', { mentee: value.mentee, index: index });

//       app.createMyMentee(value.mentee);
//       app.mainActivityView.profileView.mentorView.pendingMenteesView.removeChild(pendingMenteeCard);
//     });

//     app.mainActivityView.profileView.mentorView.pendingMenteesView.appendChild(pendingMenteeCard);
//   };

//   /* Render my mentees */
//   app.renderMyMentees = function () {
//     app.user.mentees.forEach(function (mentee) {
//       app.createMyMentee(mentee);
//     });
//   };

//   /* Create my mentee */
//   app.createMyMentee = function (mentee) {
//     var myMenteeCard = document.createElement('div');
//     var myMenteeImage = document.createElement('img');
//     var myMenteeInfo = document.createElement('div');
//     var myMenteeName = document.createElement('p');
//     var myMenteeSchool = document.createElement('p');
//     var myMenteeButtonContainer = document.createElement('div');
//     var myMenteeEvaluate = document.createElement('button');

//     myMenteeEvaluate.setAttribute('class', 'profile-card__btn btn__right');
//     myMenteeButtonContainer.setAttribute('class', 'm-l-10p');
//     myMenteeSchool.setAttribute('class', 'profile-card__info');
//     myMenteeName.setAttribute('class', 'profile-card__info profile-card__info--bold');
//     myMenteeInfo.setAttribute('class', 'block');
//     myMenteeImage.setAttribute('class', 'profile-card__avatar m-l-5p');
//     myMenteeImage.setAttribute('src', 'https://icatcare.org/app/uploads/2018/06/Layer-1704-1920x840.jpg');
//     myMenteeCard.setAttribute('class', 'flex profile-card__my-mentee');

//     myMenteeButtonContainer.appendChild(myMenteeEvaluate);
//     myMenteeInfo.appendChild(myMenteeName);
//     myMenteeInfo.appendChild(myMenteeSchool);
//     myMenteeInfo.appendChild(myMenteeButtonContainer);
//     myMenteeCard.appendChild(myMenteeImage);
//     myMenteeCard.appendChild(myMenteeInfo);

//     myMenteeEvaluate.textContent = 'Evaluate';
//     myMenteeName.textContent = mentee.basicInfo.fullname;
//     myMenteeSchool.textContent = mentee.school;

//     myMenteeEvaluate.addEventListener('click', function (e) {
//       e.preventDefault();

//       var evalBar = document.querySelector('.fa-line-chart');
//       var profileBar = document.querySelector('.fa-user-circle');
//       console.log(app.mainActivityView.evaluationView.mentorView.generalView);
//       evalBar.setAttribute('class', evalBar.className + ' nav--active');
//       profileBar.setAttribute('class', profileBar.className.replace('nav--active', ''));
//       app.mainActivityView.profileView.generalView.style.display = 'none';
//       app.mainActivityView.evaluationView.generalView.style.display = 'block';
//       app.mainActivityView.evaluationView.mentorView.generalView.style.display = 'block';
//       app.mainActivityView.evaluationView.menteeView.generalView.style.display = 'none';
//     });

//     app.mainActivityView.profileView.mentorView.myMenteesView.appendChild(myMenteeCard);
//   };

//   /* Set priviledge for mentee/mentor */
//   app.setUserPrivilege = function () {
//     if (app.user.role === 'mentee') {
//       app.user.requestConnection = function (essay) {
//         var mentee = Object.assign({}, app.user);
//         delete mentee.requestConnection;
//         delete mentee.requestDisconnection;

//         app.selectedMentor.pending.push({ mentee: mentee, essay: essay });
//         console.log(app.selectedMentor);
//         db.collection('users').doc(app.selectedMentor.basicInfo.email).set(app.selectedMentor, { merge: true });
//       };

//       app.user.requestDisconnection = function (essay) {

//       };
//     } else if (app.user.role === 'mentor') {
//       app.user.getConnections = function () {

//       };

//       app.user.handlePendingConnectionRequest = function (action, request) {
//         if (action === 'decline') {
//           app.user._reject(request);
//         } else if (action === 'accept') {
//           app.user._accept(request);
//         }
//       };

//       app.user._accept = function (request) {
//         var thisMentor = Object.assign({}, app.user);
//         delete thisMentor.getConnections;
//         delete thisMentor.handlePendingConnectionRequest;
//         delete thisMentor._accept;
//         delete thisMentor._reject;

//         app.user.mentees.push(request.mentee);
//         app.user.pending.splice(request.index, 1);
//         console.log(request.mentee);
//         request.mentee.mentors.push({ email: thisMentor.basicInfo.email, evaluations: [] });

//         db.collection('users').doc(thisMentor.basicInfo.email).set(thisMentor, { merge: true });
//         db.collection('users').doc(request.mentee.basicInfo.email).set(request.mentee, { merge: true });
//       };

//       app.user._reject = function (request) {
//         var thisMentor = Object.assign({}, app.user);
//         delete thisMentor.getConnections;
//         delete thisMentor.handlePendingConnectionRequest;
//         delete thisMentor._accept;
//         delete thisMentor._reject;

//         app.user.pending.splice(request.index, 1);
//         db.collection('users').doc(thisMentor.basicInfo.email).set(thisMentor, { merge: true });
//       };
//     }
//   }

//   /* Clear search results */
//   app.removeAllSearchResults = function () {
//     while (app.mainActivityView.searchView.searchResultsView.firstChild) {
//       app.mainActivityView.searchView.searchResultsView
//         .removeChild(app.mainActivityView.searchView.searchResultsView.lastChild);
//     }
//   };

//   /* Update search results */
//   app.createSearchResult = function (mentor) {
//     var searchCard = document.createElement('div');
//     var searchCardHeader = document.createElement('span');
//     var searchCardContent = document.createElement('div');
//     var searchCardContentImage = document.createElement('img');
//     var searchCardContentMentor = document.createElement('div');
//     var searchCardContentMentorName = document.createElement('p');
//     var searchCardContentMentorJob = document.createElement('p');
//     var searchCardContentMentorConnect = document.createElement('button');

//     searchCard.setAttribute('class', 'search-card');
//     searchCardHeader.setAttribute('class', 'search-card__header');
//     searchCardContent.setAttribute('class', 'search-card__content search-card__content--flex');
//     searchCardContentImage.setAttribute('class', 'search-card__img');
//     searchCardContentImage.setAttribute('src', 'https://icatcare.org/app/uploads/2018/06/Layer-1704-1920x840.jpg');
//     searchCardContentMentor.setAttribute('class', 'search-card__mentor');
//     searchCardContentMentorName.setAttribute('class', 'search-card__mentor-name');
//     searchCardContentMentorJob.setAttribute('class', 'search-card__mentor-job');
//     searchCardContentMentorConnect.setAttribute('class', 'search-card__connect-btn profile-card__connect-btn');
//     searchCardContentMentorConnect.textContent = 'Connect';

//     searchCardContentMentor.appendChild(searchCardContentMentorName);
//     searchCardContentMentor.appendChild(searchCardContentMentorJob);
//     searchCardContentMentor.appendChild(searchCardContentMentorConnect);
//     searchCardContent.appendChild(searchCardContentImage);
//     searchCardContent.appendChild(searchCardContentMentor);
//     searchCard.appendChild(searchCardHeader);
//     searchCard.appendChild(searchCardContent);
//     app.mainActivityView.searchView.searchResultsView.appendChild(searchCard);

//     searchCardContentMentorName.textContent = mentor.basicInfo.fullname;
//     searchCardContentMentorJob.textContent = mentor.job;

//     searchCard.addEventListener('click', function (e) {
//       var mentorInfo = Object.assign({}, mentor);

//       app.selectedMentor = mentorInfo;

//       if (e.target.tagName === 'BUTTON') {
//         e.stopPropagation();

//         if (app.mainActivityView.searchView.mentorView.generalView.style.display === 'block') {
//           app.mainActivityView.searchView.mentorView.generalView.style.display = 'none';
//         }

//         app.mainActivityView.searchView.searchFieldView.style.display = 'none';
//         app.mainActivityView.searchView.searchResultsView.style.display = 'none';
//         app.mainActivityView.searchView.applicationFormView.generalView.style.display = 'block';

//         return;
//       }

//       document.querySelectorAll('.profile-card__info').forEach(function (value) {
//         if (value.textContent.includes('Full name')) {
//           value.textContent = value.textContent + mentorInfo.basicInfo.fullname;
//         } else if (value.textContent.includes('Age')) {
//           value.textContent = value.textContent + mentorInfo.basicInfo.age;
//         } else if (value.textContent.includes('Cellphone')) {
//           value.textContent = value.textContent + mentorInfo.basicInfo.cellphone;
//         } else if (value.textContent.includes('Bio')) {
//           value.textContent = value.textContent.concat(mentor.basicInfo.bio || '');
//         }
//       });

//       app.mainActivityView.searchView.searchFieldView.style.display = 'none';
//       app.mainActivityView.searchView.searchResultsView.style.display = 'none';
//       app.mainActivityView.searchView.mentorView.generalView.style.display = 'block';

//       if (mentorInfo.pending.length >= 1 || mentorInfo.mentees.length >= 1) {
//         mentorInfo.pending.forEach(function (value) {
//           if (value.mentee.basicInfo.email === app.user.basicInfo.email) {
//             app.mainActivityView.searchView.mentorView.requestView.style.display = 'none';
//             app.mainActivityView.searchView.mentorView.pendingView.style.display = 'block';
//             app.mainActivityView.searchView.mentorView.disconnectView.style.display = 'none';
//           } else {
//             app.mainActivityView.searchView.mentorView.requestView.style.display = 'block';
//             app.mainActivityView.searchView.mentorView.pendingView.style.display = 'none';
//             app.mainActivityView.searchView.mentorView.disconnectView.style.display = 'block';
//           }
//         });

//         mentorInfo.mentees.forEach(function (value) {
//           if (value.basicInfo.email === app.user.basicInfo.email) {
//             app.mainActivityView.searchView.mentorView.requestView.style.display = 'none';
//             app.mainActivityView.searchView.mentorView.pendingView.style.display = 'none';
//             app.mainActivityView.searchView.mentorView.disconnectView.style.display = 'block';
//           } else {
//             app.mainActivityView.searchView.mentorView.requestView.style.display = 'block';
//             app.mainActivityView.searchView.mentorView.pendingView.style.display = 'none';
//             app.mainActivityView.searchView.mentorView.disconnectView.style.display = 'none';
//           }
//         });
//       } else {
//         app.mainActivityView.searchView.mentorView.requestView.style.display = 'block';
//         app.mainActivityView.searchView.mentorView.disconnectView.style.display = 'none';
//         app.mainActivityView.searchView.mentorView.pendingView.style.display = 'none';
//       }
//     });
//   };

//   /* Update recommeded mentors */
//   app.setUpRecommendedMentors = function () {
//     app.getRecommendedMentors().then(function (querySnapshot) {
//       querySnapshot.forEach(function (doc) {
//         app.createSearchResult(doc.data());
//       });
//     }).catch(function (error) {
//       console.log(error);
//     });
//   };

//   /*****************************************************************************
//    *
//    * Methods for dealing with the model
//    *
//    ****************************************************************************/

//   /* Get the user information */
//   app.getUserInfo = function (email) {
//     return db.collection('users').doc(email).get();
//   };

//   app.getRecommendedMentors = function () {
//     return db.collection('users').where('role', '==', 'mentor').get();
//   };

//   app.search = function (query) {
//     if (query['mentor-name'].value !== '' && query['mentor-job'].value === '') {
//       return db.collection('users').where('role', '==', 'mentor').where('basicInfo.fullname', '==', query['mentor-name'].value).get();
//     } else if (query['mentor-name'].value === '' && query['mentor-job'].value !== '') {
//       return db.collection('users').where('role', '==', 'mentor').where('job', '==', query['mentor-job'].value).get();
//     } else {
//       return db.collection('users').where('role', '==', 'mentor').where('basicInfo.fullname', '==', query['mentor-name'].value).where('job', '==', query['mentor-job'].value).get();
//     }
//   };

// })();

// dung format nay do phai commandManager.data.user
var initialData = {
  user: null,
  searchedMentors: null,
};

var commandManager = createCommandManager(initialData);

// Tu bayh dung nhu the nay do khoi setTimeout
commandManager
  .execute(new LogInCommand("andy@gmail.com", "123456"))
  .then(function (value) {
    // chi dung commandManager.data.user o day sau .then
    console.log(initialData.user + " do bla bla after logging in");
    commandManager
      .execute(new SearchCommand("vandijk", ""))
      .then(function (value) {
        console.log(value);
        console.log(initialData.searchedMentors);
      })
      .catch(function (error) {
        console.log(error);
      });
  })
  .catch(function (error) {
    console.log(error);
  });
