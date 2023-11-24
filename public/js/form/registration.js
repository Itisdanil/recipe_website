document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const agreement = document.getElementById('agreement').checked;

    try {
        const response = await axios.post('/api/registration', {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password,
            agreement: agreement
        });

        console.log('Ответ от сервера:', response.data);
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
});