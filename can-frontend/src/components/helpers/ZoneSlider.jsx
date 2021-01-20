import React, { useState } from 'react'
import styled from 'styled-components';



const StyledMultiRangeSlider = styled.div`
    position: relative;
    min-width: 200px;
    max-width: 300px;
`;

const StyledSlider = styled.div`
    position: relative;
    z-index: 1;
    height: 10px;
    border: 1px solid rgba(0,0,0, 0.73);
    border-radius: 6px;

`;

const StyledTrack = styled.div`
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 5px;
    background-color: #c6aee7;
    
`;

const StyledRange = styled.div`
    position: absolute;
    z-index: 3;
    left: 30%;
    right: 30%;
    top: 0;
    bottom: 0;
    border-radius: 5px;
    background-color: yellow;
`;

const StyledRangeRight = styled.div`
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;

    border-radius: 5px;
    background-color: red;
    
`;


const StyledRangeLeft = styled.div`
    position: absolute;
    z-index: 2;
    left: 0;
    right: 70%;
    top: 0;
    bottom: 0;
    border-radius: 5px;
    background-color: green;
`;


const StyledLeft = styled.div`
    left: 30%;
    transform: translate(-15px, -5px);
`;

const StyledRight = styled.div`
    right: 30%;
    transform: translate(15px, -5px);
`;

const StyledInput = styled.input`
    position: absolute;
    z-index: 2;
    height: 10px;
    width: 100%;
    -webkit-appearance: none;

    &::-webkit-slider-thumb{
        width: 30px;
        height: 30px;
    }
`;

const thumb = {
    position: "absolute",
    zIndex: 3,
    width: '20px',
    height: '20px',
    backgroundColor: '#2C363C',
    borderRadius: '50%',
};

function ZoneSlider(props) {
    const [leftValue, setLeftValue] = useState(30);
    const [rightValue, setRightValue] = useState(70);

    const settLeftValue = e => {
        const _this = e.target;
        const range = document.getElementById("range");
        const inputRight = document.getElementById("inputRight");
        const leftThumb = document.getElementById("leftThumb");
        const min = parseInt(_this.min);
        const max = parseInt(_this.max);
       



        setLeftValue(Math.min(parseInt(_this.value), parseInt(rightValue)));

        let percent = ((leftValue - min) / (max - min)) * 100;
        
       
        leftThumb.style.left = percent + "%";
        range.style.left = percent + "%";
    }

    const settRightValue = e => {
        const _this = e.target;
        const range = document.getElementById("range");
        const inputLeft = document.getElementById("inputLeft");
        const rightThumb = document.getElementById("rightThumb");
        const min = parseInt(_this.min);
        const max = parseInt(_this.max);

        setRightValue(Math.max(parseInt(_this.value), parseInt(leftValue)));

        let percent = ((rightValue - min) / (max - min)) * 100;
        
        rightThumb.style.right = (100 - percent) + "%";
        range.style.right = (100 - percent) + "%";
    }

    return (
     
            <StyledMultiRangeSlider>
                <StyledInput id="inputLeft"  type="range"  min="0" max="100" value={leftValue}  onInput={settLeftValue} />
                <StyledInput id="inputRight" type="range"  min="0" max="100" value={rightValue} onInput={settRightValue} />

                <StyledSlider>
                 
                    <StyledRangeLeft style={{right: `${100 - leftValue}%`}} />
                    <StyledRange id="range" />
                    <StyledRangeRight />
                    <StyledLeft id="leftThumb" style={thumb}/>
                    <StyledRight id="rightThumb" style={thumb} />
                </StyledSlider>

            </StyledMultiRangeSlider>
    )
}

export default ZoneSlider;
