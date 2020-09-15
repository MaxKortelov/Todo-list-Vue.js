Vue.component('add-todo', { //Компонент Список - используется для списка Todo-List на главной странице
        template: '\
    <li>\
      <b>{{ title }}</b>\
      <ul>\
      <li class="taskList" v-for="(el, index) in subtitle" v-bind:value="index">\
      {{ el }}\
      </li>\
      </ul>\
    <div class="align">\
    <button class="btnremove" v-on:click="$emit(\'change\')"> Изменить </button>\
    <button class="btnremove" v-on:click="$emit(\'remove\')"> Удалить </button>\
    </div>\
    </li>\
  ',
        props: ['title', 'subtitle', 'display']
    });

Vue.component('confirmation', { //Компонент Окно подтверждения
        template: '\
    <div class="blackBackground">\
    <div class="confWindow">\
    <p>Вы уверены?</p>\
    <div class="buttonsYN">\
    <button v-on:click="$emit(\'yes\')">Да</button>\
    <button v-on:click="$emit(\'no\')">Нет</button>\
    </div>\
    </div>\
    </div>\
  ',
        props: ['ask']
    });

var App = new Vue({
    el: '#bodypage',
    data: {
        // Параметры для главного меню
        page: 1,
        todoList: [],
        param: '', data: '',
        arrTemp: [],
        tempSaveArr: [],
        virtualTempStorage: [],
        idChanger: 0,
        // Параметры для редактора заметок
        name: '', task: '', list: [], idTodo: '',
        doneList: [], buttonCheck: 0,
    },
    methods: {
        choosePage: function (n) { // Смена Главной страницы и Страницы редактирования заметки
            this.page = n;
            this.idChanger = 0;
            this.virtualTempStorage = [];
        },
        confirmationF: function (index, prop) { // Вывод окна подтверждения
            this.data = index;
            document.querySelector('.blackBackground').style.display = 'flex';
            this.buttonCheck = prop;
        },
        yesFunc: function () { // Действия окна подтверждения в случае ответа "Да"
            if (this.page == 1) {
                this.deleteTodo();
            } else {
                if (this.buttonCheck == 'clearList') {
                    this.name = '';
                    this.list = [];
                    this.task = '';
                    this.doneList = [];
                } else if (this.buttonCheck == 'clearTodo') {
                    this.list.splice(this.data, 1);
                    this.doneList.splice(this.doneList.indexOf(this.data), 1);
                }
                document.querySelector('.blackBackground').style.display = 'none';
            }
        },
        deleteTodo: function () { // Удаление элемента списка
            this.todoList.splice(this.data, 1);
            this.data = '';
            document.querySelector('.blackBackground').style.display = 'none';
        },
        cancelFunc: function () { // Если ответ "Нет"
            document.querySelector('.blackBackground').style.display = 'none';
        },
        addItem: function () { // В окне редактирования - добавить задание
            if (this.task != '') {
                this.list.push(this.task);
                this.task = '';
            }
        },
        addNewTodo: function () { // Создать или Сохранить список задач и добавить в Главное меню
            if (this.name != '' || this.list.length > 0) {
                this.todoList.push({
                    id: this.idTodo++,
                    title: this.name,
                    todos: this.list,
                    todosShown: [this.list[0], this.list[1], this.list[2]],
                    doneTodos: this.doneList,
                });
                if (this.virtualTempStorage.length != 0) {
                    this.idChanger = 1;
                    this.virtualTempStorage.push(JSON.stringify(this.todoList[this.todoList.length - 1]));
                }
                this.name = '';
                this.list = [];
                this.doneList = [];
                this.page = 1;
            }
        },
        changeFunc: function (index) { // Редактирование существующего элемента списка Todo
            this.task = this.list[index];
            this.list.splice(index, 1);
            this.doneList.splice(this.doneList.indexOf(index), 1);
        },
        newTodo: function () { // Создание новой заметки
            this.page = 2;
            this.name = '';
            this.list = [];
            this.virtualTempStorage = [];
            this.idChanger = 0;
        },
        changeTodoList: function (index) { // Изменение Существующей заметки заметки
            this.virtualTempStorage = [];
            this.virtualTempStorage.push(JSON.stringify(this.todoList[index]));
            this.page = 2;
            this.data = index;
            this.name = this.todoList[index].title;
            this.list = this.todoList[index].todos;
            this.doneList = this.todoList[index].doneTodos;
            this.todoList.splice(index, 1);
        },
        FuncTask: function () { // Определение отмеченных заметок
            this.doneList = [];
            var arrTemp = [];
            document.querySelectorAll('.chbx').forEach(function (item, index) {
                if (item.checked) {
                    arrTemp.push(index);
                }
            });
            this.doneList = arrTemp;
            this.textDecor(this.tempSaveArr, '.todoName', this.doneList, '.taskList');
        },
        textDecor: function (arrT, select1, arr, select2) { // Вычеркивание отмеченных заметок на Главной странице и странице редактирования заметки
            if (this.page == 1) {
                document.querySelectorAll(select1).forEach(function () {
                    document.querySelectorAll(select2).forEach(function (it) {
                        it.style.textDecoration = 'none';
                    });
                });

                document.querySelectorAll(select1).forEach(function (item, index) {
                    for (var i = 0; i < arrT[index].length; i++) {
                        if (arrT[index][i] > 2) break;
                        item.querySelectorAll(select2)[arrT[index][i]].style.textDecoration = 'line-through';
                    }
                });
            } else if (this.page == 2) {
                document.querySelectorAll(select2).forEach(function (item) {
                    item.style.textDecoration = 'none';
                });

                arr.map((el) => {
                    document.querySelectorAll(select2)[el].style.textDecoration = 'line-through';
                });
            }
        },
        saveDataFunc: function () { // Хранение выполненых заданий
            var arrTemp = [];
            this.todoList.forEach(function (item, index, arr) {
                arrTemp.push(arr[index].doneTodos);
            });
            this.tempSaveArr = arrTemp;
        },
        eventChanger: function (id) { // Возмжность откатить изменения заметки в Главном меню
            if (id == 1) {
                this.idChanger = 2;
                this.todoList.pop();
                this.todoList.push(JSON.parse(this.virtualTempStorage[0]));
            } else if (id == 2) {
                this.idChanger = 1;
                this.todoList.pop();
                this.todoList.push(JSON.parse(this.virtualTempStorage[1]));
            }
        }
    },
    watch: {
        todoList: function () {
            localStorage.setItem(1, JSON.stringify(this.todoList));
            this.saveDataFunc();
        },
    },
    beforeMount: function () {
        this.todoList = JSON.parse(localStorage.getItem(1));
        if (this.todoList == null || this.todoList.length == 0) {
            this.todoList = [{
                id: 1,
                title: 'Пример Todo-List',
                todos: ['Задача1', 'Задача2', 'Задача3', 'Задача4', 'Задача5'],
                todosShown: ['Задача1', 'Задача2', 'Задача3'],
                doneTodos: [2],
            },];
        }
        this.idTodo = this.todoList.length + 1;
    },
    mounted: function () {
        this.saveDataFunc();
        this.textDecor(this.tempSaveArr, '.todoName', this.doneList, '.taskList');
    },
    updated: function () {
        this.textDecor(this.tempSaveArr, '.todoName', this.doneList, '.taskList');
    }
});

function myFunc(x) {
   return function(y) {
        Math.pow(x, y);
    }
}

console.log(myFunc(3)(2));

