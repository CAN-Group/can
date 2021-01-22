import React from 'react'
import ContentWrapper from './ContentWrapper'
import styled from 'styled-components'


const StyledInfoContent = styled.section`

    background: #2C363C;
    color: white;
`;


function InfoContent(props) {
    return (
        <ContentWrapper>
            <StyledInfoContent>
             
            </StyledInfoContent>
        </ContentWrapper>
    )
}

export default InfoContent;