// let state = {
// 	username: '',
// 	password: '',
// 	signedIn: false
// }

$(function () { 

	//This function should make a request to add a new user to the DB
	//Currently getting a 422 (Unprocessable Entity) Error
	function handleSignup(username, password) {
		let userData = {
			username: username,
			password: password
		};

		$.ajax({
			url: "http://localhost:8080/api/users/",
			type: "POST",
			data: userData,
			dataType: "json",
			success:function(data){
				console.log("yay! things worked")
			}
		});
	}

	$('#sign-up-form-js').submit(function(event) {
		event.preventDefault();
		let username = $('#username-js').val();
		let password = $('#password-js').val();
		handleSignup(username, password);
	});

	// function handleSignup(state) {
	// 	let userData = {
	// 		format: 'json',
	// 		username: state.username,
	// 		password: state.password
	// 	}

	// 	$.ajax({
	// 		url: "/api/users",
	// 		type: "POST",
	// 		data: userData,
	// 		dataType: 'json',
	// 		success: function(data) {
	// 			console.log('success!');
	// 		}
	// 	});
	// }

	// $('#sign-up-form-js').submit(function(event) {
	// 	event.preventDefault();
	// 	state.username = $('#username-js').val();
	// 	state.password = $('#password-js').val();
	// 	handleSignup(state);
	// });

	function handleLogin(username, password) {
		let userData = {
			username: username,
			password: password
		};

		$.ajax({
			url: "http://localhost:8080/api/auth/login",
			type: "POST",
			data: userData,
			dataType: "json",
			success:function(data){
				console.log("yay! things worked")
			}
		});
	}

	$('.get-started').on('click', function() {
		hideAllPages();
		$('#sign-up-page').removeClass('hidden');
	});

	$('.login-link-js').on('click', function() {
		hideAllPages();
		$('#log-in-page').removeClass('hidden');
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

let pageIDs = [
	"homepage",
	"sign-up-page",
	"log-in-page",
	"no-goals",
	"new-destination-goal-page",
	"my-destination-goals-page"
];

function hideAllPages() {
	for(let i = 0; i < pageIDs.length; i++){
		let id = pageIDs[i];
		$('#' + id).addClass('hidden');
	}
}