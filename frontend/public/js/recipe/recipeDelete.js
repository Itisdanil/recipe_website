document.addEventListener('DOMContentLoaded', function() {
    const deleteButton = document.querySelector('.delete-btn');

    deleteButton.addEventListener('click', async function(event) {
        event.preventDefault();

        const id = deleteButton.getAttribute('data-id');

        try {
            const response = await axios.delete(`/admin/recipe/delete/${id}`);

            if (response.status >= 200 && response.status < 300) {
                window.location.href = '/recipe';
            } else {
                console.error('Ошибка удаления элемента:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    });
});

