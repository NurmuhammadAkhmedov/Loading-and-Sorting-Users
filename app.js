// selecting variables
const usersList = document.querySelector('.users_list');
const loaderElement = document.querySelector('.loader');
const searchInput = document.querySelector(".search_input");
const sortSelect = document.getElementById("sort");

let originalData = [];

// creating loader
function loader(bool) {
    loaderElement.style.display = bool ? 'block' : 'none';
}

// get data
async function getData() {
    try {
        loader(true);
        const response = await fetch(`https://randomuser.me/api/?results=100`);

        if (!response.ok) {
            throw new Error('Something went wrong, brother!');
        }

        const data = await response.json();
        loader(false);
        return data;
    } catch (err) {
        console.log(err);
    }
}

// creating user item
function createUser(arr) {
    usersList.innerHTML = arr.map(item => `
        <li class="user_item">
            <img src="${item.picture.large}" alt="" class="user_img">
            <h2 class="user_name">${item.name.first} ${item.name.last}</h2>
            <p class="age"><b>Yosh:</b> ${item.registered.age}</p>
            <p class="age"><b>Telefon:</b> ${item.phone}</p>
            <p class="age"><b>Email:</b> ${item.email}</p>
            <p class="age"><b>Manzil:</b> ${item.location.city}, ${item.location.state}, ${item.location.country}</p>
        </li>
    `).join("");
}

function sortUsers(arr, type) {
    const sorted = [...arr];

    if (type === "name") {
        sorted.sort((a, b) => a.name.first.localeCompare(b.name.first));
    } else if (type === "age") {
        sorted.sort((a, b) => a.registered.age - b.registered.age);
    }

    return sorted;
}

getData().then((data) => {
    let arr = data.results;
    originalData = arr;
    createUser(arr);

    searchInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        const filtered = originalData.filter(item =>
            item.name.first.toLowerCase().includes(value) ||
            item.name.last.toLowerCase().includes(value)
        );
        const sortType = sortSelect.value;
        const sorted = sortUsers(filtered, sortType);
        createUser(sorted);
    });

    sortSelect.addEventListener("change", () => {
        const sortType = sortSelect.value;
        const value = searchInput.value.toLowerCase();

        const filtered = originalData.filter(item =>
            item.name.first.toLowerCase().includes(value) ||
            item.name.last.toLowerCase().includes(value)
        );

        const sorted = sortUsers(filtered, sortType);
        createUser(sorted);
    });
}).catch(err => console.log(err));
