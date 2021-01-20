import React from 'react'
import styled from 'styled-components';
import { FaUsers, FaCity, FaCalendarAlt, FaSyringe, FaInfoCircle } from "react-icons/fa";

const StyledInfoBoxMap = styled.div`
   z-index: 900;
   width: 200px;
   position: absolute;
   border: 1px solid gray;
   top: 15px;
   right: 15px;
   background-color: #2C363C;
   border-radius: 10px;
   display: flex;
   flex-flow: column wrap;
   
   align-content: center;
   justify-content: center;

`;

const StyledLabel = styled.label`
    display: block;
    width: 20px;
    font-weight: bold;
    text-align: right;
`;

const StyledSpan = styled.span`
    display: block;
    width: 100px;
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
`;

function InfoBoxMap(props) {
    
    return (
        <StyledInfoBoxMap>
            <FaInfoCircle style={{
                color: '#F5F5F5',
                position: 'absolute',
                fontSize: '26px',  
                top: '8px',
                right: '8px',

            }}/>
            <StyledInfoLabel>
            <StyledLabel>
                    <FaCity  style={{fontSize: '24px'}}/>
            </StyledLabel> 
                {props.countyName && <StyledSpan>{props.countyName}</StyledSpan>}
            </StyledInfoLabel>
            <StyledInfoLabel>
            <StyledLabel>
                {props.casesNumber !==0 && <FaSyringe  style={{fontSize: '24px'}}/>}
            </StyledLabel> 
                {props.casesNumber !==0 && <StyledSpan>{props.casesNumber}</StyledSpan>}
            </StyledInfoLabel>
            <StyledInfoLabel>
                <StyledLabel>
                    <FaUsers style={{fontSize: '24px'}}/>
                </StyledLabel> 
                {props.countyPopulation !== 0 && <StyledSpan>{props.countyPopulation}</StyledSpan> }
            </StyledInfoLabel>
            <StyledInfoLabel>
            <StyledLabel>
                    <FaCalendarAlt  style={{fontSize: '24px'}}/>
            </StyledLabel> 
                {props.caseUpdate && <StyledSpan>{props.caseUpdate}</StyledSpan>}
            </StyledInfoLabel>
       </StyledInfoBoxMap>
    )
}

export default InfoBoxMap;

