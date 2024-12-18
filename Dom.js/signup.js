function signup(event){
    event.preventDefault();
    const name=document.getElementById('name');
    const email=document.getElementById('email');
    const phone=document.getElementById('phone');
    const password=document.getElementById('password');
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
        alert('User account created successfully');
    })
    .catch(err => {
        alert('Something went wrong. Please try again');
        console.log(err);
    })
}