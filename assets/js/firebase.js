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

//On authorized login, hides authentification div and shows app div
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        $("#gameDiv").show();
        $("#authentication").hide();
        console.log("login confirmed")
    } else {
        $("#authentication").show();
        document.getElementById("btnLogOut").classList.add('hidden')
        console.log("login bad")
    }
})