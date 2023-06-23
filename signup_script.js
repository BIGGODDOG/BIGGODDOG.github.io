const signupBtn = document.querySelector('.login')
const userName = document.querySelector('.user')
const userMail = document.querySelector('.mail')
const userPass = document.querySelector('.pass')

signupBtn.addEventListener('click', function () {
    if (userName.value == '' || userName.value == undefined) { alert('Username can not be empty'); return; }
    if (userMail.value == '' || userMail.value == undefined) { alert('Email can not be empty'); return; }
    if (userPass.value == '' || userPass.value == undefined) { alert('Password can not be empty'); return; }

    let user = {
        username: userName.value,
        mail: userMail.value,
        pass: userPass.value,
        balance: 0,
        cart: [],
        discount: 1
    }

    let userArr = [];
    if (localStorage.getItem("users")) {
        userArr = JSON.parse(localStorage.getItem("users"));
    }

    let userExist = false;

    userArr.forEach(element => {
        if (element.username == user.username) {
            alert(`User (${user.username}) already exist!`)
            userExist = true;
            return;
        }
    });

    if (!userExist) {
        userArr.push(user);
        localStorage.setItem('users', JSON.stringify(userArr));
        window.open(`login.html`, "_self");
    }

    userName.value = '';
    userMail.value = '';
    userPass.value = '';
})