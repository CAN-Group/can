import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import MenuItem from './MenuItem'

const menuItems = ['Map','About Us','Contact'];

const StyledMenuBar = styled.div`
    align-self: flex-end;
    margin-right: 60px;
`;

const StyledMenuList = styled.ul`  
    display: flex;
    width: 450px;
    justify-content: space-between;
    
`;

const styleNavLink = {
    textDecoration: 'none',
}

function MenuBar(props)
{
    return( 
        <StyledMenuBar>
            <StyledMenuList>
            <NavLink style={styleNavLink} to="/"><MenuItem name='Map'/></NavLink>
            <NavLink style={styleNavLink} to="/about"><MenuItem name='About Us'/></NavLink>
            <NavLink style={styleNavLink} to="/contact"><MenuItem name='Contact'/></NavLink>
            </StyledMenuList>
        </StyledMenuBar>
    );
}

export default MenuBar;