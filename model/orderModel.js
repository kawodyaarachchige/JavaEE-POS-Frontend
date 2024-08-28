export class OrderModel {
    constructor(orderId, date, discount, subTotal, customerId) {
        this.id = orderId;
        this.date = date;
        this.discount_value = discount;
        this.sub_total = subTotal;
        this.customer_id = customerId;
    }

}