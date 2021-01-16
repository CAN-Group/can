import React, { useState, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import  { Marker } from 'react-leaflet';

function getIcon(_iconSize, type){
    return L.icon({
        iconUrl: `/images/icons/${type}.png`,
        iconSize: [_iconSize],
        iconAnchor: [_iconSize/2, _iconSize + 1],
    })
}

const center = {
    lat: 51.505,
    lng: -0.09,
  }
  
function DraggableMarker(props) {
    const [draggable, setDraggable] = useState(false)
    const [position, setPosition] = useState(center)
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          if (marker != null) {
            setPosition(marker.getLatLng())
          }
        },
      }),
      [],
    )
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
  
