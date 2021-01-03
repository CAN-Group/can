import React from 'react'
import ContentWrapper from './ContentWrapper'
import styled from 'styled-components'


const StyledInfoContent = styled.section`
    border: 3px solid yellow;

`;


function InfoContent(props) {
    return (
        <ContentWrapper>
            <StyledInfoContent>
                ABOUT US CONTENT
            </StyledInfoContent>
        </ContentWrapper>
    )
}

export default InfoContent;