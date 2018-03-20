wxPIM.getMultiviewConfig = function () {
    return {
        view: "multiview", id: "moduleArea",
        animate: false,
        cells: [
            wxPIM.getDayAtAGlanceConfig(),
            wxPIM.modules.Appointments.getUIConfig(),
            wxPIM.modules.Contacts.getUIConfig(),
            wxPIM.modules.Notes.getUIConfig(),
            wxPIM.modules.Tasks.getUIConfig()
        ]
    };
};