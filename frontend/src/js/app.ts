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
            imageUrl: `/dist/images/${data.photo}`,
            imageAlt: `${data.name} photo`,
            confirmButtonText: 'Add to cart',
            showCancelButton: true,
            showCloseButton: true,
            reverseButtons: true,
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
