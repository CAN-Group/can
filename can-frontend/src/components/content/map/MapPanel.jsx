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
import { getProfiles } from './../../helpers/js/apiCalls'


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
            markerStart: {lat: 54, lng: 19},
            markerStop: {lat: 53, lng: 21},
            toggled: false,
            profiles: [],
            selectedProfile: "car-eco",
            excludeZones: [],
        };
    }

    componentDidMount() {

        getProfiles().then(profiles => this.setState({profiles: profiles }));

        const cityArray = [];
        const citiesCollection = cities.map(( {city, lat, lng}) => ({city, lat,lng}));
        citiesCollection.forEach(city => {
            cityArray.push(city.city);
        })
        

        this.setState({cityArray: cityArray, citiesCollection: citiesCollection});
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

        fetch(api.route({
            start: [markerStart.lng, markerStart.lat,],
            end: [markerStop.lng, markerStop.lat ]
        },
        excludeZones,
        selectedProfile)).then( res => console.log(res.text()));

        console.log(api.route({
            start: [markerStart.lng, markerStart.lat,],
            end: [markerStop.lng, markerStop.lat ]
        },
        excludeZones,
        selectedProfile));

       
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

        const {cityArray, profiles} = this.state;
        return (
            <ContentWrapper>
                <StyledMapPanel>
                    <InputMap>
                        <ZoneSlider onThumbMouseUp={this.onThumbMouseUp} />
                        <AutoTextBox placeholder="Choose starting point..." items = {cityArray} onSelection={this.onSelectedCity} type="MarkerA" />
                        <AutoTextBox placeholder="Choose destination..." items = {cityArray} onSelection={this.onSelectedCity} type="MarkerB"/>
                        <AutoTextBox placeholder="Choose routing profile..." items = {profiles} onSelection={this.onSelectedProfile}/>
                        <SubmitButton handleClick={this.onSubmit}/>
                     
                    </InputMap>
                    <LeafletMap markerStart={this.state.markerStart} markerStop={this.state.markerStop} onDragEnd={this.onDragEnd} onZoneFetch={this.onZoneUpdate}>
                        <MapComponent />
                    </LeafletMap>
                    
                </StyledMapPanel>
            </ContentWrapper>
        )
    }

}
