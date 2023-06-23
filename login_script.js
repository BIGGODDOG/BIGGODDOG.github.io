const loginBtn = document.querySelector('.login')
const userName = document.querySelector('.mail')
const userPass = document.querySelector('.pass')

loginBtn.addEventListener('click', function () {
    if (userName.value == '' || userName.value == undefined) { alert('Username can not be empty'); return; }
    if (userPass.value == '' || userPass.value == undefined) { alert('Password can not be empty'); return; }

    let userArr = []
    if (localStorage.getItem("users")) {
        userArr = JSON.parse(localStorage.getItem("users"));
    }

    let wrongLogin = true;
    userArr.forEach(element => {
        if (element.username == userName.value || element.mail == userName.value) {
            if (element.pass == userPass.value) {
                // alert('Success!');
                wrongLogin = false;
                const userURL = `meal_index.html` + `?user=` + element.username;
                window.open(userURL, "_self").focus();
            } else {
                wrongLogin = false;
                alert('Wrong password!');
            }
        }
    });

    userName.value = '';
    userPass.value = '';
    if (wrongLogin) { alert('Wrong Login!'); }
})