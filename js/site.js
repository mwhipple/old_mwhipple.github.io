$(document).foundation();

//inline SVGs, stolen from online and simplified
$(function() {
    $('img[src$="svg"]').each(function(){
	var $img = $(this);
	$.get($img.attr('src'), function(data) {
	    $svg = $(data).find('svg');
	    // Remove any invalid XML tags as per http://validator.w3.org
	    $svg = $svg.removeAttr('xmlns:a');
	    $img.replaceWith($svg);
	}, 'xml');
    });
});
