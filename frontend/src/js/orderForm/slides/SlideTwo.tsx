import React, { ChangeEvent, Component } from 'react';
import isEmpty from 'validator/lib/isEmpty';
import Swal from 'sweetalert2';
import { Slide } from './elements/Slide';
import { SlideBasePropsI } from '../../types/models';
import { RadioInput } from './elements/RadioInput';

interface SlideTwoPropsI extends SlideBasePropsI {
    delivery: string;
}

export default class SlideTwo extends Component<SlideTwoPropsI> {
    public constructor(props) {
        super(props);

        this.submitStep = this.submitStep.bind(this);
    }

    protected deliveryMethods = ['dpd', 'royal-mail', 'ups'];

    protected submitStep(): void {
        const { delivery, updateStep } = this.props;
        let validationMessages = '';

        // eslint-disable-next-line @typescript-eslint/camelcase
        if (isEmpty(delivery, { ignore_whitespace: true })) {
            validationMessages += '<li>Please choose delivery type</li>';
        }

        if (validationMessages.length === 0) {
            updateStep(3);

            return;
        }

        Swal.fire({
            icon: 'error',
            title: 'Please provide required information',
            html: `<ul>${validationMessages}</ul>`,
        });
    }

    public render(): React.ReactElement {
        const { currentStep, updateFormData, delivery, updateStep } = this.props;

        return (
            <Slide
                cardActive={currentStep === 1}
                header="Delivery method"
                onPrev={(): void => {
                    updateStep(1);
                }}
                onNext={this.submitStep}
            >
                {this.deliveryMethods.map(
                    (val, index): JSX.Element => (
                        <RadioInput
                            key={`stepTwoInput${index}`}
                            label={val}
                            name="delivery"
                            value={delivery}
                            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                                updateFormData('delivery', e.target.value);
                            }}
                        />
                    ),
                )}
            </Slide>
        );
    }
}
