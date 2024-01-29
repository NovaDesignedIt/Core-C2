

import React, { useState } from "react";
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow,
    Marker
} from '@vis.gl/react-google-maps';
import { ThemeProvider } from "@mui/material";
import { Circle, Polyline } from "react-google-maps";


const exampleMapStyles = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 13
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#144b53"
            },
            {
                "lightness": 14
            },
            {
                "weight": 1.4
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#08304b"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#0c4152"
            },
            {
                "lightness": 5
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#0b434f"
            },
            {
                "lightness": 25
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#0b3d51"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "color": "#146474"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#021019"
            }
        ]
    }
];


const map_basic = () => {
    const position = {lat: 53, lng: 13};
    return (
        <ThemeProvider   theme={{styles: exampleMapStyles}}>
        <APIProvider apiKey={import.meta.env.VITE_MAPS_KEY !== undefined ?  import.meta.env.VITE_MAPS_KEY : ''}>
            <div style={{ height: "100%", width: "100%",backgroundColor:"#628565" }}>
             <div style={{  height: "100%", width: "100%",backgroundColor:"#628565" }}>
                <Map zoom={8} center={position}>
                    <Marker 
            position={{ lat:53.537, lng:10.143,   }}
          />  <Marker 
          position={{ lat:53.537, lng:13.143,   }}
        />
        
       
        </Map>
          
            </div>
            </div>
        </APIProvider>
        </ThemeProvider>
    );

}

export default map_basic