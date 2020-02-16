import axios, { AxiosResponse } from 'axios';
import $ from 'cash-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ProductI } from './types/models';

$(function() {
    $('.productList').on('click', '.productTrigger', (event: MouseEvent): void => {
        event.preventDefault();

        const element = event.currentTarget as HTMLElement;
        const data: ProductI = $(element).data('product');

        Swal.fire({
            title: data.name,
            text: data.description,
            footer: `Price: ${data.price.toFixed(2)}&#36;`,
            imageUrl: `/dist/images/${data.photo}`,
            imageAlt: `${data.name} photo`,
            confirmButtonText: 'Add to cart',
            showCancelButton: true,
            showCloseButton: true,
            reverseButtons: true,
            showLoaderOnConfirm: true,
            allowOutsideClick: (): boolean => !Swal.isLoading(),
            preConfirm: () => {
                return axios
                    .post('/cart/add', {
                        productId: data.id,
                    })
                    .then((response: AxiosResponse): void => {
                        if (response.status !== 200) {
                            throw new Error(response.statusText);
                        }
                    })
                    .catch((): void => {
                        Swal.showValidationMessage('Server error occurred. Please try again in a few minutes');
                    });
            },
        }).then((result): void => {
            if (result.value) {
                Swal.fire({
                    icon: 'success',
                    title: data.name,
                    text: 'Product added to cart',
                });
            }
        });
    });
});
