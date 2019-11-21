const WORDS_API = "2c641ac47amshde4fb7d34f243e5p1ea1dajsn860dafbf04af";

//Define variables
var words = [
    {
        definition: "a carnivorous mammal (Felis catus) long domesticated as a pet and for catching rats and mice",
        wordOptions: ["dog", "cat", "kangaroo", "rooster", "koala"],
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
var wordDefinition = "";
var word;
var correctWord = "";
var incorrectWords = [];
var correctSynonym = "";
var incorrectSynonyms = [];
var currentScore = 0;
var runningScore = 0;
var userChoiceDefinition = "";
var userChoiceSynonym = "";
var list;
var choice;
var API_usage = JSON.parse(localStorage.getItem("wordsAPI")) || { [moment().format("MM/DD")]: 0 };
var randomWordList = JSON.parse(localStorage.getItem("wordList")) || [];
console.log(randomWordList)

//Creates an Array of 100 Random Words
function LoadRandomWords() {
    console.log("USING WORDS_API!")
    for (var i = 0; i < 100; i++) {
        $.ajax({

            url: "https://wordsapiv1.p.rapidapi.com/words/",
            method: "GET",
            data: {
                "random": "true"
            },
            headers: {
                "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
                "x-rapidapi-key": WORDS_API
            }
        }).then(function (response) {
            console.log("WORDSAPI", response)
            if (!randomWordList.includes(word)) {
                randomWordList.push(word);
                //try to have no space
                API_usage[moment().format("MM/DD")]++;
                localStorage.setItem("wordsAPI", JSON.stringify(API_usage));
                localStorage.setItem("wordList", JSON.stringify(randomWordList));
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
            console.log(user)
            $("#navBarDiv, #gameDiv, #startButton").show();
            $("#authentication").hide();
        } else {
            $("#authentication").show();
        }
    })

    //Sign Up--pushes user information to Firebase database
    document.getElementById("btnSignUp").addEventListener('click', e => {
        const email = document.getElementById("txtEmail").value;
        const pass = document.getElementById("txtPassword").value;
        database.ref().push({
            email: email,
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

     
  
      function GetRandomWord(arr) {
          return arr[Math.floor(Math.random() * arr.length)]
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
        firebase.auth().signOut();
        hideAll();
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
        //Chooses random definition from the object array
        //list = Math.floor(Math.random() * words.length);
        //choice = words[list];
        console.log("this is word" + (GetRandomWord(randomWordList)));
        console.log("word " + QueryWord(word));
        $("#question-block").text("test " + GetRandomWord(randomWordList));
        for (var i = 0; i < GetRandomWord(randomWordList).length; i++) {
            //Create a radio button
            userChoiceDefinition = $("<button>");
            userChoiceDefinition.addClass("answer-choice");
            //Update html with the word options to choose from
            userChoiceDefinition.html(GetRandomWord(randomWordList));
            userChoiceDefinition.attr("value", GetRandomWord(randomWordList));
            $("#answer-block").append(userChoiceDefinition);
            console.log(userChoiceDefinition);
        }
    }

    //Function for the answer that's clicked on, checks answer
    function checkAnswer() {
        $(".answer-choice").on("click", function () {
            chosenAnswerDefinition = $(this).attr("value");
            if (chosenAnswerDefinition === choice.answerDef) {
                alert("You got it right");
                i=choice.answerDef
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
    function updateScore (i) {
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
                i=userChoiceSynonym;
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
        currentScore++;
        database.ref(userId).set({
            score: currentScore,
        });
    });
})