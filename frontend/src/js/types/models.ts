export interface ProductI {
    id: number;
    name: string;
    description: string;
    photo: string;
    price: number;
    createdAt: string;
    updatedAt: string;
}

export interface ProductInCartI {
    id: number;
    name: string;
    count: number;
}

interface NewProductPriceI {
    id: number;
    count: number;
    price: number;
    totalPrice: number;
}

export interface NewPricesInCartI {
    fullPrice: number;
    productsPrices: NewProductPriceI[];
}
