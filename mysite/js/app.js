 $(document).ready(function() {
   //
   // Setup
   //

   var round = 1;
   var points = 0;
   var roundScore = 0;
   var totalScore = 0;
   ranOut = false;
   var distance;

   //
   //  Init maps
   //

   svinitialize();
   mminitialize();

   //
   // Scoreboard & Guess button event
   //

   // Init Timer
   resetTimer();

   // Timer
   
   function timer() {
     count = count - 1;
     if(count <= 0) {
       console.log('finished');
       if(round < 5) {
         endRound();
       } else if(round >= 5) {
         endGame();
       }
       clearInterval(counter);
     }
     $("#timer").html(count);
   };

   // Guess Button
   $('#guessButton').click(function() {
     doGuess();
     rminitialize();
   });

   // End of round continue button click
   $('#roundEnd').on('click', '.closeBtn', function() {
     $('#roundEnd').fadeOut(500);

     // Reload maps to refresh coords
     svinitialize();
     mminitialize();
     rminitialize();

     // Reset Timer
     resetTimer();
   });

   // End of game 'play again' button click
   $('#endGame').on('click', '.playAgain', function() {
     window.location.reload();
   });

   //
   // Functions
   //

   // Reset Timer
   function resetTimer() {
     count = 100;
     counter = setInterval(timer, 1000);
   }

   // Calculate distance between points function
   function calcDistance(fromLat, fromLng, toLat, toLng) {
     return google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(fromLat, fromLng), new google.maps.LatLng(toLat, toLng));
   }

   function doGuess() {
     if(ranOut === false) {

       // Stop Counter
       clearInterval(counter);

       // Reset marker function
       function resetMarker() {
         //Reset marker
         if(guessMarker !== null) {
           guessMarker.setMap(null);
         }
       }

       // Explode latLng variables into separate variables for calcDistance function
       locLatLongs = window.locLL.toString();
       guessLatLongs = window.guessLatLng.toString();

       // Make arrays and clean from (){} characters
       window.locArray = locLatLongs.replace(/[\])}[{(]/g, '').split(',');
       window.guessArray = guessLatLongs.replace(/[\])}[{(]/g, '').split(',');

       // Calculate distance between points, and convert to kilometers
       distance = Math.ceil(calcDistance(window.locArray[0], window.locArray[1], window.guessArray[0], window.guessArray[1]) / 1000);

       // Calculate points awarded via guess proximity
       function inRange(x, min, max) {
         return(min <= x && x <= max);
       }

       // Real basic point thresholds depending on kilometer distances
       if(inRange(distance, 1, 2)) {
         points = 100;
       } else if(inRange(distance, 3, 10)) {
         points = 70;
       } else if(inRange(distance, 11, 50)) {
         points = 40;
       } else if(inRange(distance, 51, 200)) {
         points = 30;
       } else if(inRange(distance, 201, 500)) {
         points = 20;
       } else if(inRange(distance, 501, 800)) {
         points = 10;
       } else if(inRange(distance, 801, 1300)) {
         points = 5;
       } else if(inRange(distance, 1301, 1600)) {
         points = 4;
       } else if(inRange(distance, 1601, 2300)) {
         points = 30;
       } else if(inRange(distance, 2301, 2800)) {
         points = 20;
       } else if(inRange(distance, 2801, 3200)) {
         points = 10;
       } else if(inRange(distance, 3200, 4500)) {
         points = 5;
       } else if(inRange(distance, 4501, 6000)) {
         points = 2.5;
       } else {
         points = 0;
       }

       if(round < 5) {

         endRound();
       } else if(round >= 5) {
         endGame();
       }

     } else {

       // They ran out

     }

     timer();
     window.guessLatLng = '';

   }

   function endRound() {
     round++;
     if(ranOut === true) {
       roundScore = 0;
     } else {
       roundScore = points;
       totalScore = totalScore + points;
     }

     $('.round').html('Current Round: <b>' + round + '/5</b>');
     $('.roundScore').html('Last Round Score: <b>' + roundScore + '</b>');
     $('.totalScore').html('Total Score: <b>' + totalScore + '</b>');

     // If distance is undefined, that means they ran out of time and didn't click the guess button
     if(typeof distance === 'undefined' || ranOut === true) {
       $('#roundEnd').html('<p>Вы слишком долго<br/> Вы не набрали очков в этом раунде!<br/><br/><button class="btn btn-primary closeBtn" type="button">Continue</button></p></p>');
       $('#roundEnd').fadeIn();

       // Stop Counter
       clearInterval(counter);

       // Reset marker function
       function resetMarker() {
         //Reset marker
         if(guessMarker !== null) {
           guessMarker.setMap(null);
         }
       }

       window.guessLatLng = '';
       ranOut = false;

       points = 0;
     } else {
       $('#roundEnd').html('<p>Ваша догадка была на<br/><strong><h1>' + distance + '</strong>km</h1> вдали от фактического местоположения.<br/><div id="roundMap"></div><br/> Вы набрали<br/><h1>' + roundScore + ' очков</h1> в этом раунде!<br/><br/><button class="btn btn-primary closeBtn" type="button">Продолжить</button></p></p><br/><a href="http://campit.kz/?lng=ru">Хотели бы быть здесь, то вам сюда</a><br/>');
       $('#roundEnd').fadeIn();
     }

     // Reset Params
     window.guessLatLng = '';
     ranOut = false;

   }

   function endGame() {

     roundScore = points;
     totalScore = totalScore + points;

     $('#miniMap, #pano, #guessButton, #scoreBoard').hide();
     $('#endGame').html('<h1>Поздравляем!</h1><h2>Ваши баллы:</h2><h1>' + totalScore + '!</h1><br/>Поделиться этим:<br/><br/><a class="btn" href="http://www.facebook.com/sharer.php?s=100&p[title]=' + encodeURIComponent('Whereami') + '&p[summary]=' + encodeURIComponent('I just scored ' + totalScore + ' playing Whereami!') + '&p[url]=' + encodeURIComponent('https://github.com/webdevbrian/whereami') + '" target="_blank">Facebook</a> <a class="btn" href="https://twitter.com/intent/tweet?text=I+just+scored+' + totalScore + '+playing+whereami+by+@phrozen755,+based+off+of+geoguessr%21&url=https://github.com/webdevbrian/whereami" target="_blank">Twitter</a></p><br/><button class="btn btn-large btn-success playAgain" type="button">Play Again?</button>');
	 $('#endGame').fadeIn(500);

     rminitialize();

     // We're done with the game
     window.finished = true;
   }
 });
