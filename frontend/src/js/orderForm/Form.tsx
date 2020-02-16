import React, { Component } from 'react';
import axios, { AxiosResponse } from 'axios';
import Swal from 'sweetalert2';
import { Steps } from './Steps';
import SlideOne from './slides/SlideOne';
import { FormDataI } from '../types/models';
import SlideTwo from './slides/SlideTwo';
import SlideThree from './slides/SlideThree';
import HttpStatus from 'http-status-codes';

interface FormStateI extends FormDataI {
    currentStep: number;
}

export default class Form extends Component<{}, FormStateI> {
    public constructor(props) {
        super(props);

        this.state = {
            currentStep: 1,
            name: '',
            email: '',
            phone: '',
            address: '',
            delivery: '',
            payment: '',
        };

        this.updateFormData = this.updateFormData.bind(this);
        this.updateStep = this.updateStep.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    protected updateFormData(name: string, value: string): void {
        const newState = {
            [name]: value,
        };
        // @ts-ignore
        this.setState(newState);
    }

    protected updateStep(step: number): void {
        this.setState({ currentStep: step });
    }

    protected submitForm(): void {
        const { name, email, phone, address, delivery, payment } = this.state;

        Swal.fire({
            title: 'Submitting your order',
            icon: 'info',
            allowOutsideClick: false,
            onOpen: () => {
                Swal.showLoading();
                return axios
                    .post('/cart/finalize', {
                        name,
                        email,
                        phone,
                        address,
                        delivery,
                        payment,
                    })
                    .then((response: AxiosResponse): void => {
                        if (response.status !== HttpStatus.OK) {
                            throw new Error(response.statusText);
                        }

                        Swal.close();
                        Swal.fire({
                            icon: 'success',
                            title: 'Order placed!',
                            text: 'Thank you, we will complete your order as soon as possible.',
                        }).then(() => {
                            window.location.replace(window.location.origin);
                        });
                    })
                    .catch((): void => {
                        Swal.hideLoading();
                        Swal.showValidationMessage('Server error occurred. Please try again in a few minutes');
                    });
            },
        });
    }

    public render(): React.ReactElement {
        const { currentStep, name, email, phone, address, delivery, payment } = this.state;

        return (
            <div className="container">
                <Steps currentStep={currentStep} />
                <form
                    onSubmit={(e: React.FormEvent<EventTarget>): void => {
                        e.preventDefault();
                    }}
                >
                    <div className="form-cnt">
                        <div className={`form-inner step${currentStep}`}>
                            <SlideOne
                                currentStep={currentStep}
                                name={name}
                                address={address}
                                email={email}
                                phone={phone}
                                updateFormData={this.updateFormData}
                                updateStep={this.updateStep}
                            />
                            <SlideTwo
                                currentStep={currentStep}
                                delivery={delivery}
                                updateFormData={this.updateFormData}
                                updateStep={this.updateStep}
                            />
                            <SlideThree
                                currentStep={currentStep}
                                payment={payment}
                                updateFormData={this.updateFormData}
                                updateStep={this.updateStep}
                                formSubmit={this.submitForm}
                            />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
