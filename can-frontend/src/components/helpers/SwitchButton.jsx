import React from 'react'
import styled from 'styled-components'

const StyledSwitch = styled.label`
    
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    
    input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    input:checked +  {

    }

`;

const StyledSlider = styled.span`
    & {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
    }

    &:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        border-radius : 20px;
    }
`;

const SwitchButton = () => {
    return (
        <StyledSwitch>
                <input type="checkbox"/>
                <StyledSlider>
                    
                </StyledSlider>
        </StyledSwitch>
    )
}

export default SwitchButton;
