function login(event){
    event.preventDefault();
    const email=document.getElementById('email');
    const password=document.getElementById('password');
    if(!email || !password)
    {
        alert("All fields are required");
    }
    const creds={
        email,
        password
    }
    axios.post('http://127.0.0.1:3000/user/login', creds)
    .then(res=> {
        alert(res.data.message);
        document.getElementById('email').value='';
        document.getElementById('phone').value='';

    })
    .catch(err => {
        const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
        alert(errorMessage);
        console.log(err);
    })
}