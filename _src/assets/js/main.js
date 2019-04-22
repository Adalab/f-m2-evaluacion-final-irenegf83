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

function selectedFavoriteSerie(serieEl, nameSerieFavorite, imageSerieFavorite) {
    // si hago click en una serie le añado la clase favorite y si vuelvo a pulsar se la quito
    serieEl.classList.toggle('favorite');

    // las marcadas se guardarán en un array (en un objeto cada una)
    const serieObj = {
        name: nameSerieFavorite,
        image: imageSerieFavorite,
    };

    favoriteArr.push(serieObj);
    console.log('arr',favoriteArr);
    paintFavorites(nameSerieFavorite, imageSerieFavorite)
}

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

function createElement(element) {
    return document.createElement(element);
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

    // al hacer click en una serie se marca como favorita
    serieEl.addEventListener('click', function() {
        selectedFavoriteSerie(serieEl, name, image);
    });
}


// la seire favorita se mostrarán en el lado izquierdo de la pantalla (debajo del formulario)
// al hacer nueva búsqueda los favoritos se van acumulando
// se guardan el LocalStorage y al recargar página siempre se verán

function handleButtonClick(e) {
    e.preventDefault();
    listSeriesEl.innerHTML = '';
    queryApi();
    
}

// al hacer click en el botón de buscar 
buttonEl.addEventListener('click', handleButtonClick);