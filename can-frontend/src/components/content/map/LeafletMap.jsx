import React, { Component } from 'react'
import { MapContainer, TileLayer, GeoJSON} from 'react-leaflet'
import MapInfoBox from './InfoBoxMap';
import styled from 'styled-components'
import 'leaflet/dist/leaflet.css'
import {  getGeoJson , getData } from './../../helpers/js/apiCalls';
import DraggableMarker from './../../helpers/DraggableMarker';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';


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
            selectedCountyId: 0,
            geoJson: {},
          
        }
    }

    

    mapContainerStyle = {
        height: '100%',
        width: '100%',
        position: 'relative',
        zIndex: 0,

    }

    backdropStyle = {
         position: 'absolute',
         zIndex: 2,    
     }

    componentDidMount() {
        // getData().then(countyInfo => {
        //     this.setState({countyInfo: countyInfo})
        //     this.props.onZoneFetch(this.state.countyInfo);
        //     this.props.onZoneUpdate(this.state.countyInfo)
        // });
        getGeoJson().then(geo => this.setState({geoJson: geo}));
    }

    

    onEeachCounty = (county, layer) => {

        const { countyInfo } = this.props;

        const dangerColor =  countyInfo.get(county.properties.id).danger
        // const colors = ['red', 'green', 'blue', 'yellow'];
        // const randomIdx = Math.floor((Math.random() * 4));

        layer.options.fillOpacity = this.opacity;
        layer.options.fillColor = dangerColor;

        layer.on({
            mouseover: e => {
                e.target.setStyle({
                    color : "blue",
                    fillColor: "blue",
                    fillOpacity: this.opacity,
                    weight: 0.5,
                });
                this.setState({selectedCountyId: county.properties.id})
            },
            mouseout: e => {
                e.target.setStyle({
                    weight: 0.3,
                    color: 'black',
                    fillColor: dangerColor,
                    fillOpacity: this.opacity,  
                });
                this.setState({selectedCountyId: 0});
            },
        });
    }

    render() {
        const {selectedCountyId, geoJson, zoom, lat, lng} = this.state;
        let infoBox, geojsonComp;

        if(selectedCountyId !== 0)
        {
            const county = this.props.countyInfo.get(selectedCountyId);

            infoBox =  <MapInfoBox countyName={county.name} 
                                   countyPopulation={county.population}
                                   casesNumber={county.casesCount}
                                   caseUpdate= {county.lastUpdate} />               
        }

        if(this.props.countyInfo.size !== 0)
        {


            geojsonComp = <GeoJSON key={this.props.renderTrigger}
                        data= {geoJson.features}
                        onEachFeature={this.onEeachCounty}
                        style={this.geoJsonStyle}/> 
        }

        return (  
            <StyledLeafletMap> 
                <MapContainer center={[lat, lng]}
                              zoom={zoom} 
                              style={this.mapContainerStyle}
                              scrollWheelZoom={true}>
                                
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                />

                {geojsonComp}
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