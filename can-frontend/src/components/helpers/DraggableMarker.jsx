import React, { useState, useRef, useMemo, useEffect } from 'react';
import L from 'leaflet';
import  { Marker } from 'react-leaflet';

function getIcon(_iconSize, type){
    return L.icon({
        iconUrl: `/images/icons/${type}.png`,
        iconSize: [_iconSize],
        iconAnchor: [_iconSize/2, _iconSize + 1],
    })
}

  
function DraggableMarker(props) {
    const [position, setPosition] = useState(props.position)
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            setPosition(marker.getLatLng())
            props.onDragEnd(marker.getLatLng(), props.type);
          }
        },
      }),
      [],
    )

    useEffect(() =>{
       setPosition(props.position);
    }, [props.position]);
      

    return (
      <Marker
        draggable={true}
        icon={getIcon(60,props.type)}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}>
      </Marker>
    )
}

export default DraggableMarker;
  
