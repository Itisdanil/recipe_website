document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const agreement = document.getElementById('agreement').checked;

    await axios.post('/api/registration', {
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: password,
        agreement: agreement
    }).then(response => {
        if (response.data.message === "Пользователь успешно зарегистрирован") {
            window.location.href = '/auth';
        }
    }).catch(error => {
        console.log(error);
    });

});


