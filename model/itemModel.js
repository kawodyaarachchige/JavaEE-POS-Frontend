export default class ItemModel {
    constructor(itemCode, description, unitPrice, qty) {
        this._itemCode = itemCode;
        this._description = description;
        this._unitPrice = unitPrice;
        this._qty = qty;
    }

    get itemCode() {
        return this._itemCode;
    }

    set itemCode(value) {
        this._itemCode = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get unitPrice() {
        return this._unitPrice;
    }

    set unitPrice(value) {
        this._unitPrice = value;
    }

    get qty() {
        return this._qty;
    }

    set qty(value) {
        this._qty = value;
    }
}