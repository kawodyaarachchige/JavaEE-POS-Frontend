
var index = 0;
initialize()
function initialize() {
    loadTable();
}
$('#customer_reset').on('click', () => {
    console.log("Customer reset clicked..")
    $('#customerId').val("");
    $('#fullname').val("");
    $('#address').val("");
    $('#contact').val("");
});

async function loadTable() {
    $('#customer_table').empty();

    const options = {method: 'GET'};
    try {
        const response = await fetch('http://localhost:8085/customer', options)
        const data = await response.json()
        let customers = data.data;
        if (Array.isArray(customers)) {
            customers.forEach((customer, index) => {
                var record = `<tr>
                    <td id="cus-id-tbl">${customer.id}</td>
                    <td id="cus-name-tbl">${customer.name}</td>
                    <td id="cus-address-tbl">${customer.address}</td>
                    <td id="cus-phone-tbl">${customer.phone}</td>
                </tr>`;
                $('#customer_table').append(record);
            });
        } else {
            console.error("data is not an array")
        }
    } catch (error) {
        console.error(error)
    }
}

$('#customer_submit').on('click', () => {
    console.log("Customer submit clicked..")
    var id = null;
    var name = $('#fullname').val();
    var address = $('#address').val();
    var phone = $('#contact').val();


    if (name == "" || address == "" || phone == "") {
        swal.fire({
            icon: 'error',
            title: 'Please fill all the fields ',
        });
    } else if (!addressPattern.test(address)) {
        swal.fire({
            icon: 'error',
            title: 'Please enter a valid address',
        });
    } else if (!mobilePattern.test(phone)) {
        swal.fire({
            icon: 'error',
            title: 'Please enter a valid phone number',
        });
    } else {
        console.log(id, name, address, phone)
        let option = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                name: name,
                address: address,
                phone: phone
            })

        };
        fetch('http://localhost:8085/customer', option)
            .then(response => {
                return response.json()
                    .then(data => ({
                            status: response.status,
                            message: data.message,
                            body: data
                        })
                    )
            })
            .then(json => {
                if (json.status === 200) {
                    swal.fire({
                        icon: 'success',
                        title: 'Customer added successfully',
                    });
                    $('#customer_reset').click();
                    initialize()
                } else if (json.status === 404) {
                    swal.fire({
                        icon: 'error',
                        title: 'Customer already exists',
                    });
                }
            })
    }


});

$('#customer_table').on('click', 'tr', function () {

    let id = $(this).find('#cus-id-tbl').text();
    let name = $(this).find('#cus-name-tbl').text();
    let address = $(this).find('#cus-address-tbl').text();
    let phone = $(this).find('#cus-phone-tbl').text();

    $('#customerId').val(id);
    $('#fullname').val(name);
    $('#address').val(address);
    $('#contact').val(phone);

});


$(`#customer_update`).on(`click`, () => {
    const id= $('#customerId').val();
    const name= $('#fullname').val();
    const address= $('#address').val();
    const phone = $('#contact').val();

    if ($('#fullname').val() == "" || $('#address').val() == "" || $('#contact').val() == "") {
        swal.fire({
            icon: 'error',
            title: 'Please fill all the fields ',
        });
    } else if (!addressPattern.test($('#address').val())) {
        swal.fire({
            icon: 'error',
            title: 'Please enter a valid address',
        });
    } else if (!mobilePattern.test($('#contact').val())) {
        swal.fire({
            icon: 'error',
            title: 'Please enter a valid phone number',
        });
    }
    const options = {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            id: id,
            name: name,
            address: address,
            phone: phone
        })
    };
    fetch('http://localhost:8085/customer/'+ id, options)
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
                $('#customer_table').empty();
                loadTable();
                swal.fire({
                    icon: 'success',
                    title: 'Customer updated successfully',
                });
                $('#customer_reset').click();
            } else if (response.status === 404) {
                swal.fire({
                    icon: 'error',
                    title: 'Customer not found',
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

$('#customer_delete').on('click', () => {
    const id = $('#customerId').val();
    fetch('http://localhost:8085/customer/'+ id, {
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
        })
        .then(response => {
            if (response.status === 200) {
                $('#customer_table').empty();
                loadTable();
                swal.fire({
                    icon: 'success',
                    title: 'Customer deleted successfully',
                });
                $('#customer_reset').click();
            } else if (response.status === 404) {
                swal.fire({
                    icon: 'error',
                    title: 'Customer not found',
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

$("#searchCustomer").on("input", function () {
    var typedText = $("#searchCustomer").val();
    customers.map((customer, index) => {
        if (typedText == "") {
            loadTable()
        }

        if (typedText == customer.id) {
            var select_index = index;

            $('#customer_table').empty();

            var record = `<tr>
                <td class="cus-id-val">${customers[select_index].id}</td>
                <td class="cus-fname-val">${customers[select_index].name}</td>
                <td class="cus-address-val">${customers[select_index].address}</td>
                <td class="cus-contact-val">${customers[select_index].phone}</td>
            </tr>`;

            $('#customer_table').append(record);
        }
    })
});


const addressPattern = /^[a-zA-Z0-9\s,'-]*$/
const mobilePattern = /^(?:\+94|94|0)?7\d{8}$/
