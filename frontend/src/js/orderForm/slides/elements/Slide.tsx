import React, { FunctionComponent } from 'react';
import empty from 'locutus/php/var/empty';

interface StepsPropsI {
    cardActive: boolean;
    header: string;
    onNext?: () => void;
    onPrev?: () => void;
    onSubmit?: () => void;
}

export const Slide: FunctionComponent<StepsPropsI> = ({ cardActive, header, onSubmit, onNext, onPrev, children }) => (
    <div className={`form-slide ${cardActive ? 'active' : ''}`}>
        <h2>{header}</h2>
        {children}
        <div className="button-group">
            {!empty(onPrev) ? (
                <a
                    href="#"
                    className="left button"
                    onClick={(e: React.MouseEvent<HTMLElement>): void => {
                        e.preventDefault();
                        onPrev();
                    }}
                >
                    PREV
                </a>
            ) : null}
            {!empty(onNext) ? (
                <a
                    href="#"
                    className="right button"
                    onClick={(e: React.MouseEvent<HTMLElement>): void => {
                        e.preventDefault();
                        onNext();
                    }}
                >
                    NEXT
                </a>
            ) : null}
            {!empty(onSubmit) ? (
                <button
                    className="right"
                    type="button"
                    onClick={(e: React.MouseEvent<HTMLElement>): void => {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    SUBMIT
                </button>
            ) : null}
            <div className="cf" />
        </div>
    </div>
);
