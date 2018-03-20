wxPIM.getMainHeaderConfig = function () {
    return {
        view: "toolbar", id: "toolbar",
        elements: [
            {
                view: "icon", icon: "bars",
                click: function () {
                    if ($$("sidemenu").isVisible()) {
                        $$("sidemenu").hide();
                    } else {
                        $$("sidemenu").show();
                    }
                }
            },
            {
                id: "headerLabel", view: "label",
                label: "", defaultLabel: "wxPIM Day-at-a-glance"
            }
        ]
    };
};