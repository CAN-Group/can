import React from 'react';
import Logo from './navigation/Logo';   
import styled from 'styled-components';
import MenuBar from './navigation/MenuBar';

const NavWrapper = styled.nav`
    background-color : #2C363C;
    width: auto;
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    position: fixed;
    top: 0;
    width: 100%;
    
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