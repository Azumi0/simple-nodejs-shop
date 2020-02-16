import React, { FunctionComponent } from 'react';

interface StepsPropsI {
    currentStep: number;
}

export const Steps: FunctionComponent<StepsPropsI> = ({ currentStep }) => (
    <nav className="form-steps">
        <ul className="progressbar">
            {[1, 2, 3].map(
                (val: number): JSX.Element => (
                    <li key={val} className={val <= currentStep ? 'active' : ''} />
                ),
            )}
        </ul>
        <div className="cf" />
    </nav>
);
