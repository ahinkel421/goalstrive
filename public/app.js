$(function () { 
	$('.get-started').on('click', function() {
		hideAllPages();
		$('#sign-up-page').removeClass('hidden');
	});

	$('.login-link').on('click', function() {
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
	$('#create-goal-link').on('click', function() {
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
	for(let i = 0; i <pageIDs.length; i++){
		let id = pageIDs[i];
		$('#' + id).addClass('hidden');
	}
}