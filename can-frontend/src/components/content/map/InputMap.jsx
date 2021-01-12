import React, { Component } from 'react'
import styled from 'styled-components'

const StyledInputMap = styled.div`
    flex: 1;
    margin-right: 60px;

    background-color: #F8F8F8;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 33px;

    display: flex;
    align-items: center;
    justify-content: center;

`;

class InputMap extends Component {
    constructor(props) {
        super(props)

        this.state = {
                 
        }
    }

    render() {
        return (
            <StyledInputMap>
                {this.props.children}
            </StyledInputMap>
        )
    }
}

export default InputMap;