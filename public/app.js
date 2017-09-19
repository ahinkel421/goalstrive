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