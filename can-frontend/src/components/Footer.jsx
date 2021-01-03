import React, { Component } from 'react'
import styled from 'styled-components';
import { IconContext } from 'react-icons';
import { FaTwitter, FaFacebookSquare, FaQuestionCircle, FaEnvelope, FaPenSquare, FaLandmark } from "react-icons/fa";

const StyledFooter = styled.footer`
    height: 270px;
    background-color: #2C363C;
    display: flex;
    align-items: stretch;
    justify-content: space-around;
`;

const StyledLinkSection = styled.section`
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
`;

const StyledLink = styled.a`
    padding 25px 0 25px 20px;
    border-bottom: 1px solid #F5F5F5;
    width: 450px;
    display: flex;
    align-items: center;
`;

const iconStyle = {
    color: '#F5F5F5',
    size: '1.4rem'
};

const StyledSpan = styled.span`
    color: #F5F5F5;
    margin-left: 12px;
    font-family: Simonetta;
    font-weight: 900;
    font-size: 18px;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

function Footer(props) {
    
    return (  
        <StyledFooter>
            <IconContext.Provider value ={iconStyle}>
                <StyledLinkSection>
                    <StyledLink>
                        <FaEnvelope />
                        <StyledSpan>Send Us an Email</StyledSpan>
                    </StyledLink>
                    <StyledLink>
                        <FaQuestionCircle />
                        <StyledSpan>Frequently Asked Questions</StyledSpan>
                    </StyledLink>
                    <StyledLink>
                        <FaPenSquare />
                        <StyledSpan>Sign Up for the Newsletter</StyledSpan>
                    </StyledLink>
                </StyledLinkSection>
                <StyledLinkSection>
                    <StyledLink>
                        <FaTwitter />
                        <StyledSpan>On Twitter</StyledSpan>
                    </StyledLink>
                    <StyledLink>
                        <FaFacebookSquare />
                        <StyledSpan>On Facebook</StyledSpan>
                    </StyledLink>
                    <StyledLink>
                        <FaLandmark />
                        <StyledSpan>Visit Official Goverment Site</StyledSpan>
                    </StyledLink>
                </StyledLinkSection>
            </IconContext.Provider>
        </StyledFooter>
    )
}

export default Footer;