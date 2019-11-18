$(document).ready(function () {
  //hides initial game div
  $("#gameDiv").hide();
  $("#highScoresDiv").hide();
  $("#playerScoreDiv").hide();

  //Define variables
  var wordDefinition = "";
  var correctWord = "";
  var incorrectWords = [];
  var correctSynonym = "";
  var incorrectSynonyms = [];
  var currentScore = 0;
  var runningScore = 0;
  var queryUrlDictionary = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + correctWord + "?key=ce96d9e4-de5d-4795-8723-7c3340d395de"
  var queryUrlThesaurus = "https://words.bighugelabs.com/api/2/9670eec22c87195e1d58c8571bc3859c/" + correctWord + "/json"

  // Your web app's Firebase configuration>
  var firebaseConfig = {
    apiKey: "AIzaSyD83Tk0z9YVwAtDNttLZqTeFkF7zP7EqnA",
    authDomain: "dexicon-80ee3.firebaseapp.com",
    databaseURL: "https://dexicon-80ee3.firebaseio.com",
    projectId: "dexicon-80ee3",
    storageBucket: "dexicon-80ee3.appspot.com",
    messagingSenderId: "798370905412",
    appId: "1:798370905412:web:0c9cac250ce35e92202b11"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //Sign Up--pushes user information to Firebase database
  document.getElementById("btnSignUp").addEventListener('click', e => {
    const email = document.getElementById("txtEmail").value;
    const pass = document.getElementById("txtPassword").value;
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function (error) {
      console.log(error.message);
    });
  })

  //Log in--checks user information against Firebase database
  document.getElementById("btnLogin").addEventListener('click', e => {
    const email = document.getElementById("txtEmail").value;
    const pass = document.getElementById("txtPassword").value;
    const promise = firebase.auth().signInWithEmailAndPassword(email, pass);
    promise.catch(e => { console.log(error.message) })
    console.log("login first")
  })

  //On authorized login, hides authentification div and shows app div
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      $("#gameDiv").show();
      $("#authentication").hide();
      console.log("login confirmed")
    } else {
      document.getElementById("btnLogOut").classList.add('hidden')
      console.log("login bad")
    }
  })

  //Navigation Buttons
    $("[id^=btnLogOut]").click(e => {
      firebase.auth().signOut();
      console.log('logged out')
      $("#gameDiv").hide();
      $("#highScoresDiv").hide();
      $("#playerScoreDiv").hide();
      $("#authentication").show();
    })

    $(".homeButton").on("click", function () {
      $("#gameDiv").show();
      $("#playerScoreDiv").hide();
      $("#highScoresDiv").hide();
      console.log("home");
    })

    $(".yourScore").on("click", function () {
      $("#playerScoreDiv").show();
      $("#gameDiv").hide();
      $("#highScoresDiv").hide();
      console.log("yourScore");
    })

    $(".highScore").on("click", function () {
      $("#gameDiv").hide();
      $("#playerScoreDiv").hide();
      $("#highScoresDiv").show();
      console.log("highScore");
    })

  // $(document).ready(function(){
  $("#question-block").hide();
  $("#answer-block").hide();
  $(".submit").hide();

  //Game start functions
  console.log("page is loaded");
  $(".start").on('click', function () {

    //Hide the start button
    $(".start").hide();
    $("#question-block").show();
    $("#answer-block").show();
    $(".submit").show();
    console.log(".click");
  });


  //Storing our dictionary API URL for a random definition

  //Render buttons

  //Dictionary API
  $.ajax({
    url: queryUrlDictionary,
    method: "GET"
  }).then(function (response) {
    console.log(response);
  });


  //Thesaurus API
  $.ajax({
    url: queryUrlThesaurus,
    method: "GET"
  }).then(function (response) {
    console.log(response);
  });

})
