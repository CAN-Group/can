import React, { Component } from 'react';
import styled from 'styled-components';



function Logo(props) {

    

    const LogoImage = styled.img`
        width: 343px;
        height 110px;
        background-image: url("logo.png");
        border: 1px solid #000;

    `;



    return (
        <div>
              <LogoImage />
        </div>
    );
}


export default Logo;