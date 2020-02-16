import axios, { AxiosResponse } from 'axios';
import $ from 'cash-dom';
import HttpStatus from 'http-status-codes';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { toObject } from '../helpers/form';

export default (): void => {
    $('#contactForm').on('submit', (event: Event): void => {
        event.preventDefault();

        const element = event.currentTarget as HTMLFormElement;
        const data = new FormData(element);

        Swal.fire({
            title: 'Sending message',
            icon: 'info',
            allowOutsideClick: false,
            onOpen: () => {
                Swal.showLoading();
                return axios
                    .post('/contact', toObject(data))
                    .then((response: AxiosResponse): void => {
                        if (response.status !== HttpStatus.OK) {
                            throw new Error(response.statusText);
                        }

                        Swal.close();
                        Swal.fire({
                            icon: 'success',
                            title: 'Message sent!',
                            text: 'Thank you, we will contact you as soon as possible.',
                        });
                    })
                    .catch((): void => {
                        Swal.hideLoading();
                        Swal.showValidationMessage('Server error occurred. Please try again in a few minutes');
                    });
            },
        });
    });
};
