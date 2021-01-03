import React from 'react';
import styled from 'styled-components';

const StyledMenuItem = styled.li`
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 34px;
    color: #B9C3C5;
`;



class MenuItem extends React.Component
{
    
    render() {
        return (
        <StyledMenuItem onClick={this.props.onClick} >
            {this.props.name}
        </StyledMenuItem>
        
        );
    }
};

export default MenuItem;