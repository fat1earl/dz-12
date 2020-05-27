function fetchData(method, url) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  })
  return promise;
}
const key = '03fb54ebf904aeecf7fbb0e169f0c7ad';
const urlWeather = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&appid=${key}`;
const urlWeatherForecast = `https://api.openweathermap.org/data/2.5/forecast?q=Minsk&appid=${key}`;
const containerNode = document.querySelector('#container');
const sectionNode = document.createElement('section');
const section2Node = document.createElement('section');
const kelvin = 273.15;
const arrData = [];

class Weather {
  constructor(data) {
    [this.todayWeather, this.Forecast] = data;
    console.log(data);
    this.city = data[0].name;
    this.state = data[0].sys.country;
    this.temp = Math.round(data[0].main.temp - kelvin);
    this.tempFeelsLike = Math.round(data[0].main.feels_like - kelvin);
    this.correctTime = new Date(data[0].dt * 1000).getHours() + ':' + this.correctTime(new Date(data[0].dt * 1000).getMinutes());
    this.windDeg();
    this.windSpeed = data[0].wind.speed;
    this.icon = `http://openweathermap.org/img/wn/${data[0].weather[0].icon}@2x.png`;
    this.listForecast = this.Forecast.list;
    this.listForecastDays = this.listForecast.filter((item) => { 
      if (item.dt_txt.includes('12:00:00')) {
        return true;
      }  else {
        return false;
      }
    })
    this.render(sectionNode, section2Node);
    }
    windDeg() {
      if (this.todayWeather.wind.deg < 45) return "North";
      if (this.todayWeather.wind.deg < 135) return "East";
      if (this.todayWeather.wind.deg < 270) return "South";
      if (this.todayWeather.wind.deg < 315) return "West";
      if (this.todayWeather.wind.deg <= 360) return "North";
    }
    correctTime = (minute) => {
        if (minute < 10) {
          minute = "0" + minute;
        } return minute;
    }
    dtDayForecast(day) {
      return new Date(day).getDate();
    }
    dtMonthForecast(month) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthIndex = new Date(month).getMonth();
      return months[monthIndex];
    }
    
  render(parent1, parent2) {
    const template1 = `
    <div class="weather">
    <div class="todayWeather">
    <div class="cityInfoTime">
    <p>${this.city}, ${this.state}</p>
    <p><i class="far fa-clock"></i> ${this.correctTime}</p>
    </div>
    <div class="todayTemp">
    <img src="${this.icon}" alt="">
    <div class="tempP"><p>${this.temp} &#8451</p></div>
    <p>Feels like ${this.tempFeelsLike} &#8451</p>
    </div>
    <div class="wind">
    <p><i class="far fa-arrow-alt-circle-right"></i> ${this.windDeg()}</p>
    <p> <i class="fas fa-wind"></i> ${this.windSpeed} m/s</p></div>
    </div>
    </div>
    </div> 
    `
  parent1.innerHTML = template1;
  containerNode.append(parent1);
  
  this.listForecastDays.forEach(item => {
    const date = this.dtDayForecast(item.dt_txt) + ' ' + this.dtMonthForecast(item.dt_txt);
    const icon = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
    const temp = Math.round(item.main.temp -kelvin);
    
    const template2 = `
    <div class="weatherWeek">
    <div class="day">
    <p>${date} 12a.m</p>
    <div class="imgWeatherWeek">
    <img src="${icon}" alt="no photo">
    </div>
    <p>${temp} &#8451</p>
    </div>
    <hr>
  `
  parent2.innerHTML = parent2.innerHTML + template2;
  containerNode.append(parent2);
  })
}
}
fetchData('GET', urlWeather)
  .then(res => JSON.parse(res))
  .then(data => arrData.push(data))
  .then(() => fetchData('GET', urlWeatherForecast))
  .then(response => JSON.parse(response))
  .then(data => arrData.push(data))
  .then(() => new Weather(arrData))





























