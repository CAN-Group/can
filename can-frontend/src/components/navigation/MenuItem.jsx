import React from 'react'
import styled from 'styled-components'

const StyledMenuItem = styled.li`
    font-family: Roboto;
    font-weight: bold;
    font-size: 20px;
    color: #B9C3C5;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    width: 140px;
    height: 40px;

    &:hover {
        border-bottom: 2px solid  #1084C3;   
        color: white;
    }
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledLink = styled.a`
    transition: all .1s ;
    width: 100%;
    height: 100%;
    display: flex;
    align-items:center;
    justify-content: center;
    &:hover {
        transform: scale(1.1);
    }
`;



class MenuItem extends React.Component
{
    render() {
        return (
        <StyledMenuItem onClick={this.props.onClick} >
            <StyledLink>{this.props.name}</StyledLink>
        </StyledMenuItem>
        );
    }
};

export default MenuItem;