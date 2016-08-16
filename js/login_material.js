$(document).ready(function() {

	$('#moveleft').click(function() {
		$('#textbox').animate({
			'marginLeft' : "0" //moves left
		},400);

		$('.toplam').animate({
			'marginLeft' : "100%" //moves right
		},400);
	});

	$('#moveright').click(function() {
		$('#textbox').animate({
			'marginLeft' : "50%" //moves right
		},400);

		$('.toplam').animate({
			'marginLeft' : "0" //moves right
		},400);
	});

});
