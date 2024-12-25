//  =====TODO ====
//  Add loading spinner for tasks
//  Load Tasks in async fashion
// add delete functionality
// Drag and Drop

const state = {
	_isLoading: false,
	get IsLoading() {
		return this._isLoading;
	},
	set IsLoading(value) {
		if (this._isLoading !== value) {
			this._isLoading = value;
			OnLoadingChange(value);
		}
	},
};

// Enum Values
// const URGENT_IMPORTANT = 0;
// const IMPORTANT_NOT_URGENT = 1;
// const URGENT_NOT_IMPORTANT = 2;
// const NOT_URGENT_NOT_IMPORTANT = 3;

const Priority = Object.freeze({
	URGENT_IMPORTANT: 0,
	IMPORTANT_NOT_URGENT: 1,
	URGENT_NOT_IMPORTANT: 2,
	NOT_URGENT_NOT_IMPORTANT: 3,
});

const TaskActions = Object.freeze({
	ACTIVE: 0,
	DONE: 1,
	DELETE: 2,
});

state.IsLoading = true;

setTimeout(() => {
	state.IsLoading = false;
}, 1000);
// console.log("just wait");

document.addEventListener("DOMContentLoaded", () => {
	UIManager.InitializeFields();

	UIManager.TaskHandling();
	TaskManager.UpdateTaskNumbers();

	TaskManager.LoadTasks();
	TaskManager.initializeTaskControls();
	UIManager.DraggingAndDropping();
	//state.IsLoading = false;
});

class TaskManager {
	static UserTasks = [];
	static lastId = 0;
	static addTask(task) {
		task.id = this.lastId;
		this.lastId++;
		this.UserTasks.push(task);
	}
	static RemoveTask(id) {
		if (!this.isTaskExists(id)) {
			console.log("Task is not exists!");
			return;
		}
		this.DeleteTaskFromUI(id);
		let newTasks = this.UserTasks.filter((t) => t.id !== id);

		this.UserTasks = newTasks;
	}
	static DeleteTaskFromUI = (taskID) => {
		const task = document.querySelector(`.task-item[data-id="${taskID}"]`);
		task.remove();
	};
	static isTaskExists(id) {
		console.log(id);
		let check = this.UserTasks.filter((t) => t.id === id);
		return check.length === 1;
	}

	static calculateTotal(urgent, important) {
		let i = 0;
		this.UserTasks.map((t) => {
			if (t.important == important && t.urgent == urgent) {
				i++;
			}
		});

		return i;
	}

	static async LoadTasks() {
		this.UserTasks.map((task) => {
			this.AppendTaskToUI(task);
		});
	}

	static CreateDOMRepresentation(task) {
		const taskItem = document.createElement("div");
		taskItem.classList.add("task-item");
		taskItem.setAttribute("draggable", "true");
		taskItem.setAttribute("data-id", task.id);
		taskItem.setAttribute("data-state", "DO");

		const taskItemHeading = document.createElement("div");
		taskItemHeading.classList.add("task-item-heading");

		const heading = document.createElement("h5");
		heading.textContent = task.title;

		const taskItemControls = document.createElement("div");
		taskItemControls.classList.add("task-item-controls");

		// Done Button
		const doneButton = document.createElement("button");
		doneButton.title = "Done";
		doneButton.classList.add("done-button");

		const doneIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		doneIcon.setAttribute("width", "15");
		doneIcon.setAttribute("height", "15");
		doneIcon.setAttribute("fill", "none");
		doneIcon.setAttribute("viewBox", "0 0 15 15");
		doneIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");

		const doneIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
		doneIconPath.setAttribute("d", "M3.125 8.125L5.625 10.625L11.875 4.375");

		doneIconPath.setAttribute("stroke", "#243757");
		doneIconPath.setAttribute("stroke-width", "2");
		doneIconPath.setAttribute("stroke-linecap", "round");
		doneIconPath.setAttribute("stroke-linejoin", "round");

		doneIcon.appendChild(doneIconPath);
		doneButton.appendChild(doneIcon);

		const undoIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		undoIcon.setAttribute("width", "24");
		undoIcon.setAttribute("height", "24");
		undoIcon.setAttribute("fill", "none");
		undoIcon.setAttribute("viewBox", "0 0 24 24");
		undoIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");

		const undoIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
		undoIconPath.setAttribute("d", "M3 10H13C17.4183 10 21 13.5817 21 18V20M3 10L9 16M3 10L9 4");

		undoIconPath.setAttribute("stroke", "#111827");
		undoIconPath.setAttribute("stroke-width", "2");
		undoIconPath.setAttribute("stroke-linecap", "round");
		undoIconPath.setAttribute("stroke-linejoin", "round");

		undoIcon.appendChild(undoIconPath);

		doneButton.appendChild(undoIcon);

		taskItemControls.appendChild(doneButton);

		// Delete Button
		const deleteButton = document.createElement("button");
		deleteButton.title = "Delete";
		deleteButton.classList.add("delete-button");

		const deleteIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		deleteIcon.setAttribute("width", "15");
		deleteIcon.setAttribute("height", "15");
		deleteIcon.setAttribute("fill", "none");
		deleteIcon.setAttribute("viewBox", "0 0 15 15");
		deleteIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");

		const deleteIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
		deleteIconPath.setAttribute(
			"d",
			"M11.875 4.375L11.3329 11.9641C11.2862 12.6182 10.7419 13.125 10.0861 13.125H4.9139C4.2581 13.125 3.7138 12.6182 3.66708 11.9641L3.125 4.375M6.25 6.875V10.625M8.75 6.875V10.625M9.375 4.375V2.5C9.375 2.15482 9.09518 1.875 8.75 1.875H6.25C5.90482 1.875 5.625 2.15482 5.625 2.5V4.375M2.5 4.375H12.5"
		);

		deleteIconPath.setAttribute("stroke", "#354764");
		deleteIconPath.setAttribute("stroke-width", "1");
		deleteIconPath.setAttribute("stroke-linecap", "round");
		deleteIconPath.setAttribute("stroke-linejoin", "round");
		deleteIcon.appendChild(deleteIconPath);
		deleteButton.appendChild(deleteIcon);

		taskItemControls.appendChild(deleteButton);

		taskItemHeading.appendChild(heading);
		taskItemHeading.appendChild(taskItemControls);

		taskItem.appendChild(taskItemHeading);

		// Task Item Body
		const taskItemBody = document.createElement("div");
		taskItemBody.classList.add("task-item-body");

		const taskItembodyDueTo = document.createElement("div");
		taskItembodyDueTo.classList.add("task-item-body-due-to");

		// Due to  Data
		const calenderIconSpan = document.createElement("span");
		const calenderIconImage = document.createElement("img");
		calenderIconImage.setAttribute("src", "./src/assets/calendar.svg");
		calenderIconImage.setAttribute("alt", "Due To");
		calenderIconSpan.appendChild(calenderIconImage);
		taskItembodyDueTo.appendChild(calenderIconSpan);

		const calenderDateSpan = document.createElement("span");
		calenderDateSpan.classList.add("task-item-body-date");
		if (task.dueTo != "Due To") {
			calenderDateSpan.textContent = task.dueTo;
		} else {
			calenderDateSpan.textContent = "Forever";
		}
		taskItembodyDueTo.appendChild(calenderDateSpan);
		taskItemBody.appendChild(taskItembodyDueTo);

		// Tag Data
		const taskItemBodyTag = document.createElement("div");
		taskItemBodyTag.classList.add("task-item-body-tag");

		const tagIconSpan = document.createElement("span");
		const tagIconImage = document.createElement("img");
		tagIconImage.setAttribute("src", "./src/assets/tag.svg");
		tagIconImage.setAttribute("alt", "Tag");
		tagIconSpan.appendChild(tagIconImage);
		taskItemBodyTag.appendChild(tagIconSpan);

		const tagDataSpan = document.createElement("span");
		tagDataSpan.classList.add("task-item-body-tag");
		if (task.tag != "") {
			tagDataSpan.textContent = task.tag;
		} else {
			tagDataSpan.textContent = "-";
		}
		taskItemBodyTag.appendChild(tagDataSpan);
		taskItemBody.appendChild(taskItemBodyTag);

		taskItem.appendChild(taskItemBody);

		return taskItem;
	}

	static initializeTaskControls() {
		const quadrantsContainer = document.querySelector(".quadrants-container");
		quadrantsContainer.addEventListener("click", (e) => {
			const targetedElement = e.target;
			const taskDoneButton =
				targetedElement.classList.contains("done-button") ||
				targetedElement.parentElement.classList.contains("done-button") ||
				targetedElement.parentElement.parentElement.classList.contains("done-button");
			const taskDeleteButton =
				targetedElement.classList.contains("delete-button") ||
				targetedElement.parentElement.classList.contains("delete-button") ||
				targetedElement.parentElement.parentElement.classList.contains("delete-button");
			if (taskDoneButton) {
				const taskParent = targetedElement.closest(".task-item");
				let taskID = Number(taskParent.getAttribute("data-id"));

				if (taskParent.getAttribute("data-state") === "DO") {
					TaskManager.UpdateTask(taskID, TaskActions.DONE);
				} else {
					TaskManager.UpdateTask(taskID, TaskActions.ACTIVE);
				}
			}
			if (taskDeleteButton) {
				const taskParent = targetedElement.closest(".task-item");
				let taskID = Number(taskParent.getAttribute("data-id"));
				TaskManager.UpdateTask(taskID, TaskActions.DELETE);
			}
		});

		const getClickedDoneButtonElement = (e) => {};
	}

	static RenderTasks() {
		this.UserTasks.map((task) => {
			let IsTaskOnUI = document.querySelector(`.task-item[data-id="${task.id}"]`);
			if (IsTaskOnUI === null) {
				this.AppendTaskToUI(task);
				this.UpdateTaskNumbers();
			}
		});
	}
	static LoadTaskNumberForQuadrant() {}
	static AppendTaskToUI(task) {
		// Get Quadrants Task List
		const urgent_important_tasksContainer = document.querySelector(".important-urgent-quadrant .tasks");
		const important_not_urgent_tasksContainer = document.querySelector(".important-not-urgent-quadrant .tasks");
		const urgent_not_important_tasksContainer = document.querySelector(".urgent-not-important-quadrant .tasks");
		const not_urgent_not_important_tasksContainer = document.querySelector(".not-urgent-not-important-quadrant .tasks");

		// Create DOM Tree for Task
		let domRepresentation = this.CreateDOMRepresentation(task);
		switch (task.GetQuad()) {
			case Priority.URGENT_IMPORTANT:
				urgent_important_tasksContainer.appendChild(domRepresentation);
				break;
			case Priority.IMPORTANT_NOT_URGENT:
				important_not_urgent_tasksContainer.appendChild(domRepresentation);
				break;
			case Priority.URGENT_NOT_IMPORTANT:
				urgent_not_important_tasksContainer.appendChild(domRepresentation);
				break;
			case Priority.NOT_URGENT_NOT_IMPORTANT:
				not_urgent_not_important_tasksContainer.appendChild(domRepresentation);
				break;
			default:
				MessageBox.showError("Error setting a task dom to a container");
				break;
		}

		UIManager.DraggingAndDropping();
	}
	static UpdateTaskNumbers() {
		const urgentImportantTaskNumber = document.querySelector(".important-urgent-quadrant .tasks-number span");
		const ImportantNotUrgentTaskNumber = document.querySelector(".important-not-urgent-quadrant .tasks-number span");
		const urgentNotImportantTaskNumber = document.querySelector(".urgent-not-important-quadrant .tasks-number span");
		const notUrgentNotImportantTaskNumber = document.querySelector(".not-urgent-not-important-quadrant .tasks-number span");

		let u_i = TaskManager.calculateTotal(true, true);
		let i_not_u = TaskManager.calculateTotal(false, true);
		let u_not_i = TaskManager.calculateTotal(true, false);
		let not_u_not_i = TaskManager.calculateTotal(false, false);

		urgentImportantTaskNumber.textContent = `${u_i} ${u_i == 1 ? "Task" : "Tasks"}`;
		ImportantNotUrgentTaskNumber.textContent = `${i_not_u} ${i_not_u == 1 ? "Task" : "Tasks"}`;
		urgentNotImportantTaskNumber.textContent = `${u_not_i} ${u_not_i == 1 ? "Task" : "Tasks"}`;
		notUrgentNotImportantTaskNumber.textContent = `${not_u_not_i} ${not_u_not_i == 1 ? "Task" : "Tasks"}`;
	}

	static validateTask(task) {
		if (task.title == "" || task.title == " ") {
			MessageBox.showError("No Task has been provided!");
			const taskInput = document.querySelector(".task-input");
			taskInput.classList.add("error");
			return false;
		}

		return true;
	}

	static UpdateTask(taskId, action) {
		const task = this.UserTasks.filter((task) => task.id === taskId);
		switch (action) {
			case TaskActions.DONE:
				task.state = TaskActions.DONE;
				this.UpdateTaskOnUI(taskId, TaskActions.DONE);
				break;
			case TaskActions.DELETE:
				this.UpdateTaskOnUI(taskId, TaskActions.DELETE);

				break;
			case TaskActions.ACTIVE:
				task.state = TaskActions.ACTIVE;
				this.UpdateTaskOnUI(taskId, TaskActions.ACTIVE);
				break;
		}
	}

	static UpdateTaskOnUI(taskID, action) {
		const taskNode = document.querySelector(`.task-item[data-id="${taskID}"]`);
		if (taskNode) {
			switch (action) {
				case TaskActions.DONE:
					taskNode.setAttribute("data-state", "DONE");
					break;
				case TaskActions.ACTIVE:
					taskNode.setAttribute("data-state", "DO");
					break;
				case TaskActions.DELETE:
					this.RemoveTask(taskID);
					this.UpdateTaskNumbers();
					break;
			}
		}
	}

	static MoveTask(newContainer, taskID) {
		console.log(this.UserTasks);
		const task = this.UserTasks.find((t) => t.id === taskID);
		if (task) {
			if (newContainer.classList.contains("important-urgent-quadrant")) {
				task.important = true;
				task.urgent = true;
			} else if (newContainer.classList.contains("important-not-urgent-quadrant")) {
				task.important = true;
				task.urgent = false;
			} else if (newContainer.classList.contains("urgent-not-important-quadrant")) {
				task.important = false;
				task.urgent = true;
			} else if (newContainer.classList.contains("not-urgent-not-important-quadrant")) {
				task.important = false;
				task.urgent = false;
			}

			this.UserTasks = [...this.UserTasks.filter((t) => t.id !== taskID), task];
			TaskManager.UpdateTaskNumbers();
		}
	}
}

class UIManager {
	static InitializeFields() {
		// Task Input
		const taskInputField = document.querySelector(".task-input");

		const placeholder = document.querySelector(".text-input-placeholder");
		placeholder.addEventListener("click", () => {
			if (!placeholder.classList.contains("active")) {
				placeholder.classList.add("active");
				taskInputField.focus();
			}
		});
		taskInputField.addEventListener("change", (e) => {
			if (e.target.classList.contains("error")) {
				e.target.classList.remove("error");
			}

			if (e.target.value != "") {
				if (!placeholder.classList.contains("active")) {
					placeholder.classList.add("active");
					taskInputField.focus();
				}
			} else {
				if (placeholder.classList.contains("active")) {
					placeholder.classList.remove("active");
				}
			}
		});
		taskInputField.addEventListener("focus", (e) => {
			if (e.target.value != "") {
				if (!placeholder.classList.contains("active")) {
					placeholder.classList.add("active");
					taskInputField.focus();
				}
			} else {
				if (placeholder.classList.contains("active")) {
					placeholder.classList.remove("active");
				}
			}
		});

		// Date Picker
		const dueToInput = document.querySelector("input.due-to-input");
		dueToInput.addEventListener("change", (e) => {
			if (e.target.value != "") {
				let date = new Date(e.target.value);
				let formattedDate = new Intl.DateTimeFormat("en-GB", {
					dateStyle: "short",
					timeStyle: "short",
					hour12: true,
				}).format(date);

				const dateField = document.querySelector(".date-time-input-toggle-button p");
				dateField.textContent = formattedDate.toUpperCase();
				const dueToToggle = document.querySelector(".date-time-input-toggle");
				dueToToggle.style.width = "280px";
				dueToInput.setAttribute("data-value", formattedDate.toUpperCase());
			}
		});

		const urgentControl = document.querySelector(".red-toggle-button");
		urgentControl.addEventListener("click", () => {
			if (urgentControl.classList.contains("active")) {
				urgentControl.classList.remove("active");
			} else {
				urgentControl.classList.add("active");
			}
		});

		const importantControl = document.querySelector(".blue-toggle-button");
		importantControl.addEventListener("click", () => {
			if (importantControl.classList.contains("active")) {
				importantControl.classList.remove("active");
			} else {
				importantControl.classList.add("active");
			}
		});

		const tagControl = document.querySelector(".tag-control");
		const tagInput = document.querySelector(".tag-control .tag-input");
		tagInput.addEventListener("focus", () => {
			tagControl.style.borderColor = "#000000";
		});
		tagInput.addEventListener("blur", () => {
			tagControl.style.borderColor = "rgb(135, 135, 135)";
		});

		// Notification Message
		const notificationButton = document.querySelector(".notification .notification-body button");
		const notification = document.querySelector(".notification");
		notificationButton.addEventListener("click", (e) => {
			notification.classList.remove("show-notification");
		});

		// Expand/Collapse quadrant
		const expandButtons = document.querySelectorAll("button.expand-button");
		for (let expandButton of expandButtons) {
			expandButton.addEventListener("click", (e) => {
				let expanded = false;
				let targetedElement = e.target;
				if (targetedElement.nodeName === "IMG") {
					targetedElement = e.target.parentElement;
				}
				if (!targetedElement.classList.contains("expand")) {
					expanded = true;
				} else {
					expanded = false;
				}

				if (expanded) {
					targetedElement.classList.add("expand");
					const topQuadrant = targetedElement.closest(".quadrants-container .quadrant");
					topQuadrant.classList.add("expanded");
					targetedElement.querySelector("img").src = "./src/assets/collapse.svg";
				} else {
					targetedElement.classList.remove("expand");
					const topQuadrant = targetedElement.closest(".quadrant");
					topQuadrant.classList.remove("expanded");
					targetedElement.querySelector("img").src = "./src/assets/arrows-expand.svg";
				}
			});
		}
	}

	static TaskHandling() {
		// Access task input, control toggle, dueto, tag
		const addTaskButton = document.querySelector("button.add-task-button");

		addTaskButton.addEventListener("click", () => {
			let taskTitle = document.querySelector("input.task-input").value;
			let dueDate = document.querySelector(".date-time-input-toggle-button").innerText;
			let urgentToggle = document.querySelector("button.red-toggle-button").classList.contains("active");
			let importantToggle = document.querySelector("button.blue-toggle-button").classList.contains("active");
			let tagInput = document.querySelector("input.tag-input").value;

			const newTask = new Task(taskTitle, dueDate, importantToggle, urgentToggle, tagInput);

			if (TaskManager.validateTask(newTask)) {
				TaskManager.addTask(newTask);
				TaskManager.RenderTasks();
				this.ResetFields();
			}
		});
	}

	static ResetFields() {
		let taskTitle = document.querySelector("input.task-input");
		let dueDatePlaceholder = document.querySelector(".date-time-input-toggle-button");
		let dueDateInput = document.querySelector(".due-to-input");

		let urgentToggle = document.querySelector("button.red-toggle-button");
		let importantToggle = document.querySelector("button.blue-toggle-button");
		let tagInput = document.querySelector("input.tag-input");

		let taskInputContainer = document.querySelector(".task-input-container .text-input-placeholder");

		// Due To default elements
		const dueDatePlaceholderDate = document.querySelector(".date-time-input-toggle-button p");
		dueDatePlaceholder.removeChild(dueDatePlaceholderDate);
		const date = document.createElement("p");
		date.innerText = "Due To";
		dueDatePlaceholder.appendChild(date);
		dueDateInput.value = "";

		urgentToggle.classList.remove("active");
		importantToggle.classList.remove("active");
		tagInput.value = "";

		taskTitle.value = "";
		taskInputContainer.classList.remove("active");
	}

	static DraggingAndDropping() {
		const containers = document.querySelectorAll(".quadrant .tasks");
		const taskItems = document.querySelectorAll(".task-item");

		let draggedElement = null;
		let IsDragging = false;

		// Save the dragged element reference
		const dragHandler = (e) => {
			draggedElement = e.target;
			IsDragging = true;
			if (IsDragging) {
				for (let container of containers) {
					if (draggedElement.closest(".quadrant") != container.closest(".quadrant")) {
						let placeholder = container.querySelector(".tasks-dragging-placeholder");
						placeholder.classList.add("show-placeholder");
					}
				}
			}
		};

		const dropHandler = (e) => {
			if (draggedElement !== null && draggedElement.classList.contains("task-item")) {
				let selectedContainer = e.target.closest(".tasks"); // Ensure the target is a container

				// Prevent appending to the same parent container
				if (selectedContainer && selectedContainer !== draggedElement.parentElement) {
					selectedContainer.appendChild(draggedElement);

					const taskID = Number(draggedElement.getAttribute("data-id"));
					TaskManager.MoveTask(selectedContainer.closest(".quadrant"), taskID);
				}

				draggedElement = null;
				IsDragging = false;
			}
		};

		// Attach dragstart to all task items
		for (let taskItem of taskItems) {
			taskItem.addEventListener("drag", dragHandler);
		}

		for (let taskItem of taskItems) {
			taskItem.addEventListener("dragend", (e) => {
				for (let container of containers) {
					let placeholder = container.querySelector(".tasks-dragging-placeholder");
					placeholder.classList.remove("show-placeholder");
				}
			});
		}

		// Attach dragover and drop events to containers
		for (let container of containers) {
			container.addEventListener("dragover", (e) => {
				e.preventDefault(); // Allow dropping
			});
			container.addEventListener("drop", dropHandler);
		}
	}

	static render() {}
}

function OnLoadingChange(IsLoading) {
	try {
		const quadrantContainer = document.querySelector(".quadrants-container");
		const loadingIndicator = document.querySelector(".loading-indicator");

		if (IsLoading) {
			loadingIndicator.setAttribute("data-active", "true");
			quadrantContainer.setAttribute("data-active", "false");
		} else {
			quadrantContainer.setAttribute("data-active", "true");
			loadingIndicator.setAttribute("data-active", "false");
		}
	} catch (error) {
		console.log("An error occured:", error);
	}
}
class Task {
	id;
	title;
	dueTo;
	important;
	urgent;
	tag;
	quad;
	state;
	tip;
	constructor(Title, DueTo, Important, Urgent, Tag) {
		this.title = Title;
		this.dueTo = DueTo;
		this.important = Important;
		this.urgent = Urgent;
		this.tag = Tag;
		this.quad = this.GetQuad();
		this.state = TaskActions.ACTIVE;
		this.tip = this.GetProTip();
	}

	GetQuad() {
		if (this.urgent == true && this.important == true) return Priority.URGENT_IMPORTANT;
		if (this.urgent == false && this.important == true) return Priority.IMPORTANT_NOT_URGENT;
		if (this.urgent == true && this.important == false) return Priority.URGENT_NOT_IMPORTANT;
		if (this.urgent == false && this.important == false) return Priority.NOT_URGENT_NOT_IMPORTANT;
	}

	// Make GetProTip();
	GetProTip() {
		switch (this.GetQuad()) {
			case Priority.URGENT_IMPORTANT:
				this.tip = "Do these first";
				break;
			case Priority.IMPORTANT_NOT_URGENT:
				this.tip = "Schedule these";
				break;
			case Priority.URGENT_NOT_IMPORTANT:
				this.tip = "Delegate if possible";
				break;
			case Priority.NOT_URGENT_NOT_IMPORTANT:
				this.tip = "Eliminate or postpone";
				break;
		}
		return this.tip;
	}
}

let task1 = new Task("Reading System Design", "12/22/2024, 03:33 AM", false, false, "Study");
let task2 = new Task("Practice UX/UI", "12/22/2024, 05:20 PM", false, true, "Building");

TaskManager.addTask(task1);
TaskManager.addTask(task2);

class MessageBox {
	static notification = document.querySelector(".notification");
	static notificationHeader = this.notification.querySelector("h4");
	static notificationBody = this.notification.querySelector(".notification-body p");
	static showError(errorMessage) {
		// Call Dialog
		// alert(errorMessage);
		this.notificationHeader.textContent = "Error";
		this.notificationBody.textContent = errorMessage;
		this.notification.classList.add("show-notification");
	}

	static showSuccess(successMessage) {
		// Call Dialog
	}
}
