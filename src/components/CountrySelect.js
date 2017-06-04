import React, {Component} from 'react';

class CountrySelect extends Component {

    constructor(props) {

        super(props);

        this.state = {
            countries: [],
        };

        this.handleValueChange = this.handleValueChange.bind(this);
    }

    componentWillMount() {
        fetchCountries().then(data => this.setState({countries: data.countries}));
    }

    handleValueChange(e) {
        this.props.onChange(e.target.value);
    }

    render() {

        const {state, props} = this;

        return (
            <select value={props.value} onChange={this.handleValueChange}
                    style={{width: `${props.value.length * 0.74}em`}}>

                {state.countries.map(c => <option key={c}>{c}</option>)}

            </select>
        )
    }
}

function fetchCountries() {

    return fetch(`http://api.population.io:80/1.0/life-expectancy/countries`)
        .then(response => response.json())
}

export default CountrySelect;