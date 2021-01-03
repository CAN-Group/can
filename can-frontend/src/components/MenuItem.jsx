import React from 'react';
import styled from 'styled-components';

const StyledMenuItem = styled.li`
    font-family: Roboto;
    font-weight: bold;
    font-size: 20px;
    color: #B9C3C5;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    width: 140px;
    height: 50px;

    &:hover {
        background-color: #1084C3;
        color: white;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 59px;
    }

    display: flex;
    justify-content: center;
    align-items: center;
`;



class MenuItem extends React.Component
{
    
    render() {
        return (
        <StyledMenuItem onClick={this.props.onClick} >
            <a>{this.props.name}</a>
        </StyledMenuItem>
        );
    }
};

export default MenuItem;