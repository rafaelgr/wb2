wxPIM.moduleClass.Tasks = class {
    activate() {
    }
    deactivate() {
    }
    getUIConfig() {
        return {
            id: "moduleTasks-container",
            cells: [
                {
                    id: "moduleTasks-itemsCell",
                    rows: [
                        {
                            view: "tree", id: "moduleTasks-items",
                            on: { onItemClick: this.editExisting.bind(this) }
                        },
                        {
                            view: "toolbar",
                            cols: [
                                {},
                                {
                                    view: "button", label: "New", width: "80",
                                    type: "iconButton", icon: "plus",
                                    click: this.newHandler.bind(this)
                                },
                                { width: 6 }
                            ]
                        }
                    ]
                },
                {
                    id: "moduleTasks-details",
                    rows: [
                        {
                            view: "form", id: "moduleTasks-detailsForm", borderless: true,
                            elementsConfig: {
                                view: "text", labelWidth: 100,
                                bottomPadding: 20,
                                on: {
                                    onChange: () => {
                                        $$("moduleTasks-saveButton")[$$("moduleTasks-detailsForm").
                                            validate() ?
                                            "enable" : "disable"]();
                                    }
                                }
                            },
                            elements: [
                                {
                                    name: "subject", label: "Subject", required: true,
                                    invalidMessage: "Subject is required",
                                    attributes: { maxlength: 50 }
                                },
                                {
                                    view: "text", name: "category", label: "Category",
                                    suggest: [
                                        { id: 1, value: "Personal" },
                                        { id: 2, value: "Business" },
                                        { id: 3, value: "Other" }
                                    ],
                                    on: {
                                        onItemClick: function () {
                                            $$(this.config.suggest).show(this.getInputNode());
                                        }
                                    }
                                },
                                {
                                    view: "radio", name: "status", label: "Status", value: 1,
                                    id: "moduleTasks-category",
                                    options: [
                                        { id: 1, value: "Ongoing" }, {
                                            id: 2, value:
                                                "Completed"
                                        }
                                    ]
                                },
                                {
                                    view: "segmented", name: "priority", label: "Priority",
                                    value: 1,
                                    options: [
                                        { id: 1, value: "Low" },
                                        { id: 2, value: "Medium" },
                                        { id: 3, value: "High" }
                                    ]
                                },
                                {
                                    view: "datepicker", name: "dueDate", label: "Due Date",
                                    id: "moduleTasks-dueDate", required: true,
                                    invalidMessage: "Due Date is required"
                                },
                                {
                                    name: "comments", label: "Comments",
                                    attributes: { maxlength: 250 }
                                }
                            ]
                        },
                        {},
                        {
                            view: "toolbar",
                            cols: [
                                { width: 6 },
                                {
                                    view: "button", label: "Back To Summary", width: "170",
                                    type: "iconButton", icon: "arrow-left",
                                    click: () => {
                                        $$("moduleTasks-itemsCell").show();
                                    }
                                },
                                {},
                                {
                                    id: "moduleTasks-deleteButton", view: "button",
                                    label: "Delete", width: "90", type: "iconButton",
                                    icon: "remove", click: () => {
                                        wxPIM.
                                            deleteHandler("Tasks");
                                    }
                                },
                                {},
                                {
                                    view: "button", label: "Save", width: "80",
                                    type: "iconButton", icon: "floppy-o",
                                    id: "moduleTasks-saveButton", disabled: true,
                                    click: function () {
                                        wxPIM.saveHandler("Tasks", ["moduleTasks-detailsForm"]);
                                    }
                                },
                                { width: 6 }
                            ]
                        }
                    ]
                }
            ]
        };
    }
    newHandler() {
        wxPIM.isEditingExisting = false;
        wxPIM.editingID = new Date().getTime();
        $$("moduleTasks-details").show();
        $$("moduleTasks-detailsForm").clear();
        $$("moduleTasks-category").setValue(1);
        $$("moduleTasks-deleteButton").disable();
    }
    editExisting(inID) {
        const tasks = JSON.parse(localStorage.getItem("TasksDB"));
        const task = tasks[inID];
        if (!task) {
            if ($$("moduleTasks-items").isBranchOpen(inID)) {
                $$("moduleTasks-items").close(inID);
            } else {
                $$("moduleTasks-items").open(inID);
            }
            return;
        }
        wxPIM.isEditingExisting = true;
        wxPIM.editingID = inID;
        $$("moduleTasks-detailsForm").clear();
        $$("moduleTasks-details").show();
        if (task.dueDate) {
            task.dueDate = new Date(task.dueDate);
        }
        $$("moduleTasks-detailsForm").setValues(task);
        $$("moduleTasks-deleteButton").enable();
    }
    refreshData() {
        const dataItems = wxPIM.getModuleData("Tasks");
        const tasksData = {};
        for (const taskID in dataItems) {
            if (dataItems.hasOwnProperty(taskID)) {
                const task = dataItems[taskID];
                if (!tasksData[task.category]) {
                    tasksData[task.category] = {
                        $css: { padding: "10px" }, value: task.category,
                        open: true, data: []
                    };
                }
                tasksData[task.category].data.push(
                    {
                        $css: {
                            padding: "10px", margin: "10px", "border-radius": "10px",
                            "background-color": (task.status === 1 ? "#ffe0e0" : "#e0ffe0")
                        },
                        id: task.id, value: task.subject
                    }
                );
            }
        }
        const itemsAsArray = wxPIM.objectAsArray(tasksData);
        wxPIM.sortArray(itemsAsArray, "value", "A");
        $$("moduleTasks-items").clearAll();
        $$("moduleTasks-items").parse(itemsAsArray);
    }
}