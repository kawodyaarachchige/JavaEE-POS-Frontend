export class OrderDetailModel{
    constructor(orderId, itemId, qty, unitPrice, total) {
        this.order_id = orderId;
        this.item_id = itemId;
        this.qty = qty;
        this.unit_price = unitPrice;
        this.total = total;

    }

}