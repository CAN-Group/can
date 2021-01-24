import React from 'react'
import ContentWrapper from './content/ContentWrapper'
import styled from 'styled-components'


const StyledInfoContent = styled.section`
    border: 3px solid yellow;

`;


function Contact(props) {
    return (
        <ContentWrapper>
            <StyledInfoContent>
                <div>
                There is no such page
                </div>
            </StyledInfoContent>
        </ContentWrapper>
    )
}

export default Contact;