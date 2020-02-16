import React, { FunctionComponent } from 'react';

interface StepsPropsI {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLElement>) => void;
}

export const TextInput: FunctionComponent<StepsPropsI> = ({ label, name, value, onChange }) => (
    <div className="input-group r r-6">
        <label htmlFor={name}>{label}</label>
        <input type="text" name={name} id={name} value={value} onChange={onChange} />
    </div>
);
