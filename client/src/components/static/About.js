import React from 'react'

const About = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-xs-12">
                    <h3>What is Stakehouse Sports?</h3>
                    <p><strong>Stakehouse Sports</strong> has created a new type of sports competition that is way more fun than your regular old pick 'em games.</p>
                    <p>Instead of just one team over the over, you predict the scores and earn points based on how good you predict the results.</p>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-12">
                    <h3>About Stakehouse Sports</h3>
                    <p>Stakehouse Sports was built by Chris Aronchick and Paul Cullin.</p>
                    <p>We are both huge sports fans who also love fantasy sports, and we came up with Stakehouse Sports when we started talking about how we'd like to compete against each other.</p>
                    <p>Got ideas or questions? <a href="mailto:feedback@stakehousesports.com">Send us an e-mail!</a></p>
                </div>
            </div>

            <div className="row footer">
                <div className="col-xs-12">
                    <a href="/" style={{color: '#fff'}}>Stakehouse Sports</a> | <a href="https://app.termly.io/document/privacy-policy/79832fc4-999b-4a5c-b459-002bb84e862e" target="_blank" style={{color:'#fff'}}>Privacy Policy</a>
                </div> 
            </div>
        </div>
    )
}

export default About