const elements = {
    namePlaceholder: document.querySelector('#namePlaceholder'),
    emailPlaceholder: document.querySelector('#emailPlaceholder'),
    normallogodiv: document.querySelector('#normallogo'),
    premiumlogoDiv: document.querySelector('#premiumlogo'),
    premiumdiv: document.querySelector('#premiumdiv'),
    normaldiv: document.querySelector('#normaldiv'),
    usercategory: document.querySelector('#usercategory'),
    lupdatePlaceholder: document.querySelector('#lupdatePlaceholder'),
    expensePlaceholder: document.querySelector('#expensePlaceholder'),
    totalPlaceholder: document.querySelector('#totalPlaceholder'),
    logoutbtn: document.querySelector('#logoutbtn'),
    myForm: document.querySelector('#myForm'),
    Ucategory: myForm.querySelector('#category'),
    Upmethod: myForm.querySelector('#pmethod'),
    Uamount: myForm.querySelector('#amount'),
    Udate: myForm.querySelector('#date'),
    Ueditid: myForm.querySelector('#editid'),
    submitbtn: myForm.querySelector('#submitbtn'),
    successDiv: myForm.querySelector('#successDiv'),
    updateDiv: myForm.querySelector('#updateDiv'),
    buypremiumbtn: document.querySelector('#buypremiumbtn'),
    currentpagebtn:document.querySelector('#currentPage'),
    nextpagebtn:document.querySelector('#nextPage'),
    prevpagebtn: document.querySelector('#prevPage'),
    noiteminpage:document.querySelector('#noiteminpage'),
};
elements.submitbtn.addEventListener('click', addExpense);
elements.expensePlaceholder.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains("delbtn")) deleteExpense(e);
    if (e.target && e.target.classList.contains("editbtn")) editExpense(e);
});
elements.buypremiumbtn.addEventListener('click', purchasepremium);
elements.logoutbtn.addEventListener('click', logout);

elements.prevpagebtn.addEventListener('click',onclickprevpage);
elements.nextpagebtn.addEventListener('click',onclicknextpage);

elements.noiteminpage.addEventListener('change',onSelectnoitem);

let authenticatedAxios = createauthaxios();
let userName, userEmail;
let currentPage = 1;
let hasMoreExpenses;
let hasPreviousExpenses;
let noitem =5;

setupProfile();
refresh();
function showOutput(response) {
    elements.expensePlaceholder.innerHTML = "";
    elements.totalPlaceholder.innerHTML = `&#8377;${response.totalexpenses}`;
    hasMoreExpenses = response.hasMoreExpenses;
    hasPreviousExpenses = response.hasPreviousExpenses;
    if (response.expenses.length > 0) {
        response.expenses.forEach((ele, index) => {
            const tr = document.createElement('tr');
            const html =
                `<td>${((currentPage-1)*noitem)+index + 1}</td>
        <td>${ele.category}</td>
        <td>${ele.pmethod}</td>
        <td> &#8377; ${ele.amount}</td>
        <td class="text-nowrap">${ele.date}</td>
        <td>
            <button class="btn btn-outline-success editbtn" id="${ele.id}">
                Edit
            </button>
        </td>
        <td>
            <button class="btn btn-outline-danger delbtn" id="${ele.id}">
                Delete
            </button>
        </td>
        `;
            tr.innerHTML += html;
            elements.expensePlaceholder.appendChild(tr);

        })
        const lastData = response.expenses[response.expenses.length - 1];
        const lastdate = new Date(lastData.createdAt).toLocaleDateString();
        elements.lupdatePlaceholder.innerHTML = lastdate;
    } else {
        elements.lupdatePlaceholder.innerHTML = `No data present`;
    }

}

function clearFields() {
    elements.Ucategory.value = '';
    elements.Upmethod.value = '';
    elements.Uamount.value = '';
    elements.Udate.value = '';
    elements.Ueditid.value = '';
}
function createauthaxios() {
    const tokenData = JSON.parse(localStorage.getItem('token'));
    if (tokenData) {
        const { token, name } = tokenData
        return axios.create({
            headers: {
                'Authorization': `${token}`
            }
        });
    }
    else {
        window.location.href = "/home";
    }
}
function logout(e) {
    localStorage.removeItem("token");
}
function updatePageNumber() { 
    $('#currentPage').text(currentPage);
    $('#prevPage').prop('disabled', !hasPreviousExpenses);
    $('#nextPage').prop('disabled', !hasMoreExpenses); 
}
function onclickprevpage (e) {
    if (hasPreviousExpenses) {
        currentPage--;
        refresh();
    }
};
function onclicknextpage () {
    if (hasMoreExpenses) { 
        currentPage++;
        refresh();
    }
}
function onSelectnoitem (){
    noitem = elements.noiteminpage.value;
    currentPage=1;
    refresh();
}

async function setupProfile() {
    try {
        const currentuser = await authenticatedAxios.get(`user/currentuser`);
        const { name, email, ispremiumuser } = currentuser.data.user;
        userName = name;
        userEmail = email;
        elements.namePlaceholder.innerHTML = name;
        elements.emailPlaceholder.innerHTML = email;
        if (ispremiumuser) {
            elements.premiumlogoDiv.classList.remove('d-none');
            elements.premiumlogoDiv.classList.add('d-block');
            elements.premiumdiv.classList.remove('d-none');
            elements.premiumdiv.classList.add('d-block');
            elements.usercategory.innerHTML = "Premium User";
            premium();
        }
        else {
            elements.normallogodiv.classList.remove('d-none');
            elements.normallogodiv.classList.add('d-block');
            elements.normaldiv.classList.remove('d-none');
            elements.normaldiv.classList.add('d-block');
        }
    } catch (error) {
        console.log(error);
    }
}

async function purchasepremium() {
    try {
        document.getElementById('confirmationdiv').innerHTML = `<strong>Hi ${userName}</strong>`
        const response = await authenticatedAxios.get("purchase/premiummembership");
        const { key_id, orderid } = response.data;
        const { name, email } = response.data.user;
        var options = {
            "key": key_id,
            "order_id": orderid,
            "description": "Mufil Rahman Test",
            "handler": async function (response) {
                const premiumstatus = await authenticatedAxios.put("purchase/updatetransactionstatus", {
                    order_id: response.razorpay_order_id,
                    payment_id: response.razorpay_payment_id
                });
                alert(premiumstatus.data.message);
                window.location.href = "user";
            },
            "prefill": {
                "name": name,
                "email": email
            },
            "notes": {
                "address": "Mufil Pvt.ltd Corporate Office"
            },
        };
        var rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            console.log(response);
            alert('Something went wrong Transaction failed');

        });
        document.getElementById('rzp-button1').onclick = function (e) {
            rzp1.open();
            e.preventDefault();
        }
    } catch (error) {
        console.log(error);
    }
}

async function addExpense(e) {
    if (e.target && e.target.classList.contains("submit") && elements.myForm.checkValidity()) {
        e.preventDefault();
        try {
            const data = {
                category: elements.Ucategory.value,
                pmethod: elements.Upmethod.value,
                amount: Number(elements.Uamount.value),
                date: elements.Udate.value
            }
            if (elements.Ueditid.value == "") {
                const addresponse = await authenticatedAxios.post(`expenses/addexpense`, data);
                elements.successDiv.classList.remove('d-none');
                elements.successDiv.classList.add('d-block');
                setTimeout(() => {
                    elements.successDiv.classList.remove('d-block');
                    elements.successDiv.classList.add('d-none');
                    clearFields();
                    refresh();
                    premium();
                }, 500);
            } else {
                const editresponse = await authenticatedAxios.put(`expenses/update/${elements.Ueditid.value}`, data);
                elements.updateDiv.classList.remove('d-none');
                elements.updateDiv.classList.add('d-block');
                setTimeout(() => {
                    elements.updateDiv.classList.remove('d-block');
                    elements.updateDiv.classList.add('d-none');
                    clearFields();
                    refresh();
                    premium();
                }, 500);
            }
        } catch (error) {
            console.log(error);
        }
    }

}
async function deleteExpense(e) {
    try {
        e.preventDefault();
        const dID = e.target.id;
        await authenticatedAxios.delete(`expenses/delete/${dID}`)
        refresh();
        premium();
    } catch (error) {
        alert(error.response.data.message);
        refresh();
    }
}
async function editExpense(e) {
    try {
        e.preventDefault();
        const eID = e.target.id;
        const response = await authenticatedAxios.get(`expenses/getexpensebyid/${eID}`)
        const { category, pmethod, amount, date } = response.data[0];
        elements.Ucategory.value = category;
        elements.Upmethod.value = pmethod;
        elements.Uamount.value = amount;
        elements.Udate.value = date;
        elements.Ueditid.value = eID;
    } catch (error) {
        console.log(error);
        refresh();
    }
}

async function refresh() {
    try {
        const response = await authenticatedAxios.get(`expenses/getexpenses?page=${currentPage}&noitem=${noitem}`);
        showOutput(response.data);
        updatePageNumber();
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log(error);
            alert(error.response.data.message);
            window.location.href = "home";
        } else {
            console.log(error);
            alert("Something went wrong please log in again");
            window.location.href = "home";
        }
    }
}

