import {OrderModel} from "../model/OrderModel.js";
import {OrderDetailModel} from "../model/OrderDetailsModel.js";
import {loadOrderTable} from "./orderDetails.js";
import {loadTable} from "./item.js";

let cart = [];

const order_id = $('#order_Id');
const customer_id = $('#custId');
const date = $('#orderDate');
const item_Id = $('#item_Id');
const order_qty = $('#order_quantity');
const customer_name = $('#custName');
const qty_on_hand = $('#qtyOnHand');
const description = $('#desc');
const unit_price = $('#unit_price');
const net_total = $('.net_total span:nth-child(2)');
const sub_total = $('.sub_total span:nth-child(2)');
const discount = $('#discount');
const cash = $('#cash');
const balance = $('#balance');

const cart_btn = $('.cart_btn');
const order_btn = $('.order_btn');


initialize();


function initialize() {
    setOrderId();
    setCustomerNames();
    setItemIds();
}


function setOrderId() {
    $.ajax({
        url: "http://localhost:8085/order",
        type: "GET",
        data: {"nextid": "nextid"},
        success: (res) => {
            let code = res.substring(1, res.length - 1);
            $('#order_Id').val(code);
        },
        error: (res) => {
            console.error(res);
        }
    });
}

async function setCustomerNames() {
    try {
        let response = await fetch('http://localhost:8085/customer');
        let data = await response.json();
        let customers = data.data;

        if (Array.isArray(customers)) {
            customers.forEach((customer, index) => {
                customer_id.append('<option value ="' + customer.id + '">' + customer.id + '</option>');
            })
        }
    } catch (error) {
        console.error(error);
    }
}

async function setItemIds() {
    try {
        let response = await fetch('http://localhost:8085/item');
        let data = await response.json();
        let items = data.data;

        if (Array.isArray(items)) {
            items.forEach((item, index) => {
                item_Id.append('<option value ="' + item.item_id + '">' + item.item_id + '</option>');
            })
        }
    } catch (error) {
        console.error(error);
    }
}


customer_id.on('input', () => {
    if (customer_id.val() !== 'select the customer') {
        loadSearchedCustomerDetails();


    } else {
        customer_name.val('');
    }
});
async function loadSearchedCustomerDetails() {
    const option = {method: 'GET'}
    let response = await fetch("http://localhost:8085/customer/" + customer_id.val(),option);
    let data = await response.json();
    let customer=data.data;

    if(response.status === 200){
        customer_name.val(customer.name);
    }
}


item_Id.on('input', () => {
    if (item_Id.val() !== 'select the item') {
        loadSearchedItemDetails();
        $('#custId').empty();
        setCustomerNames();

    } else {
        description.val('');
        qty_on_hand.val('');
        unit_price.val('');
    }
});
async function loadSearchedItemDetails() {
    const option = {method: 'GET'}
    let response = await fetch("http://localhost:8085/item/" + item_Id.val(),option);
    let data = await response.json();
    let item=data.data;
    if(response.status === 200){
        description.val(item.description);
        qty_on_hand.val(item.quantity);
        unit_price.val(item.price);
    }
}

const formattedDate = new Date().toISOString().substr(0, 10);
date.val(formattedDate);

cart_btn.on('click', () => {
    let itemId = item_Id.val();
    let orderQTY = parseInt(order_qty.val());
    let unitPrice = unit_price.val();
    let qty = qty_on_hand.val();

    let total = unitPrice * orderQTY;

    if (qty >= orderQTY) {
        let cartItemIndex = cart.findIndex(cartItem => cartItem.itemId === itemId);
        if (cartItemIndex < 0) {
            let cart_item = {
                itemId: itemId,
                unitPrice: unitPrice,
                qty: orderQTY,
                total: total
            }
            cart.push(cart_item);
            Swal.fire({
                title: "Item added to cart",
                icon: "success"
            });
            loadCart();
            setTotalValues()
            clearItemSection();
        } else {
            cart[cartItemIndex].qty += orderQTY;
            cart[cartItemIndex].total = cart[cartItemIndex].qty * cart[cartItemIndex].unitPrice;
            loadCart();
            setTotalValues()
            clearItemSection();
        }
    } else {
        Swal.fire({
            title: "not enough quantity in stock",
            icon: "warning"
        });
    }

});


function loadCart() {
    $('tbody').eq(2).empty();
    cart.map((item) => {
        $('tbody').eq(2).append(
            `<tr>
                <th scope="row">${item.itemId}</th>
                <td>${item.unitPrice}</td>
                <td>${item.qty}</td>
                <td>${item.total}</td>
                <td><button class="cart_remove" data-id="${item.itemId}">Remove</button>
                </td>
            </tr>`
        );
    });
}


function setTotalValues() {
    let netTotal = calculateTotal();
    net_total.text(`${netTotal}/=`);

    let discount_percentage = discount.val() || 0;
    let discountAmount = (netTotal * discount_percentage) / 100;
    sub_total.text(`${netTotal - discountAmount}/=`);
}


function calculateTotal() {
    let netTotal = 0;
    cart.map((cart_item) => {
        netTotal += cart_item.total;
    });
    return netTotal;
}


function clearItemSection() {
    item_Id.val('select the item');
    description.val('');
    qty_on_hand.val('');
    unit_price.val('');
    order_qty.val('');
}


function setBalance() {
    let subTotal = parseFloat(sub_total.text());
    let cashAmount = parseFloat(cash.val());
    balance.val(cashAmount - subTotal);
}


cash.on('input', () => setBalance());

discount.on('input', () => {
    let discountValue = parseFloat(discount.val()) || 0;
    if (discountValue < 0 || discountValue > 100) {
        discountValue = Math.min(100, Math.max(0, discountValue));
        discount.val(discountValue);
    }

    let total_value = calculateTotal();
    let discountAmount = (total_value * discountValue) / 100;
    sub_total.text(`${total_value - discountAmount}/=`);
    setBalance();
});


$('tbody').on('click', '.cart_remove', function () {
    const item_Id = $(this).data('id');
    console.log(item_Id)
    const index = item_Id - 1;

    if (index !== -1) {
        cart.splice(index, 1);
        loadCart();
        setTotalValues();
    }

});


order_btn.on('click', () => {
    console.log('order button clicked');
    let orderId = order_id.val();
    let order_date = date.val();
    let customerId = customer_id.val();
    let subTotal = parseFloat(sub_total.text());
    let cashAmount = parseFloat(cash.val());
    let discountValue = parseInt(discount.val()) || 0;

    if (cashAmount >= subTotal) {
        if (cart.length !== 0) {
            let order = new OrderModel(orderId, order_date, discountValue, subTotal, customerId);
            let jsonOrder = JSON.stringify(order);

            console.log(jsonOrder);

            $.ajax({
                url: "http://localhost:8085/order",
                type: "POST",
                data: jsonOrder,
                headers: {"Content-Type": "application/json"},
                success: (res) => {
                    console.log(JSON.stringify(res));
                    Swal.fire({
                        title: JSON.stringify(res),
                        icon: "success"
                    });
                },
                error: (res) => {
                    console.error(res);
                }
            });

            cart.forEach((cart_item) => {
                let order_detail = new OrderDetailModel(orderId, cart_item.itemId, cart_item.qty, cart_item.unitPrice, cart_item.total);
                let jsonOrderDetail = JSON.stringify(order_detail);

                setTimeout(() => {
                    $.ajax({
                        url: "http://localhost:8085/orderDetails",
                        type: "POST",
                        data: jsonOrderDetail,
                        headers: {"Content-Type": "application/json"},
                        success: (res) => {
                            console.log(JSON.stringify(res));
                        },
                        error: (res) => {
                            console.error(res);
                        }
                    });
                }, 1000)

            });

            cart.splice(0, cart.length);
            loadCart();
            clearItemSection();
            customer_id.val('select the customer');
            customer_name.val('');
            discount.val('');
            cash.val('');
            balance.val('');
            net_total.text('0/=');
            sub_total.text('0/=');

            loadTable()

            setTimeout(() => {
                initialize();
                loadOrderTable()
            }, 1000)

        } else {
            Swal.fire({
                title: "please add items to cart",
                icon: "warning"
            });
        }
    } else {
        Swal.fire({
            title: "Payment is not enough",
            icon: "warning"
        });
    }

});