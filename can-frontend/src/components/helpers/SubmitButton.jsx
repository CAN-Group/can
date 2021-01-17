import React from 'react'
import styled from 'styled-components'
import { FaSearchLocation } from 'react-icons/fa';

const StyledSubmitButton = styled.button`
    display: block;
    width: 140px;
    height: 35px;
    border-radius: 20px;
    background: rgb(27,196,18);
    background: linear-gradient(0, rgba(27,196,18,1) 32%, rgba(92,212,101,1) 70%);
    border: none;
    color: #F5F5F5;
    display: flex;
    flex-flow: row nowrap;

    align-items: center;
    justify-content: space-around;

    padding: 0 25px;
    
    position: absolute;
    bottom: 30px;
    right: 40px;

    &:hover {
        border-radius: 20px;
        cursor: pointer;
        color: white;
    }

`;

const StyledSpan = styled.span`
        font-weight: bold;
        font-family: Arial, Helvetica, sens-serif;
        
        font-size: 14px;

    
    `;

function SubmitButton(props) {
    
    return (
        <StyledSubmitButton type="submit" onClick={props.handleClick}>
            <FaSearchLocation style={{fontSize: '18px'}}/>
            <StyledSpan>
                Search
            </StyledSpan>
        </StyledSubmitButton>
    )
}

export default SubmitButton;
