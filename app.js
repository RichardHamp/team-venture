$(document).ready(function(){
  $("#question-block").hide();
  $("#answer-block").hide();
  $(".submit").hide();
//Game start functions
console.log("page is loaded");
$(".start").on('click', function(){
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
});

