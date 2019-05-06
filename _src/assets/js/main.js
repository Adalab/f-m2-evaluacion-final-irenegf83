'use strict';

const inputEl = document.querySelector('#form-search__input');
const buttonEl = document.querySelector('.form-search__button');
const containerFavEl = document.querySelector('.series__highlight');
const favoriteSeriesEl = document.querySelector('.series__favorites');
const listSeriesEl = document.querySelector('.series__search');

const apiUrl = 'http://api.tvmaze.com/search/shows?q=';
const imageDefault = 'https://via.placeholder.com/210x295/eeeeee/666666/?text=TV';
let favoriteArr = JSON.parse(localStorage.getItem('favoriteArr')) || [];


function queryApi() {
    const queryUser = inputEl.value;

    fetch(apiUrl + queryUser)
        .then(response => response.json())
        .then(data => {
            for (const info of data) {
                const {show} = info;
                const nameSerie = show.name;
                const imageSerie = show.image;
                const idSerie = show.id;

                if(!imageSerie){
                    paintSeries(nameSerie, imageDefault, idSerie);
                } else {
                    paintSeries(nameSerie, imageSerie.medium, idSerie);
                }
            }
        })
        .catch(error => console.log(`Tienes un error por aquí: ${error}`));
}

const createElement = element  => document.createElement(element);

const selectedFavoriteSerie = serieEl => serieEl.classList.toggle('favorite');

const savedLocalStorage = () => localStorage.setItem('favoriteArr', JSON.stringify(favoriteArr));

function savedArrayFavorites(id, serieLi) {
    const titleEl = serieLi.querySelector('.search__title');
    const imgEl = serieLi.querySelector('.search__img');

    const serieObj = {
        name: titleEl.innerHTML,
        image: imgEl.src,
        id: id,
    };

    favoriteArr.push(serieObj);

    paintFavorites(serieObj);
}

function paintFavorites(item) {
    const serieFavEl = createElement('li');
    serieFavEl.classList.add('favorites');
    serieFavEl.setAttribute('data-id', item.id);

    const wrapperSerie = createElement('div');
    wrapperSerie.classList.add('wrapper__serie-fav');

    const titleFavEl = createElement('h4');
    titleFavEl.classList.add('favorites__title');
    const titleFav = document.createTextNode(item.name);
    titleFavEl.appendChild(titleFav);

    const imageFavEl = createElement('img');
    imageFavEl.classList.add('favorites__image');
    imageFavEl.setAttribute('src', item.image);
    imageFavEl.alt = `Portada serie "${item.name}"`;

    const deleteEl = createElement('i');
    deleteEl.classList.add('far', 'fa-trash-alt');

    wrapperSerie.appendChild(imageFavEl);
    wrapperSerie.appendChild(titleFavEl);
    serieFavEl.appendChild(wrapperSerie);
    serieFavEl.appendChild(deleteEl);
    favoriteSeriesEl.appendChild(serieFavEl);

    deleteEl.addEventListener('click', handleSerieFavClick);
}

function handleSerieFavClick(e, array) {
    const { currentTarget } = e;
    const { parentElement } = currentTarget;
    const id = parentElement.getAttribute('data-id');
    array = favoriteArr;

    for (let i = 0; i < array.length; i++) {
        if(id === array[i].id) {
            console.log(array[i].id);
            
            array.splice(i, 1);
        }
    }
    console.log(array);
    
    deleteSerieFav(currentTarget);
    // deleteObjOfArray(savedFavSeriesArr, idFav);
}

function deleteSerieFav(e) {
    const { parentElement } = e;
    parentElement.outerHTML = '';
}

function deleteObjOfArray(array, id) {
    for (let i = 0; i < array.length; i++) {
        if(id === array[i].id) {
            array.splice(i, 1);
        }
    }
    savedLocalStorage();
    console.log(array);
}

function createBtnDeleteAll() {
    const btnDeleteAllEl = createElement('button');
    btnDeleteAllEl.classList.add('btn__delete');
    btnDeleteAllEl.innerHTML = 'Eliminar series';
    containerFavEl.appendChild(btnDeleteAllEl);

    btnDeleteAllEl.addEventListener('click', deleteAllSeries);
    btnDeleteAllEl.addEventListener('click', function() {
        deleteAllObjOfArray(savedFavSeriesArr);
    });
}

function deleteAllObjOfArray(array) {
    array = [];
    savedLocalStorage(array);
}

function deleteAllSeries(e) {
    const listDelete = e.currentTarget.previousElementSibling;
    listDelete.innerHTML = '';
}

function paintSeries(name, image, id) {
    const serieEl = createElement('li');
    serieEl.classList.add('search');
    serieEl.setAttribute('data-id', id);

    const titleSerieEl = createElement('h2');
    titleSerieEl.classList.add('search__title');
    const titleSerie = document.createTextNode(name);
    titleSerieEl.appendChild(titleSerie);

    const imageSerieEl = createElement('img');
    imageSerieEl.classList.add('search__img');
    imageSerieEl.setAttribute('src', image);
    imageSerieEl.alt = `Portada serie "${name}"`;

    serieEl.appendChild(imageSerieEl);
    serieEl.appendChild(titleSerieEl);
    listSeriesEl.appendChild(serieEl);

    serieEl.addEventListener('click', handleSerieClick);
}


function handleSerieClick(e) {
    const {currentTarget} = e;
    const { id } = currentTarget.dataset;

    selectedFavoriteSerie(currentTarget);
    savedArrayFavorites(id, currentTarget);
    savedLocalStorage(favoriteArr);
}

function reloadPage() {
    if(favoriteArr) {
        for (const data of favoriteArr) {
            paintFavorites(data);
        }
        createBtnDeleteAll();
    }
}
reloadPage();

function handleButtonClick(e) {
    e.preventDefault();
    listSeriesEl.innerHTML = '';
    queryApi();
}

buttonEl.addEventListener('click', handleButtonClick);