import React  from 'react'
import styled from 'styled-components'
import { IconContext } from 'react-icons'
import { FaTwitter, FaFacebookSquare, FaQuestionCircle, FaEnvelope, FaPenSquare, FaLandmark } from "react-icons/fa"

const StyledFooter = styled.footer`
    height: 170px;
    background-color: #2C363C;
    display: flex;
    align-items: stretch;
    justify-content: space-around;
    width: 100%;
    bottom: 0;
    position: fixed;
    z-index: 2000;
`;

const StyledLinkSection = styled.section`
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    margin: 10px 0;

`;

const StyledLink = styled.a`
    padding 15px 0 10px 10px;
    border-bottom: 1px solid #F5F5F5;
    width: 450px;
    display: flex;
    align-items: center;
    color: #F5F5F5;
    text-decoration: none;
    transition: all .1s ease-in-out;

    &:hover {
        transform: scale(1.1);
        color: white;
        border-bottom: 2px solid white;
    }

`;

const iconStyle = {
    size: '1.4rem',
};

const StyledSpan = styled.span`
    margin-left: 10px;
    font-family: Simonetta;
    font-weight: 900;
    font-size: 17px;  
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

function Footer(props) {
    
    return (  
        <StyledFooter>
            <IconContext.Provider value ={iconStyle}>
                <StyledLinkSection>
                    <StyledLink href="/Contact">
                        <FaEnvelope  />
                        <StyledSpan> Send Us an Email </StyledSpan>
                    </StyledLink>
                    <StyledLink href="https://www.gov.pl/web/zdrowie">
                        <FaLandmark />
                        <StyledSpan> Visit Official Goverment Site </StyledSpan>
                    </StyledLink>
                </StyledLinkSection>
                <StyledLinkSection>
                    <StyledLink href="https://twitter.com">
                        <FaTwitter />
                        <StyledSpan> CAN on Twitter </StyledSpan>
                    </StyledLink>
                    <StyledLink href="https://facebook.com">
                        <FaFacebookSquare />
                        <StyledSpan> CAN on Facebook </StyledSpan>
                    </StyledLink>
                </StyledLinkSection>
            </IconContext.Provider>
        </StyledFooter>
    )
}

export default Footer;