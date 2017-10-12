let state = {
	loggedIn: false,
	//Keeps track of the user's token (logged in/not logged in)
	token:"",
	goalsArray: []
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
	"username-length",
	"no-match",
	"empty-fields"
];

$(function () {

	//Event Listeners

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

	$('#logout-nav-link').on('click', function() {
		hideAllPages();
		$('#homepage').removeClass('hidden');
		state.loggedIn = false,
		state.token = ""
		handleHeaderLinks();
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
			$('#goal-name-js').val("");
			$('#eta-input-js').val("");
			$('#description-input').val("");
		}
	});

	$('.goals-container').on('click', '.delete-goal', function(event) {
		event.preventDefault();
		let goalID = $(this).parents('.individual-goal').attr("data-id");
		console.log(goalID);
		let deleteConfirmation = confirm('Are you sure?');
		if (deleteConfirmation) {
			handleDeleteDestinationGoal(goalID);
		}

	});

	$('.try-demo').on('click', function(event) {
		handleAuth('auth/login', 'test', 'test123');
	});

	//Collapsible goals

	$('.goals-container').on('click', '.down-arrow', function(event) {
		event.preventDefault();
		// TODO: clean this up
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

	$('.goals-container').on('submit', '.new-checkpoint-form', function(event) {
		event.preventDefault();
		let newCheckpoint = $(this).children('.new-checkpoint').val();
		let goalID = $(this).parents('.individual-goal').attr('data-id');
		console.log(newCheckpoint);
		handleNewCheckpointGoal(goalID, newCheckpoint);
		$(this).parents('.collapsable-goal-info').removeClass('hidden');
	});

});

//Functions

function handleHeaderLinks() {
	if(state.loggedIn === true) {
		$('.nav-link').addClass('hidden');
		$('#my-goals-link, #logout-nav-link').removeClass('hidden');
	}
	else {
		$('.nav-link').removeClass('hidden');
		$('#my-goals-link, #logout-nav-link').addClass('hidden');
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

function handleLoginErrors(errorStatus, username, password) {

	if(errorStatus === 400) {
		hideAllErrorMessages();
		$('#empty-fields').removeClass('hidden');
	}
	else if(errorStatus === 401) {
		hideAllErrorMessages();
		$('#no-match').removeClass('hidden')
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
			console.log("yay! authenticated");
			state.loggedIn = true;
			//state.token is now whatever token was sent to the user
			//in order to authenticate them from page to page.
			state.token = data.authToken;
			handleHeaderLinks();
			showDestinationGoals();
			hideAllErrorMessages();
			$('#username-js-login, #password-js-login, #username-js-signup, #password-js-signup').val("");
		},
		error: function(errorData){
			console.log("we couldn't authenticate");
			console.log(errorData);
			if (errorData.responseJSON === undefined) {
				console.log(errorData.status);
				handleLoginErrors(errorData.status, username, password);
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
		//Token must be included in the request header in order to authenticate the user.
		headers: {
			"Authorization": `Bearer ${state.token}`
		},
		success: function(goalsArray){
			state.goalsArray = goalsArray;
			console.log("yay! We have our goals.");
			console.log(goalsArray);
			console.log(state.token);
			
			if (goalsArray.length > 0) {
				$('#my-destination-goals-page').removeClass('hidden');
				$('.goals-container').html('');
				for(let goal of goalsArray) {
					let goalsList = goal.subGoals.map(function(goal) {
						return `<li class="individual-checkpoint-goal">${goal}</li>`
					});
					let formattedDate = formatDate(goal.eta);
					$('.goals-container').append(
						`<div class="individual-goal" data-id=${goal.id}>
							<div class="goal-and-eta-box">
								<h3 class="destination-goal">${goal.destination}</h3>
								<span class="eta">(ETA: ${formattedDate}):</span>
								<span class="dropdown-arrow down-arrow">&darr;</span>
							</div>
							<div class="collapsable-goal-info">
								<p class="destination-goal-description">${goal.description}</p>
								<h4 id="checkpoints-header">Checkpoints</h4>
								<ul id="checkpoint-goals-list">
								${goalsList.join(" ")}
									<li class="grey-text checkpoint-goal">
										<form class="new-checkpoint-form">
											<input class="new-checkpoint" type="text" name="new-checkpoint" placeholder="New Checkpoint..." autocomplete="off">
										</form>
									</li>
								</ul>
								<span class="delete-goal">Delete this destination goal</span>
							</div>
						</div>`
					);
				}

			}
			else {
				$('#no-goals').removeClass('hidden');
			}
		},
		error: function(errorData){
			console.log("we couldn't get goals");
			console.log(errorData)
		},
	});
}


function formatDate(dateString) {
	//When passing in the goal's eta for dateString, we pull the date,
	//month, and year from the eta, concatinate them accordingly and return the full date.
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
		//Token must be included in the request header in order to authenticate the user.
		headers: {
			"Authorization": `Bearer ${state.token}`
		},
		success: function(data) {
			console.log('Woohoo! New goal created!');
			console.log(data);
			showDestinationGoals();
		},
		error: function(errorData) {
			console.log("something went wrong...", errorData, goalData)
			var parsedDate=Date.parse(eta);
			//below???
			if (!isNaN(parsedDate)==false)
			{
				alert('Please enter a valid date in the "ETA" section.');
			}
		}
	});
}

function handleNewCheckpointGoal(goalID, subGoal) {
	let currentGoal = state.goalsArray.find(function(goal) {
		return goal.id === goalID;
	});
	currentGoal.subGoals.push(subGoal);
	let goalData = {
		id: goalID,
		subGoals: currentGoal.subGoals
	};
	console.log(goalData);
	$.ajax({
		url: `api/goals/${goalID}`,
		type: "PUT",
		data: JSON.stringify(goalData),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		headers: {
			"Authorization": `Bearer ${state.token}`
		},
		success: function(data) {
			console.log('Woohoo! Goal updated');
			console.log(data);
			showDestinationGoals();
		},
		error: function(errorData) {
			console.log("something went wrong...", errorData, goalData)
			var parsedDate=Date.parse(eta);
			if (!isNaN(parsedDate)==false)
			{
				alert('Please enter a valid date in the "ETA" section.');
			}
		}
	});
}

function handleDeleteDestinationGoal(id) {
	$.ajax({
		url: `/api/goals/${id}`,
		type: "DELETE",
		data: JSON.stringify({id: id}),
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		//Token must be included in the request header in order to authenticate the user.
		headers: {
			"Authorization": `Bearer ${state.token}`
		},
		success: function(data) {
			console.log(`deleted goal ${id}`);
			showDestinationGoals();
		},
		error: function(errorData) {
			console.log(errorData);
		}
	});
}
