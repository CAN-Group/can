import React, { Component } from 'react';
import Logo from './Logo/Logo';   
import styled from 'styled-components';

const NavWrapper = styled.div`
    background-color : #2C363C;
    width: auto;
    height: 150px;
    display: flex;
    


`;


class NavBar extends React.Component {
    constructor() {
        super();
        
    }

    

    render() {
        return (
            
            <NavWrapper >
                <Logo />
            </NavWrapper>
        );

    }

};  


export default NavBar;