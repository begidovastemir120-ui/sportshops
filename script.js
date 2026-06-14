// ===== ДАННЫЕ ТОВАРОВ =====
const products = [
    { id: 1, name: "Гантели 10 кг", category: "гантели", price: 2500, inStock: true },
    { id: 2, name: "Гантели 5 кг", category: "гантели", price: 1500, inStock: true },
    { id: 3, name: "Скакалка", category: "аксессуары", price: 300, inStock: true },
    { id: 4, name: "Коврик для йоги", category: "аксессуары", price: 800, inStock: false },
    { id: 5, name: "Эспандер", category: "тренажеры", price: 1200, inStock: true },
    { id: 6, name: "Бутылка для воды", category: "аксессуары", price: 400, inStock: true },
    { id: 7, name: "Пояс утяжелитель", category: "аксессуары", price: 1200, inStock: true }
];

// ===== КОРЗИНА =====
let cart = JSON.parse(localStorage.getItem('sportshop_cart')) || [];

function saveCart() {
    localStorage.setItem('sportshop_cart', JSON.stringify(cart));
    updateCartDisplay();
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    alert(product.name + " добавлен в корзину!");
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

function updateQuantity(index, delta) {
    if (cart[index].quantity + delta > 0) {
        cart[index].quantity += delta;
        saveCart();
    } else {
        removeFromCart(index);
    }
}

function clearCart() {
    if (confirm('Очистить всю корзину?')) {
        cart = [];
        saveCart();
    }
}

function updateCartDisplay() {
    // Обновление счётчика в шапке
    const cartCountElem = document.getElementById('cart-count');
    if (cartCountElem) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElem.innerText = totalItems;
    }
    
    // Отображение корзины на странице cart.html
    const cartContainer = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total');
    
    if (cartContainer && totalSpan) {
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p style="text-align:center;">Корзина пуста. Добавьте товары!</p>';
            totalSpan.innerText = '0';
            return;
        }
        
        let html = '';
        let total = 0;
        
        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            const sum = item.price * item.quantity;
            total += sum;
            
            html += `
                <div class="cart-item">
                    <div><strong>${item.name}</strong><br>${item.price} ₽</div>
                    <div>
                        <button onclick="updateQuantity(${i}, -1)">-</button>
                        <span style="margin:0 10px;">${item.quantity}</span>
                        <button onclick="updateQuantity(${i}, 1)">+</button>
                        <button onclick="removeFromCart(${i})" style="background:#ff4444;">🗑️</button>
                    </div>
                    <div><strong>${sum} ₽</strong></div>
                </div>
            `;
        }
        
        cartContainer.innerHTML = html;
        totalSpan.innerText = total;
    }
}

// ===== ЗАГРУЗКА КАТАЛОГА =====
function loadCatalog() {
    const catalogGrid = document.getElementById('catalog-grid');
    if (!catalogGrid) return;
    
    let html = '';
    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        html += `
            <article class="product-card">
                <img src="https://via.placeholder.com/200x150?text=${p.name}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p class="price">${p.price} ₽</p>
                <p>${p.inStock ? '✅ В наличии' : '❌ Нет в наличии'}</p>
                <button onclick="addToCart({id:${p.id}, name:'${p.name}', price:${p.price}})" ${!p.inStock ? 'disabled' : ''}>
                    В корзину
                </button>
            </article>
        `;
    }
    catalogGrid.innerHTML = html;
}

// ===== BMI КАЛЬКУЛЯТОР =====
function calculateBMI() {
    const weight = document.getElementById('weight');
    const height = document.getElementById('height');
    
    if (!weight || !height) return;
    
    let w = parseFloat(weight.value);
    let h = parseFloat(height.value);
    
    // Проверка ввода
    if (isNaN(w) || isNaN(h)) {
        alert('Пожалуйста, введите корректные числа!');
        return;
    }
    
    if (w <= 0 || w > 300) {
        alert('Вес должен быть от 1 до 300 кг');
        return;
    }
    
    if (h <= 0 || h > 250) {
        alert('Рост должен быть от 1 до 250 см');
        return;
    }
    
    const heightM = h / 100;
    const bmi = w / (heightM * heightM);
    const roundedBMI = Math.round(bmi * 10) / 10;
    
    const resultDiv = document.getElementById('bmi-result');
    const recDiv = document.getElementById('bmi-recommendation');
    
    resultDiv.innerHTML = `Ваш ИМТ: <span style="color:#ff8c00;">${roundedBMI}</span>`;
    
    // Определение категории
    let category = '';
    let color = '';
    let recommendation = '';
    
    if (bmi < 16) {
        category = 'Выраженный дефицит массы';
        color = 'red';
        recommendation = '⚠️ Обратитесь к врачу!';
    } else if (bmi < 18.5) {
        category = 'Недостаточная масса';
        color = 'orange';
        recommendation = '📈 Рекомендуем полноценное питание';
    } else if (bmi < 25) {
        category = 'Нормальный вес';
        color = 'green';
        recommendation = '✅ Отличный результат! Продолжайте тренировки!';
    } else if (bmi < 30) {
        category = 'Избыточная масса';
        color = 'orange';
        recommendation = '🏃 Увеличьте физическую активность';
    } else if (bmi < 35) {
        category = 'Ожирение I степени';
        color = 'red';
        recommendation = '👨‍⚕️ Нужна консультация диетолога';
    } else if (bmi < 40) {
        category = 'Ожирение II степени';
        color = 'red';
        recommendation = '🚨 Обратитесь к врачу!';
    } else {
        category = 'Тяжелое ожирение';
        color = 'darkred';
        recommendation = '🚨 Требуется медицинская помощь!';
    }
    
    recDiv.innerHTML = `<strong style="color:${color};">${category}</strong><br>${recommendation}`;
    recDiv.style.background = color + '20';
    recDiv.style.padding = '10px';
    recDiv.style.borderRadius = '10px';
    
    // Рисуем график на canvas
    drawBMIChart(bmi);
}

function clearBMI() {
    const weight = document.getElementById('weight');
    const height = document.getElementById('height');
    if (weight) weight.value = '';
    if (height) height.value = '';
    
    const resultDiv = document.getElementById('bmi-result');
    const recDiv = document.getElementById('bmi-recommendation');
    if (resultDiv) resultDiv.innerHTML = '';
    if (recDiv) recDiv.innerHTML = '';
}

function drawBMIChart(bmi) {
    const canvas = document.getElementById('bmi-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Рисуем шкалу ИМТ
    const width = canvas.width;
    const height = canvas.height;
    
    // Фон
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
    
    // Цветные зоны
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(0, 0, width * 0.16, height);
    ctx.fillStyle = '#ffaa44';
    ctx.fillRect(width * 0.16, 0, width * 0.09, height);
    ctx.fillStyle = '#44aa44';
    ctx.fillRect(width * 0.25, 0, width * 0.25, height);
    ctx.fillStyle = '#ffaa44';
    ctx.fillRect(width * 0.50, 0, width * 0.15, height);
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(width * 0.65, 0, width * 0.35, height);
    
    // Позиция маркера BMI
    let markerX = (bmi / 45) * width;
    if (markerX > width) markerX = width - 10;
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(markerX, 0);
    ctx.lineTo(markerX - 10, 15);
    ctx.lineTo(markerX + 10, 15);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText(bmi.toFixed(1), markerX - 15, 28);
}

// ===== СПИСОК ТРЕНИРОВОК (TODOLIST) =====
let tasks = JSON.parse(localStorage.getItem('sportshop_tasks')) || [];

function saveTasks() {
    localStorage.setItem('sportshop_tasks', JSON.stringify(tasks));
    renderTasks();
}

function addTask() {
    const input = document.getElementById('task-input');
    const priority = document.getElementById('priority-select');
    
    if (!input || !priority) return;
    
    const title = input.value.trim();
    if (title === '') {
        alert('Введите название тренировки!');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        title: title,
        completed: false,
        priority: priority.value
    };
    
    tasks.push(newTask);
    saveTasks();
    input.value = '';
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
}

function toggleTask(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
    }
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    const taskCountSpan = document.getElementById('task-count');
    const completedCountSpan = document.getElementById('completed-count');
    
    if (!taskList) return;
    
    let html = '';
    let completedCount = 0;
    
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (task.completed) completedCount++;
        
        let priorityClass = '';
        let priorityText = '';
        
        if (task.priority === 'high') {
            priorityClass = 'priority-high';
            priorityText = 'Высокий';
        } else if (task.priority === 'medium') {
            priorityClass = 'priority-medium';
            priorityText = 'Средний';
        } else {
            priorityClass = 'priority-low';
            priorityText = 'Низкий';
        }
        
        html += `
            <li class="${task.completed ? 'completed' : ''}">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
                <span>${task.title}</span>
                <span class="task-priority ${priorityClass}">${priorityText}</span>
                <button onclick="deleteTask(${task.id})">❌</button>
            </li>
        `;
    }
    
    if (tasks.length === 0) {
        html = '<li style="text-align:center;">Нет задач. Добавьте первую тренировку!</li>';
    }
    
    taskList.innerHTML = html;
    if (taskCountSpan) taskCountSpan.innerText = tasks.length;
    if (completedCountSpan) completedCountSpan.innerText = completedCount;
}

// ===== ФОРМА ОБРАТНОЙ СВЯЗИ =====
function sendFeedback(event) {
    if (event) event.preventDefault();
    
    const name = document.getElementById('fb-name');
    const email = document.getElementById('fb-email');
    const subject = document.getElementById('fb-subject');
    const message = document.getElementById('fb-message');
    
    if (name && email && subject && message) {
        if (name.value && email.value && subject.value && message.value) {
            alert(`Спасибо, ${name.value}! Ваше сообщение отправлено.`);
            name.value = '';
            email.value = '';
            subject.value = '';
            message.value = '';
        } else {
            alert('Пожалуйста, заполните все поля!');
        }
    }
}

// ===== ОФОРМЛЕНИЕ ЗАКАЗА =====
function submitOrder(event) {
    if (event) event.preventDefault();
    
    if (cart.length === 0) {
        alert('Корзина пуста! Добавьте товары перед оформлением заказа.');
        return false;
    }
    
    alert('✅ Заказ оформлен! Наш менеджер свяжется с вами в ближайшее время.');
    cart = [];
    saveCart();
    window.location.href = 'index.html';
    return false;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    loadCatalog();
    renderTasks();
    
    // Обработчики форм
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.onsubmit = submitOrder;
    }
    
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.onsubmit = sendFeedback;
    }
});