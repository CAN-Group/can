import React from 'react'
import styled from 'styled-components';
import { FaReply,  FaLongArrowAltRight, FaRoad} from "react-icons/fa";
import * as ReactBootStrap from 'react-bootstrap';

const StyledInfoBoxMap = styled.div`
   z-index: 900;
   width: 240px;
   position: absolute;
   border: 1px solid gray;
   left: 15px;
   bottom: 15px;
   background-color: #2C363C;
   border-radius: 10px;
   display: flex;
   flex-flow: column wrap;
   height: 120px;
   align-content: center;
   justify-content: center;
   opacity: 0.9; 

`;

const StyledLabel = styled.label`
    
    display: block;
    width: 20px;
    font-weight: bold;
    text-align: right;
`;

const StyledSpan = styled.span`
    display: block;
    width: 130px;
    text-align: left;
    margin-left: 20px;
    
`;

const StyledInfoLabel = styled.div`
    display: flex;
    margin: 6px 0;
    font-size: 14px;
    color: #F5F5F5;
    align-items: center;
    justify-content: center;
    position:relative;
`;

function InfoBoxMap(props) {
    return (
        <StyledInfoBoxMap>
              <FaRoad style={{
                color: '#F5F5F5',
                position: 'absolute',
                fontSize: '26px',  
                top: '-15px',
                left: '8px',
                backgroundColor: '#2C363C',
                borderRadius: 30,
                width: 30,
                height: 30,

            }}/>
            {  props.loading[1] === true  ? <ReactBootStrap.Spinner animation="border"  variant="light"  /> : (
            <StyledInfoLabel>
            
            <StyledLabel>
                    <FaLongArrowAltRight style={{fontSize: '26px', color: 'red',  backgroundColor: '#F5F5F5' , borderRadius: 30, opacity:0.8 }} />
            </StyledLabel> 
                  <StyledSpan>Unsafe: {props.error[0] ? <p style = {{color:'red'}}>{props.error[0]}</p> : props.distanceRoutes[0] + " km" } </StyledSpan>
            </StyledInfoLabel>
            )}
            { props.loading[0] === true ? <ReactBootStrap.Spinner animation="border" variant="light"  /> :(
                
            <StyledInfoLabel>
            <StyledLabel>
                <FaLongArrowAltRight style={{fontSize: '26px', color: 'blue',  backgroundColor: '#F5F5F5' , borderRadius: 30, opacity:0.8}} />
            </StyledLabel> 
                 <StyledSpan>Safe: {props.error[1] ?  <p style = {{color:'red'}}>{props.error[1]}</p> : props.distanceRoutes[1] + " km"}</StyledSpan>
            </StyledInfoLabel>
            )}
           
       </StyledInfoBoxMap>
    )
}

export default InfoBoxMap;

