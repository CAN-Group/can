import React, { Component } from 'react'
import Leaflet from 'react-leaflet';
import styled from 'styled-components'

const StyledLeafletMap = styled.div`
    flex: 3;
    border-radius: 33px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    background-color: #F8F8F8;
`;


class LeafletMap extends Component {
    constructor(props) {
        super(props)

        this.state = {
                 
        }
    }


    render() {
        return (
            <StyledLeafletMap>
                
            </StyledLeafletMap>
        )
    }
}

export default LeafletMap;