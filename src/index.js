import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

import {Col, Row, Container} from 'reactstrap';
import CountrySelect from './components/CountrySelect';
import GenderSelect from './components/GenderSelect';
import Counter from './components/Counter';

import Moment from 'moment';

const moment = new Moment();


class App extends Component {

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
        }
    }

    componentDidMount() {
        setInterval(this.setTime, 1000);
        this.fetchTime();
    }

    handleAgeChange(e) {
        this.setState({age: Number(e.target.value)}, () => this.fetchTime())
    }

    handleGenderChange(e) {
        this.setState({gender: e.target.value}, () => this.fetchTime())
    }

    handleCountryChange(country) {
        this.setState({country}, () => this.fetchTime())
    }

    fetchTime() {
        const {state} = this;

        fetchLifeExpectancy(state.age, state.gender, state.country)
            .then(data => {
                const timeLeft = yearsToSeconds(data.lifeExpectancy);
                this.setState({timeLeft});
            });
    }

    setTime() {
        this.setState(state => ({timeLeft: state.timeLeft - 1}))
    }

    render() {

        const {state} = this;

        return (
            <Container fluid>
                <Row>
                    <Col style={{background: '#ddd'}}>
                        <div className="menu">
                            I'm a <input type="text" value={state.age} onChange={this.handleAgeChange}/> year old
                            <GenderSelect gender={state.gender} onChange={this.handleGenderChange}/> from
                            <CountrySelect value={state.country} onChange={this.handleCountryChange}/>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col sm={{size: 8, offset: 2}} className="text-center">
                        <Counter value={state.timeLeft}/>
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


function mapResponseData(json) {
    return {
        lifeExpectancy: json.remaining_life_expectancy,
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));

