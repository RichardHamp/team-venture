const WORDS_API = "VGGWWD0A";

function addScores() {
    i = runningScore + currentScore;
    database.ref('users/' + name).update({
    score: i,
    });
}

window.onbeforeunload = function (e) {
    addScores();
    firebase.auth().signOut();
    name = "";
    currentScore = 0;
}

//Define variables
var words = [
    {
        definition: "a carnivorous mammal (Felis catus) long domesticated as a pet and for catching rats and mice",
        //wordOptions: ["dog", "cat", "kangaroo", "rooster", "koala"],
        answerDef: "cat",
        synonymOptions: ["kitten", "monkey", "zubat", "person", "giraffe"],
        answerSyn: "kitten"
    },
    {
        definition: "having a delicious taste or smell",
        wordOptions: ["luscious", "meaty", "rabid", "sporty", "posh"],
        answerDef: "luscious",
        synonymOptions: ["squiggle", "yummy", "surf", "school", "banana"],
        answerSyn: "yummy"
    },
    {
        definition: "a deep-bowled long-handled spoon used especially for dipping up and conveying liquids",
        wordOptions: ["spatula", "noodle", "bear", "ladle", "brain"],
        answerDef: "ladle",
        synonymOptions: ["fork", "spork", "spoon", "forest", "sky"],
        answerSyn: "spoon"
    }
];

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

// Creates hideAll function
function hideAll() {
    $("#navBarDiv, #highScoresDiv, .score, #gameDiv, #playerWordsDiv, #authentication, #question-block, #answer-block, #startButton, .submit").hide();
}

hideAll();

//Global Variables
var currentUser = "";
var wordDefinition = "";
var word;
var correctWord = "";
var incorrectWords = [];
var correctSynonym = "";
var incorrectSynonyms = [];
var currentScore = 0;
var name = "";
var userChoiceDefinition = "";
var userChoiceSynonym = "";
var wordOptions;
var list;
var choice;
var API_usage = JSON.parse(sessionStorage.getItem("wordsAPI")) || { [moment().format("MM/DD")]: 0 };
var randomWordList = JSON.parse(sessionStorage.getItem("wordList")) || [];
console.log("this is randomWordList " + randomWordList);


//Creates an Array of 100 Random Words
function LoadRandomWords() {
    console.log("USING WORDS_API!")
    for (var i = 0; i < 1; i++) {
        $.ajax({

            url: "https://random-word-api.herokuapp.com/word?key=VGGWWD0A&number=100",
            method: "GET",
            
            
        }).then(function (response) {
            console.log("WORDSAPI", response)
            word = response[Math.floor(Math.random() * response.length)];
            if (!randomWordList.includes(word)) {
                randomWordList.push(word);
                
                API_usage[moment().format("MM/DD")]++;
                sessionStorage.setItem("wordsAPI", JSON.stringify(API_usage));
                sessionStorage.setItem("wordList", JSON.stringify(randomWordList));
            }
        })
    }
}

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
            console.log(name);
            $("#navBarDiv, #gameDiv, #startButton").show();
            $("#authentication").hide();
            scoreAdd = firebase.database().ref('users/' + name + '/score');
    scoreAdd.on('value', function(snapshot) {
        runningScore= snapshot.val();
        console.log(runningScore);
      });
            return(name);
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
        console.log(name)
        database.ref('users/' + name).set({
            email: email,
            score: 0,
            words: "placeholder",
            dateAdded: firebase.database.ServerValue.TIMESTAMP,
        });


        firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function (error) {
            console.log(error.message);
        });
        console.log(email);
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

    function GetRandomWord(arr) {
        return arr[Math.floor(Math.random() * arr.length)]
    }
    
    function QueryWord(word) {
        console.log("QueryWord", word)
        var queryUrlDictionary = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=ce96d9e4-de5d-4795-8723-7c3340d395de";
        var queryUrlThesaurus = "https://words.bighugelabs.com/api/2/9670eec22c87195e1d58c8571bc3859c/" + word + "/json";
        //Dictionary API
        $.ajax({
            url: queryUrlDictionary,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            test = response[0];
            wordDefinition = test.shortdef[0];
            console.log(wordDefinition);
            $("#question-block").text('Definition: "'+ wordDefinition + '"');
        })
            .catch(function (err) {
                console.log("DICTIONARY ERROR")
            });

        //Thesaurus API
        //    $.ajax({
        //      url: queryUrlThesaurus,
        //      method: "GET"
        //    }).then(function (response) {
        //      console.log(JSON.parse(response));
        //    })
        //      .catch(function (err) {
        //        console.log("Thesauras ERROR")
        //      });
    }


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
    })

    //Navigation Buttons
    $("[id^=btnLogOut]").click(e => {
        addScores();
        firebase.auth().signOut();
        hideAll();
        name = "";
        currentScore = 0;
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

    //Game play function
    function displayDefinition() {
        console.log("this is word" + (GetRandomWord(randomWordList)));


        //definition goes here

        
        // console.log("word " + QueryWord(word));
        // $("#question-block").text("test " + word);
        // for (var i = 0; i < randomWordList.length; i++) {
        //     //Create a button for the correct answer
        //     if(i < 1){
        //     userChoiceDefinition = $("<button>");
        //     userChoiceDefinition.addClass("answer-choice");
        //     //Update html with the word options to choose from
        //     userChoiceDefinition.html(word);    
        //     userChoiceDefinition.attr("value", word);
        //     $("#answer-block").append(userChoiceDefinition);
        //     console.log(userChoiceDefinition);
        // }}
            for(var i = 0; i < 5; i++){
                if(i < 5){
                console.log("1");
                wordOptions = $("<button>");
                wordOptions.addClass("word-options");
                wordOptions.html(GetRandomWord(randomWordList))
                wordOptions.attr("value", wordOptions);
                $("#answer-block").append(wordOptions);
            }}
        }
    

    //Function for the answer that's clicked on, checks answer
    function checkAnswer() {
        $(".answer-choice").on("click", function () {
            chosenAnswerDefinition = $(this).attr("value");
            if (chosenAnswerDefinition === choice.answerDef) {
                alert("You got it right");
                i = choice.answerDef
                console.log(choice.answerDef)
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

    // console.log(word);
    function updateScore(i) {
        currentScore++;
        console.log(i)
        $(".words").append("<tr><td>" + "</td><td>" + i + "</td></tr>");
        $(".score").text(currentScore);
        console.log(currentScore);
    }

    //Function to move to the next word
    function nextWord() {
        $("#answer-block").empty();
        $("#answer-response").empty();
        displayDefinition();
        checkAnswer();
    }
    //To check the answer for the synonym
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

    $("#testButton").on("click", function () {
        updateScore();
        console.log(currentScore);
        console.log(name)
    });
})

//Populates User Scores
var ref = database.ref('users');
ref.on('value', gotData, errData);

function gotData(data) {
    var scores = data.val();
    var keys = Object.keys(scores);
    console.log(scores)
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

// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//         console.log(name);
//     scoreAdd = firebase.database().ref('users/' + 'a@a' + '/score');
//     scoreAdd.on('value', function(snapshot) {
//         runningScore= snapshot.val();
//         console.log(runningScore);
//       });
// } 

// else {
//     console.log("I'm in the login");
//   }
// });

function errData(err) {
    console.log("error")
    console.log(err)
}