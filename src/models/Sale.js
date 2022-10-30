export default class Sale {
    constructor(creator = "", product = "", price = null) {
        this.creator = creator;
        this.product = product;
        this.price = price;
        this.validation = {
            creator: true,
            product: true,
            price: true,
        };
        this.checkValidation = function () {
            this.validation.creator = this.creator !== '' ? true : false;
            this.validation.product = this.product !== '' ? true : false;
            this.validation.price = this.price !== null ? true : false;

            return this.validation.creator & this.validation.product & this.validation.price;
        };
    }
}