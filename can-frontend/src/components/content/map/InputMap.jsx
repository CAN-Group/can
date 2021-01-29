import React, { Component } from "react";
import styled from "styled-components";

const StyledInputMap = styled.div`
  flex: 1;
  margin-right: 60px;
  background-color: #f8f8f8;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 33px;
  height: 400px;
  margin-top: 100px;
  position: relative;
`;

const StyledWrap = styled.div`
  display: flex;
  align-items: left;
  justify-content: space-around;
  flex-flow: column nowrap;
  height: 250px;
  margin: 70px;
`;

class InputMap extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <StyledInputMap>
        <StyledWrap>{this.props.children}</StyledWrap>
      </StyledInputMap>
    );
  }
}

export default InputMap;
