
initialize()
function initialize() {
    loadTable();
}

$('#item_reset').on('click', () => {
    $('#itemCode').val("");
    $('#description').val("");
    $('#unitPrice').val("");
    $('#qty').val("");
});

async function loadTable() {
    $('#item_table').empty();
    const options = {method: 'GET'};
    try {
        const response = await fetch('http://localhost:8085/item', options)
        const data = await response.json()
        let items = data.data;
        if (Array.isArray(items)) {
            items.forEach((item, index) => {
                var record = `<tr>
                    <td id="item-code-tbl">${item.item_id}</td>
                    <td id="item-desc-tbl">${item.description}</td>
                    <td id="item-price-tbl">${item.price}</td>
                    <td id="item-qty-tbl">${item.quantity}</td>
                </tr>`;
                $('#item_table').append(record);
            });
        } else {
            console.error("data is not an array")
        }
    } catch (error) {
        console.error(error)
    }
}
async function loadSearchedItem() {
    const options = {method: 'GET'};
    try {
        const response = await fetch('http://localhost:8085/item/' + $('#searchItem').val(), options)
        const data = await response.json()
        let items = data.data;
        console.log(items);
        var record = `<tr>
                    <td id="item-code-tbl">${items.item_id}</td>
                    <td id="item-desc-tbl">${items.description}</td>
                    <td id="item-price-tbl">${items.price}</td>
                    <td id="item-qty-tbl">${items.quantity}</td>
                </tr>`;
        $('#item_table').append(record);

    } catch (error) {
        console.error(error)
    }
}
$('#item_submit').on('click', () => {
    console.log("Item submit clicked..")
    var id = null;
    var desc = $('#description').val();
    var unit_price = $('#unitPrice').val();
    var qty = $('#qty').val();

    console.log(desc, unit_price, qty)

    if (desc == '' || unit_price == '' || qty == '') {
        swal.fire({
            icon: 'error',
            title: 'Please fill all the fields ',
        });
    } else if (!pricePattern.test(unit_price)) {
        swal.fire({
            icon: 'error',
            title: 'Please enter a valid price',
        });
    } else {
        console.log("Item submit clicked..")
        let options = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                item_id: null,
                description: desc,
                price: unit_price,
                quantity: qty

            })

        };
        fetch('http://localhost:8085/item', options)
            .then(response => {
                return response.json()
                    .then(data => ({
                        status: response.status,
                        message: data.message,
                        body: data
                    }))
            })
            .then(json => {
                    if (json.status === 200) {
                        swal.fire({
                            icon: 'success',
                            title: 'Item added successfully',
                        });
                        $('#item_reset').click();
                        loadTable();
                    } else if (json.status === 404) {
                        swal.fire({
                            icon: 'error',
                            title: 'Item already exists',
                        });
                    }
                }
            )
    }

});

$('#item_table').on('click', 'tr', function () {

    const itemCode = $(this).find('#item-code-tbl').text();
    const itemDesc = $(this).find('#item-desc-tbl').text();
    const itemPrice = $(this).find('#item-price-tbl').text();
    const itemQty = $(this).find('#item-qty-tbl').text();

    $('#itemCode').val(itemCode);
    $('#description').val(itemDesc);
    $('#unitPrice').val(itemPrice);
    $('#qty').val(itemQty);
});


$(`#item_update`).on(`click`, () => {

    const id = $('#itemCode').val();
    const desc = $('#description').val();
    const unit_price = $('#unitPrice').val();
    const qty = $('#qty').val();


    if ($('#description').val() == '' || $('#unitPrice').val() == '' || $('#qty').val() == '') {
        swal.fire({
            icon: 'error',
            title: 'Please fill all the fields ',
        });
    } else if (!pricePattern.test($('#unitPrice').val())) {
        swal.fire({
            icon: 'error',
            title: 'Please enter a valid price',
        });

    }
    const options = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            item_id: id,
            description: desc,
            price: unit_price,
            quantity: qty

        })

    };

    fetch('http://localhost:8085/item/'+ id, options)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text);
                });
            }
            return response.json().then(data => ({
                status: response.status,
                message: data.message,
                body: data
            }));
        })
        .then(response => {
            if (response.status === 200) {
                $('#item_table').empty();
                loadTable();
                swal.fire({
                    icon: 'success',
                    title: 'item updated successfully',
                });
                $('#item_reset').click();
            } else if (response.status === 404) {
                swal.fire({
                    icon: 'error',
                    title: 'item not found',
                });
            }
        })
        .catch(error => {
            console.error('Error:', error.message);
            swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: error.message
            });
        });


})


$('#item_delete').on('click', () => {
    const id = $('#itemCode').val();
    fetch('http://localhost:8085/item/'+ id, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text);
                });
            }
            return response.json().then(data => ({
                status: response.status,
                message: data.message,
                body: data
            }));
        }).then(response => {
        if (response.status === 200) {
            $('#item_table').empty();
            loadTable();
            swal.fire({
                icon: 'success',
                title: 'Item deleted successfully',
            });
            $('#item_reset').click();
        } else if (response.status === 404) {
            swal.fire({
                icon: 'error',
                title: 'Item not found',
            });
        }
        })
        .catch(error => {
            console.error('Error:', error.message);
            swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: error.message
            });
        });
})


$("#searchItem").on("input", function () {
    console.log("searching..."+$("#searchItem").val());
    try{
        if($("#searchItem").val() == "" || $("#searchItem").val() == null){
            $('#item_table').empty();
            loadTable();
        }else {
            $('#item_table').empty();
            loadSearchedItem();
        }
    }catch (err){
        console.error(err);
    }
});


const pricePattern = /^\$?\d+(\.\d{2})?$/
