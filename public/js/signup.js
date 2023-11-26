
document.addEventListener("DOMContentLoaded", function () {
    const password1 = document.querySelector("#txtPassword");
    const password2 = document.querySelector("#confirm-password");
    const passwordError = document.getElementById("password-error");
    const passwordmatched = document.getElementById("password-matched");
    const passwordErrorBtn = document.getElementById("password-error-btn");
    password1.addEventListener("input", validatePasswords);
    password2.addEventListener('input', validatePasswords);
    


    //check username availability
    document.querySelector("#txtUsername").addEventListener("input", async function () {
        const username = document.querySelector("#txtUsername").value;
        const usernameAvailability = document.getElementById("usernameAvailability");
    
        if (!username.trim()) {
            usernameAvailability.innerHTML = "Username is required";
            usernameAvailability.classList.remove("username-valid");
            usernameAvailability.classList.add("username-invalid");
            return;
        } else {
            fetch(`/checkUsername?username=${username}`)
                .then(response => response.json())
                .then(data => {
                    if (username.length < 3) {
                        usernameAvailability.innerHTML = "Username must be at least 3 characters";
                        usernameAvailability.classList.remove("username-valid");
                        usernameAvailability.classList.add("username-invalid");
                    } else {
                        usernameAvailability.innerHTML = data.message;
                        if (data.isTaken) {
                            usernameAvailability.classList.remove("username-valid");
                            usernameAvailability.classList.add("username-invalid");
                        } else {
                            usernameAvailability.classList.remove("username-invalid");
                            usernameAvailability.classList.add("username-valid");
                        }
                    }
                });
        }
    });
    



    
    


    function validatePasswords(){
        if(password1.value != password2.value){
            passwordError.innerHTML = "Passwords do not match";
            passwordmatched.innerHTML = " ";
            passwordErrorBtn.innerHTML = "Passwords do not match";
            document.getElementById("submit").disabled = true;
        }
        else{
            passwordmatched.innerHTML = "Passwords matched";
            passwordError.innerHTML = " ";
            passwordErrorBtn.innerHTML = " ";
            document.getElementById("submit").disabled = false;

        }
    
        return true;
    }

});

