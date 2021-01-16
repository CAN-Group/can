import React from 'react'
import ContentWrapper from '../ContentWrapper'
import styled from 'styled-components'
import InputMap from './InputMap'
import LeafletMap from './LeafletMap'
import SwitchButton from '../../helpers/SwitchButton';
import AutoTextBox from '../../helpers/AutoTextBox';
import cities from './../../../assets/metadata/cities.json';


const StyledMapPanel = styled.div`
    height: 600px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    
`;






function MapPanel(props) {
    const cityArray = [];
    const citiesCollection = cities.map(( {city, lat, lng}) => ({city, lat,lng}));
    
    citiesCollection.forEach(city => {
        cityArray.push(city.city);
    })
    
    return (
        <ContentWrapper>
            <StyledMapPanel>
                <InputMap>
                    <AutoTextBox placeholder="Choose starting point..." items = {cityArray} />
                    <AutoTextBox placeholder="Choose destination..." items = {cityArray} />
                </InputMap>
                <LeafletMap />
            </StyledMapPanel>
        </ContentWrapper>
    )
}

export default MapPanel;
