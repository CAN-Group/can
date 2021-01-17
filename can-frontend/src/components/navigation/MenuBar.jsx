import React from 'react';
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
                { menuItems.map( item =>  <MenuItem key={item.toString()} name={item} />) }
            </StyledMenuList>
        </StyledMenuBar>
    );
}

export default MenuBar;