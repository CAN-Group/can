import React, { Component } from 'react'
import styled from 'styled-components'
import MapPanel from './content/map/MapPanel'
import InfoContent from './content/InfoContent'

const NavSpacing = styled.div`
    height: 110px;
    width: 100%;
`;

const StyledMainContent = styled.section`
    min-height: 600px;
    margin: 60px;
    display: flex;
    flex-flow: column nowrap;
`;

// border: 3px solid red;
class MainContent extends Component {
    constructor(props) {
        super(props)
        this.state = {      
        }
    }

    render() {
        return (
            <>
                <NavSpacing/>
                <StyledMainContent>
                    <MapPanel />
                        
                    <InfoContent />
                </StyledMainContent>
            </>
        )
    }
}

export default MainContent;
