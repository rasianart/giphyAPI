var favorites = {

	gifArray: [],

	printDOM: function(){
		$('<div id="results"/>').appendTo('body');
		$('<a>').attr({'id': 'stored', 'href': 'index.html'}).text('Search Again').appendTo('body');		
		$('<button>').attr('id', 'clearFav').text('Clear Favorites').appendTo('body');
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
	},

	clearFavorites: function() {
		$(document).on('click', 'button#clearFav', function(event) {
			localStorage.clear();
			$('#results').empty();
		});
	}
}

favorites.printDOM();
favorites.clearFavorites();
