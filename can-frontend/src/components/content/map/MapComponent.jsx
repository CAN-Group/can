import { useMap } from 'react-leaflet';
import L from 'leaflet-gpx';

import React, {useEffect, useState} from 'react';

function MapComponent(props) {
    const map = useMap();
    const [layer, setLayer] = useState({});
    useEffect(() => {      
        map.removeLayer(layer);
        const newLayer = new L.GPX(props.gpx,{
            async: true,
            display_wpt: false,
            marker_options: {
                startIconUrl: 'images/trans.png',
                endIconUrl: 'images/trans.png',
                shadowUrl: 'images/trans.png',
                riseOnHover: false,
                opacity: 0,  
                
            },
            polyline_options: {
                color: 'blue',
                opacity: 0.6,
                weight: 2,
                lineCap: 'round'
              }

        }).on('loaded', (e) =>{
            map.fitBounds(e.target.getBounds());
        });
        newLayer.addTo(map);
        
        setLayer(newLayer)
    }, [props.gpx]);

    

    // console.log("loading");
    return null;
}

export default MapComponent;