
const parts = window.location.href.split('/'); 
const lastPart = parts[parts.length - 1];


const myForm = document.querySelector('#resetpasswordform');
const password = myForm.querySelector('#password');
const confirm_password = myForm.querySelector('#confirm-password');
const passwordDiv = myForm.querySelector('#passwordDiv');
const successDiv = myForm.querySelector('#successDiv');
const submitbtn = myForm.querySelector('#submitbtn');
submitbtn.addEventListener('click',onReset)
async function onReset(e) {
    try {
        if (e.target && myForm.checkValidity()) {
            e.preventDefault();
            if(password.value!==confirm_password.value){
                passwordDiv.classList.remove('d-none');
                passwordDiv.classList.add('d-block');
                setTimeout(() => {
                    passwordDiv.classList.remove('d-block');
                    passwordDiv.classList.add('d-none');
                }, 3000);
            }else{
                const data = {
                    resetid: lastPart,
                    newpassword: password.value,
                };
               const resetresponse =  await axios.post("/password/reset", data);
               if(resetresponse && resetresponse.status === 200){
                e.preventDefault();
                password.value='';
                successDiv.classList.remove('d-none');
                successDiv.classList.add('d-block');
                setTimeout(() => {
                    successDiv.classList.remove('d-block');
                    successDiv.classList.add('d-none');
                    window.location.href = `/home`;
                }, 1000);

            }
            }
        }

    } catch (error) {
        console.log(error);
        alert(error.response.data.message);

    }
}
