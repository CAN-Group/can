import React, { Component } from 'react'
import ContentWrapper from '../ContentWrapper'
import styled from 'styled-components'
import InputMap from './InputMap'
import LeafletMap from './LeafletMap'
import AutoTextBox from '../../helpers/AutoTextBox';
import cities from './../../../assets/metadata/cities.json';
import MapComponent from './MapComponent';
import SubmitButton from '../../helpers/SubmitButton'
import ZoneSlider from './../../helpers/ZoneSlider'
import { getProfiles, getData, getGeoJson } from './../../helpers/js/apiCalls'
import { GeoJSON} from 'react-leaflet'
import MapInfoBox from './InfoBoxMap';

import api from './../../helpers/js/connection';



const StyledMapPanel = styled.div`
    height: 600px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
`;



export default class Mappanel extends Component {
    constructor(props) {
        super(props)

        this.state = {
            cityArray: [],
            citiesCollection: [],
            markerStart: {lat: 54.090912551535496, lng: 22.944773199664805},
            markerStop: {lat: 53.730511521850424, lng: 22.70256041650225},
            toggled: false,
            profiles: [],
            selectedProfile: "car-eco",
            excludeZones: [],
            countyInfo: new Map(),
            zoneThresshold: [30,70],
            selectedCountyId: 0,
            geoJson: {},
            newGpx: '',
        };
    }

    opacity = 0.1;

    geoJsonStyle = {
        weight: 0.3,
        color: 'black',
        fillColor: "gray",
        opacity: 0.5,
    }

    componentDidMount() {
        getData().then(countyInfoxd => {
            this.setState({countyInfo: countyInfoxd});
            this.setZoneLevel(this.state.countyInfo);
            this.onZoneUpdate(this.state.countyInfo);
          
        });
        getGeoJson().then(geo => this.setState({geoJson: geo}));
        getProfiles().then(profiles => this.setState({profiles: profiles }));
       

        const cityArray = [];
        const citiesCollection = cities.map(( {city, lat, lng}) => ({city, lat,lng}));
        citiesCollection.forEach(city => {
            cityArray.push(city.city);
        })
        

        this.setState({cityArray: cityArray, citiesCollection: citiesCollection});
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

    
    setZoneLevel(countyInfo)
    {
        const tempMap = new Map(countyInfo);

        const { zoneThresshold } = this.state;

        let ratioLevel = [];

        countyInfo.forEach( (value,key) => {
            let ratio = parseInt(value.casesCount) / parseInt(value.population) * 1000000; 
            ratioLevel.push({key, ratio});
        });

        ratioLevel.sort( (a,b) => a.ratio - b.ratio);
    
        const lowThresshold = Math.floor((zoneThresshold[0]/ 100) * ratioLevel.length);
        const highThresshold = Math.floor((zoneThresshold[1] /100) * ratioLevel.length);

        let color;
        ratioLevel.forEach( (county, index) =>{
            if(index <= lowThresshold) {
                color = 'green';
            }
            else if(index >= highThresshold) {
                color = 'red';
            }
            else {
                color = 'yellow';
            }

            tempMap.get(county.key).danger = color;

        })

        this.setState({countyInfo: tempMap });
       
    }

    onSelectedCity = (cityName, type) =>{
        let lat = 0;
        let lng = 0;
        this.state.citiesCollection.forEach(cityObj => {
            if(cityObj.city === cityName)
            {
                
                lat = cityObj.lat;
                lng = cityObj.lng;

                if(type === 'MarkerA')
                {
                    this.setState({markerStart: {lat: lat, lng: lng} });
                }
                else{
                    this.setState({markerStop: {lat: lat, lng: lng} });
                }
            }
        })
    }

    onSelectedProfile = (value, type) => {
        this.setState({selectedProfile: value})
    }

    onSubmit = (e) => {
        const { markerStart, markerStop, selectedProfile, excludeZones } = this.state;

        const url = api.route({
            start: [markerStart.lng, markerStart.lat,],
            end: [markerStop.lng, markerStop.lat ]
        },
        excludeZones,
        selectedProfile);

        fetch(url)
        .then(res => res.text())
        .then(data => this.setState({newGpx: data}));
        
    }

    onZoneUpdate = countyInfo => {

        const excludedZones = [];
        countyInfo.forEach((county, id) => {
            if(county.danger === 'red') {
                excludedZones.push(id);
            }
        })
        
        this.setState({excludeZones: excludedZones});

    }

    onDragEnd = (position,type) => {
        if(type === "MarkerA") {
            this.setState({markerStart: {lat: position.lat, lng: position.lng}});
        } else if(type === "MarkerB") {
            this.setState({markerStop: {lat: position.lat, lng: position.lng}});
        }
    }

    onThumbMouseUp = e => {
        const {id, value } = e.target;
        console.log(id + "->" +  value);
    }

    render() {


        const {cityArray, profiles, zoneThresshold} = this.state;
        return (
            <ContentWrapper>
                <StyledMapPanel>
                    <InputMap>
                        <ZoneSlider onThumbMouseUp={this.onThumbMouseUp} zoneThresshold={zoneThresshold} />
                        <AutoTextBox placeholder="Choose starting point..." items = {cityArray} onSelection={this.onSelectedCity} type="MarkerA" />
                        <AutoTextBox placeholder="Choose destination..." items = {cityArray} onSelection={this.onSelectedCity} type="MarkerB"/>
                        <AutoTextBox placeholder="Choose routing profile..." items = {profiles} onSelection={this.onSelectedProfile}/>
                        <SubmitButton handleClick={this.onSubmit}/>
                     
                    </InputMap>
                    <LeafletMap markerStart={this.state.markerStart} markerStop={this.state.markerStop} onDragEnd={this.onDragEnd} onZoneFetch={this.onZoneUpdate} >
                        <MapComponent gpx={this.state.newGpx} />
                    </LeafletMap>
                
                </StyledMapPanel>
            </ContentWrapper>
        )
    }

}
