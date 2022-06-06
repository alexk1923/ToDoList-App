/*jshint esversion: 6 */

const statusLabels = document.querySelectorAll(".status label");
let noItems = document.querySelectorAll(".item-card").length;
const counter = document.querySelector('label.items-counter');
const inputTask = document.querySelector("input#add-input");
let showStatus = "All";
let tasksList = [];

// get all items from local storage
function initTasks() {
	let tasks = JSON.parse(localStorage.getItem("tasks"));
	if (tasks) {
		tasks.forEach(task => {

			const newLi = document.createElement("li");
			newLi.classList.add("item-card");
			newLi.setAttribute('data-id', ++noItems);
			const i1 = document.createElement("i");

			const label = document.createElement("label");
			label.classList.add("task-label");
			label.textContent = task.text;

			if (task.status == "active") {
				i1.classList.add("fa-regular", "circle", "fa-circle");
			} else {
				label.classList.add("completed");
				i1.classList.add("fa-regular", "circle", "fa-circle-check");
			}

			const xMark = document.createElement("i");
			xMark.classList.add("fa-solid", "fa-xmark", "xmark");

			newLi.appendChild(i1);
			newLi.appendChild(label);
			newLi.appendChild(xMark);

			i1.setAttribute('onClick', "toggleTaskStatus(event)");
			label.setAttribute("ondblclick", "changeTaskToInput(event)");
			xMark.setAttribute('onClick', "removeTask(event)");


			document.querySelector("ul.items").appendChild(newLi);
			setRemainingTasks(noItems);

			tasksList.push(task);

		});
	}
}

initTasks();

function setRemainingTasks(newNoItems) {
    // set new number of items
	noItems = newNoItems;

    // change text
	const index = counter.textContent.indexOf(':');
	counter.textContent = counter.textContent.slice(0, index + 2); // after ": "
	counter.textContent = counter.textContent.concat(newNoItems);
}


inputTask.addEventListener('keyup', (e) => {
	if (e.key == "Enter") {
		if (e.target.value == "") {
			window.alert("You need to enter at least one character!");
		} else {

            // create list item
			const newLi = document.createElement("li");
			newLi.classList.add("item-card");
			newLi.setAttribute('data-id', ++noItems);
			const i1 = document.createElement("i");
			i1.classList.add("fa-regular", "fa-circle", "circle");
            i1.setAttribute('onClick', "toggleTaskStatus(event)");

            // create label
			const label = document.createElement("label");
			label.classList.add("task-label");
			label.textContent = e.target.value;
            label.setAttribute("ondblclick", "changeTaskToInput(event)");

            // create x mark
			const xMark = document.createElement("i");
			xMark.classList.add("fa-solid", "fa-xmark", "xmark");
            xMark.setAttribute('onClick', "removeTask(event)");

            // append all in li component
			newLi.appendChild(i1);
			newLi.appendChild(label);
			newLi.appendChild(xMark);

            // clear input
			e.target.value = "";

            // add it into the list of tasks
			document.querySelector("ul.items").appendChild(newLi);
			setRemainingTasks(noItems);

            // update local storage and tasksList
			let new_json_task = {};
			new_json_task.text = label.textContent;
			new_json_task.status = "active";
			tasksList.push(new_json_task);
			localStorage.setItem("tasks", JSON.stringify(tasksList));

            // if a task is added when viewing only completed tasks
			if (showStatus == "completed") {
				showCompleted();
			}
		}
	}
});


function changeStatusJSON(modifiedLabel) {
	for (let i = 0; i < tasksList.length; i++) {
		const element = tasksList[i];
		if (element.text == modifiedLabel.textContent) {
			if (element.status == "active") {
				element.status = "completed";
			} else {
				element.status = "active";
			}
		}
	}

	localStorage.setItem("tasks", JSON.stringify(tasksList));
}


function toggleTaskStatus(e) {
	const modifiedLabel = e.target.nextElementSibling;
	modifiedLabel.classList.toggle("completed");
	e.target.classList.toggle("fa-circle-check");
	e.target.classList.toggle("fa-circle");

	changeStatusJSON(modifiedLabel);

	if (showStatus == "active") {
		showActive();
	}

	if (showStatus == "completed") {
		showCompleted();
	}

}

function removeTask(e) {
	if (e.target.style.display != "none") {
		e.target.parentElement.remove();
	}

	for (let i = 0; i < tasksList.length; i++) {
		const element = tasksList[i];
		if (element.text == e.target.previousSibling.textContent) {
			tasksList.splice(i, 1);
			break;
		}
	}

	localStorage.setItem("tasks", JSON.stringify(tasksList));
	console.log(localStorage);
	setRemainingTasks(noItems - 1);
}

function selectAllTasks() {
	const circles = document.querySelectorAll("i.circle");
	circles.forEach(circle => {
        // change circle type
		circle.classList.toggle("fa-circle-check");
		circle.classList.toggle("fa-circle");
		circle.nextElementSibling.classList.toggle("completed"); // mark each label as completed
	});

    // change status for all tasks
	tasksList.forEach(task => {
		if (task.status == "active") {
			task.status = "completed";
		} else {
			task.status = "active";
		}
	});
	localStorage.setItem("tasks", JSON.stringify(tasksList));
}

function clearCompleted() {
	const labels = document.querySelectorAll("label.completed");

    // delete each completed task
	labels.forEach(label => {
		label.parentElement.remove();

		for (let i = 0; i < tasksList.length; i++) {
			const element = tasksList[i];
			if (element.text == label.parentElement.textContent) {
				tasksList.splice(i, 1);
				break;
			}
		}

		localStorage.setItem("tasks", JSON.stringify(tasksList));
        noItems--;

	});

    // update remaining tasks
	setRemainingTasks(noItems);
}

function showAll() {
	const itemCards = document.querySelectorAll(".item-card");
	itemCards.forEach(itemCard => {
		itemCard.style.display = "flex";
	});
	showStatus = "All";
}

function showActive() {
	const itemCards = document.querySelectorAll(".item-card");
	itemCards.forEach(itemCard => {
		const label = itemCard.querySelector("label");
		itemCard.style.display = "flex";
		if (label.classList.contains("completed")) {
			itemCard.style.display = "none";
		}
	});
	showStatus = "active";
}

function showCompleted() {
	const itemCards = document.querySelectorAll(".item-card");
	itemCards.forEach(itemCard => {
		const label = itemCard.querySelector("label");
		itemCard.style.display = "flex";
		if (!label.classList.contains("completed")) {
			itemCard.style.display = "none";
		}
	});
	showStatus = "completed";
}

// select a view mode
statusLabels.forEach(statusLabel => statusLabel.addEventListener('click', (e) => {
	const activeLabel = document.querySelector(".selected-view");
	activeLabel.classList.remove("selected-view");
	e.target.classList.add("selected-view");
}));


function changeInputToTask(func, pos) {
	const label = document.createElement("label");
	label.classList.add("task-label");

	const input = document.querySelector(".task-input");
	label.textContent = input.value;
	label.setAttribute("ondblclick", "changeTaskToInput(event)");
	if (input.previousElementSibling.classList.contains("fa-circle-check")) {
		label.classList.add("completed");
	}

	input.parentElement.replaceChild(label, input);

    // remove click outside task event
	document.removeEventListener('click', func);

    // update local storage
	let new_json_task = {};
	new_json_task.text = label.textContent;
	if (label.classList.contains("completed")) {
		new_json_task.status = "completed";
	} else {
		new_json_task.status = "active";
	}

	tasksList.splice(pos, 0, new_json_task);
	localStorage.setItem("tasks", JSON.stringify(tasksList));
}

function resetInputToTask(func, event, pos) {
	const inputItem = document.querySelector(".task-input");
    
    // if click outside the input field
	if (!inputItem.contains(event.target)) {
		changeInputToTask(func, pos);
	}
}


function changeTaskToInput(e) {
	let oldPos = -1;
	for (let i = 0; i < tasksList.length; i++) {
		const element = tasksList[i];
		if (element.text == e.target.textContent) {
			tasksList.splice(i, 1);
			oldPos = i;
			break;
		}
	}

	localStorage.setItem("tasks", JSON.stringify(tasksList));

    // replace text with input field
	const newItem = document.createElement("input");
	newItem.type = "text";
	newItem.classList.add("task-input");
	console.log(e.target.textContent);
	newItem.value = e.target.textContent;

    // user pressed enter key
	newItem.addEventListener('keyup', (event) => {
		if (event.key == "Enter") {
			changeInputToTask(event);
		}
	});

    // click outside the task
    document.addEventListener('click', clickTaskReset);

    // select all text from input field
	e.target.parentElement.replaceChild(newItem, e.target);
	newItem.select();

	function clickTaskReset(e) {
		resetInputToTask(clickTaskReset, e, oldPos);
	}

}