const cityInput = document.querySelector('.city_input')
const searchBtn = document.querySelector('.search_button')

const weatherInfoSection = document.querySelector('.weather_info')
const notFoundSection = document.querySelector('.not_found')
const searchCitySection = document.querySelector('.search_city')

const cityTxt = document.querySelector('.city_text')
const nationTxt = document.querySelector('.nation_text')
const tempTxt = document.querySelector('.temp_txt')
const conditionTxt = document.querySelector('.condition_txt')
const descriptionTxt = document.querySelector('.description_txt')
const humidityValueTxt = document.querySelector('.humidity_value_text')
const windValueTxt = document.querySelector('.wind_value_text')
const weatherSummaryImg = document.querySelector('.weather_summary_img')
const currentDateTxt = document.querySelector('.current_date_text')

const forecastItemsContainer = document.querySelector('.forecast_items_container')

const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

//Collect Input when User clicks Search Icon Button
searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
    
})
//Get Input when user hits Enter
cityInput.addEventListener('keydown', (event) => {
    if(event.key == 'Enter' &&
        cityInput.value.trim() != ''
    ) 
    {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
    
})

async function getFetchData(endPoint, city,) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=imperial`

    const response = await fetch(apiUrl)

    return response.json()
}

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorms.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'fog.svg'
    if (id === 800) return 'clear-day.svg'
    else return 'cloudy.svg'
}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-US', options)
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city)

    if(weatherData.cod !== 200) {
        showDisplaySection(notFoundSection)
        return
    }
    

    const {
        name : cityName,
        main: {temp, humidity},
        weather: [{id, main, description}],
        wind: {speed},
        sys: {country}
        
    } = weatherData

    cityTxt.textContent = cityName + ' , ' + country
    tempTxt.textContent = Math.round(temp) + ' ℉'
    conditionTxt.textContent = main
    descriptionTxt.textContent = description
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed +' MPH'

    console.log(weatherData)
   currentDateTxt.textContent = getCurrentDate()
   weatherSummaryImg.src = `icons/${getWeatherIcon(id)}`

    await updateForecastInfo(city)
    showDisplaySection(weatherInfoSection)
}

async function updateForecastInfo(city) {
    const forecastData = await getFetchData('forecast', city)
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemsContainer.innerHTML = ''
    forecastData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate))
            updateForecastItems(forecastWeather) 
    })
    
}

function updateForecastItems(weatherData) {

    const {
        dt_txt : date,
        weather: [{ id }],
        main: { temp }

    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

    const forecastItem = `
        <div class="forecast_item">
            <h5 class="forecast_item_date">${dateResult}</h5>
            <img src="icons/${getWeatherIcon(id)}"  class="forecast-item-img">
            <h5 class="forecast_item_temp">${Math.round(temp)} ℉</h5>
        </div>
    `

    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')


    section.style.display = 'flex'
}
