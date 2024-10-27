class Todo {
    constructor() {
        this.tasks = [];
        this.filteredTerm = '';
        this.taskListElement = document.getElementById('myUL');
        this.taskInput = document.getElementById('task-input');
        this.taskDeadline = document.getElementById('task-deadline');
        this.addTaskButton = document.getElementById('add-task-button');
        this.searchInput = document.getElementById('myInput');

        this.loadTasks();
        this.addEventListeners();
    }

    addEventListeners() {
        this.addTaskButton.addEventListener('click', () => this.addTask());
        this.searchInput.addEventListener('input', () => this.searchTasks());
        document.addEventListener('DOMContentLoaded', () => this.loadTasks());
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        const deadline = this.taskDeadline.value;

        // Walidacja
        if (taskText.length < 3 || taskText.length > 255) {
            alert('Zadanie musi mieć od 3 do 255 znaków.');
            return;
        }

        if (deadline && new Date(deadline) < new Date()) {
            alert('Data musi być w przyszłości.');
            return;
        }

        this.tasks.push({ text: taskText, deadline: deadline });
        this.saveTasks();
        this.draw();
        this.taskInput.value = '';
        this.taskDeadline.value = '';
    }

    draw() {
        this.taskListElement.innerHTML = '';
        const filteredTasks = this.getFilteredTasks();

        filteredTasks.forEach((task, index) => {
            const taskItem = this.createTaskElement(task, index);
            this.taskListElement.appendChild(taskItem);
        });
    }

    createTaskElement(task, index) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');

        // Dodanie podświetlenia wyszukiwanej frazy
        const textSpan = document.createElement('span');
        textSpan.innerHTML = this.highlightTerm(task.text); // Podświetlenie
        textSpan.classList.add('task-text'); // Dodałem klasę do stylowania

        const deadlineSpan = document.createElement('span');
        deadlineSpan.textContent = task.deadline ? ` - do: ${new Date(task.deadline).toLocaleString()}` : '';
        deadlineSpan.classList.add('deadline');

        taskItem.appendChild(textSpan);
        taskItem.appendChild(deadlineSpan);

        // Dodanie przycisku usuwania
        const deleteButton = this.createDeleteButton(index);
        taskItem.appendChild(deleteButton);

        // Dodanie edycji zadania po kliknięciu
        taskItem.addEventListener('click', (event) => {
            if (event.target !== deleteButton) {
                this.editTask(taskItem, index);
            }
        });

        return taskItem;
    }

    highlightTerm(text) {
        if (this.filteredTerm.length < 2) {
            return text; // Zwróć oryginalny tekst, jeśli fraza jest za krótka
        }
        const regex = new RegExp(`(${this.filteredTerm})`, 'gi'); // Stworzenie wyrażenia regularnego do podświetlenia
        return text.replace(regex, '<mark>$1</mark>'); // Zastąpienie frazy znacznikiem <mark>
    }

    createDeleteButton(index) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Usuń';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = (event) => {
            event.stopPropagation(); // Zapobiega propagacji kliknięcia
            this.tasks.splice(index, 1);
            this.saveTasks();
            this.draw();
        };
        return deleteButton;
    }

    editTask(taskItem, index) {
        const task = this.tasks[index];
        const oldText = task.text;
        const oldDeadline = task.deadline;

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.value = oldText;
        textInput.classList.add('edit-input');

        const dateInput = document.createElement('input');
        dateInput.type = 'datetime-local';
        dateInput.value = oldDeadline || '';
        dateInput.classList.add('edit-date');

        taskItem.innerHTML = ''; // Wyczyść zawartość elementu li
        taskItem.appendChild(textInput);
        taskItem.appendChild(dateInput);
        textInput.focus();

        // Funkcja, która zapisuje zmiany
        const saveChanges = () => {
            const newText = textInput.value.trim();
            const newDeadline = dateInput.value;

            // Walidacja tekstu
            if (newText.length < 3 || newText.length > 255) {
                alert('Zadanie musi mieć od 3 do 255 znaków.');
                taskItem.innerHTML = `${oldText} ${oldDeadline ? `- do: ${new Date(oldDeadline).toLocaleString()}` : ''}`;
                taskItem.appendChild(this.createDeleteButton(index));
            } else {
                // Aktualizacja zadania
                this.tasks[index] = { text: newText, deadline: newDeadline };
                this.saveTasks();
                this.draw();
            }
        };

        // Zapisz zmiany po utracie fokusu na polu tekstowym
        textInput.addEventListener('blur', saveChanges);
        dateInput.addEventListener('blur', saveChanges);
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const tasksFromStorage = JSON.parse(localStorage.getItem('tasks')) || [];
        this.tasks = tasksFromStorage.map(task => ({
            text: task.text,
            deadline: task.deadline
        }));
        this.draw();
    }

    searchTasks() {
        this.filteredTerm = this.searchInput.value.toLowerCase();
        this.draw();
    }

    getFilteredTasks() {
        if (this.filteredTerm.length < 2) {
            return this.tasks;
        }
        return this.tasks.filter(task => task.text.toLowerCase().includes(this.filteredTerm));
    }
}

// Inicjalizacja aplikacji
const todoApp = new Todo();
