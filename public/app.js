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

	$('#sign-up-form-js').submit(function(event) {
		event.preventDefault();
		let username = $('#username-js-signup').val();
		let password = $('#password-js-signup').val();
		handleAuth('users', username, password);
	});

	$('#login-form-js').submit(function(event) {
		event.preventDefault();
		let username = $('#username-js-login').val();
		let password = $('#password-js-login').val();
		handleAuth('auth/login', username, password);
	});

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

function hideAllPages() {
	for(let i = 0; i < pageIDs.length; i++){
		let id = pageIDs[i];
		$('#' + id).addClass('hidden');
	}
}

//This function should make a request to add a new user to the DB
//Currently getting a 422 (Unprocessable Entity) Error
function handleAuth(route, username, password) {

	let userData = {
		username: username,
		password: password
	};

	//api/auth/login
console.log(userData)
	$.ajax({
		url: `/api/${route}`,
		type: "POST",
		data: JSON.stringify(userData),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data){
			console.log("yay! things worked");
			state.loggedIn = true;
				console.log(data);
			// TODO: DON'T take me to login. BOTH SIGNUP + LOGIN SHOULD GET YOU TO YOUR GOALS
			// Either (no-goals-page / my-goals-page)
		},
		error: function(errorData){
			console.log("oh! things failed");
			// TODO: SHOW SERVER ERRORS LIKE MUST BE 5 CHAR LONG
			console.log(errorData)
		},

	});
}
