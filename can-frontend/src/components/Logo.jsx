import React from 'react';
import styled from 'styled-components';

//TODO style logo do poprawy

function Logo(props) {

    const LogoImg = styled.img`
        width: 345px;
        height: 110px;     
        background: url("/images/logo.png") no-repeat center;
        background-size: contain;
    `;
    const LogoWrapper = styled.div`
        width:  340px;
        height: 107px;
        display: flex;
        align-items: center;
        overflow: hidden;
        margin-left: 85px; 
    `;
    return (
        <LogoWrapper>
            <LogoImg />
        </LogoWrapper>
    );
}

export default Logo;