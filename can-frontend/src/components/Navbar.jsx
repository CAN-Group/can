import React from 'react';
import Logo from './navigation/Logo';   
import styled from 'styled-components';
import MenuBar from './navigation/MenuBar';

const NavWrapper = styled.nav`
    background-color: #2C363C;
    height: 110px;
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    padding-left: 60px;
    position: fixed;
    top: 0;
    width: 97%;
    z-index: 2000; 
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