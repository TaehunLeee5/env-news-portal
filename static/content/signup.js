<<<<<<< HEAD
=======

>>>>>>> 8fb666720a55fed81a495061f1130c0da4ca293b
//may be replaced with html pattern attribute if detailed feedback isn't necessary
function validateName(name) {
    var errorMsg = "";

    //TODO: provide more detailed error feedback
    if (!name.match(/^[\w\-\s]+$/))
        errorMsg = errorMsg.concat("The provided name is invalid.");

    return errorMsg;
}

//may be replaced with html pattern attribute if detailed feedback isn't necessary
function validateEmail(email) {
    var errorMsg = "";
    
    //TODO: provide more detailed error feedback
    if (!email.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) 
        errorMsg = errorMsg.concat("The provided email is invalid.");

    return errorMsg;
}

function validatePassword(pw) {
    var errorMsg = "";
<<<<<<< HEAD
    // No password requirements - allow any password
=======

    if (pw.length < 6)
        errorMsg = errorMsg.concat("Your password must contain at least 6 characters.\n");
    if (pw.length > 20)
        errorMsg = errorMsg.concat("Your password must contain at most 20 characters.\n");
    if (pw.search("[*@!#%&()$^~{}]+") == -1)
        errorMsg = errorMsg.concat("Your password must contain at least 1 special character.\n");
    if (pw.search("[0-9]+") == -1)
        errorMsg = errorMsg.concat("Your password must contain at least 1 digit\n");
    if (pw.search("[A-Z]+") == -1)
        errorMsg = errorMsg.concat("Your password must contain at least 1 uppercase letter.");

>>>>>>> 8fb666720a55fed81a495061f1130c0da4ca293b
    return errorMsg;
}

//clientside validation of signup form input
//checks whether each field follows correct format and provides appropriate feedback
//returns true if all fields have correct input, false otherwise
function validateSignupForm() {
    
    var nameInput = document.forms.signupForm.name;
    var name = nameInput.value;
    var emailInput = document.forms.signupForm.email;
    var email = emailInput.value;
    var pwInput = document.forms.signupForm.password;
    var pw = pwInput.value;
    var confirmInput = document.forms.signupForm.confirm_password;
    var confirmPw = confirmInput.value;

    pwInput.setCustomValidity(validatePassword(pw));
    pwInput.reportValidity();
    emailInput.setCustomValidity(validateEmail(email));
    emailInput.reportValidity();
    nameInput.setCustomValidity(validateName(name));
    nameInput.reportValidity();

    if (pw !== confirmPw)
        confirmInput.setCustomValidity("Passwords do not match.");
    confirmInput.reportValidity();

    return nameInput.checkValidity() && emailInput.checkValidity() && pwInput.checkValidity() && confirmInput.checkValidity();
}

document.addEventListener("DOMContentLoaded", function() {
    window.history.replaceState(null, null, window.location.href);
});