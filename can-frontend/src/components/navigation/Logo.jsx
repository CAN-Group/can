import React from 'react';
import styled from 'styled-components';

//TODO style logo do poprawy

const LogoImg = styled.div`
    width: 345px;
    height: 90px;     
    background: url("/images/logo.png") no-repeat center;
    background-size: contain;
`;

function Logo(props) {

  
    return (
            <LogoImg /> 
    );
}

export default Logo;