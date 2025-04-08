

function validateName(name) {
    var errorMsg = "";

    //TODO: provide more detailed error feedback
    if (!name.match(/^[\w\-\s]+$/))
        errorMsg = errorMsg.concat("The name provided is invalid");

    return errorMsg;
}
function validateEmail(email) {
    var errorMsg = "";
    
    //TODO: provide more detailed error feedback
    if (!email.toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) 
        errorMsg = errorMsg.concat("The email provided is invalid.");

    return errorMsg;
}

function validatePassword(pw) {
    var errorMsg = "";

    if (pw.length < 6)
        errorMsg = errorMsg.concat("Your password must contain at least 6 characters.\n");
    if (pw.length > 20)
        errorMsg = errorMsg.concat("Your password must contain at most 20 characters.\n");
    if (pw.search("[*@!#%&()$^~{}]+") == -1)
        errorMsg = errorMsg.concat("Your password must contain at least 1 special character.\n");
    if (pw.search("[0-9]+") == -1)
        errorMsg = errorMsg.concat("Your password must contain at least 1 digit\n");
    if (pw.search("[A-Z]+") == -1)
        errorMsg =  errorMsg.concat("Your password must contain at least 1 uppercase letter.");

    return errorMsg;
}

function validateSignupForm() {
    var nameInput = document.forms.signupForm.name;
    var name = nameInput.value;
    var emailInput = document.forms.signupForm.email;
    var email = emailInput.value;
    var pwInput = document.forms.signupForm.password;
    var pw = pwInput.value;
    
    pwInput.setCustomValidity(validatePassword(pw));
    pwInput.reportValidity();
    emailInput.setCustomValidity(validateEmail(email));
    emailInput.reportValidity();
    nameInput.setCustomValidity(validateName(name));
    nameInput.reportValidity();

    return nameInput.checkValidity() && emailInput.checkValidity() && pwInput.checkValidity();
}

document.addEventListener("DOMContentLoaded", function() {
    window.history.replaceState(null, null, window.location.href);
});