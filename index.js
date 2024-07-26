const apiKey = "393edfa921a9a8e2dedd57ddf5d71ae3";
//inputs
const cityLocation = document.querySelector(".location");
const searchButton = document.querySelector(".loc-button");
//elements
const todayInfo = document.querySelector(".today-info");
const daysList = document.querySelector(".days-list");
//main elements
const currentLocation=document.querySelector('.current-location');
const todayWeatherIcon = document.querySelector(".today-weather i");
const todayTemp = document.querySelector(".weather-temp");
const cloudDesc=document.querySelector('.cloud-desc');
const pressure=document.querySelector('.pressure');
const visibility=document.querySelector('.visibility');
const wind=document.querySelector('.wind');

//weather icons
const weatherIconMap = {
    "01d": "sun",
    "01n": "moon",
    "02d": "sun",
    "02n": "moon",
    "03d": "cloud",
    "03n": "cloud",
    "04d": "cloud",
    "04n": "cloud",
    "09d": "cloud-rain",
    "09n": "cloud-rain",
    "10d": "cloud-rain",
    "10n": "cloud-rain",
    "11d": "cloud-lightning",
    "11n": "cloud-lightning",
    "13d": "cloud-snow",
    "13n": "cloud-snow",
    "50d": "water",
    "50n": "water",
};

function fecthWeatherData(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        if (data.list && data.list.length > 0) {

            const todayIconCode=data.list[0].weather[0].icon;
            const temp = data.list[0].main.temp;
            const dewPoint = temp - (100 - data.list[0].main.humidity) / 5;
            const cloudDescription = data.list[0].weather[0].description;
            const qnh = data.list[0].main.pressure;
            const hg = qnh * 0.02953;
            const visibilityKm = data.list[0].visibility / 1000;
            const windSpeed = data.list[0].wind.speed * 1.94384;
            const windDirection = data.list[0].wind.deg;

            //left info
            currentLocation.textContent=`${data.city.name}, ${data.city.country}`;
            todayInfo.querySelector('h2').textContent=new Date().toLocaleDateString('en',{weekday:'long'});
            todayInfo.querySelector('span').textContent=new Date().toLocaleDateString('en',{day:'numeric', month:'long', year:'numeric'});

            todayWeatherIcon.className=`bx bx-${weatherIconMap[todayIconCode]}`;
            todayTemp.innerHTML=`${Math.round(temp)}°C/${Math.round(dewPoint)}°C`;
            cloudDesc.innerHTML=cloudDescription;

            //right info
            pressure.innerHTML=`${qnh}/${hg.toFixed(2)}`;
            visibility.innerHTML=`${visibilityKm} KM`;
            wind.innerHTML=`${windDirection}°/${windSpeed.toFixed()} KTS`;

            //update next 4 days 
            const today = new Date();
            const nextDaysData = data.list.slice(1);
            
            const uniqueDays = new Set();
            let count=0;
            daysList.innerHTML='';

            for (const dayData of nextDaysData) {
                const forecastDate=new Date(dayData.dt_txt);

                const iconCode=dayData.weather[0].icon;
                const dayAbbreviation=forecastDate.toLocaleDateString('en',{weekday:'short'});
                const dayTemp=Math.round(dayData.main.temp);

                if(!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()){
                    uniqueDays.add(dayAbbreviation);
                    daysList.innerHTML+=`
                        <li>
                            <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                            <span>${dayAbbreviation}</span>
                            <span class="day-temp">${dayTemp}°C</span>
                        </li>
                    `;
                    count++;
                }

                //stop after get the next 4 days
                if(count===4) break;
            }

        } else {
            alert("The city doesn't exist.");
        }
    })
    .catch((error) => {
        console.log(error);
    });

}

document.addEventListener('DOMContentLoaded',()=>{
    const defaultLocation ='bogota'
    fecthWeatherData(defaultLocation);
});

searchButton.addEventListener('click',()=>{
    const city=cityLocation.value;
    if(!city){
        cityLocation.value='';
        return;
    }
    fecthWeatherData(city);
});