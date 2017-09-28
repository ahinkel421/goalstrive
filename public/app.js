let state = {
	loggedIn: false
}

let pageIDs = [
	"homepage",
	"sign-up-page",
	"log-in-page",
	"no-goals",
	"new-destination-goal-page",
	"my-destination-goals-page"
];

$(function () { 

	//Functions/Function Stubs

	function hideAllPages() {
		for(let i = 0; i < pageIDs.length; i++){
			let id = pageIDs[i];
			$('#' + id).addClass('hidden');
		}
	}

	//This function should make a request to add a new user to the DB
	//Currently getting a 422 (Unprocessable Entity) Error
	function handleSignup(username, password) {
		let userData = {
			username: username,
			password: password
		};

		$.ajax({
			url: "http://localhost:8080/api/users",
			type: "Post",
			data: userData,
			dataType: "json",
			success:function(data){
				console.log("yay! things worked");
				state.loggedIn = true;
			}
		});
	}

	$('#sign-up-form-js').submit(function(event) {
		event.preventDefault();
		let username = $('.username-js').val();
		let password = $('.password-js').val();
		handleSignup(username, password);
	});

	function handleLogin(username, password) {
		let userData = {
			username: username,
			password: password
		};

		$.ajax({
			url: "http://localhost:8080/api/auth/login",
			type: "Post",
			data: userData,
			dataType: "json",
			success:function(data){
				console.log("yay! things worked");
				state.loggedIn = true;
				handleHeaderLinks();
			}
		});
	}

	$('#login-form-js').submit(function(event) {
		event.preventDefault();
		let username = $('.username-js').val();
		let password = $('.password-js').val();
		handleLogin(username, password);
	});

	function handleHeaderLinks() {
		if(state.loggedIn === true) {
			$('.nav-link').addClass('hidden');
			$('#my-goals-link, #logout-nav-link').removeClass('hidden');
		}
		else {
			$('#my-goals-link').addClass('hidden');
			$('.nav-link').removeClass('hidden');
		}
	}

	//Event Listeners 

	$('.get-started').on('click', function() {
		hideAllPages();
		$('#sign-up-page').removeClass('hidden');
	});

	$('.login-link-js').on('click', function() {
		hideAllPages();
		$('#log-in-page').removeClass('hidden');
	});

	$('#demo').on('click', function() {
		hideAllPages();
		$('#no-goals').removeClass('hidden');
	});

	$('.home-link').on('click', function() {
		hideAllPages();
		$('#homepage').removeClass('hidden');
	});

	$('#my-goals-link').on('click', function() {
		hideAllPages();
		// TODO: get goals from server
		let numberOfGoals = 0;
		if (numberOfGoals > 0) {
			$('#my-destination-goals-page').removeClass('hidden');
		}
		else {
			$('#no-goals').removeClass('hidden');
		}
	});
	
	$('#create-goal-button').on('click', function() {
		hideAllPages();
		$('#new-destination-goal-page').removeClass('hidden');
	});
});