const RickAndMortyURL = 'https://rickandmortyapi.com/api/character';

const characters = document.querySelector('.case');
let cnt = 0;
let userBalance = 0;
let ownedCharacters = [];
let newCharacterCost = 50;
// fetch(RickAndMortyURL)
//     .then(response => response.ok ? response.json() : Promise.reject(response))
//     .then(data => {
//         console.log(data.results)
//         let characterBlock = document.createElement('div');
//         characterBlock.classList.add('character');
//         characterBlock.textContent = data.results[cnt].name;
//         cnt++;
//         characters.appendChild(characterBlock);
//     }).catch(() => alert('Incorrect input'));



const addBtn = document.querySelector('.add');

addBtn.addEventListener('click', function () {
    fetch(`${RickAndMortyURL}/${cnt + 1}`)
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(data => {
            if (userBalance < newCharacterCost * cnt * cnt) {
                alert(`You need ${newCharacterCost * cnt * cnt} ₿`)
                return;
            }
            userBalance -= newCharacterCost * cnt * cnt;
            cnt++;
            newCharacterCost += newCharacterCost;
            document.querySelector('.balance__value').textContent = `${userBalance} ₿`;
            addBtn.textContent = `Buy new character (${newCharacterCost * cnt * cnt} ₿)`;

            console.log(data)
            ownedCharacters.push(data.id)
            let upgradePoint = 1;
            // let upgradeCostFormula = data.id * (upgradePoint * 15 * upgradePoint / 5);
            let characterBlock = document.createElement('div');
            characterBlock.classList.add('character');

            let characterImage = document.createElement('div');
            characterImage.classList.add('character__image');
            characterImage.style.backgroundImage = `url(${data.image})`;

            // characterImage.addEventListener('click', function () {
            //     userBalance += data.id * data.id * upgradePoint;
            //     document.querySelector('.balance__value').textContent = userBalance;
            // })

            characterBlock.appendChild(characterImage);

            const infoBlock = document.createElement('div')
            infoBlock.classList.add('character__info')

            const name = document.createElement('p')
            name.textContent = `${data.name} (${data.status})`;
            name.classList.add('character__name')
            infoBlock.appendChild(name)

            const species = document.createElement('p')
            species.classList.add('character__species')
            if (data.type != '') {
                species.textContent = `${data.species}: ${data.type}`;
            } else {
                species.textContent = `${data.species}`;
            }
            infoBlock.appendChild(species)

            const gender = document.createElement('p')
            gender.textContent = `Gender: ${data.gender}`;
            infoBlock.appendChild(gender)

            const location = document.createElement('p')
            location.textContent = `Location: ${data.location.name}`;
            infoBlock.appendChild(location);

            const upgradeBtn = document.createElement('button');
            upgradeBtn.textContent = `${upgradePoint}) Upgrade cost: ${data.id * (upgradePoint * 15 * upgradePoint / 5) + 1} ₿`;
            upgradeBtn.classList.add('upgrade');
            upgradeBtn.addEventListener('click', function () {
                if (userBalance >= data.id * (upgradePoint * 15 * upgradePoint / 5) + 1) {
                    userBalance -= data.id * (upgradePoint * 15 * upgradePoint / 5) + 1;
                    document.querySelector('.balance__value').textContent = `${userBalance}₿`;
                    ownedCharacters[data.id - 1]++;
                    upgradePoint++;
                    upgradeBtn.textContent = `${upgradePoint}) Upgrade cost: ${data.id * (upgradePoint * 15 * upgradePoint / 5) + 1} ₿`;
                } else {
                    alert('Not enough money!')
                }
            })
            infoBlock.appendChild(upgradeBtn);
            characterBlock.appendChild(infoBlock);
            document.querySelector('.balance__value').textContent = `${userBalance} ₿`;
            characters.appendChild(characterBlock);
        }).catch(() => alert('Fetch error'));
})



window.onscroll = function () { myFunction() };
var header = document.querySelector(".user__balance");
var sticky = header.offsetTop;

function myFunction() {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}

const clickBtn = document.querySelector('.click')
clickBtn.addEventListener('click', function () {
    ownedCharacters.forEach(element => {
        userBalance += element;
    });
    document.querySelector('.balance__value').textContent = `${userBalance} ₿`;
})


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const user = urlParams.get('user');

var modal = document.querySelector(".modal");
var cancelBtn = document.querySelector(".modal__cancel");
var EarnBtn = document.querySelector(".modal__logout");

cancelBtn.addEventListener("click", function () {
    modal.style.display = "none";
})
EarnBtn.addEventListener("click", function () {
    // modal.style.display = "none";
    const userURL = `meal_index.html` + `?user=` + user;

    let userData = JSON.parse(localStorage.getItem("users"));
    userData.forEach(element => {
        if (element.username == user) {
            let newBalance = +element.balance;
            newBalance += userBalance * cnt / 6666
            element.balance = newBalance.toFixed(2);
            return;
        }
    });
    // userData[user].balance += (userBalance * cnt / 666).toFixed(2);
    localStorage.setItem('users', JSON.stringify(userData));

    window.open(userURL, "_self").focus();
})

document.querySelector('.header__logo').addEventListener('click', function () {
    document.querySelector('.earnings').textContent = `(You will earn ${(userBalance * cnt / 6666).toFixed(2)}$ for completing it)`;
    modal.style.display = "block";
    // const userURL = `meal_index.html`;
    // window.open(userURL, "_self").focus();
})

document.addEventListener('keydown', (event) => {
    var keyName = event.key;
    var keyCode = event.code;
    if(keyName == 'g'){
        ownedCharacters.forEach(element => {
            userBalance += element * 13;
        });
        document.querySelector('.balance__value').textContent = `${userBalance} ₿`;
    }
    // alert(`Keydown: The key pressed is ${keyName} and its code value is ${keyCode}`);
}, false);