const API_KEY = 'VQmRvvRd8lOluHjxz3OyvmRVlro3F8xWOZD5S4Pd';

document.addEventListener("DOMContentLoaded", function () {
  getCurrentImageOfTheDay();

  const form = document.getElementById("search-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const dateInput = document.getElementById("search-input").value;
    if (dateInput) {
      getImageOfTheDay(dateInput);
    }
  });

  loadSearchHistory();
});

function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${currentDate}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayImage(data);
    })
    .catch(error => {
      console.error("Error fetching current image:", error);
    });
}
function getImageOfTheDay(date) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayImage(data);
      saveSearch(date);
      addSearchToHistory(date);
    })
    .catch(error => {
      console.error("Error fetching image for date:", error);
    });
}

function displayImage(data) {
  const container = document.getElementById("current-image-container");
  container.innerHTML = `
    <h2>${data.title}</h2>
    ${data.media_type === "image" 
      ? `<img src="${data.url}" alt="${data.title}" />` 
      : `<iframe width="100%" height="400" src="${data.url}" frameborder="0" allowfullscreen></iframe>`}
    <p>${data.explanation}</p>
  `;
}

function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

function addSearchToHistory(date) {
  const list = document.getElementById("search-history");
  const listItem = document.createElement("li");
  listItem.textContent = date;
  listItem.addEventListener("click", function () {
    getImageOfTheDay(date);
  });
  list.prepend(listItem);
}

function loadSearchHistory() {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  searches.reverse().forEach(date => addSearchToHistory(date));
}
