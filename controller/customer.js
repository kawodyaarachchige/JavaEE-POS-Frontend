/*import {setCustomerIds} from "./placeOrder.js";*/


var index = 0;

initialize()


function initialize() {
    /*loadTable();

    var newId = generateCustomerId();
    $('#customerId').val(newId)

    setCustomerIds(customers)*/
}

function loadTable() {
    $('#customer_table').empty();

    customers.map((customer, index) => {
        var id = customer.id;
        var name = customer.name;
        var address = customer.address;
        var phone = customer.phone;

        var record = `<tr>
        <td class="cus-id-val">${id}</td>
        <td class="cus-fname-val">${name}</td>
        <td class="cus-address-val">${address}</td>
        <td class="cus-contact-val">${phone}</td>
    </tr>`;

        console.log(record)

        $('#customer_table').append(record);
    });

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
    index = $(this).index();
    let id = $(this).find('.cus-id-val').text();
    let name = $(this).find('.cus-fname-val').text();
    let address = $(this).find('.cus-address-val').text();
    let phone = $(this).find('.cus-contact-val').text();

    $('#customerId').val(id);
    $('#fullname').val(name);
    $('#address').val(address);
    $('#contact').val(phone);
});


$(`#customer_update`).on(`click`, () => {

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
    } else {
        console.log(customers[index])
        customers[index].id = $('#customerId').val();
        customers[index].name = $('#fullname').val();
        customers[index].address = $('#address').val();
        customers[index].phone = $('#contact').val();

        Swal.fire({
            icon: 'success',
            title: 'Customer updated successfully',
        });
        $('#customer_reset').click();
        initialize()
    }

})

$('#customer_delete').on('click', () => {
    customers.splice(index, 1);
    Swal.fire({
        icon: 'success',
        title: 'Customer deleted successfully',
    });
    $('#customer_reset').click();
    initialize()
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

function generateCustomerId() {
    let lastId = 'C-001'; // Default if array is empty

    if (customers.length > 0) {
        let lastElement = customers[customers.length - 1].id;
        let lastIdParts = lastElement.split('-');
        let lastNumber = parseInt(lastIdParts[1]);

        lastId = `C-${String(lastNumber + 1).padStart(3, '0')}`;
    }

    return lastId;
}


const addressPattern = /^[a-zA-Z0-9\s,'-]*$/
const mobilePattern = /^(?:\+94|94|0)?7\d{8}$/
