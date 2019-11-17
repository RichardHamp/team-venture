
//hides initial game div
$("#game").hide();

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
    $("#game").show();
    $("#authentication").hide();
    console.log("login confirmed")
  } else {
    document.getElementById("btnLogOut").classList.add('hidden')
    console.log("login bad")
  }
})

//Logout button--no use currently, but should put it on page somewhere if we have time
document.getElementById("btnLogOut").addEventListener('click', e => {
  firebase.auth().signOut();
  console.log('logged out')
  $("#game").hide();
  $("#authentication").show();
})

//Game start functions
$("#start").on('click', function(){
  //Hide the start button
  $("#start").hide();
  $("#QUESTIONS").show();
});

//Storing our dictionary API URL for a random definition

//Render buttons

//Dictionary API
$.ajax({
    url: "https://www.dictionaryapi.com/api/v3/references/collegiate/json/voluminous?key=ce96d9e4-de5d-4795-8723-7c3340d395de",
    method: "GET"}).then(function(response) {
        console.log(response);
});


//Thesaurus API
$.ajax({
    url: "https://words.bighugelabs.com/api/2/9670eec22c87195e1d58c8571bc3859c/cat/json",
    method: "GET"}).then(function(response) {
        console.log(response);
});      


