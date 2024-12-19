
function signup(event){
    event.preventDefault();
    const name=document.getElementById('name').value;
    const email=document.getElementById('email').value;
    const phone=document.getElementById('phone').value;
    const password=document.getElementById('password').value;
    if(!name || !email || !phone || !password)
    {
        alert("Please fill required fields");
    }
    const user={
        name,
        email,
        phone,
        password
    }
    axios.post('http://127.0.0.1:3000/user/signup', user)
    .then(res => {
           alert(res.data.message);
           if(res.status===201)
           {
            window.location.href='/user/loginpage';
           }
        document.getElementById('name').value='';
        document.getElementById('email').value='';
        document.getElementById('phone').value='';
        document.getElementById('password').value='';
    })
    .catch(err => {
        const errorMessage = err.response?.data?.message || 'Something went wrong. Please try again.';
        alert(errorMessage);
        if(err.status===400)
            {
             window.location.href='/user/loginpage';
            }
        console.log(err);
    })
    
}