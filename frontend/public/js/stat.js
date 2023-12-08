// График 1

async function fetchRecipeDifficultyData() {
    try {
        const response = await axios.get('/api/recipe/difficulty');

        const labels = response.data.map(item => item._id);
        const data = response.data.map(item => item.count);

        renderRecipeDifficultyChart(labels, data);
    } catch (error) {
        console.error('Ошибка при получении данных о сложности рецептов:', error);
    }
}

function renderRecipeDifficultyChart(labels, data) {
    const ctx = document.getElementById('recipeDifficultyChart').getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Уровень сложности рецептов',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 16
                        }
                    }
                }
            }
        }
    });
}

fetchRecipeDifficultyData();

// График 2

async function fetchVisitorsData() {
    try {
        const response = await axios.get('/api/visitors');

        const labels = response.data.map(item => item.date);
        const data = response.data.map(item => item.visitors);

        renderVisitorsChart(labels, data);
    } catch (error) {
        console.error('Ошибка при получении данных о посетителях:', error);
    }
}

function renderVisitorsChart(labels, data) {
    const ctx = document.getElementById('visitorsChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Посетителей',
                data: data,
                fill: false,
                borderColor: 'rgb(75,91,192)',
                backgroundColor: 'rgba(91,75,192,0.2)',
                pointBackgroundColor: 'rgb(83,75,192)',
                pointRadius: 5,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Посетители сайта за 7 дней',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 14
                        }
                    },
                },
                x: {
                    ticks: {
                        font: {
                            size: 14
                        }
                    }
                }
            },
            animation: {
                tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 0.8,
                    to: 0.2,
                    loop: true
                }
            }
        }
    });
}

fetchVisitorsData();


// График 3

async function fetchRecipesByCountryData() {
    try {
        const response = await axios.get('/api/recipes-by-country');

        const labels = response.data.map(item => item.country);
        const data = response.data.map(item => item.recipesCount);

        renderRecipesByCountryChart(labels, data);
    } catch (error) {
        console.error('Ошибка при получении данных о количестве рецептов по странам:', error);
    }
}

function renderRecipesByCountryChart(labels, data) {
    const ctx = document.getElementById('recipesByCountryChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Количество рецептов',
                data: data,
                backgroundColor: 'rgb(215,177,50)',
                borderColor: 'rgb(215,186,50)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 40,
                        font: {
                            size: 16
                            }
                        },
                    },
                x: {
                    ticks: {
                        font: {
                            size: 16
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Количество рецептов по странам',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

fetchRecipesByCountryData();

async function fetchDishTypesData() {
    try {
        const response = await axios.get('/api/dish-types');

        const labels = response.data.map(item => item.type);
        const data = response.data.map(item => item.count);

        renderDishTypesRadarChart(labels, data);
    } catch (error) {
        console.error('Ошибка при получении данных о типах блюд:', error);
    }
}

function renderDishTypesRadarChart(labels, data) {
    const ctx = document.getElementById('dishTypesRadarChart').getContext('2d');

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Количество блюд',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    suggestedMin: 0,
                    ticks: {
                        font: {
                            size: 14
                        }
                    },
                    pointLabels: {
                        font: {
                            size: 18,
                        },
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Соотношение типов блюд',
                    font: {
                        size: 20
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 16
                        }
                    }
                }
            }
        }
    });
}

fetchDishTypesData();

// График 5

async function fetchPopularRecipesVisitsData() {
    try {
        const response = await axios.get('/api/popular-recipes-visits');

        const labels = response.data.map(item => item.recipe);
        const data = response.data.map(item => item.visits);

        renderPopularRecipesVisitsChart(labels, data);
    } catch (error) {
        console.error('Ошибка при получении данных о посещении популярных рецептов:', error);
    }
}

function renderPopularRecipesVisitsChart(labels, data) {
    const ctx = document.getElementById('popularRecipesVisitsChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Количество посещений',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                title: {
                    display: true,
                    text: 'Посещения самых популярных рецептов',
                    font: {
                        size: 20
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 16
                        }
                    }
                }
            }
        }
    });
}

fetchPopularRecipesVisitsData();
