//FOR SIGN UP 
const form1 = document.querySelector("#myForm1");
const signupbtn = form1.querySelector('#signup');
const usernameDiv1 = form1.querySelector('#usernameDiv1');
const successDiv1 = form1.querySelector('#successDiv1');
const passwordDiv1 = form1.querySelector('#passwordDiv1');
const Name = form1.querySelector('#Name');
const userName = form1.querySelector('#userName');
const password1 = form1.querySelector('#password1');
const password2 = form1.querySelector('#password2');
signupbtn.addEventListener('click', onSignup);
async function onSignup(e) {
    try {
        if (e.target && e.target.classList.contains("submit") && form1.checkValidity()) {
            e.preventDefault();
            if (password1.value != password2.value) {
                passwordDiv1.classList.remove('d-none');
                passwordDiv1.classList.add('d-block');
                setTimeout(() => {
                    passwordDiv1.classList.remove('d-block');
                    passwordDiv1.classList.add('d-none');
                }, 3000);
            } else {
                const data = {
                    Name: Name.value,
                    userName: userName.value,
                    password: password1.value,
                };
                const response = await axios.post("user/signup", data);
                successDiv1.classList.remove('d-none');
                successDiv1.classList.add('d-block');
               await new Promise((resolve) => {
                setTimeout(() => {
                  successDiv1.classList.remove('d-block');
                  successDiv1.classList.add('d-none');
                  resolve();
                }, 3000);
              });
              const userCredentials = await axios.post("user/signin", data); 
              localStorage.setItem('token', JSON.stringify({name:data.Name,token:userCredentials.data.token}));
              window.location.href = `user`;           

            }
        }     
    } catch (error) {
        if (error.response && error.response.status === 401) {
            e.preventDefault();
            console.log("Authentication failed. User is already exist.");
            usernameDiv1.classList.remove('d-none');
            usernameDiv1.classList.add('d-block');
            setTimeout(() => {
                usernameDiv1.classList.remove('d-block');
                usernameDiv1.classList.add('d-none');
            }, 3000);
        } else {
            console.error("An error occurred:", error);
        }
    }
}

//FOR SIGNIN 
const form2 = document.querySelector("#myForm2");
const signinbtn = form2.querySelector('#signin');
const usernameDiv2 = form2.querySelector('#usernameDiv2');
const successDiv2 = form2.querySelector('#successDiv2');
const passwordDiv2 = form2.querySelector('#passwordDiv2');
const Name2 = form2.querySelector('#Name');
const loguserName = form2.querySelector('#loguserName');
const logpassword = form2.querySelector('#logpassword');
signinbtn.addEventListener('click', onSignin);
async function onSignin(e) {
    try {
        if (e.target && e.target.classList.contains("submit") && form2.checkValidity()) {
            e.preventDefault();
            const data = {
                userName: loguserName.value,
                password: logpassword.value,
            };
            const userCredentials = await axios.post("user/signin", data);
            if(userCredentials && userCredentials.status === 200){
                e.preventDefault();
                localStorage.setItem('token', JSON.stringify({name:userCredentials.data.user.name,token:userCredentials.data.token}));
                successDiv2.classList.remove('d-none');
                successDiv2.classList.add('d-block');
                setTimeout(() => {
                    successDiv2.classList.remove('d-block');
                    successDiv2.classList.add('d-none');
                    window.location.href = `user`;
                }, 1000);

            }
        }

    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log("Authentication failed. User is not found.");
            usernameDiv2.classList.remove('d-none');
            usernameDiv2.classList.add('d-block');
            setTimeout(() => {
                usernameDiv2.classList.remove('d-block');
                usernameDiv2.classList.add('d-none');
            }, 3000);
        } else if (error.response && error.response.status === 401) {
            console.log("Authentication failed. User is unauthorized.");
            e.preventDefault();
            passwordDiv2.classList.remove('d-none');
            passwordDiv2.classList.add('d-block');
            setTimeout(() => {
                passwordDiv2.classList.remove('d-block');
                passwordDiv2.classList.add('d-none');
            }, 3000);
        } else {
            console.error("An error occurred:", error);
        }
    }
}

//FOR BUYING PREMIUM
const form3 = document.querySelector("#myForm3");
const headDiv = document.querySelector('#headDiv')
const registerbtn = form3.querySelector('#register-btn');
const usernameDiv3 = form3.querySelector('#usernameDiv3');
const successDiv3 = form3.querySelector('#successDiv3');
const passwordDiv3 = form3.querySelector('#passwordDiv3');
const rgstrName = form3.querySelector('#rgstrName');
const rgstruserName = form3.querySelector('#rgstruserName');
const rgstrpassword1 = form3.querySelector('#rgstrpassword1');
const rgstrpassword2 = form3.querySelector('#rgstrpassword2');
const cancelbtn = form3.querySelector('#cancelbtn');
cancelbtn.addEventListener('click',cancelPayment);
registerbtn.addEventListener('click', onRegister);
let userCredentials;
async function onRegister(e) {
    try {
        if (e.target && e.target.classList.contains("submit") && form3.checkValidity()) {
            e.preventDefault();
            if (rgstrpassword1.value === rgstrpassword2.value) {
                const data = {
                    Name: rgstrName.value,
                    userName: rgstruserName.value,
                    password: rgstrpassword1.value,
                };
                userCredentials = await axios.post("user/signup", data);
                localStorage.setItem('token', JSON.stringify({ name: data.Name, token: userCredentials.data.token }));
                purchasepremium();
            } else {
                passwordDiv3.classList.remove('d-none');
                passwordDiv3.classList.add('d-block');
                setTimeout(() => {
                    passwordDiv3.classList.remove('d-block');
                    passwordDiv3.classList.add('d-none');
                }, 3000);
            }
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            e.preventDefault();
            console.log("Authentication failed. User is already exist.");
            usernameDiv3.classList.remove('d-none');
            usernameDiv3.classList.add('d-block');
            setTimeout(() => {
                usernameDiv3.classList.remove('d-block');
                usernameDiv3.classList.add('d-none');
            }, 3000);
        } else {
            console.error("An error occurred:", error);
        }
    }
}

async function purchasepremium(){
    try {
        const response = await axios.get("purchase/premiummembership", {
            headers: {
                'Authorization': `${userCredentials.data.token}`
            }
        });
        clearFields();
        successDiv3.classList.remove('d-none');
        successDiv3.classList.add('d-block');
        const { key_id, orderid } = response.data;
        const {name,email} = response.data.user;
        var options = {
            "key": key_id,
            "order_id": orderid,
            "description": "Mufil Rahman Test",
            "handler": async function (response) {
                const premiumstatus = await axios.put("purchase/updatetransactionstatus", {
                    order_id: response.razorpay_order_id,
                    payment_id: response.razorpay_payment_id
                }, { headers: { 'Authorization': userCredentials.data.token } });
                alert(premiumstatus.data.message);
                window.location.href = "user";
            },
            "prefill":{
                "name" : name,
                "email" :email
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

function clearFields() {
    headDiv.remove();
    rgstrName.parentElement.remove();
    rgstruserName.parentElement.remove();
    rgstrpassword1.parentElement.remove();
    rgstrpassword2.parentElement.remove();
    registerbtn.parentElement.remove();
}

function cancelPayment(){
    alert('You are signed as Basic user')
    window.location.href = "user";   
}

const forgotform = document.querySelector('#forgotpassword_form')
const forgotpasswordbtn = form2.querySelector('#forgotpasswordbtn');
const forgotEmail = forgotform.querySelector('#forgotEmail');
const usernameDiv4 = forgotform.querySelector('#usernameDiv4');
const successDiv4 = forgotform.querySelector('#successDiv4');
const paswdresetbtn = forgotform.querySelector('#paswdresetbtn');
paswdresetbtn.addEventListener('click',passwordreset);
async function passwordreset(e){
    try {
        if(e.target && forgotform.checkValidity()){
            e.preventDefault();
            const data = {
                email: forgotEmail.value,
            }
           const res = await axios.post('password/forgotpassword',data);
           console.log(res);
            successDiv4.classList.remove('d-none');
            successDiv4.classList.add('d-block');
            setTimeout(() => {
                successDiv4.classList.remove('d-block');
                successDiv4.classList.add('d-none');
                window.location.href = `home`;
            }, 3000);
        }

        
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log("User is not found.");
            usernameDiv4.classList.remove('d-none');
            usernameDiv4.classList.add('d-block');
        }  
        setTimeout(() => {
            usernameDiv4.classList.remove('d-block');
            usernameDiv4.classList.add('d-none');
        }, 3000);
    }
}

