"use strict"
let burger = document.querySelector(".button__burger"), // button burger for mobile. Open Favorite Tab
    button = document.querySelector(".button"), // button burger for mobile. Open Favorite Tab
    favourite = document.querySelector(".favourite"), //Favorite Tab. Opens when clicked on the value of "button"
    categories = document.querySelector(".categories"), // Categories selection 
    categoriesName = document.querySelectorAll(".categories__name"), // Categories selection 
    radio = document.querySelectorAll(".radio__input"), //  Type of search 
    content = document.querySelector(".content__tape"), // content. Insert post on content page
    genButton = document.querySelector('.joke-gen__button'),
    search = document.querySelector('.joke-gen__search'),
    searchError = document.querySelector('.joke-gen__error-value'),
    bg = document.querySelector('.bg');

let localSTR = window.localStorage;

let genJoke = "random";
// Checking local storage //
if (!localSTR.getItem('post')) {

    // if missing local storage, we creating it //
    localSTR.setItem("post", JSON.stringify([]));

} else {
    // if local storage not null, creating saved post //
    let value = JSON.parse(localSTR.getItem("post"));

    value.forEach((el) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `https://api.chucknorris.io/jokes/${el.id}`);
        xhr.send();
        xhr.onload = function() {
            let post = createTemplate(JSON.parse(xhr.response), "favourite");
            favourite.append(post);
        }
    })
}

//function creating template post  . 2 values : "content", "favourite" //
function createTemplate(joke, typePost = 'content') {
    let value = {
        "post": ["content__post", "post"],
        "content": '',
        "ellipse": '',
        "joke": '',
        "info": '',
        "heart": (typePost === "search") ? "post__heart_active" : ""
    }; // Default value. "content" //
    let categories = (joke.categories && joke.categories.length != 0) ? `<p class="post__cattegories">${joke.categories}</p></div>` : '';

    if (typePost === "favourite") {
        value = {
            "post": ["favourite__post", "post", "post_favourite-color"],
            "content": "post__content_favourite-margin",
            "ellipse": "post__ellipse_favourite-color",
            "joke": "post__joke_favourite-size",
            "info": "post__information_favourite-margin",
            "heart": "post__heart_active post__heart_favourite-margin"
        };
        categories = ''; // value "favourite" //
    }

    let html = document.createElement('div'); // creating 'div' to insert //
    let date = Date.now();
    joke.updated_at = Math.floor(((date - Date.parse(joke.updated_at)) / ((3600 * 1000)))); // convert date to hours //


    value.post.forEach(item => html.classList.add(item)) // add class to post

    html.innerHTML = `<div data-id = "${joke.id}" class="post__heart ${value.heart}"> </div>
        <div class="post__content ${value.content}"><div class="post__ellipse ${value.ellipse}"> <img src="./img/chat.svg"  class="post__chat-icon" alt=""></div>
            <div class="post__body-joke">
               <p class="post__id">ID:<a href="https://api.chucknorris.io/jokes/${joke.id}" class="post__id post__id_link">${joke.id}<img class="post__id post__id_size-img" src="./img/interface.svg" alt=""></a></p>
               <div class="post__joke ${value.joke}">${joke.value}</div>
               <div class="post__information ${value.info}"><p class="post__upd-time">Last update: ${joke.updated_at} hours ago</p>
               ${categories}
            </div>
        </div>` // template
    return html;
}

// function Favourite. Called when a user wants to add a post to favorites.

function favouriteCreate(e) {

    if (!e.target.classList.contains("post__heart_active")) {
        e.target.classList.toggle("post__heart_active");

        let node = e.target.parentNode;

        let joke = {
            "id": node.querySelector(".post__id_link").innerText,
            "body": node.querySelector(".post__joke").innerText
        };
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `https://api.chucknorris.io/jokes/${joke.id}`);
        xhr.send();
        xhr.onload = function() {

            let value = JSON.parse(localSTR.getItem("post"));
            value.push(joke);
            localSTR.setItem("post", JSON.stringify(value));

            joke = JSON.parse(xhr.response);

            let post = createTemplate(joke, "favourite");

            favourite.append(post);
        }
    } else {
        let id = e.target.dataset.id;
        let value = JSON.parse(localSTR.getItem("post"));
        value = value.filter(item => item.id !== id);
        localSTR.setItem("post", JSON.stringify(value));

        if (e.target.parentNode.classList.contains("favourite__post")) {
            e.target.parentNode.remove();
        } else {
            e.target.classList.remove("post__heart_active");
        }

        let node = document.querySelectorAll(".post");

        node.forEach(e => {
            if (e.childNodes[0].dataset.id === id && e.classList.contains("favourite__post")) {
                e.remove();
            } else if (e.childNodes[0].dataset.id === id) {
                e.childNodes[0].classList.remove("post__heart_active");
            }
        })
    }
}


document.addEventListener('click', (e) => {
    if (e.target.classList.contains("post__heart")) {
        favouriteCreate(e);
    }
}, false);

radio.forEach((el) => {
    el.addEventListener("change", (e) => {
        switch (e.target.id) {
            case "ctg-joke":
                categories.classList.toggle("categories_active");
                searchError.classList.remove("joke-gen__error-value_active");
                search.classList.remove("joke-gen__search_active");
                break;
            case "random-joke":
                genJoke = 'random';
                categories.classList.remove("categories_active");
                searchError.classList.remove("joke-gen__error-value_active");
                search.classList.remove("joke-gen__search_active");
                break;
            case "search-joke":
                categories.classList.remove("categories_active");
                search.classList.toggle("joke-gen__search_active");
        }
    })
})

categoriesName.forEach((el) => {
    el.addEventListener("click", (e) => {
        categoriesName.forEach((el) => {
            if (el.classList.contains("categories__name_active")) {
                el.classList.toggle("categories__name_active");
            }
        })
        e.target.classList.toggle("categories__name_active");
        genJoke = `random?category=${e.target.innerHTML}`;
    })
})

button.addEventListener("click", (e) => {
    burger.classList.toggle("button__burger-active");
    favourite.classList.toggle("favourite-active");
    bg.classList.toggle("bg_active")
})


genButton.addEventListener("click", () => {


    if (search.classList.contains('joke-gen__search_active')) {
        genJoke = 'search?query=' + search.value;
        if (search.value.length < 3) {
            searchError.classList.toggle("joke-gen__error-value_active");
            return false;
        } else {
            searchError.classList.remove("joke-gen__error-value_active");
        }

    }

    let xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api.chucknorris.io/jokes/${genJoke}`);
    xhr.send();
    xhr.onload = function() {

        let arr = JSON.parse(xhr.response);
        let post;

        if (arr.result) {
            let searchId;
            let reg = new RegExp(search.value);
            let value = JSON.parse(localSTR.getItem("post"));
            value.forEach(el => {
                if (reg.test(el.body)) {
                    let xhr = new XMLHttpRequest();
                    searchId = el.id;

                    xhr.open("GET", `https://api.chucknorris.io/jokes/${el.id}`);

                    xhr.send();

                    xhr.onload = function() {

                        let joke = JSON.parse(xhr.response);

                        let post = createTemplate(joke, 'search');
                        content.prepend(post);
                    }
                }
            })

            arr = arr.result;
            for (let i = 0; i < arr.length; i++) {
                if (searchId !== arr[i].id) {
                    post = createTemplate(arr[i]);
                    content.prepend(post);
                }
            }

        } else {
            post = createTemplate(arr);
            content.prepend(post);
        }
    }
})