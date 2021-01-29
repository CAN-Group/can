import React from 'react'
import ContentWrapper from './content/ContentWrapper'
import styled from 'styled-components'


const StyledInfoContent = styled.section`
    border: 3px solid black;
    background: #2C363C;
    color: white;
    text-align: center;
    position: relative;
    width: 50%;
    top: 50%;
    left: 25%;
`;

const StyledMainContent = styled.section`
    min-height: 200px;
    margin: 60px;
    display: flex;
    flex-flow: column nowrap;
`;


function Contact(props) {
    return (
        <ContentWrapper>
            <StyledMainContent/>
            <StyledInfoContent>
                Send us mail at:
                <br/><br/>
                exampleContactMail@can.com
                
            </StyledInfoContent>
        </ContentWrapper>
    )
}

export default Contact;