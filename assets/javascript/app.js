$(document).ready(function() {

// array of buttons 
var places = {

	placesToD: [
	'field',
	'snow',
	'school',
	'church',
	'picnic',
	'alone',
	'white house',
	'home',
	'south',
	'family'
	],

// empty array used for pushing chosen gifs to favorite storage/localStorage
	gifArray: [],

// creates and prints all elements to DOM
	printDOM: function() {
		$('<button>').attr({'id': 'stored', 'class': 'btn btn-outline-secondary'}).text('Favorite Gifs').appendTo('body');
		$('<div id="results"/>').appendTo('body');
		var userInput = $('<form id="form"/>');
		userInput.append($('<input id="input" type="text" placeholder="Add a place">'));
		userInput.prependTo('body');
		$('<button id="submit">Submit</button>').appendTo(userInput);
		$('<div id="dialog-animated"/>').appendTo('body');
	    $('<img id="chosenGif">').appendTo('#dialog-animated');
	    $('<div id="buttonHolder">').prependTo('#form');

		for(var i = 0; i < this.placesToD.length; i++){
			this.createButton(this.placesToD[i]);
		}
		$('<h1 id="header"/>').text('Places To D').prependTo('body');
	},

// create button function
	createButton: function(places) {
		var button = $('<input/>', { class: "pButton btn btn-outline-secondary", type: "button", value: places });
		button.data('search', places);
		$('#buttonHolder').append(button);
	},

// gives submit button functionality and takes input values
	submitBut: function() {
		$( '#submit' ).on('click', function() {
  			var values = $('#input').val();
  			event.preventDefault();
  			places.createButton(values);
  			$('#input').val('');
		});
	},

// on button click makes an ajax call and displays results to the DOM
	buttonClick: function() {
		$(document).on('click', 'input.pButton', function() {
			$('#results').empty();
			var search = $(this).data('search');
        	var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=dc6zaTOxFJmzC&limit=10";
	        $.ajax({
	                url: queryURL,
	                method: 'GET'
	            })
	            .done(function(response) {	              
	                var results = response.data;
	                for (var i = 0; i < results.length; i++) {
	                	var imageBox = $('<div class="image-box"/>');
	                	var rating = $('<p/>').text(results[i].rating.toUpperCase());
	                    var gifImage = $('<img>');	                
	                    gifImage.attr({
	                    	'src': results[i].images.fixed_height_still.url, 
	                    	'class': 'gif', 
	                    	'data-still': results[i].images.fixed_height_still.url, 
	                    	'data-animate': results[i].images.fixed_height.url, 
	                    	'data-state': 'still'});	        
	                    imageBox.append(rating);
	                    imageBox.append(gifImage);
	                    (imageBox).appendTo('#results');
	                }
	            });
	              
		});
	},

// this function is not used, but it for the purposes of the assignment - it was required.  
	// I chose to use a different method, but I had this one implemented first. Pauses and plays gif on click
	imagePause: function() {
		$(document).on('click', 'img.gif', function(event) {
		    event.preventDefault();
			var state = $(this).attr('data-state');
			if ( state == 'still'){
                $(this).attr('src', $(this).data('animate'));
                $(this).attr('data-state', 'animate');
            }else{
                $(this).attr('src', $(this).data('still'));
                $(this).attr('data-state', 'still');
            }
        });
	},

// creates a pop up dialog
	popUp: function() {
		$( "#dialog-animated" ).dialog({
	        autoOpen: false,
	        buttons: [
	            {
	                text: "Pause",
	                "class": "btn btn-outline-secondary pause",
	                click: $.noop
	            },
	            {
	            	text: "Play",
	            	"class": "btn btn-outline-secondary play",
	            	click: $.noop
	            },
	            {
	            	text: "Favorite",
	            	"class": "btn btn-outline-secondary favorite",
	            	click: $.noop
	            }
	        ],
	        show: {
	            effect: "bounce",
	            duration: 1000
	        },
	        hide: {
	            effect: "fade",
	            duration: 300
	        }
	    });
	},

// on click shows the pop up dialog with the chosen/clicked gif.  there are play/pause buttons
// also a favorite button that pushes the gif and the still gif to an array in local storage
	popActivate: function() {
	    $(document).on('click', 'img.gif', function(event) {
			event.preventDefault();
			var animate = $(this).data('animate');
			console.log(animate);
			var still = $(this).data('still');
			$('#chosenGif').attr('src', animate);
	        $( "#dialog-animated" ).dialog( "open" );
	        $('.pause').on('click', function() {
	        	$('#chosenGif').attr('src', still);
	        });
	        $('.play').on('click', function() {
	        	$('#chosenGif').attr('src', animate);
	        });
	        $('.favorite').one('click', function() {
	        	var gifObj = {
	        		animateGif: animate,
	        		stillGif: still
	        	};
	        	places.gifArray.push(gifObj);
	        	console.log(places.gifArray);
	        	localStorage.clear();
	        	localStorage.setItem("gifs", JSON.stringify(places.gifArray));
	        $( "#dialog-animated" ).dialog( "close" );
	        });
	    });
	},

// clears the DOM and displays the array of gifs stored in the local storage
	storedPage: function() {
		$(document).on('click', 'button#stored', function(event) {
			$('body').empty();
			// places.gifArray = [];
			$('<button>').attr({'id': 'search', 'class': 'btn btn-outline-secondary'}).text('Search Again').appendTo('body');
			$('<button>').attr({'id': 'clearFav', 'class': 'btn btn-outline-secondary'}).text('Clear Favorites').appendTo('body');
			$('<div id="results"/>').appendTo('body');
			if(JSON.parse(localStorage.getItem("gifs"))){
				var storedGifs = JSON.parse(localStorage.getItem("gifs"));
				gifArray = storedGifs;
				for(var i=0; i < gifArray.length; i++) {
					var gifs = gifArray[i];
			    	var imageBox = $('<div class="image-box"/>');
			        var gifImage = $('<img>');	                
			        gifImage.attr({
			        	'src': gifArray[i].animateGif, 
			        	'class': 'gif', 
			        	'data-still': gifArray[i].stillGif, 
			        	'data-animate': gifArray[i].animateGif});	        
			        imageBox.append(gifImage);
			        (imageBox).appendTo('#results');
				                
				}
			}
		});
	},

// search again button that recreates original DOM and allows a repeat process
	searchAgain: function() {
		$(document).on('click', 'button#search', function(event) {
			$('body').empty();
			places.printDOM();
			places.popUp();
			// places.popActivate();
			places.storedPage();
			places.ifStored();
		});
	},

// clears the local storage, array, and DOM and recreates the original DOM for a repeat process
	clearFavorites: function() {
		$(document).on('click', 'button#clearFav', function(event) {
			localStorage.clear();
			places.gifArray = [];
			$('#results').empty();
		});
	},

// function that checks if there is a local storage and set an array equal to the storage, ready to be printed to the DOM
	ifStored: function() {
		if(JSON.parse(localStorage.getItem("gifs"))){
			var storedGifs = JSON.parse(localStorage.getItem("gifs"));
			places.gifArray = storedGifs;
		}
	},

};

places.printDOM();
places.submitBut();
places.buttonClick();
places.popUp();
places.popActivate();
places.storedPage();
places.searchAgain();
places.clearFavorites();
places.ifStored();

});

