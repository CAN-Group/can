import {useMap} from 'react-leaflet';
import L from 'leaflet-gpx';
import gpx from './example.gpx';

function MapComponent(props) {
    const map = useMap();
    // console.log("loading");
    // new L.GPX(gpx,{async: true}).on('loaded', (e) =>{
    //     map.fitBounds(e.target.getBounds());
    // } ).addTo(map);
    
    

    return null;
}

export default MapComponent;