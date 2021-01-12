import React, { Component } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import styled from 'styled-components'
import 'leaflet/dist/leaflet.css'
import counties from '../../../assets/metadata/counties.json'
import {  getCounties } from './map-utils'

const StyledLeafletMap = styled.div`
    flex: 3;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    background-color: #F8F8F8;
`;

const geoJsonStyle = {
    weight: 0.3,
    color: 'black',
    fillColor: "gray",
    opacity: 0.5,

}




class LeafletMap extends Component {

    zoneLevel = ['red', 'green', 'yellow'];
    opacity = 0.2;

    constructor(props) {
        super(props);

        this.state = {
            lat: 52.23,
            lng: 21.01,
            zoom: 6.4,
            population: [],
        }
    }

    componentDidMount() {
        getCounties().then(arr => this.setState({population: arr}));
    }

    onCountyActive = (event) => {
        event.target.setStyle({
            color : "blue",
            fillColor: "blue",
            fillOpacity: this.opacity,
            weight: 0.5,
        
        });
    }

    onEeachCounty = (county, layer) => {
        const countyId = county.properties.id;
        const countyName = county.properties.nazwa;

        
        layer.bindPopup(countyName);

        const colorIndex = Math.floor(Math.random()* this.zoneLevel.length);
        layer.options.fillColor = this.zoneLevel[colorIndex];
        layer.options.fillOpacity = this.opacity;

        layer.on({
            mouseover: this.onCountyActive,
            mouseout: e => {
                e.target.setStyle({
                    weight: 0.3,
                    color: 'black',
                    fillColor: this.zoneLevel[colorIndex],
                    fillOpacity: this.opacity,   
                })
            },
        });
    }

    render() {
        const position = [this.state.lat, this.state.lng];

        return (
            <StyledLeafletMap>
                <MapContainer center={position} zoom={this.state.zoom} style={{height:'100%'}}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                />
                <GeoJSON data= {counties.features}
                         onEachFeature={this.onEeachCounty}
                         style={geoJsonStyle}
                />
                         
                </MapContainer>
            </StyledLeafletMap>
        )
    }
}

export default LeafletMap;