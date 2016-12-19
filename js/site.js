$(function() {
    $(document).foundation();

    $("#tag-container")
	.foundation('down', $(window.location.hash).find("[data-submenu]"));
});
