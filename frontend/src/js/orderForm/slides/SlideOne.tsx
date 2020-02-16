import React, { ChangeEvent, Component } from 'react';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import isEmpty from 'validator/lib/isEmpty';
import Swal from 'sweetalert2';
import { Slide } from './elements/Slide';
import { TextInput } from './elements/TextInput';
import { FormDataI, SlideBasePropsI } from '../../types/models';

type SlideOneBase = Omit<FormDataI, 'delivery' | 'payment'>;
interface SlideOnePropsI extends SlideBasePropsI, SlideOneBase {}

export default class SlideOne extends Component<SlideOnePropsI> {
    public constructor(props) {
        super(props);

        this.submitStep = this.submitStep.bind(this);
    }

    protected inputs = [
        {
            name: 'name',
            label: 'Name',
        },
        {
            name: 'email',
            label: 'E-Mail',
        },
        {
            name: 'phone',
            label: 'Phone with country code',
        },
        {
            name: 'address',
            label: 'Address',
        },
    ];

    protected submitStep(): void {
        const { name, email, phone, address, updateStep } = this.props;
        let validationMessages = '';

        // eslint-disable-next-line @typescript-eslint/camelcase
        if (isEmpty(name, { ignore_whitespace: true })) {
            validationMessages += '<li>Please type your name for the order</li>';
        }

        // eslint-disable-next-line @typescript-eslint/camelcase
        if (isEmpty(address, { ignore_whitespace: true })) {
            validationMessages += '<li>Please provide address for the delivery</li>';
        }

        if (!isMobilePhone(phone, 'any', { strictMode: true })) {
            validationMessages += '<li>Phone number is invalid. Make sure you inserted your country code +xx</li>';
        }

        // eslint-disable-next-line @typescript-eslint/camelcase
        if (!isEmail(email, { allow_utf8_local_part: false })) {
            validationMessages += '<li>Invalid e-mail address</li>';
        }

        if (validationMessages.length === 0) {
            updateStep(2);

            return;
        }

        Swal.fire({
            icon: 'error',
            title: 'Please provide required information',
            html: `<ul>${validationMessages}</ul>`,
        });
    }

    public render(): React.ReactElement {
        const { currentStep, updateFormData } = this.props;

        return (
            <Slide cardActive={currentStep === 1} header="Personal Data" onNext={this.submitStep}>
                {this.inputs.map(
                    (val, index): JSX.Element => (
                        <TextInput
                            key={`stepOneInput${index}`}
                            value={this.props[val.name]}
                            label={val.label}
                            name={val.name}
                            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                                updateFormData(val.name, e.target.value);
                            }}
                        />
                    ),
                )}
            </Slide>
        );
    }
}
