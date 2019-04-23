'use strict';

// elementos del HTML
const inputEl = document.querySelector('#form-search__input');
const buttonEl = document.querySelector('.form-search__button');
const favoriteSeriesEl = document.querySelector('.series__favorites');
const listSeriesEl = document.querySelector('.series__search');

// constantes/variables
const apiUrl = 'http://api.tvmaze.com/search/shows?q=';
const imageDefault = 'https://via.placeholder.com/210x295/eeeeee/666666/?text=TV';
const favoriteArr = [];


function queryApi() {
    const queryUser = inputEl.value;
    // nos conectaremos a una api de series dónde se buscará lo que el usuario introduzca en el campo de búsqueda
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

// si hago click en una serie le añado la clase favorite y si vuelvo a pulsar se la quito
const selectedFavoriteSerie = (serieEl) => {
    serieEl.classList.add('favorite');
};

function savedArrayFavorites(nameSerieFavorite, imageSerieFavorite, idSerieFavorite) {
    // las marcadas se guardarán en un array (en un objeto cada una)
    const serieObj = {
        name: nameSerieFavorite,
        image: imageSerieFavorite,
        id: idSerieFavorite,
    };

    // al hacer nueva búsqueda los favoritos se van acumulando
    favoriteArr.push(serieObj);
    // console.log('arr',favoriteArr);

    paintFavorites(nameSerieFavorite, imageSerieFavorite, idSerieFavorite);
}

// añadirlas en la caché local (LS)
const savedLocalStorage = array => localStorage.setItem('favoriteArr', JSON.stringify(array));

const savedFavSeries = JSON.parse(localStorage.getItem('favoriteArr'));

function paintFavorites(nameFav, imageFav, idFav) {
    const serieFavEl = createElement('li');
    serieFavEl.classList.add('favorites');
    serieFavEl.setAttribute('data-idFav', idFav);
    // título de la serie
    const titleFavEl = createElement('h4');
    titleFavEl.classList.add('favorites__title');
    const titleFav = document.createTextNode(nameFav);
    titleFavEl.appendChild(titleFav);
    // imagen de la serie
    const imageFavEl = createElement('img');
    imageFavEl.classList.add('favorites__image');
    imageFavEl.setAttribute('src', imageFav);
    // añado todo el contenido a sus madres
    serieFavEl.appendChild(imageFavEl);
    serieFavEl.appendChild(titleFavEl);
    favoriteSeriesEl.appendChild(serieFavEl);
}

function paintSeries(name, image, id) {
    // pintar una tarjeta:
    const serieEl = createElement('li');
    serieEl.classList.add('search');
    serieEl.setAttribute('data-id', id);

    // título de la serie
    const titleSerieEl = createElement('h2');
    titleSerieEl.classList.add('search__title');
    const titleSerie = document.createTextNode(name);
    titleSerieEl.appendChild(titleSerie);
    // imagen de la serie
    const imageSerieEl = createElement('img');
    imageSerieEl.setAttribute('src', image);
    // añado todo el contenido a sus madres
    serieEl.appendChild(imageSerieEl);
    serieEl.appendChild(titleSerieEl);
    listSeriesEl.appendChild(serieEl);

    // al hacer click en una serie:
    //se marca como favorita
    serieEl.addEventListener('click', function() {
        selectedFavoriteSerie(serieEl, id);
    });
    // se guarda en un array
    serieEl.addEventListener('click', function() {
        savedArrayFavorites(name, image, id);
    });
    // se guarda en LocalStorage
    serieEl.addEventListener('click', function() {
        savedLocalStorage(favoriteArr);
    });
}

function reloadPage() {
    // si la chaché tiene datos pintalos
    if (savedFavSeries) {
        console.log('la caché tiene cosicas');
        for (const data of savedFavSeries) {
            paintFavorites(data.name, data.image);
        }
    } else {
        console.log('la caché está vacía');
    }
}

reloadPage();

function handleButtonClick(e) {
    e.preventDefault();
    listSeriesEl.innerHTML = '';
    queryApi();
}

// al hacer click en el botón de buscar
buttonEl.addEventListener('click', handleButtonClick);