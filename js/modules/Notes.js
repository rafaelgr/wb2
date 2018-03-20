class Notes {
    activate() {
    }

    deactivate() {
    }

    getUIConfig() {
        const cssListItem = `
        color : #000000;
        height : 66px;
        border : 1px solid #000000;
        border-radius : 8px;
        margin : 8px 10px 12px 4px;
        overflow : hidden;
        padding : 6px 6px 20px 6px;
        box-shadow : 4px 4px #aaaaaa;
        cursor : hand;
        `;
        const cssListItemTitle = `
        font-weight : bold;
        padding-bottom : 6px;
        `;
        return {
            id: "moduleNotes-container",
            cells: [
                {
                    id: "moduleNotes-itemsCell",
                    rows: [
                        {
                            view: "list", id: "moduleNotes-items",
                            type: {
                                templateStart:
                                    `<div style="${cssListItem}background-color:#color#;"
                                        onClick="wxPIM.modules.Notes.editExisting('#id#');">`,
                                template:
                                    `<div style="${cssListItemTitle}">#title#</div>#text#`,
                                templateEnd: `</div>`
                            }
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
                    id: "moduleNotes-details",
                    rows: [
                        {
                            view: "form", id: "moduleNotes-detailsForm", borderless: true,
                            elements: [
                                {
                                    view: "text", name: "title", label: "Title", required:
                                        true,
                                    bottomPadding: 20, invalidMessage: "Title is required",
                                    attributes: { maxlength: 50 },
                                    on: {
                                        onChange: function () {
                                            if (this.getParentView().validate()) {
                                                $$("moduleNotes-saveButton").enable();
                                            } else {
                                                $$("moduleNotes-saveButton").disable();
                                            }
                                        }
                                    }
                                },
                                {
                                    id: "moduleNotes-detailsForm-text", view: "richtext",
                                    name: "text", label: "Text", attributes: {
                                        maxlength:
                                            1000
                                    }
                                },
                                {
                                    view: "colorpicker", name: "color", label: "Color",
                                    id: "moduleNotes-detailsForm-color"
                                },
                            ]
                        },
                        {
                            view: "toolbar",
                            cols: [
                                { width: 6 },
                                {
                                    view: "button", label: "Back To Summary", width: "170",
                                    type: "iconButton", icon: "arrow-left",
                                    click: () => {
                                        $$("moduleNotes-itemsCell").show();
                                    }
                                },
                                {},
                                {
                                    id: "moduleNotes-deleteButton", view: "button",
                                    label: "Delete", width: "90", type: "iconButton",
                                    icon: "remove",
                                    click: () => {
                                        wxPIM.
                                            deleteHandler("Notes");
                                    }
                                },
                                {},
                                {
                                    view: "button", label: "Save", width: "80",
                                    type: "iconButton", icon: "floppy-o",
                                    id: "moduleNotes-saveButton", disabled: true,
                                    click: function () {
                                        wxPIM.saveHandler("Notes", ["moduleNotes-detailsForm"]);
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
        $$("moduleNotes-details").show();
        $$("moduleNotes-detailsForm").clear();
        $$("moduleNotes-detailsForm-text").setValue("");
        $$("moduleNotes-detailsForm-color").setValue("#ffd180");
        $$("moduleNotes-deleteButton").disable();
    }

    editExisting(inID) {
        const notes = JSON.parse(localStorage.getItem("NotesDB"));
        const note = notes[inID];
        wxPIM.isEditingExisting = true;
        wxPIM.editingID = inID;
        $$("moduleNotes-detailsForm").clear();
        $$("moduleNotes-details").show();
        $$("moduleNotes-detailsForm").setValues(note);
        $$("moduleNotes-deleteButton").enable();
    }

    refreshData() {
        const dataItems = wxPIM.getModuleData("Notes");
        const itemsAsArray = wxPIM.objectAsArray(dataItems);
        wxPIM.sortArray(itemsAsArray, "id", "D");
        $$("moduleNotes-items").clearAll();
        $$("moduleNotes-items").parse(itemsAsArray);
    }
}