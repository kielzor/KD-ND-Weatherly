import React, { Component } from 'react';
import './App.css';
import Welcome from './Welcome';
import Search from './Search';
import Key from './Key';
import CurrentWeather  from './CurrentWeather';
import SevenHourForecast from './SevenHourForecast';
import TenDayForecast from './TenDayForecast';
import {currWeatherData} from './DataScrape';

class App extends Component {
  constructor(){
    super();
    this.state = {
      userLocation: '',
      time: '',
      date: '',
      CurrentWeather: {},
      SevenHourForecast: [],
      TenDayForecast: [],
      showSevenHour: false,
      showTenDay: false,
      showWelcomeMessage: true,
    }
  }

  setLocalStorage = (location) => {
    localStorage.setItem('location', JSON.stringify(location));
  };

  componentDidMount() {
    let location = JSON.parse(localStorage.getItem('location')) || null;
    if (location) {this.importLocation(location)};
    showWelcomeMessage: false;
  }

  importLocation(location) {
    const url= `http://api.wunderground.com/api/${Key}/conditions/hourly/forecast10day/q/${location}.json`

    console.log(url)
    fetch(url).then(response => response.json())
    .then(res => {
      const newWeather = currWeatherData(res)
      this.setState({
        userLocation: newWeather.location,
        CurrentWeather: newWeather,
        TenDayForecast: res.forecast.simpleforecast.forecastday,
        SevenHourForecast: res.hourly_forecast,
      })
      this.setLocalStorage(location);
    })
    // this needs to be updated and an issue created
    // .catch(error => {
    //   alert('Please enter a valid location')
    // })
  }

  setSevenHour = () => {
  this.setState({
    showSevenHour: true,
    showTenDay: false,
  })
}

  setTenDay = () =>{
  this.setState({
    showSevenHour:false,
    showTenDay: true,
  })
}

  render() {
    if(this.state.userLocation){
      return (
        <div className="app">
          {this.state.showWelcomeMessage = false}
          <CurrentWeather weather={this.state.CurrentWeather}/>
          <Search setLocation={(location) => this.importLocation(location)} 
          setSevenHour={this.setSevenHour} 
          setTenDay={this.setTenDay}/>
          {this.state.showSevenHour && <SevenHourForecast weather={this.state.SevenHourForecast}/>}
          {this.state.showTenDay && <TenDayForecast weather={this.state.TenDayForecast}/>}
        </div>
      );
    }
    return (
      <div className = "app">
        {this.state.showWelcomeMessage && <Welcome />}
        <Search setLocation={(location) => this.importLocation(location)} />
      </div>
    )
  }
}

export default App;