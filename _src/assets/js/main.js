'use strict';

const inputEl = document.querySelector('#form-search__input');
const buttonEl = document.querySelector('.form-search__button');
const containerFavEl = document.querySelector('.series__highlight');
const favoriteSeriesEl = document.querySelector('.series__favorites');
const listSeriesEl = document.querySelector('.series__search');

const apiUrl = 'http://api.tvmaze.com/search/shows?q=';
const imageDefault = 'https://via.placeholder.com/210x295/eeeeee/666666/?text=TV';
const favoriteArr = [];


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

const savedLocalStorage = array => localStorage.setItem('favoriteArr', JSON.stringify(array));

const savedFavSeriesArr = JSON.parse(localStorage.getItem('favoriteArr'));

function savedArrayFavorites(nameSerieFavorite, imageSerieFavorite, idSerieFavorite) {
    const serieObj = {
        name: nameSerieFavorite,
        image: imageSerieFavorite,
        id: idSerieFavorite,
    };

    favoriteArr.push(serieObj);

    paintFavorites(nameSerieFavorite, imageSerieFavorite, idSerieFavorite);
}

/*function createBtnDeleteAll() {
    //creo el botón de borrar todo
    const btnDeleteAllEl = createElement('button');
    btnDeleteAllEl.classList.add('btn__delete');
    btnDeleteAllEl.innerHTML = 'Eliminar series';
    containerFavEl.appendChild(btnDeleteAllEl);
    btnDeleteAllEl.addEventListener('click', deleteAllSeries);
}*/

function paintFavorites(nameFav, imageFav, idFav) {
    const serieFavEl = createElement('li');
    serieFavEl.classList.add('favorites');
    serieFavEl.setAttribute('data-id', idFav);

    const wrapperSerie = createElement('div');
    wrapperSerie.classList.add('wrapper__serie-fav');

    const titleFavEl = createElement('h4');
    titleFavEl.classList.add('favorites__title');
    const titleFav = document.createTextNode(nameFav);
    titleFavEl.appendChild(titleFav);

    const imageFavEl = createElement('img');
    imageFavEl.classList.add('favorites__image');
    imageFavEl.setAttribute('src', imageFav);
    imageFavEl.alt = `Portada serie "${nameFav}"`;

    const deleteEl = createElement('i');
    deleteEl.classList.add('far', 'fa-trash-alt');

    wrapperSerie.appendChild(imageFavEl);
    wrapperSerie.appendChild(titleFavEl);
    serieFavEl.appendChild(wrapperSerie);
    serieFavEl.appendChild(deleteEl);
    favoriteSeriesEl.appendChild(serieFavEl);

    deleteEl.addEventListener('click', deleteSerieFav);
    deleteEl.addEventListener('click', function() {
        deleteObjOfArray(savedFavSeriesArr, idFav);
    });
}

function deleteSerieFav(e) {
    const serieToDelete = e.currentTarget.parentElement;
    serieToDelete.outerHTML = '';
}

function deleteObjOfArray(array, id) {
    for (let i = 0; i < array.length; i++) {
        if(id === array[i].id) {
            array.splice(i, 1);
        }
    }
    savedLocalStorage(array);
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
    imageSerieEl.setAttribute('src', image);
    imageSerieEl.alt = `Portada serie "${name}"`;

    serieEl.appendChild(imageSerieEl);
    serieEl.appendChild(titleSerieEl);
    listSeriesEl.appendChild(serieEl);

    serieEl.addEventListener('click', function() {
        selectedFavoriteSerie(serieEl);
    });
    serieEl.addEventListener('click', function() {
        savedArrayFavorites(name, image, id);
    });
    serieEl.addEventListener('click', function() {
        savedLocalStorage(favoriteArr);
    });
}

function reloadPage() {
    if (savedFavSeriesArr) {
        for (const data of savedFavSeriesArr) {
            paintFavorites(data.name, data.image, data.id);
        }
    }
}

reloadPage();

function handleButtonClick(e) {
    e.preventDefault();
    listSeriesEl.innerHTML = '';
    queryApi();
}

buttonEl.addEventListener('click', handleButtonClick);