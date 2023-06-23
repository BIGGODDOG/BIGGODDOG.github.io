const mealURL = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef';



const login = document.querySelector('.cabinet__word');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const user = urlParams.get('user');

const usersData = JSON.parse(localStorage.getItem("users"));
let cartArray = [];
if(JSON.parse(localStorage.getItem("cart_tmp")) != null){
    cartArray = JSON.parse(localStorage.getItem("cart_tmp"));
}

if ("users" in localStorage) {
    usersData.forEach(element => {
        if (user == element.username) {
            login.textContent = `${user}, balance: ${element.balance}$`;
            document.querySelector('.payment__discount__value').textContent = `${element.discount}%`;
        }
    });

    let userCart = JSON.parse(localStorage.getItem("users"));
    userCart.forEach(element => {
        if (element.username == user && user != null && element.cart != []) {
            cartArray = element.cart;
            element.cart = cartArray;
            localStorage.setItem('users', JSON.stringify(userCart));
            return;
        }
        console.log(element);
    });
} else {
    cartArray = [];
}

orderListInit(cartArray);



fillGrid('Beef'); // Заполнение страницы при первом открытии
function fillGrid(category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(data => {
            data.meals.forEach(element => {
                const item = document.createElement('div');
                item.classList.add('grid__item');

                const foodImg = document.createElement('div');
                foodImg.classList.add('grid__item__img');
                foodImg.style.backgroundImage = `url(${element.strMealThumb})`;

                item.appendChild(foodImg);

                const title = document.createElement('p');
                title.classList.add('grid__item__title')
                title.textContent = element.strMeal;
                item.appendChild(title);
                document.querySelector('.food__grid').appendChild(item);

                item.addEventListener('click', function () {
                    let isAdded = false;
                    cartArray.forEach(item => {
                        if (item.id == element.idMeal) {
                            item.quantity++;
                            isAdded = true;
                        }
                    });
                    if (!isAdded) { cartArray.push({ id: element.idMeal, quantity: 1 }) }
                    orderListInit(cartArray);
                })
            });
            // console.log(data);
        }).catch(() => alert('Fetch error'));
}

document.querySelector('.cancel__order').addEventListener('click', function () { 
    cartArray = []; 
    document.querySelector('.cart__items').innerHTML = ''; 
    countSum(); 
    saveUserCart(); 
    // localStorage.setItem('cart_tmp', []);
});

function orderListInit(arr) {
    document.querySelector('.cart__items').innerHTML = '';
    arr.forEach(element => {
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${element.id}`)
            .then(response => response.ok ? response.json() : Promise.reject(response))
            .then(data => {
                // console.log(data.meals[0]);
                const item = document.createElement('div');
                item.classList.add('cart__item');

                const itemImg = document.createElement('div');
                itemImg.classList.add('cart__item__img');
                itemImg.style.backgroundImage = `url(${data.meals[0].strMealThumb})`;

                const itemName = document.createElement('div');
                itemName.classList.add('cart__item__name');
                itemName.textContent = data.meals[0].strMeal;

                const itemQuantity = document.createElement('div');
                itemQuantity.classList.add('cart__item__quantity');

                const itemQuantityValue = document.createElement('div');
                itemQuantityValue.classList.add('cart__item__quantity__value');
                itemQuantityValue.textContent = element.quantity;

                const itemQuantityPlus = document.createElement('div');
                itemQuantityPlus.classList.add('cart__item__quantity__plus');
                itemQuantityPlus.textContent = '+';
                itemQuantityPlus.addEventListener('click', function () {
                    element.quantity++;
                    itemQuantityValue.textContent = element.quantity;
                    itemPrice.textContent = `${(((data.meals[0].strInstructions.length) / 100) * element.quantity).toFixed(2)}$`;
                    countSum();
                    saveUserCart();
                })

                const itemQuantityMinus = document.createElement('div');
                itemQuantityMinus.classList.add('cart__item__quantity__minus');
                itemQuantityMinus.textContent = '-';
                itemQuantityMinus.addEventListener('click', function () {
                    if (element.quantity == 1) { // При уменьшении объекта до нуля предмет удаляется из массива
                        removeByAttr(cartArray, "id", data.meals[0].idMeal);
                        orderListInit(cartArray);
                    } else {
                        element.quantity--;
                        itemQuantityValue.textContent = element.quantity;
                    }

                    itemPrice.textContent = `${(((data.meals[0].strInstructions.length) / 100) * element.quantity).toFixed(2)}$`;
                    countSum();
                    saveUserCart();
                })

                itemQuantity.appendChild(itemQuantityPlus);
                itemQuantity.appendChild(itemQuantityValue);
                itemQuantity.appendChild(itemQuantityMinus);

                const itemPrice = document.createElement('div');
                itemPrice.classList.add('cart__item__price');
                itemPrice.textContent = `${(((data.meals[0].strInstructions.length) / 100) * element.quantity).toFixed(2)}$`;

                item.appendChild(itemImg);
                item.appendChild(itemName);
                item.appendChild(itemQuantity);
                item.appendChild(itemPrice);

                document.querySelector('.cart__items').appendChild(item);
                countSum();
                saveUserCart();
            })
    });
}

function saveUserCart() {
    let userCart = JSON.parse(localStorage.getItem("users"));
    userCart.forEach(element => {
        if (element.username == user && user != null) {
            element.cart = cartArray;
            localStorage.setItem('users', JSON.stringify(userCart));
            return;
        }
    });
    // console.log(userCart);
}

fetch('https://www.themealdb.com/api/json/v1/1/categories.php') // Добавление категорий в боковое меню
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(data => {
        // console.log(data.categories);
        data.categories.forEach(element => {
            const sidebar_item = document.createElement('div');
            sidebar_item.classList.add('sidebar__block');
            sidebar_item.textContent = element.strCategory;
            sidebar_item.addEventListener('click', function () {
                document.querySelector('.food__grid').innerHTML = '';
                fillGrid(`${element.strCategory}`);
            })

            document.querySelector('.menu__bar').appendChild(sidebar_item);
        });
    }).catch(() => alert('Fetch error'));



document.querySelector('form').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('.search').value = '';
})


// Инициализация даты и времени
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
today = dd + '/' + mm + '/' + yyyy;

document.getElementById('date').textContent = today;

(function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    m = checkTime(m);
    document.getElementById('clock').innerHTML =
        h + ":" + m;
    var t = setTimeout(startTime, 500);
})();

function checkTime(i) {
    if (i < 10) { i = "0" + i };
    return i;
}



// Проверка на вход/выход из учётной записи с модальным окном
var openModalBtn = document.querySelector(".cabinet");
var modal = document.querySelector(".modal");
var cancelBtn = document.querySelector(".modal__cancel");
var LogoutBtn = document.querySelector(".modal__logout");

openModalBtn.addEventListener("click", function () {
    if (user == null) {
        localStorage.setItem('cart_tmp', JSON.stringify(cartArray));
        window.open(`login.html`, "_self").focus();
    } else {
        modal.style.display = "block";
    }
})

cancelBtn.addEventListener("click", function () {
    modal.style.display = "none";
})
LogoutBtn.addEventListener("click", function () {
    cartArray = [];
    localStorage.setItem('cart_tmp', JSON.stringify(cartArray));
    modal.style.display = "none";
    window.open(`meal_index.html`, "_self").focus();
})



function countSum() { // Подсчёт суммы корзины
    const prices = document.querySelectorAll('.cart__item__price');
    let sum = 0;
    prices.forEach(element => {
        sum += Number(element.textContent.replace(/\D/g, ""));
    });
    sum = (sum / 100).toFixed(2);
    document.querySelector('.payment__subtotal__value').textContent = `${sum}$`;

    const discount = document.querySelector('.payment__discount__value').textContent.replace(/\D/g, "");
    // alert(discount);
    document.querySelector('.payment__total__value').textContent = `${(sum - sum * (discount / 100)).toFixed(2)}$`
}



document.querySelector('.search__button').addEventListener('click', function () { // Поиск по названию
    if (document.querySelector('.search').value == '' || document.querySelector('.search').value == undefined) return;
    searchGrid(document.querySelector('.search').value);
})
function searchGrid(name) { // Составление сетки объектов по названию
    document.querySelector('.food__grid').innerHTML = '';
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
        .then(response => response.ok ? response.json() : Promise.reject(response))
        .then(data => {
            data.meals.forEach(element => {
                const item = document.createElement('div');
                item.classList.add('grid__item');

                const foodImg = document.createElement('div');
                foodImg.classList.add('grid__item__img');
                foodImg.style.backgroundImage = `url(${element.strMealThumb})`;

                item.appendChild(foodImg);

                const title = document.createElement('p');
                title.classList.add('grid__item__title')
                title.textContent = element.strMeal;
                item.appendChild(title);
                document.querySelector('.food__grid').appendChild(item);

                item.addEventListener('click', function () {
                    let isAdded = false;
                    cartArray.forEach(item => {
                        if (item.id == element.idMeal) {
                            item.quantity++;
                            isAdded = true;
                        }
                    });
                    if (!isAdded) { cartArray.push({ id: element.idMeal, quantity: 1 }) }
                    orderListInit(cartArray);
                })
            });
        }).catch(() => { alert('Incorrect input!'); fillGrid('Beef') });
}



var removeByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
        if (arr[i]
            && arr[i].hasOwnProperty(attr)
            && (arguments.length > 2 && arr[i][attr] === value)) {
            arr.splice(i, 1);
        }
    }
    return arr;
}

const extractNumbers = (text, options) => {
    let numbers;
    options = options || {};
    if (!text || typeof text !== 'string') {
        return [];
    }

    numbers = text.match(/(-\d+|\d+)(,\d+)*(\.\d+)*/g);

    if (options.string === false) {
        numbers = numbers.map(n => Number(n.replace(/,/g, '')));
    }

    return numbers.at(-1);
};



document.querySelector('.header__logo').addEventListener('click', function () {
    if (user == null) return;
    const userURL = `RnM_index.html` + `?user=` + user;
    window.open(userURL, "_self").focus();
})

document.querySelector('.send__order').addEventListener('click', function () { // При оформлении заказа идёт проверка на счёт пользователя, высчета баланса, очитска корзины, начисление бонусов
    if (user == null) alert('Log in at first.');
    const userBalance = extractNumbers(document.querySelector('.cabinet').textContent, { string: false });
    const orderSum = extractNumbers(document.querySelector('.payment__total__value').textContent, { string: false });
    let newBalance = (userBalance - orderSum).toFixed(2);
    console.log(`User balance ${userBalance}`);
    console.log(`Order sum ${orderSum}`);
    console.log(`${newBalance}`);

    if (userBalance < orderSum) alert('Not enough user balance!');
    else {
        let userData = JSON.parse(localStorage.getItem("users"));
        userData.forEach(element => {
            if (element.username == user) {
                element.balance = newBalance;
                if (element.discount <= 20) {
                    element.discount += 1;
                }
                document.querySelector('.payment__discount__value').textContent = `${element.discount}%`;
                return;
            }
        });

        cartArray = [];
        document.querySelector('.cart__items').innerHTML = '';
        countSum();
        saveUserCart();

        localStorage.setItem('users', JSON.stringify(userData));
        login.textContent = `${user}, balance: ${newBalance}$`;
    }
})