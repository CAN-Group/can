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

function MenuBar(props)
{
    return( 
        <StyledMenuBar>
            <StyledMenuList>
            <NavLink to="/"><MenuItem name='Map'/></NavLink>
            <NavLink to="/about"><MenuItem name='About Us'/></NavLink>
            <NavLink to="/contact"><MenuItem name='Contact'/></NavLink>
            </StyledMenuList>
        </StyledMenuBar>
    );
}

export default MenuBar;