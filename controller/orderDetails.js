
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

            updateCounter('#orderCount', ordersArray.length);
        },
        error: (res) => {
            console.error(res);
        }
    });

}


$("#searchOrder").on("input", function () {
    var typedText = $("#searchOrder").val();
    $('#order_detail_id').val("");
    $('#order_detail_customer_id').val("");
    $('#order_details_date').empty();
    $('#order_details_discount').val("");
    $('#order_detail_table').empty();

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


$('#order_table').on('click', 'tr', function () {
    let o_id = $(this).find('.order-id-val').text();
    let cus_id = $(this).find('.cus-id-val').text();
    let date = $(this).find('.order-date-val').text();

    $.ajax({
        url: "http://localhost:8085/order",
        type: "GET",
        data: {"id": o_id},
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
        data: {"id": o_id},
        success: (res) => {
            let search
            if (res) {
                try {
                    /*search= JSON.parse(res);*/
                    search = res
                    console.log('Parsed response:', search);
                } catch (e) {
                    console.error('JSON parse error:', e);
                }
            } else {
                console.warn('Received empty response');
            }

            if (Array.isArray(search)) {
                search.forEach((orderDetail, index) => {
                    let option = {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                    fetch('http://localhost:8085/item/' + orderDetail.item_id, option)
                        .then(response => response.json())
                        .then(data => {
                            if (data && data.data) {
                                console.log("Response data: ", data.data);
                                console.log("Description: ", data.data.description);

                                var record = `<tr>
                                        <td class="item-id-val">${orderDetail.item_id}</td>
                                        <td class="description-val">${data.data.description}</td>
                                        <td class="price-val">${orderDetail.unit_price}</td>
                                        <td class="qty-val">${orderDetail.qty}</td>
                                        <td class="total-val">${orderDetail.total}</td>
                                    </tr>`;
                                $('#order_detail_table').append(record);
                            } else {
                                console.error("Data or description not found");
                            }
                        })
                })
            }

        },
        error: (res) => {
            console.error(res);
        }
    });
}
function generateReport() {

    var table = document.getElementById('order_table');
    var rows = table.getElementsByTagName('tr');
    var csv = '';

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        var row = [];
        for (var j = 0; j < cells.length; j++) {
            row.push(cells[j].innerText);
        }
        csv += row.join(',') + '\n';
    }
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.href = url;
    a.download = 'report.csv';
    a.click();
    URL.revokeObjectURL(url);


}

$(document).ready(function() {
    $('#report').on('click', generateReport);
    loadOrderTable();
})