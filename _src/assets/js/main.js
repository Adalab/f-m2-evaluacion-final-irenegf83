'use strict';

const inputEl = document.querySelector('#form-search__input');
const buttonEl = document.querySelector('.form-search__button');
const favoriteSeriesEl = document.querySelector('.series__favorites');
const listSeriesEl = document.querySelector('.series__search');

const apiUrl = 'http://api.tvmaze.com/search/shows?q=';
const imageDefault = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
let favoriteArr = [];


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

                if(imageSerie === null){
                    paintSeries(nameSerie, imageDefault);
                } else {
                    paintSeries(nameSerie, imageSerie.medium);
                }
            }
        })
        .catch(error => console.log(`Tienes un error por aquí: ${error}`));
}

const createElement = element  => document.createElement(element);

// si hago click en una serie le añado la clase favorite y si vuelvo a pulsar se la quito
const selectedFavoriteSerie = serieEl => serieEl.classList.toggle('favorite');

function savedArrayFavorites(nameSerieFavorite, imageSerieFavorite) {
    // las marcadas se guardarán en un array (en un objeto cada una)
    const serieObj = {
        name: nameSerieFavorite,
        image: imageSerieFavorite,
    };

    // al hacer nueva búsqueda los favoritos se van acumulando
    favoriteArr.push(serieObj);
    // console.log('arr',favoriteArr);

    paintFavorites(nameSerieFavorite, imageSerieFavorite);
}

function savedLocalStorage(array) {
    // añadirlas en la caché local (LS)
    localStorage.setItem('favoriteArr', JSON.stringify(array));
}

const savedFavSeries = JSON.parse(localStorage.getItem('favoriteArr'));

function paintFavorites(nameFav, imageFav) {
    const serieFavEl = createElement('li');
    // título de la serie
    const titleFavEl = createElement('h4');
    const titleFav = document.createTextNode(nameFav);
    titleFavEl.appendChild(titleFav);
    // imagen de la serie
    const imageFavEl = createElement('img');
    imageFavEl.setAttribute('src', imageFav);
    // añado todo el contenido a sus madres
    serieFavEl.appendChild(imageFavEl);
    serieFavEl.appendChild(titleFavEl);
    favoriteSeriesEl.appendChild(serieFavEl);
}

function paintSeries(name, image) {
    // pintar una tarjeta:
    const serieEl = createElement('li');

    // título de la serie
    const titleSerieEl = createElement('h2');
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
        selectedFavoriteSerie(serieEl);
    });
    // se guarda en un array
    serieEl.addEventListener('click', function() {
        savedArrayFavorites(name, image);
    });
    // se guarda en LocalStorage
    serieEl.addEventListener('click', function() {
        savedLocalStorage(favoriteArr);
    });
}


// se guardan el LocalStorage y al recargar página siempre se verán
function reload() {
    // si la chaché tiene datos pintalos
    if (savedFavSeries) {
        console.log('la caché tiene cosicas');
        for (const data of savedFavSeries) {
            // console.log(data.name);
            paintFavorites(data.name, data.image);
        }
    } else {
        console.log('la caché está vacía');
    }
}

reload();

function handleButtonClick(e) {
    e.preventDefault();
    listSeriesEl.innerHTML = '';
    queryApi();
}

// al hacer click en el botón de buscar
buttonEl.addEventListener('click', handleButtonClick);