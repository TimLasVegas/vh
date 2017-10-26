'use strict';

/**
 * Run when the page is loaded
 */
$(document).ready(function () {
    // Nothing so far
});

/**
 * Display a message in the notification area
 * @param message The message to display
 */
function dispMessage(message) {
    $("#desktop-message").removeClass("bg-danger");
    $("#mobile-message").removeClass("bg-danger");
    $("#desktop-message").html(message);
    $("#mobile-message").html(message);
}

/**
 * Display an error in the notification area
 * @param errMessage The error message to display
 */
function dispErrMessage(message) {
    dispMessage(message);
    $("#desktop-message").addClass("bg-danger");
    $("#mobile-message").addClass("bg-danger");
}

/**
 * YouTube initialization
 */
function init() {
    gapi.client.setApiKey("AIzaSyBGNvHf5Ovu91NB8_bqw-APNgOHbBNutc4");
    gapi.client.load("youtube", "v3", function() {
        dispMessage("Loaded");
    });
}

/**
 * Make sure the value is a string and is not empty
 * @param s
 * @returns {boolean}
 */
function isValidString(s) {
    return ($.type(s) === "string" && s.trim() !== '');
}