import { useState, useEffect } from 'react';

export function useWeather() {
    const [weather, setWeather] = useState<{ temp: number; icon: string; text: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWeather() {
            try {
                // Seogwipo Coordinates
                const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=33.25&longitude=126.56&current=temperature_2m,weather_code&timezone=Asia%2FTokyo');
                const data = await response.json();

                const temp = Math.round(data.current.temperature_2m);
                const code = data.current.weather_code;

                let icon = 'sun';
                let text = '맑음';

                if (code >= 1 && code <= 3) { icon = 'cloud-sun'; text = '구름약간'; }
                else if (code >= 45 && code <= 48) { icon = 'smog'; text = '안개'; }
                else if (code >= 51 && code <= 67) { icon = 'cloud-rain'; text = '비'; }
                else if (code >= 71) { icon = 'snowflake'; text = '눈'; }
                else if (code >= 95) { icon = 'cloud-lightning'; text = '뇌우'; }
                else if (code === 0) { icon = 'sun'; text = '맑음'; }
                else { icon = 'cloud'; text = '흐림'; }

                setWeather({ temp, icon, text });
            } catch (e) {
                console.error("Weather fetch failed", e);
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();
    }, []);

    return { weather, loading };
}
