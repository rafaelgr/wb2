class Appointments {
    constructor() {
        this.currentData = {};
    }

    getUIConfig() {
        return {
            id: "moduleAppointments-container",
            cells: [
                {
                    id: "moduleAppointments-itemsCell",
                    rows: [
                        {
                            view: "calendar", id: "moduleAppointments-items", width: 0,
                            height: 0,
                            weekHeader: true, events: webix.Date.isHoliday,
                            dayTemplate: this.dayTemplate,
                            on: {
                                onAfterDateSelect: this.selectDateHandler,
                            }
                        },
                        {
                            view: "toolbar",
                            cols: [
                                {},
                                {
                                    view: "button", label: "New", width: "80", type:
                                        "iconButton",
                                    icon: "plus", click: this.newHandler.bind(this)
                                },
                                { width: 6 }
                            ]
                        }
                    ]
                },
                {
                    id: "moduleAppointments-details",
                    rows: [
                        {
                            view: "form", id: "moduleAppointments-detailsForm",
                            borderless: true,
                            elementsConfig: {
                                view: "text", labelWidth: 100,
                                bottomPadding: 20,
                                on: {
                                    onChange: () => {
                                        $$("moduleAppointments-saveButton")
                                        [$$("moduleAppointments-detailsForm").validate() ?
                                                "enable" : "disable"]();
                                    }
                                }
                            },
                            elements: [
                                {
                                    name: "subject", label: "Subject", required: true,
                                    invalidMessage: "Subject is required", attributes: {
                                        maxlength: 100
                                    }
                                },
                                {
                                    view: "text", name: "category", label: "Category",
                                    suggest: [
                                        { id: 1, value: "Personal" }, {
                                            id: 2, value:
                                                "Business"
                                        },
                                        { id: 3, value: "Other" }
                                    ],
                                    on: {
                                        onItemClick: () => {
                                            $$(this.config.suggest).show(this.getInputNode());
                                        }
                                    }
                                },
                                {
                                    view: "datepicker", name: "when", label: "When",
                                    required: true,
                                    invalidMessage: "When is required", timepicker: true
                                },
                                {
                                    name: "location", label: "Location", attributes: {
                                        maxlength: 200
                                    }
                                },
                                {
                                    view: "slider", name: "attendees", label: "Attendees",
                                    min: 1, max: 100, step: 1, title: "#value#",
                                    id: "moduleAppointments-attendees"
                                },
                                {
                                    name: "notes", label: "Notes", attributes: {
                                        maxlength:
                                            250
                                    }
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
                                        $$("moduleAppointments-itemsCell").show();
                                    }
                                },
                                {},
                                {
                                    id: "moduleAppointments-deleteButton", view: "button",
                                    label: "Delete",
                                    width: "90", type: "iconButton",
                                    icon: "remove", click: () => {
                                        wxPIM.
                                            deleteHandler("Appointments");
                                    }
                                },
                                {},
                                {
                                    view: "button", label: "Save", width: "80", type:
                                        "iconButton",
                                    icon: "floppy-o", id: "moduleAppointments-saveButton",
                                    disabled: true,
                                    click: function () {
                                        wxPIM.saveHandler("Appointments", ["moduleAppointments-detailsForm"
                                        ]);
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

    dayTemplate(inDate) {
        const cssDayMarker = `
        background-color : #ff0000;
        border-radius : 50%;
        height : 8px;
        margin : 0 auto 8px;
        width : 8px;
        position : relative;
        top : -25px;
        `;
        const thisDate = new Date(inDate).setHours(0, 0, 0, 0);
        const appointment = wxPIM.modules.Appointments.currentData[thisDate];
        let html = `<div class="day">${inDate.getDate()}</div>`;
        if (appointment) {
            html += `<div style="${cssDayMarker}"></div>`;
        }
        return html;
    }

    activate() {
    }

    deactivate() {
        if ($$("moduleAppointments-dateWindow")) {
            $$("moduleAppointments-dateWindow").close();
        }
    }

    newHandler() {
        wxPIM.isEditingExisting = false;
        wxPIM.editingID = new Date().getTime();
        if ($$("moduleAppointments-dateWindow")) {
            $$("moduleAppointments-dateWindow").close();
        }
        $$("moduleAppointments-details").show();
        $$("moduleAppointments-detailsForm").clear();
        $$("moduleAppointments-attendees").setValue(1);
        $$("moduleAppointments-deleteButton").disable();
    }

    editExisting(inID) {
        if ($$("moduleAppointments-dateWindow")) {
            $$("moduleAppointments-dateWindow").close();
        }
        const appointments = JSON.parse(localStorage.getItem("AppointmentsDB"));
        const appointment = appointments[inID];
        wxPIM.isEditingExisting = true;
        wxPIM.editingID = inID;
        $$("moduleAppointments-detailsForm").clear();
        $$("moduleAppointments-details").show();
        if (appointment.when) {
            appointment.when = new Date(appointment.when);
        }
        $$("moduleAppointments-detailsForm").setValues(appointment);
        $$("moduleAppointments-deleteButton").enable();
    }

    refreshData() {
        const dataItems = wxPIM.getModuleData("Appointments");
        wxPIM.modules.Appointments.currentData = {};
        for (const key in dataItems) {
            if (dataItems.hasOwnProperty(key)) {
                const item = dataItems[key];
                wxPIM.modules.Appointments.currentData[new Date(item.when).
                    setHours(0, 0, 0, 0)] =
                    item;
            }
        }
        $$("moduleAppointments-items").refresh();
    }

    selectDateHandler(inDate) {
        const appointments = wxPIM.getModuleData("Appointments");
        const selectedDate = new Date(inDate).setHours(0, 0, 0, 0);
        const listData = [];
        for (const key in appointments) {
            if (appointments.hasOwnProperty(key)) {
                const appointment = appointments[key];
                const appointmentDate = new Date(appointment.when).setHours(0, 0, 0, 0);
                if (appointmentDate == selectedDate) {
                    listData.push(appointment);
                }
            }
        }
        if ($$("moduleAppointments-dateWindow")) {
            $$("moduleAppointments-dateWindow").close();
        }
        webix.ui({
            view: "window", id: "moduleAppointments-dateWindow", width: 300,
            height: 284,
            position: "center",
            head: {
                view: "toolbar",
                cols: [
                    { view: "label", label: inDate.toLocaleDateString() },
                    {
                        view: "icon", icon: "times-circle",
                        click: function () {
                            $$("moduleAppointments-dateWindow").close();
                        }
                    }
                ]
            },
            body: function () {
                if (listData.length == 0) {
                    return {
                        rows: [
                            {},
                            {
                                borderless: true,
                                template: `<div style="text-align: center;">Nothing on this
                                    day</span>`
                            },
                            {}
                        ]
                    };
                } else {
                    return {
                        view: "list", id: "appAppointments-itemsList", data: listData,
                        template: "#subject#", click: wxPIM.modules.Appointments.
                            editExisting,
                    };
                }
            }()
        }).show();
    }
}