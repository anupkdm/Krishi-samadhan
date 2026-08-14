const { getDb } = require('../db/database');

function generateSignals(weather) {
    const signals = [];
    if (weather.precipitation > 10 || weather.rainfall > 10) {
        signals.push('Heavy rainfall expected. Postpone field operations.');
    }
    if (weather.temperature > 40) {
        signals.push('Heat stress risk. Ensure adequate irrigation.');
    }
    if (weather.humidity > 85) {
        signals.push('High humidity. Monitor for fungal diseases.');
    }
    if (weather.wind_speed > 40) {
        signals.push('High winds. Secure crop covers and structures.');
    }
    return signals;
}

exports.getCurrentWeather = async (lat, lon) => {
    try {
        const db = await getDb();
        // Check cache first (30 mins validity)
        const result = db.exec("SELECT * FROM weather_cache WHERE latitude = ? AND longitude = ? AND fetched_at > datetime('now', '-30 minutes')", [lat, lon]);
        
        let weatherData;
        if (result.length > 0) {
            const row = result[0].values[0];
            const columns = result[0].columns;
            const data = {};
            columns.forEach((col, i) => data[col] = row[i]);
            
            weatherData = {
                temperature: data.temperature,
                humidity: data.humidity,
                precipitation: data.rainfall,
                wind_speed: data.wind_speed,
                weather_code: data.weather_code
            };
        } else {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch weather data');
            const data = await response.json();
            const current = data.current;
            
            weatherData = {
                temperature: current.temperature_2m,
                humidity: current.relative_humidity_2m,
                precipitation: current.precipitation,
                wind_speed: current.wind_speed_10m,
                weather_code: current.weather_code
            };

            const stmt = db.prepare("INSERT INTO weather_cache (latitude, longitude, temperature, humidity, rainfall, wind_speed, weather_code) VALUES (?, ?, ?, ?, ?, ?, ?)");
            stmt.run([lat, lon, weatherData.temperature, weatherData.humidity, weatherData.precipitation, weatherData.wind_speed, weatherData.weather_code]);
            stmt.free();
        }

        const signals = generateSignals(weatherData);

        return {
            ...weatherData,
            signals,
            source: 'Open-Meteo',
            status: 'Live'
        };
    } catch (error) {
        console.error('Weather service error:', error);
        throw new Error('Failed to retrieve weather data');
    }
};

exports.getForecast = async (lat, lon) => {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code,wind_speed_10m_max&timezone=auto&forecast_days=7`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch forecast data');
        const data = await response.json();
        
        return {
            forecast: data.daily,
            source: 'Open-Meteo',
            status: 'Live'
        };
    } catch (error) {
        console.error('Forecast service error:', error);
        throw new Error('Failed to retrieve forecast data');
    }
};
