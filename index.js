let items = [
    "Сделать проектную работу",
    "Полить цветы",
    "Пройти туториал по Реакту",
    "Сделать фронт для своего проекта",
    "Прогуляться по улице в солнечный день",
    "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        return JSON.parse(savedTasks);
    }
    return items;
}

function updateStorage() {
    const currentTasks = getTasksFromDOM();
    saveTasks(currentTasks);
    return currentTasks;
}

function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createItem(item) {
    const template = document.getElementById("to-do__item-template");
    const clone = template.content.querySelector(".to-do__item").cloneNode(true);
    const textElement = clone.querySelector(".to-do__item-text");
    const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
    const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
    const editButton = clone.querySelector(".to-do__item-button_type_edit");

    textElement.textContent = item;

    deleteButton.addEventListener('click', function () {
        clone.remove();
        updateStorage()
    });

    duplicateButton.addEventListener('click', function () {
        const itemName = textElement.textContent;
        const newItem = createItem(itemName);
        listElement.prepend(newItem);

        updateStorage()
    });

    editButton.addEventListener('click', function () {
        textElement.setAttribute('contenteditable', 'true');
        textElement.focus();

        const range = document.createRange();
        range.selectNodeContents(textElement);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    });

    textElement.addEventListener('blur', function () {
        textElement.setAttribute('contenteditable', 'false');
        updateStorage()
    });

    return clone;
}

function getTasksFromDOM() {
    const tasks = [];

    const itemElements = listElement.querySelectorAll('.to-do__item-text');

    itemElements.forEach(function (element) {
        tasks.push(element.textContent);
    });

    return tasks;
}

items = loadTasks();
items.forEach(function (item) {
    const newItem = createItem(item);
    listElement.append(newItem);
});

formElement.addEventListener('submit', function (event) {
    event.preventDefault();

    const taskText = inputElement.value.trim();

    if (taskText) {
        const newItem = createItem(taskText);
        listElement.prepend(newItem);

        items = updateStorage();

        inputElement.value = '';
    }
});