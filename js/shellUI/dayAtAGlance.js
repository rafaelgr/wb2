wxPIM.getDayAtAGlanceConfig = function () {
    return {
        id: "dayAtAGlance", view: "scrollview", borderless: true, body: {
            paddingX: 20, paddingY: 20, rows: [
                {
                    view: "fieldset", label: "Appointments",
                    body: { id: "dayAtAGlanceScreen_Appointments", rows: [] }
                },
                { height: 20 },
                {
                    view: "fieldset", label: "Tasks",
                    body: { id: "dayAtAGlanceScreen_Tasks", rows: [] }
                }
            ]
        }
    };
};

wxPIM.dayAtAGlance = function () {
    if (wxPIM.activeModule) {
        wxPIM.modules[wxPIM.activeModule].deactivate();
    }
    wxPIM.activeModule = null;
    const worker = function (inWhich) {
        let sortProperty = "when";
        let sortDirection = "A";
        let dateProperty = "when";
        let template = webix.template("#subject# - #when# #location#");
        if (inWhich == "Tasks") {
            sortProperty = "value";
            sortDirection = "A";
            dateProperty = "dueDate";
            template = webix.template("#subject#");
        }
        let dataItems = wxPIM.getModuleData(inWhich);
        dataItems = wxPIM.objectAsArray(dataItems);
        wxPIM.sortArray(dataItems, sortProperty, sortDirection);
        const currentDate = new Date().setHours(0, 0, 0, 0);
        const rows = [];
        for (let i = 0; i < dataItems.length; i++) {
            const item = dataItems[i];
            const itemDate = new Date(item[dateProperty]).setHours(0, 0, 0, 0);
            if (itemDate == currentDate) {
                if (item.location) {
                    item.location = "(" + item.location + ")";
                } else {
                    item.location = "";
                }
                if (item.status == 1) {
                    item.status = "Ongoing";
                } else {
                    item.status = "Completed";
                }
                item[dateProperty] = webix.i18n.timeFormatStr(new
                    Date(item[dateProperty]));
                rows.push({
                    borderless: true, template: template(item), height: 30
                });
            }
        }
        webix.ui(rows, $$(`dayAtAGlanceScreen_${inWhich}`));
    };
    worker("Tasks");
    worker("Appointments");
    $$("headerLabel").setValue($$("headerLabel").config.defaultLabel);
};