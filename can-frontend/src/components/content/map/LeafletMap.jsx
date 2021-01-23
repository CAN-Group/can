import React, { Component } from 'react'
import { MapContainer, TileLayer, GeoJSON} from 'react-leaflet'
import MapInfoBox from './InfoBoxMap';
import styled from 'styled-components'
import 'leaflet/dist/leaflet.css'
import {  getGeoJson , getData } from './../../helpers/js/apiCalls';
import DraggableMarker from './../../helpers/DraggableMarker';


const StyledLeafletMap = styled.div`
    flex: 3;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    background-color: #F8F8F8;
    position: relative;
`;


class LeafletMap extends Component {
    opacity = 0.1;
    
    geoJsonStyle = {
        weight: 0.3,
        color: 'black',
        fillColor: "gray",
        opacity: 0.5,
    }

    constructor(props) {
        super(props);

        this.state = {
            lat: 52.23,
            lng: 21.01,
            zoom: 6.4,
            countyInfo: new Map(),
            selectedCountyId: 0,
            geoJson: {},
            markers: [],
        }
    }

    componentDidMount() {
        getData().then(countyInfo => {
            this.setState({countyInfo: countyInfo})
            this.props.onZoneFetch(countyInfo);
        });
        getGeoJson().then(geo => this.setState({geoJson: geo}));
    }

    

    onEeachCounty = (county, layer) => {


        const dangerColor =  this.state.countyInfo.get(county.properties.id).danger
        
        layer.options.fillOpacity = this.opacity;
        layer.options.fillColor = dangerColor;


        layer.on({
            mouseover: e => {
                e.target.setStyle({
                    color : "blue",
                    fillColor: "blue",
                    fillOpacity: this.opacity,
                    weight: 0.5,
                })
                this.setState({selectedCountyId: county.properties.id})
            },
            mouseout: e => {
                e.target.setStyle({
                    weight: 0.3,
                    color: 'black',
                    fillColor: dangerColor,
                    fillOpacity: this.opacity,  
                })
                this.setState({selectedCountyId: 0});
            },
        });
    }

    render() {
        const position = [this.state.lat, this.state.lng];

        let infoBox;
        if(this.state.selectedCountyId !== 0)
        {
            const county = this.state.countyInfo.get(this.state.selectedCountyId);

            infoBox =  <MapInfoBox countyName={county.name} 
                                   countyPopulation={county.population}
                                   casesNumber={county.casesCount}
                                   caseUpdate= {county.lastUpdate} 
                        />               
        }

        let geojson;
        if(this.state.countyInfo.size !== 0)
        {
            geojson = <GeoJSON data= {this.state.geoJson.features}
                        onEachFeature={this.onEeachCounty}
                        style={this.geoJsonStyle}
                      /> 
        }

        return (  
            <StyledLeafletMap>
                <MapContainer center={position}
                              zoom={this.state.zoom} 
                              style={{height:'100%'}}
                              scrollWheelZoom={true}
                              >
                                
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                />
                { geojson }
                <DraggableMarker type='MarkerA' position={this.props.markerStart} onDragEnd={this.props.onDragEnd} />
                <DraggableMarker type='MarkerB' position={this.props.markerStop}  onDragEnd={this.props.onDragEnd} />
                
                {this.props.children}

                </MapContainer>
                { infoBox }
            </StyledLeafletMap>         
        )
    }
}

export default LeafletMap;