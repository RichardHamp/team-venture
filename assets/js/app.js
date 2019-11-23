//Global Variable
const WORDS_API = "VGGWWD0A";

//Global Variables
var word;
var currentScore = 0;
var name = "";
var userChoiceSynonym = "";
var answerArray = [];
var answer = ""
var choice;
var API_usage = JSON.parse(sessionStorage.getItem("wordsAPI")) || { [moment().format("MM/DD")]: 0 };
var randomWordList = JSON.parse(sessionStorage.getItem("wordList")) || [];

//Updates Firebase score
function addScores() {
    i = runningScore + currentScore;
    database.ref('users/' + name).update({
        score: i,
    });
}

//Clears variables
function wipe() {
    name = "";
    currentScore = 0;
    answerArray = "";
}

//Function fires on page refresh to clear user login
window.onbeforeunload = function (e) {
    addScores();
    firebase.auth().signOut();
    wipe();
}

// Hides all divs
function hideAll() {
    $("#navBarDiv, #highScoresDiv, .score, #gameDiv, #playerWordsDiv, #authentication, #question-block, #answer-block, #startButton, .submit").hide();
} hideAll();

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
var database = firebase.database();

//Creates an Array of 100 Random Words
function LoadRandomWords() {
    for (var i = 0; i < 1; i++) {
        $.ajax({
            url: "https://random-word-api.herokuapp.com/word?key=VGGWWD0A&number=100",
            method: "GET",
        }).then(function (response) {
            var word1 = (response[Math.floor(Math.random() * response.length)]);
            for (i = 0; i < 5; i++) {
                word = (response[Math.floor(Math.random() * response.length)]);
                answerArray.push(word);
            }
            word = response[Math.floor(Math.random() * response.length)];
            if (!randomWordList.includes(word)) {
                randomWordList.push(word);
                API_usage[moment().format("MM/DD")]++;
                sessionStorage.setItem("wordsAPI", JSON.stringify(API_usage));
                sessionStorage.setItem("wordList", JSON.stringify(randomWordList));
            }
        }
        )
    }
}

//Populates User Scores
var ref = database.ref('users');
ref.on('value', gotData);
function gotData(data) {
    var scores = data.val();
    var keys = Object.keys(scores);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var initials = scores[k].email;
        var score = scores[k].score;
        var li = document.createElement('li');
        var newContent = document.createTextNode(initials + ': ' + score);
        li.appendChild(newContent);
        $("#scorelist").append(li);
    }
}

//Gameplay
$(document).ready(function () {
    var count = API_usage[moment().format("MM/DD")];
    if (count < 2000 && randomWordList.length < 100) {
        LoadRandomWords();
    }

    //Log in--checks user information against Firebase database
    document.getElementById("btnLogin").addEventListener('click', e => {
        const email = document.getElementById("txtEmail").value;
        const pass = document.getElementById("txtPassword").value;
        const promise = firebase.auth().signInWithEmailAndPassword(email, pass);
        promise.catch(e => { console.log(error.message) })
    })

    //On authorized login, hides authentification div and shows app div
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            userId = user.uid;
            umail = (user.email)
            name = umail.substring(0, umail.lastIndexOf("."));
            $("#navBarDiv, #gameDiv, #startButton").show();
            $("#authentication").hide();
            scoreAdd = firebase.database().ref('users/' + name + '/score');
            scoreAdd.on('value', function (snapshot) {
                runningScore = snapshot.val();
            });
            return (name);
        } else {
            $("#authentication").show();
        }
    })

    //Sign Up--pushes user information to Firebase database
    $("#btnSignUp").on('click', function () {
        firebase.auth().signOut();
        name = "";
        currentScore = 0;
        const email = document.getElementById("txtEmail").value;
        const pass = document.getElementById("txtPassword").value;
        name = email.substring(0, email.lastIndexOf("."));
        database.ref('users/' + name).set({
            email: email,
            score: 0,
            words: "placeholder",
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
        });
        firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function (error) {
            console.log(error.message);
        });
    })

    //Start Game Function
    $(".start").on('click', StartGame);
    function StartGame() {
        hideAll();
        $("#gameDiv, #question-block, #answer-block, #navBarDiv, #questions, .score").show();
        $("#startButton").hide();
        QueryWord(GetRandomWord(randomWordList));
        nextWord();
    }

    //Randomizing Correct Word
    function GetRandomWord(arr) {
        return arr[Math.floor(Math.random() * arr.length)]
    }

    //Navigation Buttons
    $("[id^=btnLogOut]").click(e => {
        addScores();
        firebase.auth().signOut();
        hideAll();
        wipe()
        $("#authentication").show();
    })
    $(".homeButton").on("click", function () {
        hideAll();
        $("#gameDiv, #navBarDiv, #startButton").show();
    })
    $(".yourWords").on("click", function () {
        hideAll();
        $("#playerWordsDiv, #navBarDiv").show();
    })
    $(".highScore").on("click", function () {
        hideAll();
        $("#highScoresDiv, #navBarDiv").show();
    })

    //Word Lists
    function QueryWord(word) {
        answer = word;
        var queryUrlDictionary = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=ce96d9e4-de5d-4795-8723-7c3340d395de";
        var queryUrlThesaurus = "https://words.bighugelabs.com/api/2/9670eec22c87195e1d58c8571bc3859c/" + word + "/json";

        //Dictionary API
        $.ajax({
            url: queryUrlDictionary,
            method: "GET"
        }).then(function (response) {
            test = response[0];
            var wordDefinition = test.shortdef[0];
            $("#question-block").text('Definition: "' + wordDefinition + '"');
        })
            .catch(function (err) {
                console.log("DICTIONARY ERROR")
            });
    }

    //Game play function
    function buttonCreation() {
        for (var i = 0; i < 5; i++) {
            if (i < 5) {
                wordOptions = $("<button>");
                wordOptions.addClass("word-options");
                wordOptions.html(answerArray[i]);
                wordOptions.attr("value", wordOptions);
                wordOptions.attr("id", "button" + i);
                $("#answer-block").append(wordOptions);
            }
        }
        j = (Math.floor(Math.random() * 5));
        $("#button" + j).text(answer);
    }

    //Function for the answer that's clicked on, checks answer
    function checkAnswer() {
        $(".answer-choice").on("click", function () {
            chosenAnswerDefinition = $(this).attr("value");
            if (chosenAnswerDefinition === choice.answerDef) {
                alert("You got it right");
                i = choice.answerDef
                updateScore(i);
                $("#answer-block").empty();
                for (var j = 0; j < choice.synonymOptions.length; j++) {
                    $("#question-block").html("Choose the synonym of '" + i + "'");
                    userChoiceSynonym = $("<button>");
                    userChoiceSynonym.addClass("synonym-choice");
                    userChoiceSynonym.html(choice.synonymOptions[j]);
                    userChoiceSynonym.attr("value", choice.synonymOptions[j]);
                    $("#answer-block").append(userChoiceSynonym);
                }
            }
            else {
                alert("wrong");
                nextWord();
            }
            checkSynonym();
        });
    }

    //Populates Player Scores Page
    function updateScore(i) {
        currentScore++;
        $(".words").append("<tr><td>" + "</td><td>" + i + "</td></tr>");
        $(".score").text(currentScore);
    }

    //Function to move to the next word
    function nextWord() {
        $("#answer-block").empty();
        $("#answer-response").empty();
        buttonCreation();
        checkAnswer();
    }
})