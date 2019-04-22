'use strict';

const inputEl = document.querySelector('#form-search__input');
const buttonEl = document.querySelector('.form-search__button');
const favoriteSeriesEl = document.querySelector('.series__favorites');
const listSeriesEl = document.querySelector('.series__search');

const apiUrl = 'http://api.tvmaze.com/search/shows?q=';
const imageDefault = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';



function queryApi() {
    const queryUser = inputEl.value;
    
    // nos conectaremos a una api de series dónde se buscará lo que el usuario introduzca en el campo de búsqueda
    fetch(apiUrl + queryUser)
        .then(response => response.json())
        .then(data => {
            for (const info of data) {
                const {show} = info;
                const nameSerie = show.name;
                const {medium: imageSerie} = show.image;

                // pintar una tarjeta:
                const serieEl = document.createElement('li');
                // título de la serie
                const titleSerieEl = document.createElement('h2');
                const titleSerie = document.createTextNode(nameSerie);
                titleSerieEl.appendChild(titleSerie);
                // imagen de la serie
                const imageSerieEl = document.createElement('img');
                imageSerieEl.setAttribute('src', imageSerie);
                // añado todo el contenido a sus madres
                serieEl.appendChild(titleSerieEl);
                serieEl.appendChild(imageSerieEl);
                listSeriesEl.appendChild(serieEl);
            }
            
        })
        .catch(error => console.log(`Tienes un error por aquí: ${error}`));

    // al hacer click en una serie se marca como favorita
    // las marcadas se guradarán en un array
    // se mostrarán en el lado izquierdo de la pantalla (debajo del formulario)
    // al hacer nueva búsqueda los favoritos se van acumulando
    // se guardan el LocalStorage y al recargar página siempre se verán
}

function handleButtonClick(e) {
    e.preventDefault();
    listSeriesEl.innerHTML = '';
    queryApi();
    
}

// al hacer click en el botón de buscar 
buttonEl.addEventListener('click', handleButtonClick);