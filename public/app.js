let state = {
	loggedIn: false,
	numberOfGoals: 0
}

let pageIDs = [
	"homepage",
	"sign-up-page",
	"log-in-page",
	"no-goals",
	"new-destination-goal-page",
	"my-destination-goals-page"
];

let errorMessageIDs = [
	"username-taken",
	"password-length",
	"username-length"
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
		showDestinationGoals();
	});

	$('.create-goal-button').on('click', function() {
		hideAllPages();
		$('#new-destination-goal-page').removeClass('hidden');
	});

	$('#new-goal-form').submit(function(event) {
		event.preventDefault();
		let destination = $('#goal-name-js').val();
		let eta = $('#eta-input-js').val();
		let description = $('#description-input').val();
		if (destination === "" || eta === "" || description === "") {
			alert("Please fill out all required fields");
			return;
		}
		else {
			handleNewDestinationGoal(destination, eta, description);
		}
	});

	//Collapsible goals

	$('.goals-container').on('click', '.down-arrow', function(event) {
		event.preventDefault();
		$(this).parent().parent().children('.collapsable-goal-info').addClass('hidden');
		$(this).addClass('hidden');
		$(this).parent().append('<span class="dropdown-arrow right-arrow">&rarr;</span>');
	});

	$('.goals-container').on('click', '.right-arrow', function(event) {
		event.preventDefault();
		$(this).parent().parent().children('.collapsable-goal-info').removeClass('hidden');
		$(this).addClass('hidden');
		$(this).parent().append('<span class="dropdown-arrow down-arrow">&darr;</span>');
	});

});

//Functions

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

function hideAllErrorMessages() {
	for(let i = 0; i < errorMessageIDs.length; i++) {
		let id = errorMessageIDs[i];
		$('#' + id).addClass('hidden');
	}
}

function handleSignupErrors(errorMessage) {
	
	if(errorMessage === "Username already taken") {
		hideAllErrorMessages();
		$('#username-taken').removeClass('hidden');
	}
	if(errorMessage === "Must be at least 1 characters long") {
		hideAllErrorMessages();
		$('#username-length').removeClass('hidden');
	}
	if(errorMessage === "Must be at least 5 characters long") {
		hideAllErrorMessages();
		$('#password-length').removeClass('hidden');
	}
}


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
			handleHeaderLinks();
			showDestinationGoals();
			hideAllErrorMessages();
			// TODO: DON'T take me to login. BOTH SIGNUP + LOGIN SHOULD GET YOU TO YOUR GOALS
			// Either (no-goals-page / my-goals-page)
		},
		error: function(errorData){
			console.log("oh! things failed");
			// TODO: SHOW SERVER ERRORS LIKE MUST BE 5 CHAR LONG
			console.log(errorData);
			if (errorData.responseJSON === undefined) {
				return;
			}
			else {
				let errorMessage = errorData.responseJSON.message;
				handleSignupErrors(errorMessage);
			}
		},

	});
}

function showDestinationGoals() {
	hideAllPages();

	$.ajax({
		url: `/api/goals`,
		type: "GET",
		dataType: "json",
		success: function(goalsArray){
			console.log("yay! We have our goals."); 
			console.log(goalsArray);

			if (goalsArray.length > 0) {
				$('#my-destination-goals-page').removeClass('hidden');
				$('.goals-container').html('');
				for(let goal of goalsArray) {
					let formattedDate = formatDate(goal.eta);
					$('.goals-container').append(`<div class="individual-goal"><div class="goal-and-eta-box"><h3 class="destination-goal">${goal.destination}</h3><span class="eta">(ETA: ${formattedDate}):</span><span class="dropdown-arrow down-arrow">&darr;</span></div><div class="collapsable-goal-info">
				<p class="destination-goal-description">${goal.description}</p>
				<h4 id="checkpoints-header">Checkpoints</h4>
				<ul id="checkpoint-goals-list">
				<li class="grey-text checkpoint-goal"><input id="new-checkpoint" type="text" name="new-checkpoint" placeholder="New Checkpoint..."></li>
				</ul><h5 class="delete-goal">Delete this destination goal</h5></div></div>`);
				}

			}
			else {
				$('#no-goals').removeClass('hidden');
			}
		},
		error: function(errorData){
			console.log("oh! things failed");
			console.log(errorData)
		},
	});
}

function validateDate(date) {
	if(typeof date !== date) {
		alert('Please enter a valid date in the "ETA" section.');
	}
}

function formatDate(dateString) {
	var date = new Date(dateString);
    var curr_date = date.getDate();
    var curr_month = date.getMonth() + 1; //Months are zero based
    var curr_year = date.getFullYear();
    return curr_month + "-" + curr_date + "-" + curr_year;
}

function handleNewDestinationGoal(destination, eta, description) {

	let goalData = {
		destination: destination,
		eta: eta,
		description: description
	};

	$.ajax({
		url: "api/goals/",
		type: "POST",
		data: JSON.stringify(goalData),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function(data) {
			console.log('Woohoo! New goal created!');
			console.log(data);
			showDestinationGoals();
		},
		error: function(errorData) {
			console.log("something went wrong...")
			console.log(errorData);
			console.log(goalData);
			validateDate(eta);
		}
	});
}







