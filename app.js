//Global Variable
const WORDS_API = "VGGWWD0A";

//Global Variables
var word;
var currentScore = 0;
var name = "";
var userChoiceSynonym = "";
var answerArray = [];
var answer = "";
var wordOptions;
var answerChosen;
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
    wordOptions="";
        // answerChosen="";
        // wordDefinition="";
        // answer="";
        // i='';
        // word="";
        // answerArray=[];  
    for (var i = 0; i < 1; i++) {
        $.ajax({
            url: "https://random-word-api.herokuapp.com/word?key=VGGWWD0A&number=100",
            method: "GET",
        }).then(function (response) {
            console.log("WORDSAPI", response);
            for (i = 0; i < 5; i++) {
                j = [Math.floor(Math.random() * response.length)];
                word = response[j]
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
            console.log(test);
            console.log(wordDefinition);
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
                wordOptions.text(answerArray[i]);
                wordOptions.attr("value", answerArray[i]);
                wordOptions.attr("id", "button" + i);
                $("#answer-block").append(wordOptions);
            }
        }
        j = (Math.floor(Math.random() * 5));
        answerChosen = $("#button" + j).text(answer)
        answerChosen.addClass("word-options");
        answerChosen.attr("value", answer);
        answerArray=[];  
    }

    //Function for the answer that's clicked on, checks answer
    function checkAnswer() {
        $(".word-options").on("click", function () {
            wordOptions = $(this).attr("value");
            answerChosen = $(this).attr("value");
            console.log("answer chosen" + answerChosen);
            console.log("answer" + answer);
            if (answerChosen === answer) {
                alert("You got it right");
                i = answer;
                updateScore(i);
                $("#answer-block").empty();
                nextWord();
                }
                else{
                    alert("you got it wrong");
                nextWord();
            }
            });
    }
    
    //Populates Player Scores Page
    function updateScore(i) {
        currentScore++;
        $(".words").append("<tr><td>" + "</td><td>" + i + "</td></tr>");
        $(".score").text("Current Score: " + currentScore);
    }

    //Function to move to the next word
    function nextWord() {
        $("#answer-block").empty();
        $("#answer-response").empty();
        QueryWord(GetRandomWord(randomWordList));
        LoadRandomWords();
        buttonCreation();
        checkAnswer();
    }
})

    //Checking synonym answer
    function checkSynonym() {
        $(".synonym-choice").on("click", function () {
            userChoiceSynonym = $(this).attr("value");
            if (userChoiceSynonym === choice.answerSyn) {
                i = userChoiceSynonym;
                alert("Correct");
                updateScore(i);
                nextWord();
            }
            else {
                alert("wrong");
                nextWord();
            }
        })
    }

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
