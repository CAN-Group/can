import React, { Component } from 'react';
import Logo from './Logo';   
import styled from 'styled-components';
import MenuBar from './MenuBar';

const NavWrapper = styled.div`
    background-color : #2C363C;
    width: auto;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: space-around;
`;




class NavBar extends React.Component {
    render() {
        return (  
            <NavWrapper >
                <Logo />
                <MenuBar />
            </NavWrapper>
        );
    }
};  


export default NavBar;