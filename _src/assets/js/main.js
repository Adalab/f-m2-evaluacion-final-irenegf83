'use strict';

// elementos del HTML
const inputEl = document.querySelector('#form-search__input');
const buttonEl = document.querySelector('.form-search__button');
const containerFavEl = document.querySelector('.series__highlight');
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
const selectedFavoriteSerie = serieEl => {
    // const {id} = serieEl.dataset;
    if(serieEl.classList.contains('favorite')){
        serieEl.classList.remove('favorite');
        deleteFavorites();
    } else {
        serieEl.classList.add('favorite');
    }
};

// añadirlas en la caché local (LS)
const savedLocalStorage = array => localStorage.setItem('favoriteArr', JSON.stringify(array));

const savedFavSeries = JSON.parse(localStorage.getItem('favoriteArr'));

function savedArrayFavorites(nameSerieFavorite, imageSerieFavorite, idSerieFavorite) {
    // las marcadas se guardarán en un array (en un objeto cada una)
    const serieObj = {
        name: nameSerieFavorite,
        image: imageSerieFavorite,
        id: idSerieFavorite,
    };

    // al hacer nueva búsqueda los favoritos se van acumulando
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
    // creo un wrapper para la imagen y el título
    const wrapperSerie = createElement('div');
    wrapperSerie.classList.add('wrapper__serie-fav');
    // título de la serie
    const titleFavEl = createElement('h4');
    titleFavEl.classList.add('favorites__title');
    const titleFav = document.createTextNode(nameFav);
    titleFavEl.appendChild(titleFav);
    // imagen de la serie
    const imageFavEl = createElement('img');
    imageFavEl.classList.add('favorites__image');
    imageFavEl.setAttribute('src', imageFav);
    imageFavEl.alt = `Portada serie "${nameFav}"`;
    // añado el elemento de borrar series
    const deleteEl = createElement('i');
    deleteEl.classList.add('far', 'fa-trash-alt');
    // añado todo el contenido a sus madres
    wrapperSerie.appendChild(imageFavEl);
    wrapperSerie.appendChild(titleFavEl);
    serieFavEl.appendChild(wrapperSerie);
    serieFavEl.appendChild(deleteEl);
    favoriteSeriesEl.appendChild(serieFavEl);

    deleteEl.addEventListener('click', deleteSerieFav);
    deleteEl.addEventListener('click', function() {
        deleteObjArray(savedFavSeries, idFav);
    });
}

function deleteSerieFav(e) {
    // borra el elemento <li> de la papelera que ha sido pulsada
    const serieToDelete = e.currentTarget.parentElement;
    // serieToDelete.outerHTML = '';
}

function deleteObjArray(array, id) {
    console.log('array', array);

    for (let i = 0; i < array.length; i++) {
        if(id === array[i].id) {
            // console.log('la id es igual', id, '=',  array[i].id);
            // borra del array la posición indicada
            array.splice(i, 1);
        } else {
            // console.log('mmmeeecc', id, '!=',  array[i].id);
        }
    }
    console.log('array final', array);
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
    imageSerieEl.alt = `Portada serie "${name}"`;
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
        for (const data of savedFavSeries) {
            paintFavorites(data.name, data.image, data.id);
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