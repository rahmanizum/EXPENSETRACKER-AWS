const lbplaceholder = elements.premiumdiv.querySelector('#lbplaceholder');
const completedownloadbtn = elements.premiumdiv.querySelector('#completedownloadbtn');
const historyplaceholder = elements.premiumdiv.querySelector('#historyplaceholder');
completedownloadbtn.addEventListener('click',downloadData);
function showLeaderboard(data) {
    lbplaceholder.innerHTML="";
    data.forEach((ele, index) => {
        if(index<25){
            const firstName = ele.name.split(' ')[0];
            const li = document.createElement('li');
            li.className = "list-group-item text-nowrap"
            const text = `${index + 1}. ${firstName} - Expense: &#8377;${ele.totalExpenses}`;
            li.innerHTML = text;
            lbplaceholder.appendChild(li);
        }

    })

}
function showDownloadhistory(data) {
    
if(data.length>0){
    historyplaceholder.innerHTML="";
    data.forEach((ele, index) => {
        if(index<25){
            const date = new Date(ele.createdAt).toLocaleString();
            const a = document.createElement('a');
            a.className = "list-group-item text-nowrap";
            a.href = `${ele.downloadUrl}`
            a.innerHTML = `${date}`;
            historyplaceholder.appendChild(a);
        }

    })
}
}

async function downloadData(e){
    try {
        e.preventDefault();
        let response = await authenticatedAxios.get('premium/download');
        window.location.href = response.data.URL;
        premium();
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
}

async function premium() {
    try {
        const leaderboard = await authenticatedAxios.get('premium/leaderborddata');
        showLeaderboard(leaderboard.data);
        const downloadhistory = await authenticatedAxios.get('premium/downloadhistory');
        showDownloadhistory(downloadhistory.data);
    } catch (error) {
        console.log(error);
    }
}

