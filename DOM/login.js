function login(event){
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
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
        const token=res.data.token;
        localStorage.setItem('token',token);
        alert(res.data.message);
        window.location.href='/chat';
        document.getElementById('email').value='';
        document.getElementById('password').value='';

    })
    .catch(err => {
        const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
        alert(errorMessage);
        console.log(err);
    })
}