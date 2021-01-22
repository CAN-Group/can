import React from 'react'
import ContentWrapper from './content/ContentWrapper'
import styled from 'styled-components'


const StyledInfoContent = styled.section`
    border: 3px solid black;
    background: #2C363C;
    color: white;
    position: relative;
    width: 50%;
    top: 50%;
    left: 25%;
`;

const StyledImg = styled.section`
    clear: none;
    overflow: auto;
    margin: 10px;
    h1{
        font-size: 20px;
    }
    h2{
        font-size: 15px;
    }
    img {
        float: left;
        width: 10%;
        height: 10%;
        border-radius: 50%;
        margin-right: 25px;
      }          
`;

const NavSpacing = styled.div`
    height: 200px;
    width: 100%;
`;

function AboutUs(props) {
    return (
        <ContentWrapper>
            <NavSpacing/>
            <StyledInfoContent>
                    <StyledImg>
                    <img src="/images/img_avatar.png" alt="Avatar"></img>
                    <h1>Name Surname</h1>
                    <h2>Position</h2>
                    <br></br>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa. Fusce luctus vestibulum augue ut aliquet. Mauris ante ligula, facilisis sed ornare eu, lobortis in odio. Praesent convallis urna a lacus interdum ut hendrerit risus congue. Nunc sagittis dictum nisi, sed ullamcorper ipsum dignissim
                    </StyledImg>
            </StyledInfoContent>
            <br></br>
            <StyledInfoContent>
                    <StyledImg>
                    <img src="/images/img_avatar.png" alt="Avatar"></img>
                    <h1>Name Surname</h1>
                    <h2>Position</h2>
                    <br></br>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa. Fusce luctus vestibulum augue ut aliquet. Mauris ante ligula, facilisis sed ornare eu, lobortis in odio. Praesent convallis urna a lacus interdum ut hendrerit risus congue. Nunc sagittis dictum nisi, sed ullamcorper ipsum dignissim
                    </StyledImg>
            </StyledInfoContent>
            <br></br>
            <StyledInfoContent>
                    <StyledImg>
                    <img src="/images/img_avatar.png" alt="Avatar"></img>
                    <h1>Name Surname</h1>
                    <h2>Position</h2>
                    <br></br>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa. Fusce luctus vestibulum augue ut aliquet. Mauris ante ligula, facilisis sed ornare eu, lobortis in odio. Praesent convallis urna a lacus interdum ut hendrerit risus congue. Nunc sagittis dictum nisi, sed ullamcorper ipsum dignissim
                    </StyledImg>
            </StyledInfoContent>
            <br></br>
            <StyledInfoContent>
                    <StyledImg>
                    <img src="/images/img_avatar.png" alt="Avatar"></img>
                    <h1>Name Surname</h1>
                    <h2>Position</h2>
                    <br></br>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa. Fusce luctus vestibulum augue ut aliquet. Mauris ante ligula, facilisis sed ornare eu, lobortis in odio. Praesent convallis urna a lacus interdum ut hendrerit risus congue. Nunc sagittis dictum nisi, sed ullamcorper ipsum dignissim
                    </StyledImg>
            </StyledInfoContent>
        </ContentWrapper>
    )
}

export default AboutUs;