import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
        return NextResponse.json(
            { error: "Latitude and longitude are required" },
            { status: 400 }
        );
    }

    try {
        // Fetch weather data from Open-Meteo
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m,weather_code&hourly=temperature_2m,wind_speed_10m&timezone=auto`
        );
        
        // Fetch marine data (wave height) from Open-Meteo Marine API
        const marineRes = await fetch(
            `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=wave_height&timezone=auto`
        );

        if (!weatherRes.ok || !marineRes.ok) {
            throw new Error("Failed to fetch from Open-Meteo");
        }

        const weatherData = await weatherRes.json();
        const marineData = await marineRes.json();

        const current = weatherData.current;
        const marineCurrent = marineData.current || { wave_height: 0.5 }; // fallback if inland

        // Determine fishing conditions based on wind and waves
        let fishingCondition = "Bagus";
        let conditionColor = "text-success"; // Use Tailwind color from globals.css or standard
        
        const windSpeed = current.wind_speed_10m; // km/h
        const waveHeight = marineCurrent.wave_height; // meters

        if (windSpeed > 30 || waveHeight > 1.5) {
            fishingCondition = "Berbahaya";
            conditionColor = "text-red-500";
        } else if (windSpeed > 20 || waveHeight > 1.0) {
            fishingCondition = "Kurang Baik";
            conditionColor = "text-yellow-500";
        }

        // Map weather code to description (simplified WMO codes)
        let weatherDesc = "Cerah Berawan";
        const code = current.weather_code;
        if (code === 0) weatherDesc = "Cerah";
        else if (code >= 1 && code <= 3) weatherDesc = "Berawan";
        else if (code >= 51 && code <= 67) weatherDesc = "Hujan Ringan";
        else if (code >= 80 && code <= 82) weatherDesc = "Hujan Lebat";
        else if (code >= 95) weatherDesc = "Badai Petir";

        return NextResponse.json({
            temperature: current.temperature_2m,
            windSpeed: current.wind_speed_10m,
            waveHeight: marineCurrent.wave_height,
            weatherCode: current.weather_code,
            weatherDesc,
            fishingCondition,
            conditionColor
        });

    } catch (error) {
        console.error("Weather API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch weather data" },
            { status: 500 }
        );
    }
}
