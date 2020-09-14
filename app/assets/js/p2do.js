module.exports = {
  getTodos,
  saveTodo,
  updateTodoPriority,
  deleteTodo,
  addTodoReminderDate,
  addTodoReminderTime,
  resetTodoReminder,
  saveFullTodo
};

function getTodos() {

  document.getElementById("todos-table-body").innerHTML = "";

  let iTRs = 0;

  let todoPriority = ``;

  todosDB.find({}).sort({ _priority: -1 }).exec(function (err, docs) {
    docs.forEach(function(d) {

      switch (d._priority) {
        case 1:
          todoPriority = `
          <div class="uk-inline">
            <span class="uk-label uk-label-success uk-border-circle priopoint uk-margin-small-top">&nbsp;</span>
            <div uk-dropdown="pos: top-right">
              <ul class="uk-nav uk-dropdown-nav">
                <li class="uk-nav-header">` + i18n.__('priority') + `</li>
                <li><a onclick="p2DoJS.updateTodoPriority(` + d._id + `, '3');"><span class="uk-label uk-label-danger uk-border-circle priopoint"></span> ` + i18n.__('high') + ` </a></li>
                <li><a onclick="p2DoJS.updateTodoPriority(` + d._id + `, '2');"><span class="uk-label uk-label-warning uk-border-circle priopoint"></span> ` + i18n.__('medium') + ` </a></li>
                <li class="uk-active"><a onclick="p2DoJS.updateTodoPriority(` + d._id + `, '1');"><span class="uk-label uk-label-success uk-border-circle priopoint"></span> ` + i18n.__('low') + ` </a></li>
              </ul>
            </div>
          </div>`;
          break;
        case 2:
        todoPriority = `
        <div class="uk-inline">
          <span class="uk-label uk-label-warning uk-border-circle priopoint uk-margin-small-top">&nbsp;</span>
          <div uk-dropdown="pos: top-right">
            <ul class="uk-nav uk-dropdown-nav">
              <li class="uk-nav-header">` + i18n.__('priority') + `</li>
              <li ><a onclick="p2DoJS.updateTodoPriority(` + d._id + `, '3');"><span class="uk-label uk-label-danger uk-border-circle priopoint"></span> ` + i18n.__('high') + ` </a></li>
              <li class="uk-active"><a onclick="p2DoJS.updateTodoPriority(` + d._id + `, '2');"><span class="uk-label uk-label-warning uk-border-circle priopoint"></span> ` + i18n.__('medium') + ` </a></li>
              <li><a onclick="p2DoJS.updateTodoPriority(` + d._id + `, '1');"><span class="uk-label uk-label-success uk-border-circle priopoint"></span> ` + i18n.__('low') + ` </a></li>
            </ul>
          </div>
        </div>`;
          break;
        case 3:
        todoPriority = `
        <div class="uk-inline">
          <span class="uk-label uk-label-danger uk-border-circle priopoint uk-margin-small-top">&nbsp;</span>
          <div uk-dropdown="pos: top-right">
            <ul class="uk-nav uk-dropdown-nav">
              <li class="uk-nav-header">` + i18n.__('priority') + `</li>
              <li class="uk-active"><a onclick="p2DoJS.updateTodoPriority(` + d._id + `, '3');"><span class="uk-label uk-label-danger uk-border-circle priopoint"></span> ` + i18n.__('high') + ` </a></li>
              <li><a onclick="p2DoJS.updateTodoPriority(` + d._id + `, '2');"><span class="uk-label uk-label-warning uk-border-circle priopoint"></span> ` + i18n.__('medium') + ` </a></li>
              <li><a onclick="p2DoJS.updateTodoPriority(` + d._id + `, '1');"><span class="uk-label uk-label-success uk-border-circle priopoint"></span> ` + i18n.__('low') + ` </a></li>
            </ul>
          </div>
        </div>`;
          break;
      }

      let reminderIconColor = " todo-reminder-on";
      let reminderDateValue = "";
      let reminderTimeValue = "";
      if (d._reminderDate === "" && d._reminderTime === "") {
        reminderIconColor = "";
      } else {
        reminderDateValue = d._reminderDate;
        reminderTimeValue = d._reminderTime;

        let srDateArr = d._reminderDate.split("-");
        let srTimeArr = d._reminderTime.split(":");

        let srDateYear = srDateArr[0];
        let srDateMonth = srDateArr[1];
        let srDateDay = srDateArr[2];

        let srTimeHour = srTimeArr[0];
        let srTimeMinutes = srTimeArr[1];

        let settedReminderDateTime = new Date(srDateYear, parseInt(srDateMonth) - 1, srDateDay, srTimeHour, srTimeMinutes);
        let settedReminderTime = settedReminderDateTime.getTime();
        let settedReminderObj = { id: d._id, time: settedReminderTime, todo: d._todo }
        settedReminders.push(settedReminderObj);
      }

      let todoTR = `
      <tr id="todo-tr-` + d._id + `">
        <td class="uk-table-expand">
          <input id="todo-text-` + d._id + `" type="text" class="uk-input" onblur="p2DoJS.saveTodo(this.value, ` + d._id + `);" value="` + d._todo + `">
        </td>
        <td class="uk-table-shrink">` + todoPriority + `</td>
        <td class="uk-table-shrink">
          <div class="uk-inline">
            <span class="priopoint">
              <span class="todo-reminder-icon` + reminderIconColor + ` uk-margin-small-top" uk-icon="warning">
            </span>
            <div uk-dropdown="pos: top-right">
              <ul class="uk-nav uk-dropdown-nav">
                <li class="uk-nav-header">` + i18n.__('reminder') + `</li>
                <li><input type="date" class="uk-input" onblur="p2DoJS.addTodoReminderDate(` + d._id + `, this.value);" value="` + reminderDateValue + `"></li>
                <li><input type="time" class="uk-input" onblur="p2DoJS.addTodoReminderTime(` + d._id + `, this.value);" value="` + reminderTimeValue + `"></li>
              </ul>
            </div>
          </div>
        </td>
        <td class="uk-table-shrink">
          <input id="todo-finishd-cb-` + d._id + `" type="checkbox" class="uk-checkbox uk-margin-small-top" onclick="p2DoJS.deleteTodo(` + d._id + `);">
        </td>
      </tr>`;

      document.getElementById("todos-table-body").innerHTML += todoTR;

      iTRs++;

    });

    if (iTRs < 10) {

      todoPriority = `
      <div class="uk-inline">
        <span class="uk-label uk-label-warning uk-border-circle priopoint uk-margin-small-top">&nbsp;</span>
        <div uk-dropdown="pos: top-right">
          <ul class="uk-nav uk-dropdown-nav">
            <li class="uk-nav-header">` + i18n.__('priority') + `</li>
            <li ><a onclick="p2DoJS.saveTodoPriority(todoid, '3');"><span class="uk-label uk-label-danger uk-border-circle priopoint"></span> ` + i18n.__('high') + ` </a></li>
            <li><a onclick="p2DoJS.saveTodoPriority(todoid, '2');"><span class="uk-label uk-label-warning uk-border-circle priopoint"></span> ` + i18n.__('medium') + ` </a></li>
            <li><a onclick="p2DoJS.saveTodoPriority(todoid, '1');"><span class="uk-label uk-label-success uk-border-circle priopoint"></span> ` + i18n.__('low') + ` </a></li>
          </ul>
        </div>
      </div>`;

      let todoEmptyTR = `
      <tr>
        <td class="uk-table-expand">
          <input type="text" class="uk-input" onblur="p2DoJS.saveTodo(this.value);">
        </td>
        <td class="uk-table-shrink">` + todoPriority + `</td>
        <td class="uk-table-shrink">
          <div class="uk-inline">
            <span class="priopoint">
              <span class="todo-reminder-icon uk-margin-small-top" uk-icon="warning">
            </span>
            <div uk-dropdown="pos: top-right">
              <ul class="uk-nav uk-dropdown-nav">
                <li class="uk-nav-header">` + i18n.__('reminder') + `</li>
                <li><input type="date" class="uk-input"></li>
                <li><input type="time" class="uk-input"></li>
              </ul>
            </div>
          </div>
        </td>
        <td class="uk-table-shrink">
          <input type="checkbox" class="uk-checkbox uk-margin-small-top">
        </td>
      </tr>`;

      for (iTRs;iTRs<10;iTRs++) {
        document.getElementById("todos-table-body").innerHTML += todoEmptyTR;
      }

    }

  });

}
getTodos();

function saveTodo(todo, todoid) {

  if (todo !== '') {

    if (todoid !== undefined && todoid !== null) {

      todosDB.update({ _id: todoid }, { $set: { _todo: todo } }, function (err, numReplaced) {

      });

    } else {

      todosDB.find({}).sort({ _id: -1 }).limit(1).exec(function (err, docs) {

        let newid = 0;

        docs.forEach(function(doc) { newid = doc._id + 1; });

        if (newid === 0) { newid = 1; }

        let newtodoArr = [];

        let newtodoObj = {
          _id: newid,
          _todo: todo,
          _priority: 2,
          _reminderDate: '',
          _reminderTime: ''
        };

        newtodoArr.push(newtodoObj);

        todosDB.insert(newtodoArr, function(err, docs) {
          setTimeout( () => { getTodos(); }, 1500);
        });

      });

    }

  }

}

function updateTodoPriority(todoid, todopriority) {

  todosDB.update({ _id: todoid }, { $set: { _priority: parseInt(todopriority) } }, function (err, numReplaced) {
    getTodos();
  });

}

function deleteTodo(todoid) {

  let todoCB = document.getElementById('todo-finishd-cb-' + todoid);

  if (todoCB.checked) {

    todosDB.remove({ _id: todoid }, function(err, numDeleted) {

      document.getElementById('todo-tr-' + todoid).classList.add("uk-animation-scale-up", "uk-animation-reverse");
      setTimeout( () => { getTodos(); }, 500);

    });

  }

}

function addTodoReminderDate(todoid, reminderDate) {

  todosDB.update({ _id: todoid }, { $set: { _reminderDate: reminderDate } }, function (err, numReplaced) {
    // getTodos();
  });

}

function addTodoReminderTime(todoid, reminderTime) {

  todosDB.update({ _id: todoid }, { $set: { _reminderTime: reminderTime } }, function (err, numReplaced) {
    setTimeout( () => { getTodos(); }, 1000);
  });

}

function resetTodoReminder(todoid) {

  todosDB.update({ _id: todoid }, { $set: { _reminderDate: '', _reminderTime: '' } }, function (err, numReplaced) {
    setTimeout( () => { getTodos(); }, 1000);
  });

}

function saveFullTodo() {

  if (document.getElementById('add-new-todo-input').value !== '') {

    let todoText = document.getElementById('add-new-todo-input').value;
    let todoPrioritySelect = document.getElementById('add-new-todo-priority');
    let todoPriority = todoPrioritySelect.options[todoPrioritySelect.selectedIndex].value;
    let todoReminderDate = document.getElementById('add-new-todo-reminder-date').value;
    let todoReminderTime = document.getElementById('add-new-todo-reminder-time').value;

    todosDB.find({}).sort({ _id: -1 }).limit(1).exec(function (err, docs) {

      let newid = 0;

      docs.forEach(function(doc) { newid = doc._id + 1; });

      if (newid === 0) { newid = 1; }

      let newtodoArr = [];

      let newtodoObj = {
        _id: newid,
        _todo: todoText,
        _priority: parseInt(todoPriority),
        _reminderDate: todoReminderDate,
        _reminderTime: todoReminderTime
      };

      newtodoArr.push(newtodoObj);

      todosDB.insert(newtodoArr, function(err, docs) {

        document.getElementById('add-new-todo-input').value = '';
        document.getElementById('add-new-todo-priority').selectedIndex = 1;
        document.getElementById('add-new-todo-reminder-date').value = '';
        document.getElementById('add-new-todo-reminder-time').value = '';

        getTodos();

      });

    });

  }
}
