import axios, { AxiosResponse } from 'axios';
import $ from 'cash-dom';
import HttpStatus from 'http-status-codes';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ProductInCartI, NewPricesInCartI } from '../types/models';

export default (): void => {
    const fixPrices = (data: NewPricesInCartI): void => {
        for (const productPrice of data.productsPrices) {
            $(`.cartRow[data-id="${productPrice.id}"] .productTotalPrice`).html(
                `${productPrice.totalPrice.toFixed(2)}&#36;`,
            );
        }
        $('.cartTotalPrice').html(`${data.fullPrice.toFixed(2)}&#36;`);
    };

    $('.productsInCart').on('click', '.removeFromCart', (event: MouseEvent): void => {
        event.preventDefault();

        const element = event.currentTarget as HTMLElement;
        const selectedElement = $(element);
        const data: ProductInCartI = {
            id: parseInt(selectedElement.data('id')),
            name: selectedElement.data('name'),
            count: parseInt(selectedElement.data('count')),
        };

        Swal.fire({
            icon: 'question',
            title: data.name,
            text: 'Are you sure you want to remove one item from your cart?',
            confirmButtonText: 'Remove from cart',
            showCancelButton: true,
            showCloseButton: true,
            reverseButtons: true,
            showLoaderOnConfirm: true,
            allowOutsideClick: (): boolean => !Swal.isLoading(),
            preConfirm: () => {
                return axios
                    .post('/cart/remove', {
                        productId: data.id,
                    })
                    .then((response: AxiosResponse): void => {
                        if (response.status !== HttpStatus.OK) {
                            throw new Error(response.statusText);
                        }

                        return response.data;
                    })
                    .catch((): void => {
                        Swal.showValidationMessage('Server error occurred. Please try again in a few minutes');
                    });
            },
        }).then((result): void => {
            if (result.value) {
                if (data.count === 1) {
                    selectedElement.closest('tr').remove();

                    if ($('.productsInCart tbody tr').length === 0) {
                        $('.cartPage').html('<h4>Add some products from the homepage to your cart first</h4>');
                    } else {
                        fixPrices(result.value.extraData);
                    }
                } else {
                    const newCount = data.count - 1;
                    selectedElement.data('count', newCount);
                    selectedElement
                        .closest('tr')
                        .find('.productAmount')
                        .text(`${newCount}`);
                    fixPrices(result.value.extraData);
                }

                Swal.fire({
                    icon: 'success',
                    title: data.name,
                    text: 'Product removed from cart',
                });
            }
        });
    });
};
