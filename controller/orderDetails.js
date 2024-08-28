loadOrderTable()

export function loadOrderTable() {
    $('#order_table').empty();

    let ordersArray = [];

    $.ajax({
        url: "http://localhost:8085/order",
        type: "GET",
        data: {"all": "getAll"},
        success: (res) => {
            console.log(res);
            ordersArray = JSON.parse(res);
            console.log(ordersArray);

            ordersArray.map((order, index) => {

                var record = `<tr>
                    <td class="order-id-val">${order.id}</td>
                    <td class="cus-id-val">${order.customer_id}</td>
                    <td class="order-date-val">${order.date}</td>
                    <td class="order-total-val">${order.sub_total}</td>
                </tr>`;

                $('#order_table').append(record);
            });

            $("#order_count").text(ordersArray.length);
        },
        error: (res) => {
            console.error(res);
        }
    });

}


$("#order_search").on("input", function() {
    var typedText = $("#order_search").val();

    $.ajax({
        url: "http://localhost:8085/order",
        type: "GET",
        data: {"search": typedText},
        success: (res) => {
            console.log(res);
            let searchArray = JSON.parse(res);
            console.log(searchArray);

            $('#order_table').empty();

            searchArray.map((order, index) => {

                var record = `<tr>
                    <td class="order-id-val">${order.id}</td>
                    <td class="cus-id-val">${order.customer_id}</td>
                    <td class="order-date-val">${order.date}</td>
                    <td class="order-total-val">${order.sub_total}</td>
                </tr>`;

                $('#order_table').append(record);
            });

        },
        error: (res) => {
            console.error(res);
        }
    });
});


$('#order_table').on('click','tr', function () {
    let o_id = $(this).find('.order-id-val').text();
    let cus_id = $(this).find('.cus-id-val').text();
    let date = $(this).find('.order-date-val').text();

    $.ajax({
        url: "http://localhost:8085/order",
        type: "GET",
        data: {"id": o_id },
        success: (res) => {
            console.log(res);
            let search = JSON.parse(res);
            console.log(search);

            $('#order_details_discount').val(search.discount_value);

            loadDetailTable(o_id);
        },
        error: (res) => {
            console.error(res);
        }
    });

    $('#order_detail_id').val(o_id);
    $('#order_detail_customer_id').val(cus_id);
    $('#order_details_date').val(date);
});


function loadDetailTable(o_id) {
    $('#order_detail_table').empty();

    $.ajax({
        url: "http://localhost:8085/orderDetails",
        type: "GET",
        data: {"id": o_id },
        success: (res) => {
            console.log(res);
            let search = JSON.parse(res);
            console.log(search);

            search.map((orderDetail, index) => {

                $.ajax({
                    url: "http://localhost:8085/item",
                    type: "GET",
                    data: {"id": orderDetail.item_id },
                    success: (res) => {
                        console.log(res);
                        let search = JSON.parse(res);
                        console.log(search);

                        let desc = search.description

                        var record = `<tr>
                                <td class="item-id-val">${orderDetail.item_id}</td>
                                <td class="description-val">${desc}</td>
                                <td class="price-val">${orderDetail.unit_price}</td>
                                <td class="qty-val">${orderDetail.qty}</td>
                                <td class="total-val">${orderDetail.total}</td>
                            </tr>`;

                        $('#order_detail_table').append(record);
                    },
                    error: (res) => {
                        console.error(res);
                    }
                });
            });

        },
        error: (res) => {
            console.error(res);
        }
    });
}