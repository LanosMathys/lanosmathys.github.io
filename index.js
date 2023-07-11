// Spotify API keys, here removed for security reasons
let refresh_token = ""
let client_id = ""
let client_secret = ""

let weatherApi = "1f8485698314cd7951c7b69e34af9133"
let github = ["https://api.github.com/repos/lanosmathys/lanosmathys.github.io"]

async function updateSpotify() {
    try {
        const token = await getToken();
        const url = 'https://api.spotify.com/v1/me/player/currently-playing';
        const response = await fetch(url, {
            headers: {'Authorization': `Bearer ${token}`},
        });
        const json = await response.json();

        const {album, name, artists, external_urls} = json.item;
        const coverUrl = album.images[0].url;
        const trackName = name;
        const artistName = artists[0].name;
        const trackUrl = external_urls.spotify;

        document.getElementById('bars').style.display = 'block';
        document.getElementById('cover').src = coverUrl;
        document.getElementById('trackName').innerHTML = `<b>${trackName}</b>`;
        document.getElementById('artistName').innerHTML = artistName;
        document.getElementById('spotify').onclick = () => {
            window.open(trackUrl, '_blank');
        };
    } catch (error) {}
}

async function getToken() {
    const url = 'https://accounts.spotify.com/api/token';
    const data = `grant_type=refresh_token&refresh_token=${refresh_token}&client_id=${client_id}&client_secret=${client_secret}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: data,
    });
    return (await response.json()).access_token;
}

async function updateWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Paris,fr&appid=${weatherApi}&units=metric`;
    const response = await fetch(url);
    const json = await response.json();
    const weatherIcon = document.getElementById('weatherImg');
    switch (json.weather[0].main) {
        case 'Thunderstorm':
            weatherIcon.src = './images/weather/thunder.svg';
            break;
        case 'Drizzle':
            weatherIcon.src = './images/weather/drizzle.svg';
            break;
        case 'Rain':
            weatherIcon.src = './images/weather/rain.svg';
            break;
        case 'Snow':
            weatherIcon.src = './images/weather/snow.svg';
            break;
        case 'Clouds':
            weatherIcon.src = './images/weather/cloud.svg';
            break;
        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Dust':
        case 'Fog':
        case 'Sand':
        case 'Dust':
        case 'Squall':
        case 'Tornado':
            weatherIcon.src = './images/weather/atmosphere.svg';
            break;
    }
    document.getElementById('weather').innerHTML = `It's currently ${Math.round(json.main.temp)}°C (${json.weather[0].main}) in Paris.`;
}

async function updateGithub() {
    const ul = document.getElementById('projects');

    for (url of github) {
        const response = await fetch(url);
        const json = await response.json();
        const {name, description, stargazers_count, forks, svn_url} = json;
        const ul = document.getElementById('projects');
        const li = `<a href="${svn_url}" target="_blank"><li><b>${name}</b><br><small>${description}<br><img src="./images/stars.svg"> ${stargazers_count}  <img src="./images/forks.svg"> ${forks}</small></li><br>`;
        ul.innerHTML += li;
    }
}

window.onload = function() {
  updateWeather();
  updateSpotify();
  updateGithub();

  setInterval(updateWeather, 600000);
  setInterval(updateSpotify, 60000);
};