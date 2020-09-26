import React from 'react'

import { WiDayLightning,
    WiDayShowers,
    WiNightAltShowers,
    WiDayRain,
    WiNightAltRain,
    WiDaySnow,
    WiNightAltSnow,
    WiDayFog,
    WiNightFog,
    WiDaySunny,
    WiNightClear,
    WiNightCloudy,
    WiNightPartlyCloudy,
    WiCloudy } from 'react-icons/wi'

import { IconContext } from 'react-icons'

const iconTable = {
    '11d': <WiDayLightning />,
    '10d': <WiDayShowers />,
    '10n': <WiNightAltShowers />,
    '09d': <WiDayRain />,
    '09n': <WiNightAltRain />,
    '13d': <WiDaySnow />,
    '13n': <WiNightAltSnow />,
    '50d': <WiDayFog />,
    '50n': <WiNightFog />,
    '01d': <WiDaySunny />,
    '01n': <WiNightClear />,
    '04d': <WiCloudy />,
    '04n': <WiNightCloudy />,
    '02d': <WiCloudy />,
    '02n': <WiNightPartlyCloudy />,
    '03d': <WiCloudy />,
    '03n': <WiNightCloudy />
}

const WeatherIcon = ({icon, description}) => {
    console.log('description', description)
    return iconTable[icon] ? (
        <IconContext.Provider value={{  title: description, color: "#3d5a80", className: "weatherIcon" }}>
            {iconTable[icon]}
        </IconContext.Provider>

    ) : (
        <span></span>
    )
}

WeatherIcon.propTypes = {

}

export default WeatherIcon
