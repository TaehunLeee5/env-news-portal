
function validatePassword() {
    var pwInput = document.getElementById("password")
    var pw = pwInput.value;

    pwInput.setCustomValidity("");

    if (pw.length < 6)
        pwInput.setCustomValidity("Your password must contain at least 6 characters.");
    if (pw.length > 20)
        pwInput.setCustomValidity("Your password must contain at most 20 characters.");
    if (pw.search("[*@!#%&()$^~{}]+") == -1)
        pwInput.setCustomValidity("Your password must contain at least 1 special character.");
    if (pw.search("[0-9]+") == -1)
        pwInput.setCustomValidity("Your password must contain at least 1 digit");
    if (pw.search("[A-Z]+") == -1)
        pwInput.setCustomValidity("Your password must contain at least 1 uppercase letter.");

    pwInput.reportValidity();
}

function signup(form) {
    validatePassword();
}