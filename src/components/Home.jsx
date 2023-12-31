import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import SearchBar from "./SearchBar.jsx"
import Forecast from "./Forecast.jsx"
import { geopositionAddress, apiKey } from "../util.js";

const DEFAULT_LOCATION = {
    key: '215854',
    localizedName: 'Tel Aviv',
    country: 'Israel',
}

export default function Home({location = DEFAULT_LOCATION}) {
    const { state } = useLocation();
    const [selectedLocation, setSelectedLocation] = useState(location)
    function handleLocationClicked(location){
        setSelectedLocation(location);
    }

    useEffect(() => {
        function getUserCurrentPosition() {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetch(`${geopositionAddress}?` + new URLSearchParams({
                    apikey: apiKey,
                    q: `${lat},${lon}`
                }))
                .then(res => res.json())
                .then(json => {
                    const currentLocation = {
                        key: json.Key,
                        localizedName: json.LocalizedName,
                        country: json.Country.LocalizedName,
                    };
                    setSelectedLocation(currentLocation);
                }).catch(function () {
                    setSelectedLocation(DEFAULT_LOCATION);
                })
            }, (error) => {
                setSelectedLocation(DEFAULT_LOCATION);
            });
        }
        if(state) {
            setSelectedLocation(state.location);
        } else {
            getUserCurrentPosition();
        }
    }
    ,[state]);

    return (
        <div id="home">
            <SearchBar onLocationClicked={handleLocationClicked}/>
            <Forecast location={selectedLocation}/>
        </div>
    )
}