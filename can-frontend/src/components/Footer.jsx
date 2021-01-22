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
    color: white;
`;

const iconStyle = {
    color: '#F5F5F5',
    size: '1.4rem'
};

const StyledSpan = styled.span`
    color: #F5F5F5;
    margin-left: 10px;
    font-family: Simonetta;
    font-weight: 900;
    font-size: 17px;
    
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    a:link {
        color: #F5F5F5;
    }
    a:visited {
        color: #F5F5F5;
    }
    a:hover {
        transition: font-size 1s;
        font-size: 22px;
    }
`;

function Footer(props) {
    
    return (  
        <StyledFooter>
            <IconContext.Provider value ={iconStyle}>
                <StyledLinkSection>
                    <StyledLink>
                        <FaEnvelope />
                        <StyledSpan>
                            <a href="/Contact">Send Us an Email</a>
                        </StyledSpan>
                    </StyledLink>
                    <StyledLink>
                        <FaLandmark />
                        <StyledSpan>
                            <a href="https://www.gov.pl/web/zdrowie">Visit Official Goverment Site</a>
                        </StyledSpan>
                    </StyledLink>
                </StyledLinkSection>

                <StyledLinkSection>
                    <StyledLink>
                        <FaTwitter />
                        <StyledSpan>
                            <a href="https://twitter.com">On Twitter</a>
                        </StyledSpan>
                    </StyledLink>
                    <StyledLink>
                        <FaFacebookSquare />
                        <StyledSpan>
                            <a href="https://facebook.com">On Facebook</a>
                        </StyledSpan>
                    </StyledLink>
                </StyledLinkSection>
            </IconContext.Provider>
        </StyledFooter>
    )
}

export default Footer;