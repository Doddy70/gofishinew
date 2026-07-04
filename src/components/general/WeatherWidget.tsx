"use client";

import { useState, useEffect } from "react";
import { LuCloud, LuSun, LuCloudRain, LuWind, LuWaves, LuFish } from "react-icons/lu";

type Location = {
    name: string;
    lat: number;
    lng: number;
};

const LOCATIONS: Location[] = [
    { name: "Perairan Jakarta", lat: -5.993, lng: 106.829 },
    { name: "Banten (Anyer)", lat: -6.024, lng: 106.035 },
    { name: "Tangerang (Tanjung Kait)", lat: -6.046, lng: 106.634 },
    { name: "Kepulauan Seribu", lat: -5.748, lng: 106.572 }
];

type WeatherData = {
    temperature: number;
    windSpeed: number;
    waveHeight: number;
    weatherCode: number;
    weatherDesc: string;
    fishingCondition: string;
    conditionColor: string;
};

export default function WeatherWidget() {
    const [selectedLoc, setSelectedLoc] = useState<Location>(LOCATIONS[0]);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchWeather = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/weather?lat=${selectedLoc.lat}&lng=${selectedLoc.lng}`);
                const data = await res.json();
                if (isMounted && res.ok) {
                    setWeather(data);
                }
            } catch (error) {
                console.error("Failed to load weather", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchWeather();
        return () => { isMounted = false; };
    }, [selectedLoc]);

    const getWeatherIcon = (code: number) => {
        if (code === 0) return <LuSun className="w-8 h-8 text-yellow-500" />;
        if (code >= 1 && code <= 3) return <LuCloud className="w-8 h-8 text-gray-400" />;
        if (code >= 51 && code <= 82) return <LuCloudRain className="w-8 h-8 text-blue-500" />;
        return <LuCloud className="w-8 h-8 text-gray-500" />;
    };

    return (
        <div className="bg-canvas border border-default rounded-xl p-6 shadow-soft w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                        <LuFish className="w-5 h-5 text-primary" />
                        Kondisi Perairan & Cuaca
                    </h3>
                    <p className="text-sm text-muted">Cek kondisi cuaca sebelum mancing</p>
                </div>
                
                <select 
                    className="p-2 bg-white border border-default rounded-lg text-sm font-medium text-ink outline-none focus:border-primary w-full md:w-auto"
                    value={selectedLoc.name}
                    onChange={(e) => {
                        const loc = LOCATIONS.find(l => l.name === e.target.value);
                        if (loc) setSelectedLoc(loc);
                    }}
                >
                    {LOCATIONS.map(loc => (
                        <option key={loc.name} value={loc.name}>{loc.name}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="animate-pulse flex gap-4 h-24 bg-muted/20 rounded-lg w-full"></div>
            ) : weather ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Cuaca Umum */}
                    <div className="flex flex-col items-center justify-center p-3 bg-muted/10 rounded-lg">
                        {getWeatherIcon(weather.weatherCode)}
                        <span className="text-lg font-bold text-ink mt-2">{weather.temperature}°C</span>
                        <span className="text-xs text-muted font-medium">{weather.weatherDesc}</span>
                    </div>

                    {/* Angin */}
                    <div className="flex flex-col items-center justify-center p-3 bg-muted/10 rounded-lg">
                        <LuWind className="w-6 h-6 text-teal-500 mb-2" />
                        <span className="text-lg font-bold text-ink">{weather.windSpeed}</span>
                        <span className="text-xs text-muted font-medium">km/jam</span>
                    </div>

                    {/* Ombak */}
                    <div className="flex flex-col items-center justify-center p-3 bg-muted/10 rounded-lg">
                        <LuWaves className="w-6 h-6 text-blue-600 mb-2" />
                        <span className="text-lg font-bold text-ink">{weather.waveHeight}</span>
                        <span className="text-xs text-muted font-medium">Meter</span>
                    </div>

                    {/* Status Mancing */}
                    <div className="flex flex-col items-center justify-center p-3 bg-muted/10 rounded-lg">
                        <span className="text-xs text-muted mb-1 font-medium text-center">Status Mancing</span>
                        <span className={`text-lg font-bold ${weather.conditionColor} text-center leading-tight`}>
                            {weather.fishingCondition}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="text-center text-muted p-4">Gagal memuat data cuaca.</div>
            )}
        </div>
    );
}
