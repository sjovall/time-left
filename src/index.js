import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import {Col, Row, Container, Input} from 'reactstrap';

import Moment from 'moment';

const moment = new Moment();


class Timer extends React.Component {

    constructor(props) {
        super(props);

        this.handleAgeChange = this.handleAgeChange.bind(this);
        this.handleGenderChange = this.handleGenderChange.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.setTime = this.setTime.bind(this);

        this.state = {
            age: 21,
            gender: 'male',
            country: 'Sweden',
            timeLeft: null,
            countries: [],
        }
    }

    componentDidMount() {
        setInterval(this.setTime, 1000);
        this.fetchTime();
        fetchCountries().then(data => this.setState({countries: data.countries}));
    }

    handleAgeChange(e) {
        this.setState({age: Number(e.target.value)}, () => this.fetchTime())
    }

    handleGenderChange(e) {
        this.setState({gender: e.target.value}, () => this.fetchTime())
    }

    handleCountryChange(e) {
        this.setState({country: e.target.value}, () => this.fetchTime())
    }

    fetchTime() {
        fetchLifeExpectancy(this.state.age, this.state.gender, this.state.country)
            .then(data => {
                const timeLeft = yearsToSeconds(data.lifeExpectancy);
                this.setState({timeLeft});
            });
    }

    setTime() {
        const timeLeft = this.state.timeLeft - 1;
        this.setState({timeLeft})
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col className="m-b-3" style={{background: '#ddd'}}>
                        <div style={{fontSize: '2em'}} className="text-center">
                            I'm a&nbsp;

                            <input type="text" value={this.state.age} onChange={this.handleAgeChange}
                                   style={{
                                       display: 'inline',
                                       padding: 0,
                                       border: 0,
                                       color: '#444',
                                       fontWeight: 'bold',
                                       background: '#ddd',
                                       width: '1.2em'
                                   }}/> year old

                            <Input type="select" value={this.state.gender} onChange={this.handleGenderChange}
                                   style={{
                                       display: 'inline',
                                       padding: 0,
                                       border: 0,
                                       fontWeight: 'bold',
                                       fontSize: '1em',
                                       width: `${this.state.gender.length * 0.74}em`,
                                       background: '#ddd'
                                   }}>
                                <option>male</option>
                                <option>female</option>
                            </Input>

                            from
                            <Input type="select" value={this.state.country} onChange={this.handleCountryChange}
                                   style={{
                                       display: 'inline',
                                       padding: 0,
                                       border: 0,
                                       fontWeight: 'bold',
                                       fontSize: '1em',
                                       width: `${this.state.country.length * 0.74}em`,
                                       background: '#ddd'
                                   }}>

                                {this.state.countries.map(c => <option key={c}>{c}</option>)}


                            </Input>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <i className="fa fa-heart"/>

                    <Col sm={{size: 8, offset: 2}} className="text-center">
                        <div style={{marginTop: '20%'}}>
                            <h2 style={{color: '#521f1e', fontWeight: 'bold'}}>YOU WILL SEAS TO EXIST IN</h2>
                            <hr/>
                            <h1 className='pulse' style={{
                                fontSize: '6em',
                                color: '#521f1e',
                                fontWeight: 'bold'
                            }}>{this.state.timeLeft}</h1>
                            <hr/>
                            <h2 style={{color: '#521f1e', fontWeight: 'bold'}}>SECONDS</h2>

                            <small style={{color: '#521f1e', fontWeight: 'bold'}}>According to world population data</small>
                        </div>
                    </Col>
                </Row>

            </Container>
        );
    }
}

function fetchLifeExpectancy(age, gender, country) {

    return fetch(`http://api.population.io:80/1.0/life-expectancy/remaining/${gender}/${country}/${moment.format('YYYY-MM-DD')}/${age}y`)
        .then(response => response.json())
        .then(json => mapResponseData(json));
}

const yearsToSeconds = (years) => Math.floor(years * 365 * 24 * 60 * 60);


function fetchCountries() {

    return fetch(`http://api.population.io:80/1.0/life-expectancy/countries`)
        .then(response => response.json())
}


function mapResponseData(json) {
    return {
        lifeExpectancy: json.remaining_life_expectancy,
    }
}

ReactDOM.render(<Timer/>, document.getElementById('root'));

