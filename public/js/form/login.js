document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.get('/api/login', {
            params: {
                username: username,
                password: password
            }
        });

        console.log('Ответ от сервера:', response.data);
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
});