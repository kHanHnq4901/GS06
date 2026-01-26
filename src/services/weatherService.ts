import { WeatherData } from '../types';

const API_KEY = '4a9f20ca36b342f39c765139251307';
const CITY = 'New Delhi';
const BASE_URL = "http://api.weatherapi.com/v1/"

export const fetchWeatherData = async (): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}current.json?key=${API_KEY}&q=${CITY}&aqi=no`
    );
    const data = await response.json();

    return {
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
      },
      current: {
        temp_c: data.current.temp_c,
        temp_f: data.current.temp_f,
        condition: {
          text: data.current.condition.text,
          icon: data.current.condition.icon,
        },
        humidity: data.current.humidity,
        wind_kph: data.current.wind_kph,
        vis_km: data.current.vis_km,
        feelslike_c: data.current.feelslike_c,
        feelslike_f: data.current.feelslike_f,
      },
      unit: 'C',
    };

  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return default data on error
    return {
      location: {
        name: 'New Delhi',
        region: 'Delhi',
        country: 'India',
      },
      current: {
        temp_c: 29.0,
        temp_f: 84.2,
        condition: {
          text: 'Moderate or heavy rain with thunder',
          icon: '//cdn.weatherapi.com/weather/64x64/day/389.png',
        },
        humidity: 79,
        wind_kph: 11.5,
        vis_km: 3.5,
        feelslike_c: 28.5,
        feelslike_f: 83.4,
      },
      unit: 'C',
    };
  }
}; 