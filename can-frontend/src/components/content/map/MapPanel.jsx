import React, { Component } from 'react'
import ContentWrapper from '../ContentWrapper'
import styled from 'styled-components'
import InputMap from './InputMap'
import LeafletMap from './LeafletMap'
import SwitchButton from '../../helpers/SwitchButton';
import AutoTextBox from '../../helpers/AutoTextBox';
import cities from './../../../assets/metadata/cities.json';
import { FaBreadSlice } from 'react-icons/fa'
import MapComponent from './MapComponent';
import SubmitButton from '../../helpers/SubmitButton'
import ZoneSlider from './../../helpers/ZoneSlider'


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
        };
    }

    componentDidMount() {
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
                    console.log("xd");
                    this.setState({markerStart: {lat: lat, lng: lng} });
                }
                else{
                    this.setState({markerStop: {lat: lat, lng: lng} });
                }
            }
        })
    }

    onSubmit = (e) => {
        
    }

    render() {

        const {cityArray} = this.state;
        return (
            <ContentWrapper>
                <StyledMapPanel>
                    <InputMap>
                        <ZoneSlider />
                        <AutoTextBox placeholder="Choose starting point..." items = {cityArray} onSelection={this.onSelectedCity} type="MarkerA" />
                        <AutoTextBox placeholder="Choose destination..." items = {cityArray} onSelection={this.onSelectedCity} type="MarkerB"/>
                        <SubmitButton onClick={null}/>
                        <SwitchButton />
                    </InputMap>
                    <LeafletMap markerStart={this.state.markerStart} markerStop={this.state.markerStop} >
                        <MapComponent />
                    </LeafletMap>
                    
                </StyledMapPanel>
            </ContentWrapper>
        )
    }

}
