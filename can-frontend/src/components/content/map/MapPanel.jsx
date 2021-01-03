import React from 'react'
import ContentWrapper from '../ContentWrapper'
import styled from 'styled-components'
import InputMap from './InputMap'
import LeafletMap from './LeafletMap'

const StyledMapPanel = styled.div`
    height: 600px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    
`;



function MapPanel(props) {
    
    return (
        <ContentWrapper>
            <StyledMapPanel>
                <InputMap />
                <LeafletMap />
            </StyledMapPanel>
        </ContentWrapper>
    )
}

export default MapPanel;
