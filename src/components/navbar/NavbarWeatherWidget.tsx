"use client";

import { useState, useEffect } from "react";
import { LuSun, LuWind, LuDroplets, LuCloudRain, LuCloud, LuCloudLightning, LuSunset } from "react-icons/lu";

interface WeatherData {
  temperature: number;
  windSpeed: number;
  waveHeight: number;
  weatherCode: number;
  weatherDesc: string;
  fishingCondition: string;
  conditionColor: string;
}

// Default coordinates (Jakarta/Ancol area)
const DEFAULT_LAT = -6.1167;
const DEFAULT_LNG = 106.8333;

export default function NavbarWeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(`/api/weather?lat=${DEFAULT_LAT}&lng=${DEFAULT_LNG}`);
        if (res.ok) {
          const data = await res.json();
          setWeather(data);
        }
      } catch (error) {
        console.error("Weather fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <LuSun className="w-5 h-5 text-yellow-500" />;
    if (code >= 1 && code <= 3) return <LuCloud className="w-5 h-5 text-gray-400" />;
    if (code >= 51 && code <= 67) return <LuCloudRain className="w-5 h-5 text-blue-400" />;
    if (code >= 95) return <LuCloudLightning className="w-5 h-5 text-purple-500" />;
    return <LuSunset className="w-5 h-5 text-orange-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center gap-6 px-6 py-2 rounded-full border border-transparent">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-[1px] h-6 bg-gray-200"></div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-[1px] h-6 bg-gray-200"></div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-6 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="flex items-center gap-6 px-6 py-2 rounded-full border border-transparent hover:bg-surface-soft hover:border-hairline transition-all duration-300">
      {/* Temperature */}
      <div className="flex items-center gap-2 group cursor-default">
        {getWeatherIcon(weather.weatherCode)}
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-ink leading-none">{weather.temperature}°C</span>
          <span className="text-[11px] font-bold uppercase text-muted tracking-wide mt-0.5">{weather.weatherDesc}</span>
        </div>
      </div>

      <div className="w-[1px] h-6 bg-hairline"></div>

      {/* Wind Speed */}
      <div className="flex items-center gap-2 group cursor-default">
        <LuWind className="w-5 h-5 text-teal-500 group-hover:text-primary transition-colors" />
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-ink leading-none">{weather.windSpeed} km/h</span>
          <span className="text-[11px] font-bold uppercase text-muted tracking-wide mt-0.5">Angin</span>
        </div>
      </div>

      <div className="w-[1px] h-6 bg-hairline"></div>

      {/* Wave Height */}
      <div className="flex items-center gap-2 group cursor-default">
        <LuDroplets className="w-5 h-5 text-blue-500 group-hover:text-primary transition-colors" />
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold text-ink leading-none">{weather.waveHeight}m</span>
          <span className="text-[11px] font-bold uppercase text-muted tracking-wide mt-0.5">Ombak</span>
        </div>
      </div>

      {/* Fishing Condition Badge */}
      <div className={`px-3 py-1 rounded-full text-xs font-bold ${weather.conditionColor === 'text-red-500' ? 'bg-red-100 text-red-600' : weather.conditionColor === 'text-yellow-500' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
        {weather.fishingCondition}
      </div>
    </div>
  );
}
