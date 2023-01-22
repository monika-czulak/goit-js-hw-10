import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');

const API_LINK = 'https://restcountries.com/v3.1/';
const API_FIELDS = '?fields=name,capital,population,flags,languages';
const URL =
  'https://restcountries.com/v3.1/all?fields=name,capital,population,flags,languages';

const fetchCountries = name => {
  fetch(URL)
    .then(res => {
      if (!res.ok) {
        throw new Error(res.status);
      }
      return res.json();
    })
    .then(res => {
      const countries = res.filter(country =>
        country.name.official.includes(input.value)
      );
      console.log(countries);
      console.log(countries.length);
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (countries.length <= 10 && countries.length > 1) {
        console.log('lista max 10');
        countries.forEach(country => {
          renderCountryList(country);
        });
      } else {
        console.log('opis kraju');
        countries.forEach(country => console.log(country));
      }
    })
    .catch(err => {
      console.log(err);
      Notify.failure('Oops, there is no country with that name');
    });
};

input.addEventListener(
  'input',
  debounce(() => {
    fetchCountries();
  }, DEBOUNCE_DELAY)
);

function renderCountryList(country) {
  countryList.insertAdjacentHTML(
    'beforeend',
    `<li class="country-list__item">
        <img src="${country.flags.svg}" alt="${country.flags.svg}"/>
        <p>${country.name.common}</p>
       </li>`
  );
}

function renderCountryDesc(countries, name) {
  const markup = countries
    .filter(country => country.name.official.includes(name))
    .map(country => {
      return `<li>
          <p><b>Name</b>: ${country.name.official}</p>
          <p><b>Capital</b>: ${country.capital}</p>
          <p><b>Population</b>: ${country.population}</p>
          <p><b>Languages</b>: ${country.languages}</p>
        </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}
