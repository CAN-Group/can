import React from 'react'
import styled from 'styled-components'

const StyledSwitch = styled.label`
        position: relative;
        display: inline-block;
        width: 60px;
        height: 32px;
        position: absolute;
        bottom: 30px;
    & input {
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
        transition: 0.4s;
        border-radius: 30px;
    }

    &:before {
        position: absolute;
        content: "";
        height: 24px;
        width: 24px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: 0.4s;
        border-radius: 30px;
    }
`;

const StyledInput = styled.input`

`;

const SwitchButton = (props) => {
    return (
        <StyledSwitch>
                
                <StyledInput type="checkbox" checked={props.isToggled} onChange={props.onToggle}/>
                <StyledSlider className="sliderr" />
        </StyledSwitch>    
    )
}

export default SwitchButton;
