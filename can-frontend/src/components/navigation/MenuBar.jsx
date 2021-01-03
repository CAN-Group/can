import React from 'react';
import styled from 'styled-components';
import MenuItem from './MenuItem'

const menuItems = ['Home','About','Map','Contact'];

const StyledMenuList = styled.ul`  
    display: flex;
    width: 500px;
    justify-content: space-between;
`;

function MenuBar(props)
{
    return( 
        <StyledMenuList>
            { menuItems.map( item =>  < MenuItem name={item} />) }
        </StyledMenuList>
    );
}

export default MenuBar;