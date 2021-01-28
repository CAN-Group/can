import React, {Component} from 'react'
import styled from 'styled-components'


const StyledAutoComplete = styled.div`
    
    border: 1px solid grey;
    font-family: Arial, Helvetica, sens-serif;
    border-radius: 10px;
    font-size: 14px;
    color: rgba(0,0,0, 0.73);
    margin-top: 12px;
    position:relative;
    width: 200px;
`;

const StyledInput = styled.input`
    width: 100%;
    border: none;
    font-family: Arial, Helvetica, sens-serif;
    font-size: 14px;
    color: rgba(0,0,0, 0.73);
    box-sizing: border-box;
    outline: none;
    height:25px;
    border-radius: 10px;
    transition: all .1s ease-in-out;


    &:hover{
        background-color: #EEF6FF;
        color: rgba(0,0,0, 1);
    }

`;

const StyledUl = styled.ul`
    text-align: left;
    border: 1px solid gray;
    position: absolute;
    background-color: white;
    height: 200px;
    overflow: scroll;
    width: 100%;
    z-index: 999;
    &:before {
        content: "";
    }
`;

const StyledLi = styled.li`
    padding: 10px 5px;
    cursor: pointer;
    &:hover{
       text-decoration: none;
       background-color: #EEF6FF;
    }
`;

const StyledWrapper = styled.div`
    display: flex ;
    align-items: center;
`;


class AutoTextbox  extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestions: [],
            text: '',
        };
    }

    onTextChanged = (e) => {
        const { items } = this.props;
        const value = e.target.value;

        let suggestions = [];
        if(value.length > 0) {
            const regex = new RegExp(`^${value}`, 'i');
            suggestions = items.sort().filter(v => regex.test(v));
        }
        this.setState(() => ({suggestions , text: value}));      
    }

    suggestionSelected(value) {
        this.setState(() => ({
            text: value,
            suggestions: [],
        }))
        this.props.onSelection(value, this.props.type);
    }

    renderSuggestions () {
        const { suggestions } = this.state;
        if(suggestions.length === 0) {
            return null;
    }

        return (
            <StyledUl>
                {suggestions.map((item) => <StyledLi onClick={() => this.suggestionSelected(item)}>{item}</StyledLi> )}
            </StyledUl>
        );

    }
    
    render() {
        const { text } = this.state;
        return (
           <StyledWrapper>
               {this.props.children}
            <StyledAutoComplete>
              
                <StyledInput placeholder={this.props.placeholder} value={text} type="text" onChange={this.onTextChanged}/>
                {this.renderSuggestions()}
            </StyledAutoComplete>
            </StyledWrapper>
        );
    }
}

export default AutoTextbox;