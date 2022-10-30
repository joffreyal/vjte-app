export default class Payment {
    constructor(mode = "", amount = "") {
        this.mode = mode;
        this.amount = amount;
        this.validation = {
            mode: true,
            amount: true,
        };
        this.checkValidation = function () {
            this.validation.mode = this.mode !== '' ? true : false;
            this.validation.amount = this.amount !== '' ? true : false;

            return this.validation.mode & this.validation.amount;
        };
    }
}