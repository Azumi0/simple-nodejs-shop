import React, { ChangeEvent, Component } from 'react';
import isEmpty from 'validator/lib/isEmpty';
import Swal from 'sweetalert2';
import { Slide } from './elements/Slide';
import { SlideBasePropsI } from '../../types/models';
import { RadioInput } from './elements/RadioInput';

interface SlideTwoPropsI extends SlideBasePropsI {
    payment: string;
    formSubmit: () => void;
}

export default class SlideThree extends Component<SlideTwoPropsI> {
    public constructor(props) {
        super(props);

        this.submitStep = this.submitStep.bind(this);
    }

    protected paymentMethods = ['wire', 'cash'];

    protected submitStep(): void {
        const { payment, formSubmit } = this.props;
        let validationMessages = '';

        // eslint-disable-next-line @typescript-eslint/camelcase
        if (isEmpty(payment, { ignore_whitespace: true })) {
            validationMessages += '<li>Please choose payment type</li>';
        }

        if (validationMessages.length === 0) {
            formSubmit();

            return;
        }

        Swal.fire({
            icon: 'error',
            title: 'Please provide required information',
            html: `<ul>${validationMessages}</ul>`,
        });
    }

    public render(): React.ReactElement {
        const { currentStep, updateFormData, payment, updateStep } = this.props;

        return (
            <Slide
                cardActive={currentStep === 1}
                header="Payment method"
                onPrev={(): void => {
                    updateStep(2);
                }}
                onSubmit={this.submitStep}
            >
                {this.paymentMethods.map(
                    (val, index): JSX.Element => (
                        <RadioInput
                            key={`stepTwoInput${index}`}
                            label={val}
                            name="payment"
                            value={payment}
                            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                                updateFormData('payment', e.target.value);
                            }}
                        />
                    ),
                )}
            </Slide>
        );
    }
}
