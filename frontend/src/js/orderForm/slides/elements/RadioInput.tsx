import React, { FunctionComponent } from 'react';

interface StepsPropsI {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLElement>) => void;
}

export const RadioInput: FunctionComponent<StepsPropsI> = ({ label, name, value, onChange }) => (
    <div className="radio-group">
        <input name={name} type="radio" id={label} value={label} checked={value === label} onChange={onChange} />
        <label htmlFor={label}>
            <img src={`/dist/images/${label}.png`} alt={`${label} logo`} />
        </label>
    </div>
);
