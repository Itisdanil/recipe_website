document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const message = document.getElementById('message').value;

    try {
        const response = await axios.post('/api/feedback', { message: message });
        console.log(response.data);
    } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
    }
});