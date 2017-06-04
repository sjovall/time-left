import React from 'react';

const GenderSelect = ({gender, onChange}) => (
    <select value={gender} onChange={onChange} style={{width: `${gender.length * 0.74}em`}}>
        <option>male</option>
        <option>female</option>
    </select>
);

export default GenderSelect;