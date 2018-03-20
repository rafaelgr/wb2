"use strict";

class WXPIM {
    constructor() {
        webix.rules.isNumberOrBlank = function (inValue) {
            if (inValue == "") return true;
            return webix.rules.isNumber(inValue);

        }

        webix.rules.isEmailOrBlank = function (inValue) {
            if (inValue == "") { return true; }
            return webix.rules.isEmail(inValue);
        };

        this.isEditingExisting = false;
        this.editingID = null;
        this.moduleClasses = {};
        this.modules = {};
        this.activeModule = null;

        webix.ready(this.start.bind(this));
    }

    start() {
        this.modules.Appointments = new this.moduleClasses.Appointments();
        this.modules.Contacts = new this.moduleClasses.Contacts();
        this.modules.Notes = new this.moduleClasses.Notes();
        this.modules.Tasks = new this.moduleClasses.Tasks();
        webix.ui(this.getBaseLayoutConfig());
        webix.ui(this.getSideMenuConfig());
        wxPIM.dayAtAGlance();
    }

    launchModule(inModuleName) {
        if (wxPIM.activeModule) {
            wxPIM.modules[wxPIM.activeModule].deactivate();
        }
        wxPIM.activeModule = inModuleName;
        $$("sidemenu").hide();
        $$("headerLabel").setValue(inModuleName);
        wxPIM.editingID = null;
        wxPIM.isEditingExisting = false;
        $$(`module${inModuleName}-itemsCell`).show();
        $$(`module${inModuleName}-container`).show();
        wxPIM.modules[inModuleName].refreshData();
        wxPIM.modules[inModuleName].activate();
    }

    sortArray(inArray, inProperty, inDirection) {
        inArray.sort(function compare(inA, inB) {
            inA = (inA[inProperty] + "").toLowerCase();
            inB = (inB[inProperty] + "").toLowerCase();
            if (inA > inB) {
                if (inDirection === "D") {
                    return -1;
                } else {
                    return 1;
                }
            } else if (inA < inB) {
                if (inDirection === "D") {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                return 0;
            }
        });
    }

    objectAsArray(inObject) {
        const array = [];
        for (const key in inObject) {
            if (inObject.hasOwnProperty(key)) {
                array.push(inObject[key]);
            }
        }
        return array;
    };

    getModuleData(inModuleName) {
        let items = localStorage.getItem(`${inModuleName}DB`);
        if (!items) {
            items = {};
            localStorage.setItem(`${inModuleName}DB`, webix.stringify(items));
        } else {
            items = JSON.parse(items);
        }
        return items;
    };

    saveHandler(inModuleName, inFormIDs) {
        const itemData = {};
        for (let i = 0; i < inFormIDs.length; i++) {
            const formData = $$(inFormIDs[i]).getValues();
            webix.proto(itemData, formData);
        }
        itemData.id = wxPIM.editingID;
        delete itemData.$init;
        const moduleData = wxPIM.getModuleData(inModuleName);
        moduleData[itemData.id] = itemData;
        localStorage.setItem(`${inModuleName}DB`, webix.stringify(moduleData));
        wxPIM.modules[inModuleName].refreshData();
        $$(`module${inModuleName}-itemsCell`).show();
        webix.message({ type: "error", text: "Item saved" });
    };

    deleteHandler(inModuleName) {
        webix.html.addCss(webix.confirm({
            title: `Please Confirm`, ok: "Yes", cancel: "No", type: "confirm-warning",
            text: `Are you sure you want to delete this item?`, width: 300,
            callback: function (inResult) {
                if (inResult) {
                    const dataItems = wxPIM.getModuleData(inModuleName);
                    delete dataItems[wxPIM.editingID];
                    localStorage.setItem(`${inModuleName}DB`, webix.
                        stringify(dataItems));
                    wxPIM.modules[inModuleName].refreshData();
                    $$(`module${inModuleName}-itemsCell`).show();
                    webix.message({ type: "error", text: "Item deleted" });
                }
            }
        }), "animated bounceIn");
    };
}

const wxPIM = new WXPIM();
