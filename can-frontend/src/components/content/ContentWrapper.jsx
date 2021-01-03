import React, { Component } from 'react'
import styled from 'styled-components'

const StyledContentWrapper = styled.section`
    margin: 25px 0;
    border: 3px solid green;

    &:first-child {
        margin-top: 0;
    }
    
    &:last-child {
        margin-bottom: 0;
    }

`;

function ContentWrapper(props) {
    return (
        <StyledContentWrapper>
            {props.children}
        </StyledContentWrapper>
    )
}

export default ContentWrapper;
