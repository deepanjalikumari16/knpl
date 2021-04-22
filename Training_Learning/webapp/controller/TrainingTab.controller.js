sap.ui.define(
    [
        "com/knpl/pragati/Training_Learning/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
        "sap/ui/core/Fragment",
        "sap/ui/layout/form/FormElement",
        "sap/m/Input",
        "sap/m/Label",
        "sap/ui/core/library",
        "sap/ui/core/message/Message",
        "sap/m/DatePicker",
        "sap/ui/core/ValueState",
        "sap/ui/model/type/Date",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/core/format/DateFormat",
        "sap/ui/core/routing/History",
        "sap/ui/core/SeparatorItem",
        "../model/formatter"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        BaseController,
        JSONModel,
        MessageBox,
        MessageToast,
        Fragment,
        FormElement,
        Input,
        Label,
        library,
        Message,
        DatePicker,
        ValueState,
        DateType,
        Filter,
        FilterOperator,
        DateFormat,
        History,
        SeparatorItem,
        formatter
    ) {
        "use strict";

        return BaseController.extend(
            "com.knpl.pragati.Training_Learning.controller.TrainingTab",
            {
                formatter: formatter,
                onInit: function () {

                    var oViewModel = new JSONModel({
                        busy: false,
                        currDate: new Date(),
                        Search: {
                            Attendance: "",
                            Enrollment: ""
                        },
                        TrainingDetails: {
                        }
                    });
                    this.setModel(oViewModel, "oModelView");

                    var oRouter = this.getOwnerComponent().getRouter(this);
                    oRouter
                        .getRoute("RouteTrainingTab")
                        .attachMatched(this._onRouteMatched, this);
                },
                _onRouteMatched: function (oEvent) {
                    debugger;
                    var oProp = oEvent.getParameter("arguments").prop;
                    var mode = oEvent.getParameter("arguments").mode;
                    var trainingType = oEvent.getParameter("arguments").trtype;

                    var that = this;
                    var oViewModel = this.getModel("oModelView");
                    var oView = this.getView();

                    var oData = {
                        modeEdit: false,
                        bindProp: oProp,
                        trainingId: oProp.replace(/[^0-9]/g, ""),
                        ProfilePic: "/KNPL_PAINTER_API/api/v2/odata.svc/" + oProp + "/$value",
                        Search: {
                            Attendance: "",
                            Enrollment: ""
                        }
                    };

                    var aZones = [],
                        aDivisions = [],
                        aDepots = [];

                    oViewModel.setProperty("/ProfilePic", oData.ProfilePic);
                    oViewModel.setProperty("/ProfilePicHeader", oData.ProfilePic);

                    oViewModel.setProperty("/trainingId", oData.trainingId);
                    oViewModel.setProperty("/Search/Attendance", "");
                    oViewModel.setProperty("/Search/Enrollment", "");

                    this.getModel("appView").setProperty("/trainingType", trainingType);
                    var sPath = "/" + oProp;
                    oViewModel.setProperty("/sPath", sPath);
                    if (trainingType === 'ONLINE' || trainingType === 'OFFLINE') {
                        that.getModel().read(sPath, {
                            urlParameters: {
                                "$expand": "Creator, TrainingZone, TrainingDivision, TrainingDepot, PainterArcheType, PainterTypeDetails, TrainingType, TrainingSubTypeDetails, TrainingQuestionnaire, TrainingQuestionnaire/TrainingQuestionnaireOptions"
                            },
                            success: function (data) {

                                if (trainingType === 'ONLINE') {
                                    if (data.TrainingQuestionnaire) {
                                        data.TrainingQuestionnaire.results.forEach(function (ele) {
                                            if (ele.TrainingQuestionnaireOptions && ele.TrainingQuestionnaireOptions.results.length) {
                                                ele.TrainingQuestionnaireOptions = ele.TrainingQuestionnaireOptions.results;
                                            } else {
                                                ele.TrainingQuestionnaireOptions = [];
                                            }
                                        })

                                        data.TrainingQuestionnaire = data.TrainingQuestionnaire.results;
                                    } else {
                                        data.TrainingQuestionnaire = [];
                                    }

                                    if (data.TrainingZone.results.length > 0) {
                                        for (var x of data["TrainingZone"]["results"]) {
                                            aZones.push(x["ZoneId"]);
                                        }
                                    }

                                    if (data.TrainingDivision.results.length > 0) {
                                        for (var y of data["TrainingDivision"]["results"]) {
                                            aDivisions.push(y["DivisionId"]);
                                        }
                                    }

                                    if (data.TrainingDepot.results.length > 0) {
                                        for (var z of data["TrainingDepot"]["results"]) {
                                            aDepots.push(z["DepotId"]);
                                        }
                                    }

                                    // if (data.TrainingDepot && data.TrainingDepot.results) {
                                    //     data.TrainingDepot = data.TrainingDepot.results;
                                    // } else {
                                    //     data.TrainingDepot = [];
                                    // }

                                    // if (data.TrainingDivision && data.TrainingDivision.results) {
                                    //     data.TrainingDivision = data.TrainingDivision.results;
                                    // } else {
                                    //     data.TrainingDivision = [];
                                    // }

                                    // if (data.TrainingZone && data.TrainingZone.results) {
                                    //     data.TrainingZone = data.TrainingZone.results;
                                    // } else {
                                    //     data.TrainingZone = [];
                                    // }

                                }

                                oViewModel.setProperty("/TrainingDetails", data);
                                oViewModel.setProperty("/__metadata", data.__metadata);

                                if (trainingType === 'ONLINE') {

                                    if (aZones) {
                                        oViewModel.setProperty("/TrainingDetails/Zones", aZones);
                                    } else {
                                        oViewModel.setProperty("/DisTrainingDetailsplay/Zones", []);
                                    }
                                    if (aDivisions) {
                                        oViewModel.setProperty("/TrainingDetails/Divisions", aDivisions);
                                    } else {
                                        oViewModel.setProperty("/TrainingDetails/Divisions", []);
                                    }
                                    if (aDepots) {
                                        oViewModel.setProperty("/TrainingDetails/Depots", aDepots);
                                    } else {
                                        oViewModel.setProperty("/TrainingDetails/Depots", []);
                                    }

                                    var dateValue = data.StartDate.toDateString();
                                    var timeValue = data.StartDate.toLocaleTimeString();
                                    var patternDate = "dd/MM/yyyy hh:mm a";
                                    var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                                        pattern: patternDate
                                    });
                                    var oDateTime = dateValue + " " + timeValue;
                                    var oNow = new Date(oDateTime);
                                    oViewModel.setProperty("/TrainingDetails/ViewStartDate", oDateFormat.format(oNow));

                                    dateValue = data.EndDate.toDateString();
                                    timeValue = data.EndDate.toLocaleTimeString();
                                    oDateTime = dateValue + " " + timeValue;
                                    oNow = new Date(oDateTime);
                                    oViewModel.setProperty("/TrainingDetails/ViewEndDate", oDateFormat.format(oNow));
                                    that._initFilerForTablesEnrollment(data.Id);
                                }

                                if (trainingType === 'OFFLINE') {
                                    that._initFilerForTablesAttendance(data.Id);
                                }
                            }
                        })
                    } else {
                        that.getModel().read(sPath, {
                            urlParameters: {
                                "$expand": "Creator, TrainingZone, TrainingDivision, TrainingDepot, PainterArcheType, PainterTypeDetails, TrainingType, TrainingSubTypeDetails, LearningQuestionnaire, LearningQuestionnaire/LearningQuestionnaireOptions"
                            },
                            success: function (data) {
                                if (data.LearningQuestionnaire) {
                                    data.LearningQuestionnaire.results.forEach(function (ele) {
                                        if (ele.LearningQuestionnaireOptions && ele.LearningQuestionnaireOptions.results.length) {
                                            ele.TrainingQuestionnaireOptions = ele.LearningQuestionnaireOptions.results;
                                        } else {
                                            ele.TrainingQuestionnaireOptions = [];
                                        }
                                    })

                                    data.TrainingQuestionnaire = data.LearningQuestionnaire.results;
                                } else {
                                    data.TrainingQuestionnaire = [];
                                }

                                oViewModel.setProperty("/TrainingDetails", data);
                                oViewModel.setProperty("/__metadata", data.__metadata);

                                if (data.TrainingZone.results.length > 0) {
                                        for (var x of data["TrainingZone"]["results"]) {
                                            aZones.push(x["ZoneId"]);
                                        }
                                    }

                                    if (data.TrainingDivision.results.length > 0) {
                                        for (var y of data["TrainingDivision"]["results"]) {
                                            aDivisions.push(y["DivisionId"]);
                                        }
                                    }

                                    if (data.TrainingDepot.results.length > 0) {
                                        for (var z of data["TrainingDepot"]["results"]) {
                                            aDepots.push(z["DepotId"]);
                                        }
                                    }

                                    if (aZones) {
                                        oViewModel.setProperty("/TrainingDetails/Zones", aZones);
                                    } else {
                                        oViewModel.setProperty("/DisTrainingDetailsplay/Zones", []);
                                    }
                                    if (aDivisions) {
                                        oViewModel.setProperty("/TrainingDetails/Divisions", aDivisions);
                                    } else {
                                        oViewModel.setProperty("/TrainingDetails/Divisions", []);
                                    }
                                    if (aDepots) {
                                        oViewModel.setProperty("/TrainingDetails/Depots", aDepots);
                                    } else {
                                        oViewModel.setProperty("/TrainingDetails/Depots", []);
                                    }

                                oViewModel.setProperty("/TrainingDetails/LearningQuestionnaire", []);
                            }
                        })
                    }

                    if (trainingType === 'ONLINE') {
                        var TrainingVideoDetails = this.getView().getModel("i18n").getResourceBundle().getText("OnlineTrainingDetails");
                        oViewModel.setProperty("/TrainingVideoDetails", TrainingVideoDetails);
                    } else if (trainingType === 'OFFLINE') {
                        var TrainingVideoDetails = this.getView().getModel("i18n").getResourceBundle().getText("OfflineTrainingDetails");
                        oViewModel.setProperty("/TrainingVideoDetails", TrainingVideoDetails);
                    } else {
                        var TrainingVideoDetails = this.getView().getModel("i18n").getResourceBundle().getText("VideoTrainingDetails");
                        oViewModel.setProperty("/TrainingVideoDetails", TrainingVideoDetails);
                    }
                    if (mode === 'edit') {
                        that.handleEditPress();
                    } else {
                        if (trainingType === 'ONLINE' || trainingType === 'VIDEO') {
                            that._loadEditTrainingDetail("Display");
                            that._loadEditQuestion("Display");
                        } else if (trainingType === 'OFFLINE') {
                            that.getModel("appView").setProperty("/EditAttendance", false);
                        }
                        // that._toggleButtonsAndView(false);
                    }
                    that.getView().unbindElement();

                    that.getView().setModel(oViewModel, "oModelView");
                    that.getView().getModel().resetChanges();
                },

                onTablesSearch: function (oEvent) {
                    var oView = this.getView();
                    var sPath = oEvent.getSource().getBinding("value").getPath();
                    var sValue = oEvent.getSource().getValue();
                    var sTrainingId = oView
                        .getModel("oModelView")
                        .getProperty("/trainingId");
                    if (sPath.match("Attendance")) {
                        this._SearchAttendance(sValue, sTrainingId);
                    } else if (sPath.match("Enrollment")) {
                        this._SearchEnrollment(sValue, sTrainingId);
                    }
                },

                _SearchAttendance: function (sValue, sTrainingId) {
                    var oView = this.getView();
                    var aCurrentFilter = [];

                    var oTable = oView.byId("idTblAttendance");
                    if (/^\+?(0|[1-9]\d*)$/.test(sValue)) {
                        aCurrentFilter.push(
                            new Filter(
                                [
                                    new Filter(
                                        "PainterDetails/Mobile",
                                        FilterOperator.Contains,
                                        sValue.trim().substring(0, 8)
                                    ),
                                ],
                                false
                            )
                        );
                    } else {
                        aCurrentFilter.push(
                            new Filter(
                                [
                                    new Filter(
                                        "tolower(PainterDetails/Name)",
                                        FilterOperator.Contains,
                                        "'" + sValue.trim().toLowerCase().replace("'", "''") + "'"
                                    ),
                                    new Filter(
                                        "tolower(PainterDetails/MembershipCard)",
                                        FilterOperator.Contains,
                                        "'" + sValue.trim().toLowerCase().replace("'", "''") + "'"
                                    ),

                                ],
                                false
                            )
                        );
                    }
                    aCurrentFilter.push(
                        new Filter("TrainingId", FilterOperator.EQ, parseInt(sTrainingId))
                    );
                    var endFilter = new Filter({
                        filters: aCurrentFilter,
                        and: true,
                    });

                    oTable.getBinding("items").filter(endFilter);
                },

                _SearchEnrollment: function (sValue, sTrainingId) {
                    var oView = this.getView();
                    var aCurrentFilter = [];

                    var oTable = oView.byId("idTblEnrollment");
                    if (/^\+?(0|[1-9]\d*)$/.test(sValue)) {
                        aCurrentFilter.push(
                            new Filter(
                                [
                                    new Filter(
                                        "PainterDetails/Mobile",
                                        FilterOperator.Contains,
                                        sValue.trim().substring(0, 8)
                                    ),
                                ],
                                false
                            )
                        );
                    } else {
                        aCurrentFilter.push(
                            new Filter(
                                [
                                    new Filter(
                                        "tolower(PainterDetails/Name)",
                                        FilterOperator.Contains,
                                        "'" + sValue.trim().toLowerCase().replace("'", "''") + "'"
                                    ),
                                    new Filter(
                                        "tolower(PainterDetails/MembershipCard)",
                                        FilterOperator.Contains,
                                        "'" + sValue.trim().toLowerCase().replace("'", "''") + "'"
                                    ),

                                ],
                                false
                            )
                        );
                    }
                    aCurrentFilter.push(
                        new Filter("TrainingId", FilterOperator.EQ, parseInt(sTrainingId))
                    );
                    var endFilter = new Filter({
                        filters: aCurrentFilter,
                        and: true,
                    });

                    oTable.getBinding("items").filter(endFilter);
                },

                fmtStatus: function (mParam) {
                    var sLetter = "";
                    if (mParam) {
                        sLetter = mParam
                            .toLowerCase()
                            .split(" ")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ");
                    }
                    return sLetter;
                },

                onMultyZoneChange: function (oEvent) {
                    debugger;
                    var sKeys = oEvent.getSource().getSelectedKeys();
                    var oView = this.getView();
                    var aArray = [];
                    for (var x of sKeys) {
                        aArray.push({
                            ZoneId: x,
                            TrainingId: this.getModel("oModelView").getProperty("/trainingId")
                        });
                    }
                    oView.getModel("oModelView").setProperty("/TrainingDetails/TrainingZone", aArray);
                    var oDivision = oView.byId("idDivision");

                    oDivision.clearSelection();
                    oDivision.fireSelectionChange();
                    var aDivFilter = [];
                    for (var y of aArray) {
                        aDivFilter.push(new Filter("Zone", FilterOperator.EQ, y["ZoneId"]))
                    }

                    oDivision.getBinding("items").filter(aDivFilter);


                    var oDepot = oView.byId("idDepot");
                    oDepot.clearSelection();
                    oDepot.fireSelectionChange();
                },

                onMultyDivisionChange: function (oEvent) {
                    debugger;
                    var sKeys = oEvent.getSource().getSelectedKeys();
                    var oView = this.getView();
                    var aArray = [];
                    for (var x of sKeys) {
                        aArray.push({
                            DivisionId: x,
                            TrainingId: this.getModel("oModelView").getProperty("/trainingId")
                        });
                    }
                    oView.getModel("oModelView").setProperty("/TrainingDetails/TrainingDivision", aArray);
                    //depot clear
                    var oDepot = oView.byId("idDepot");
                    oDepot.clearSelection();
                    oDepot.fireSelectionChange();

                    //depot filter
                    var aDepot = [];
                    for (var y of aArray) {
                        aDepot.push(new Filter("Division", FilterOperator.EQ, y["DivisionId"]))
                    }

                    oDepot.getBinding("items").filter(aDepot);
                },

                onMultyDepotChange: function (oEvent) {
                    debugger;
                    var sKeys = oEvent.getSource().getSelectedKeys();
                    var oView = this.getView();
                    var aArray = [];
                    for (var x of sKeys) {
                        aArray.push({
                            DepotId: x,
                            TrainingId: this.getModel("oModelView").getProperty("/trainingId")
                        });
                    }
                    oView.getModel("oModelView").setProperty("/TrainingDetails/TrainingDepot", aArray);
                },

                onCancel: function () {
                    this.getRouter().navTo("worklist", true);
                },

                onAfterRendering: function () {
                    //Init Validation framework
                    this._initMessage();
                },

                onActiveInActive: function (oEvent) {
                    var sPath = this.getModel("oModelView").getProperty("/sPath");
                    var sData = this.getModel("oModelView").getProperty("/TrainingDetails");
                    var data = sPath + "/Status";
                    var that = this;
                    var oModel = that.getModel();
                    if (sData.Status === 0) {
                        if (sData.Url === "") {
                            that.showToast.call(that, "MSG_PLEASE_ADD_URL_BEFORE_ACTIVATING_TRAINING");
                        } else if (sData.TrainingZone.results.length == 0) {
                            that.showToast.call(that, "MSG_PLEASE_ADD_ZONE_BEFORE_ACTIVATING_TRAINING");
                        } else if (sData.TrainingDivision.results.length == 0) {
                            that.showToast.call(that, "MSG_PLEASE_ADD_DIVISION_BEFORE_ACTIVATING_TRAINING");
                        } else if (sData.TrainingDepot.results.length == 0) {
                            that.showToast.call(that, "MSG_PLEASE_ADD_DEPOT_BEFORE_ACTIVATING_TRAINING");
                        } else if (sData.PainterType === null) {
                            that.showToast.call(that, "MSG_PLEASE_ADD_PAINTER_TYPE_BEFORE_ACTIVATING_TRAINING");
                        } else if (sData.PainterArcheId === null) {
                            that.showToast.call(that, "MSG_PLEASE_ADD_PAINTER_ARCHETYPE_BEFORE_ACTIVATING_TRAINING");
                        } else {
                            that.getModel().update(data, {
                                Status: 1
                            }, {
                                success: function () {
                                    that.showToast.bind(that, "MSG_SUCCESS_ACTIVATED_SUCCESSFULLY");
                                    oModel.refresh(true);
                                    that.getRouter().navTo("worklist", true);
                                }
                            });
                        }
                    }
                    if (sData.Status === 1) {
                        that.getModel().update(data, {
                            Status: 0
                        }, {
                            success: function () {
                                that.showToast.bind(that, "MSG_SUCCESS_DEACTIVATED_SUCCESSFULLY");
                                oModel.refresh(true);
                                that.getRouter().navTo("worklist", true);
                            }
                        });
                    }
                    if (sData.Status === 2) {
                        that.showToast.call(that, "MSG_EXPIRED_TRAININGS_CANT_BE_CHANGED");
                    }
                },

                _initMessage: function () {
                    //MessageProcessor could be of two type, Model binding based and Control based
                    //we are using Model-binding based here
                    var oMessageProcessor = this.getModel("oModelView");
                    this._oMessageManager = sap.ui.getCore().getMessageManager();
                    this._oMessageManager.registerMessageProcessor(oMessageProcessor);
                },

                onAddQuestionnaire: function (oEvent) {
                    var addQsFlag = true;
                    this.getModel("oModelView").setProperty("/addQsFlag", addQsFlag);

                    var oTrainingQuestionnaire = [];
                    this.getModel("oModelView").setProperty("/oAddTraining", {
                        Question: "",
                        TrainingQuestionnaireOptions: [],
                        IsArchived: false
                    });

                    var sPath = "/oAddTraining";
                    var oButton = oEvent.getSource();
                    var oView = this.getView();
                    var oModelView = this.getModel("oModelView"),
                        oThat = this;

                    if (!this.byId("QuestionnaireOptionsDialog")) {
                        // load asynchronous XML fragment
                        Fragment.load({
                            id: oView.getId(),
                            name: "com.knpl.pragati.Training_Learning.view.fragments.QuestionnaireOptionsDialog",
                            controller: this
                        }).then(function (oDialog) {
                            // connect dialog to the root view 
                            //of this component (models, lifecycle)
                            oView.addDependent(oDialog);
                            oDialog.bindElement({
                                path: sPath,
                                model: "oModelView"
                            });
                            oDialog.open();
                        });
                    } else {
                        oThat.byId("QuestionnaireOptionsDialog").bindElement({
                            path: sPath,
                            model: "oModelView"
                        });
                        oThat.byId("QuestionnaireOptionsDialog").open();
                    }

                },

                updateOptions: function () {
                    var selectCorrectFlag,
                        blankOption,
                        addTr;
                    selectCorrectFlag = false;
                    blankOption = true;
                    var addQsFlag = this.getModel("oModelView").getProperty("/addQsFlag");
                    if (addQsFlag === true) {
                        addTr = this.getModel("oModelView").getProperty("/oAddTraining");
                    } else {
                        var iIndex = this.getModel("oModelView").getProperty("/iIndex");
                        addTr = this.getModel("oModelView").getData().TrainingDetails.TrainingQuestionnaire[iIndex];
                    }
                    if (addTr.Question === "") {
                        this.showToast.call(this, "MSG_PLS_ENTER_ERR_QUESTION");
                    } else {
                        if (addTr.TrainingQuestionnaireOptions.length >= 2) {
                            if (addTr.TrainingQuestionnaireOptions.length <= 4) {
                                for (var i = 0; i < addTr.TrainingQuestionnaireOptions.length; i++) {
                                    if (addTr.TrainingQuestionnaireOptions[i].IsCorrect === true) {
                                        selectCorrectFlag = true;
                                    }
                                }
                                if (selectCorrectFlag === false) {
                                    this.showToast.call(this, "MSG_PLS_SELECT_ONE_CORRECT_OPTION");
                                } else {
                                    for (var i = 0; i < addTr.TrainingQuestionnaireOptions.length; i++) {
                                        if (addTr.TrainingQuestionnaireOptions[i].Option === "") {
                                            blankOption = false;
                                            this.showToast.call(this, "MSG_DONT_ENTER_BLANK_OPTION");
                                        }
                                    }
                                    if (blankOption === true) {
                                        if (addQsFlag === true) {
                                            this.getModel("oModelView").setProperty("/addQsFlag", false);
                                            this.getModel("oModelView").getData().TrainingDetails.TrainingQuestionnaire.push({
                                                Question: addTr.Question,
                                                TrainingQuestionnaireOptions: addTr.TrainingQuestionnaireOptions,
                                                IsArchived: false
                                            });
                                            this.byId("QuestionnaireOptionsDialog").close();
                                            this.getModel("oModelView").refresh();
                                        } else {
                                            this.byId("QuestionnaireOptionsDialog").close();
                                            this.getModel("oModelView").refresh();
                                        }
                                    }
                                }
                            } else {
                                this.showToast.call(this, "MSG_PLS_ENTER_MAXIMUM_FOUR_OPTIONS");
                            }
                        } else {
                            this.showToast.call(this, "MSG_PLS_ENTER_MINIMUM_TWO_OPTIONS");
                        }
                    }
                },

                closeOptionsDialog: function () {
                    this.byId("QuestionnaireOptionsDialog").close();
                },

                onEditQuestionnaire: function (oEvent) {
                    var addQsFlag = false;
                    this.getModel("oModelView").setProperty("/addQsFlag", addQsFlag);
                    var sPath = oEvent.getSource().getBindingContext("oModelView").getPath(),
                        oButton = oEvent.getSource();
                    var oView = this.getView();
                    var oModelView = this.getModel("oModelView"),
                        oThat = this;
                    var iIndex = oEvent.getSource().getBindingContext("oModelView").getPath().match(/\d$/g);
                    this.getModel("oModelView").setProperty("/iIndex", iIndex);

                    if (!this.byId("QuestionnaireOptionsDialog")) {
                        // load asynchronous XML fragment
                        Fragment.load({
                            id: oView.getId(),
                            name: "com.knpl.pragati.Training_Learning.view.fragments.QuestionnaireOptionsDialog",
                            controller: this
                        }).then(function (oDialog) {
                            // connect dialog to the root view 
                            //of this component (models, lifecycle)
                            oView.addDependent(oDialog);
                            oDialog.bindElement({
                                path: sPath,
                                model: "oModelView"
                            });
                            oDialog.open();
                        });
                    } else {
                        oThat.byId("QuestionnaireOptionsDialog").open();
                        oThat.byId("QuestionnaireOptionsDialog").bindElement({
                            path: sPath,
                            model: "oModelView"
                        });
                    }
                },

                onAddQuestionnaireOptions: function () {
                    var sPath = this.getView().byId("QuestionnaireOptionsDialog").getElementBinding("oModelView").getPath();
                    var oObject = this.getModel("oModelView").getProperty(sPath + "/TrainingQuestionnaireOptions");
                    oObject.push({
                        Option: "",
                        IsCorrect: false,
                        IsArchived: false
                    });
                    this.getModel("oModelView").refresh();
                },

                onDeleteQuestionnaire: function (oEvent) {
                    var iIndex = oEvent.getSource().getBindingContext("oModelView").getPath().match(/\d$/g);
                    function onYes() {
                        if (!this.getModel("oModelView").getData().TrainingDetails.TrainingQuestionnaire[iIndex].Id) {
                            this.getModel("oModelView").getData().TrainingDetails.TrainingQuestionnaire.splice(iIndex, 1);
                        } else {
                            this.getModel("oModelView").getData().TrainingDetails.TrainingQuestionnaire[iIndex].IsArchived = true;
                        }
                        this.getModel("oModelView").refresh();
                    }
                    this.showWarning("MSG_CONFIRM_QUESTION_DELETE", onYes);
                },

                onDeleteQuestionnaireOptions: function (oEvent) {
                    var oView = this.getView();
                    var iOptionIndex = oEvent.getSource().getBindingContext("oModelView").getPath().match(/\d$/g);
                    var addQsFlag = this.getModel("oModelView").getProperty("/addQsFlag");

                    if (addQsFlag === true) {
                        var oAddTrain = this.getModel("oModelView").getProperty("/oAddTraining");
                        oAddTrain.TrainingQuestionnaireOptions.splice(iOptionIndex, 1);
                    } else {
                        var iQuestionIndex = this.getModel("oModelView").getProperty("/iIndex");
                        this.getModel("oModelView").getData().TrainingDetails.TrainingQuestionnaire[iQuestionIndex].TrainingQuestionnaireOptions[iOptionIndex].IsArchived = true;
                    }
                    this.getModel("oModelView").refresh();
                },

                /* 
                 * @function
                 * Save edit or create FAQ details 
                 */
                handleSavePress: function (oEvent) {
                    this._oMessageManager.removeAllMessages();
                    var oViewModel = this.getModel("oModelView");
                    var oPayload = {};
                    debugger;
                    $.extend(true, oPayload, oViewModel.getProperty("/TrainingDetails"));
                    var trainingType = this.getModel("appView").getProperty("/trainingType");
                    if (trainingType === 'ONLINE') {
                        var oValid = this._fnValidationOnline(oPayload);
                    } else if (trainingType === 'VIDEO') {
                        var oValid = this._fnValidationVideo(oPayload);
                    }

                    if (oValid.IsNotValid) {
                        this.showError(this._fnMsgConcatinator(oValid.sMsg));
                        return;
                    }
                    oViewModel.setProperty("/busy", true);
                    if (trainingType === 'ONLINE') {
                        this.CUOperationOnlineTraining(oPayload, oEvent);
                    } else if (trainingType === 'VIDEO') {
                        this.CUOperationVideo(oPayload, oEvent);
                    }
                },

                _fnValidationOnline: function (data) {
                    var oReturn = {
                        IsNotValid: false,
                        sMsg: []
                    },
                        url = data.Url,
                        aCtrlMessage = [];
                    var regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
                    if (data.TrainingSubTypeId === "" || data.TrainingSubTypeId === null) {
                        oReturn.IsNotValid = true;
                        oReturn.sMsg.push("MSG_PLS_SELECT_ERR_TRTYPE");
                        aCtrlMessage.push({
                            message: "MSG_PLS_SELECT_ERR_TRTYPE",
                            target: "/TrainingDetails/TrainingSubTypeId"
                        });
                    } else
                        if (data.Title === "") {
                            oReturn.IsNotValid = true;
                            oReturn.sMsg.push("MSG_PLS_ENTER_ERR_TTL");
                            aCtrlMessage.push({
                                message: "MSG_PLS_ENTER_ERR_TTL",
                                target: "/TrainingDetails/Title"
                            });
                        } else
                            if (data.Url !== "" && !url.match(regex)) {
                                oReturn.IsNotValid = true;
                                oReturn.sMsg.push("MSG_VALDTN_ERR_URL");
                                aCtrlMessage.push({
                                    message: "MSG_VALDTN_ERR_URL",
                                    target: "/TrainingDetails/Url"
                                });
                            } else
                                if (data.StartDate === null) {
                                    oReturn.IsNotValid = true;
                                    oReturn.sMsg.push("MSG_PLS_ENTER_ERR_TSDATE");
                                    aCtrlMessage.push({
                                        message: "MSG_PLS_ENTER_ERR_TSDATE",
                                        target: "/TrainingDetails/StartDate"
                                    });
                                } else
                                    if (data.EndDate === null) {
                                        oReturn.IsNotValid = true;
                                        oReturn.sMsg.push("MSG_PLS_ENTER_ERR_TEDATE");
                                        aCtrlMessage.push({
                                            message: "MSG_PLS_ENTER_ERR_TEDATE",
                                            target: "/TrainingDetails/EndDate"
                                        });
                                    } else
                                        if (data.EndDate <= data.StartDate) {
                                            oReturn.IsNotValid = true;
                                            oReturn.sMsg.push("MSG_ENDDATE_SHOULD_MORE_THAN_STARTDATE");
                                            aCtrlMessage.push({
                                                message: "MSG_ENDDATE_SHOULD_MORE_THAN_STARTDATE",
                                                target: "/TrainingDetails/EndDate"
                                            });
                                        } else
                                            if (data.RewardPoints === "" || data.RewardPoints === null) {
                                                oReturn.IsNotValid = true;
                                                oReturn.sMsg.push("MSG_PLS_ENTER_ERR_REWARD");
                                                aCtrlMessage.push({
                                                    message: "MSG_PLS_ENTER_ERR_REWARD",
                                                    target: "/TrainingDetails/RewardPoints"
                                                });
                                            } else
                                                if (data.RewardPoints == 0) {
                                                    oReturn.IsNotValid = true;
                                                    oReturn.sMsg.push("MSG_ENTER_REWARD_MORETHAN_ZERO");
                                                    aCtrlMessage.push({
                                                        message: "MSG_ENTER_REWARD_MORETHAN_ZERO",
                                                        target: "/TrainingDetails/RewardPoints"
                                                    });
                                                }
                                                else
                                                    if (data.TrainingQuestionnaire.length < 3) {
                                                        oReturn.IsNotValid = true;
                                                        oReturn.sMsg.push("MSG_PLEASE_ENTER_ATLEAST_THREE_QUESTIONS");
                                                        aCtrlMessage.push({
                                                            message: "MSG_PLEASE_ENTER_ATLEAST_THREE_QUESTIONS",
                                                            target: "/TrainingDetails/TrainingQuestionnaire"
                                                        });
                                                    }

                    if (aCtrlMessage.length) this._genCtrlMessages(aCtrlMessage);
                    return oReturn;
                },

                _fnValidationVideo: function (data) {
                    var oReturn = {
                        IsNotValid: false,
                        sMsg: []
                    },
                        url = data.Url,
                        aCtrlMessage = [];
                    var regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
                    if (data.TrainingSubTypeId === "" || data.TrainingSubTypeId === null) {
                        oReturn.IsNotValid = true;
                        oReturn.sMsg.push("MSG_PLS_SELECT_ERR_TRTYPE");
                        aCtrlMessage.push({
                            message: "MSG_PLS_SELECT_ERR_TRTYPE",
                            target: "/TrainingDetails/TrainingSubTypeId"
                        });
                    } else
                        if (data.Title === "") {
                            oReturn.IsNotValid = true;
                            oReturn.sMsg.push("MSG_PLS_ENTER_ERR_TTL");
                            aCtrlMessage.push({
                                message: "MSG_PLS_ENTER_ERR_TTL",
                                target: "/TrainingDetails/Title"
                            });
                        } else
                            if (data.Url === "") {
                                oReturn.IsNotValid = true;
                                oReturn.sMsg.push("MSG_PLS_ENTER_ERR_URL");
                                aCtrlMessage.push({
                                    message: "MSG_PLS_ENTER_ERR_URL",
                                    target: "/TrainingDetails/Url"
                                });
                            } else
                                if (data.Url !== "" && !url.match(regex)) {
                                    oReturn.IsNotValid = true;
                                    oReturn.sMsg.push("MSG_VALDTN_ERR_URL");
                                    aCtrlMessage.push({
                                        message: "MSG_VALDTN_ERR_URL",
                                        target: "/TrainingDetails/Url"
                                    });
                                } else
                                    if (data.Duration === null || data.Duration === "") {
                                        oReturn.IsNotValid = true;
                                        oReturn.sMsg.push("MSG_VALDTN_ERR_DURATION");
                                        aCtrlMessage.push({
                                            message: "MSG_VALDTN_ERR_DURATION",
                                            target: "/TrainingDetails/Duration"
                                        });
                                    } else
                                        if (data.Duration == 0) {
                                            oReturn.IsNotValid = true;
                                            oReturn.sMsg.push("MSG_ENTER_DURATION_MORETHAN_ZERO");
                                            aCtrlMessage.push({
                                                message: "MSG_ENTER_DURATION_MORETHAN_ZERO",
                                                target: "/TrainingDetails/Duration"
                                            });
                                        } else if (data.RewardPoints === "" || data.RewardPoints === null) {
                                            oReturn.IsNotValid = true;
                                            oReturn.sMsg.push("MSG_PLS_ENTER_ERR_REWARD");
                                            aCtrlMessage.push({
                                                message: "MSG_PLS_ENTER_ERR_REWARD",
                                                target: "/TrainingDetails/RewardPoints"
                                            });
                                        } else
                                            if (data.RewardPoints == 0) {
                                                oReturn.IsNotValid = true;
                                                oReturn.sMsg.push("MSG_ENTER_REWARD_MORETHAN_ZERO");
                                                aCtrlMessage.push({
                                                    message: "MSG_ENTER_REWARD_MORETHAN_ZERO",
                                                    target: "/TrainingDetails/RewardPoints"
                                                });
                                            } else
                                                if (data.TrainingQuestionnaire.length < 3) {
                                                    oReturn.IsNotValid = true;
                                                    oReturn.sMsg.push("MSG_PLEASE_ENTER_ATLEAST_THREE_QUESTIONS");
                                                    aCtrlMessage.push({
                                                        message: "MSG_PLEASE_ENTER_ATLEAST_THREE_QUESTIONS",
                                                        target: "/TrainingDetails/TrainingQuestionnaire"
                                                    });
                                                }

                    if (aCtrlMessage.length) this._genCtrlMessages(aCtrlMessage);
                    return oReturn;
                },

                _genCtrlMessages: function (aCtrlMsgs) {
                    var that = this,
                        oViewModel = that.getModel("oModelView");
                    aCtrlMsgs.forEach(function (ele) {
                        that._oMessageManager.addMessages(
                            new sap.ui.core.message.Message({
                                message: that.getResourceBundle().getText(ele.message),
                                type: sap.ui.core.MessageType.Error,
                                target: ele.target,
                                processor: oViewModel,
                                persistent: true
                            }));
                    });
                },

                _fnMsgConcatinator: function (aMsgs) {
                    var that = this;
                    return aMsgs.map(function (x) {
                        return that.getResourceBundle().getText(x);
                    }).join("");
                },

                CUOperationOnlineTraining: function (oPayload, oEvent) {
                    debugger;
                    var oViewModel = this.getModel("oModelView");
                    var trainingType = this.getModel("appView").getProperty("/trainingType");
                    oPayload.TrainingTypeId = parseInt(oPayload.TrainingTypeId);
                    oPayload.Status = parseInt(oPayload.Status);
                    oPayload.TrainingSubTypeId = parseInt(oPayload.TrainingSubTypeId);
                    oPayload.RewardPoints = parseInt(oPayload.RewardPoints);
                    if (oPayload.PainterArcheId) {
                        oPayload.PainterArcheId = parseInt(oPayload.PainterArcheId);
                    }
                    if (oPayload.PainterType) {
                        oPayload.PainterType = parseInt(oPayload.PainterType);
                    }

                    delete oPayload.Duration;
                    delete oPayload.Zones;
                    delete oPayload.Divisions;
                    delete oPayload.Depots;

                    var dateValue = oPayload.StartDate.toDateString();
                    var timeValue = oPayload.StartDate.toLocaleTimeString();
                    var patternDate = "dd/MM/yyyy hh:mm a";
                    var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                        pattern: patternDate
                    });
                    var oDateTime = dateValue + " " + timeValue;
                    var oNow = new Date(oDateTime);
                    oViewModel.setProperty("/TrainingDetails/ViewStartDate", oDateFormat.format(oNow));

                    dateValue = oPayload.EndDate.toDateString();
                    timeValue = oPayload.EndDate.toLocaleTimeString();
                    oDateTime = dateValue + " " + timeValue;
                    oNow = new Date(oDateTime);
                    oViewModel.setProperty("/TrainingDetails/ViewEndDate", oDateFormat.format(oNow));

                    var oClonePayload = $.extend(true, {}, oPayload),
                        that = this;

                    delete oClonePayload.ViewStartDate;
                    delete oClonePayload.ViewEndDate;
                    delete oClonePayload.__metadata;
                    debugger;
                    //Quick fix Training zone depot
                    if (oClonePayload.TrainingDepot && oClonePayload.TrainingDepot.results) {
                        oClonePayload.TrainingDepot = oClonePayload.TrainingDepot.results;
                    }

                    if (oClonePayload.TrainingDivision && oClonePayload.TrainingDivision.results) {
                        oClonePayload.TrainingDivision = oClonePayload.TrainingDivision.results;
                    }

                    if (oClonePayload.TrainingZone && oClonePayload.TrainingZone.results) {
                        oClonePayload.TrainingZone = oClonePayload.TrainingZone.results;
                    }

                    var sKey = that.getModel().createKey("/TrainingSet", {
                        Id: oClonePayload.Id
                    });

                    that.getModel().update(sKey, oClonePayload, {
                        success: that._UploadImageforVideo(sKey, oViewModel.getProperty("/ProfilePic")).then(that._Success.bind(that, oEvent), that._Error.bind(
                            that)),
                        error: that._Error.bind(that)
                    });
                },

                CUOperationVideo: function (oPayload, oEvent) {
                    var oViewModel = this.getModel("oModelView");
                    oPayload.TrainingTypeId = parseInt(oPayload.TrainingTypeId);
                    oPayload.Status = parseInt(oPayload.Status);
                    oPayload.TrainingSubTypeId = parseInt(oPayload.TrainingSubTypeId);
                    oPayload.Duration = parseInt(oPayload.Duration);
                    oPayload.RewardPoints = parseInt(oPayload.RewardPoints);
                    if (oPayload.PainterArcheId) {
                        oPayload.PainterArcheId = parseInt(oPayload.PainterArcheId);
                    }
                    if (oPayload.PainterType) {
                        oPayload.PainterType = parseInt(oPayload.PainterType);
                    }
                    delete oPayload.StartDate;
                    delete oPayload.EndDate;
                    delete oPayload.Zones;
                    delete oPayload.Divisions;
                    delete oPayload.Depots;

                    for (var i = 0; i < oPayload.TrainingQuestionnaire.length; i++) {
                        oPayload.LearningQuestionnaire.push(
                            {
                                Question: oPayload.TrainingQuestionnaire[i].Question,
                                IsArchived: oPayload.TrainingQuestionnaire[i].IsArchived,
                                LearningQuestionnaireOptions: oPayload.TrainingQuestionnaire[i].TrainingQuestionnaireOptions
                            }
                        );
                    }
                    delete oPayload.TrainingQuestionnaire;

                    var oClonePayload = $.extend(true, {}, oPayload),
                        that = this;

                    //Quick fix Training zone depot
                    if (oClonePayload.TrainingDepot && oClonePayload.TrainingDepot.results) {
                        oClonePayload.TrainingDepot = oClonePayload.TrainingDepot.results;
                    }

                    if (oClonePayload.TrainingDivision && oClonePayload.TrainingDivision.results) {
                        oClonePayload.TrainingDivision = oClonePayload.TrainingDivision.results;
                    }

                    if (oClonePayload.TrainingZone && oClonePayload.TrainingZone.results) {
                        oClonePayload.TrainingZone = oClonePayload.TrainingZone.results;
                    }
                    
                    var sKey = that.getModel().createKey("/LearningSet", {
                        Id: oClonePayload.Id
                    });
                    that.getModel().update(sKey, oClonePayload, {
                        success: that._UploadImageforVideo(sKey, oViewModel.getProperty("/ProfilePic")).then(that._Success.bind(that, oEvent), that._Error.bind(
                            that)),
                        error: that._Error.bind(that)
                    });
                },

                _Error: function (error) {
                    MessageToast.show(error.toString());
                },

                _Success: function () {
                    // this.handleCancelPress();
                    var trainingType = this.getModel("appView").getProperty("/trainingType");
                    if (trainingType === 'ONLINE' || trainingType === 'OFFLINE') {
                        MessageToast.show(this.getResourceBundle().getText("MSG_SUCCESS_TRAINING_UPATE"));
                    } else {
                        MessageToast.show(this.getResourceBundle().getText("MSG_SUCCESS_UPDATE"));
                    }
                    var oModel = this.getModel();
                    oModel.refresh(true);
                    this.getRouter().navTo("worklist", true);
                },

                onUpload: function (oEvent) {
                    var oFile = oEvent.getSource().FUEl.files[0];
                    this.getImageBinary(oFile).then(this._fnAddFile.bind(this));
                },

                onImageView: function (oEvent) {
                    var oButton = oEvent.getSource();
                    var oView = this.getView();
                    var oThat = this;
                    if (!oThat.EditImageDialog) {
                        Fragment.load({
                            name: "com.knpl.pragati.Training_Learning.view.fragments.EditImageDialog",
                            controller: oThat,
                        }).then(
                            function (oDialog) {
                                oView.addDependent(oDialog);
                                oThat.EditImageDialog = oDialog;
                                oDialog.open();
                            });
                    } else {
                        oThat.EditImageDialog.open();
                    }
                },

                onPressCloseImageDialog: function () {
                    this.EditImageDialog.close();
                },

                getImageBinary: function (oFile) {
                    var oFileReader = new FileReader();
                    var sFileName = oFile.name;
                    return new Promise(function (res, rej) {

                        if (!(oFile instanceof File)) {
                            res(oFile);
                            return;
                        }

                        oFileReader.onload = function () {
                            res({
                                Image: oFileReader.result,
                                name: sFileName
                            });
                        };
                        res({
                            Image: oFile,
                            name: sFileName
                        });
                    });
                },

                _fnAddFile: function (oItem) {
                    this.getModel("oModelView").setProperty("/ProfilePic", {
                        Image: oItem.Image,
                        FileName: oItem.name,
                        IsArchived: false
                    });

                    this.getModel("oModelView").refresh();
                },

                _UploadImageforVideo: function (sPath, oImage, oEvent) {
                    debugger;
                    var that = this;
                    if (oImage.Image) {
                        var url = "/KNPL_PAINTER_API/api/v2/odata.svc" + sPath + "/$value";
                    }
                    return new Promise(function (res, rej) {
                        if (!oImage.Image) {
                            res();
                            return;
                        }

                        var settings = {
                            url: url,
                            data: oImage.Image,
                            method: "PUT",
                            headers: that.getModel().getHeaders(),
                            contentType: "image/png",
                            processData: false,
                            success: function () {
                                res.apply(that);
                            },
                            error: function () {
                                rej.apply(that);
                            }
                        };

                        $.ajax(settings);
                    });
                },

                _initFilerForTablesEnrollment: function (trainingId) {
                    var oView = this.getView();
                    var aFilters = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter('IsArchived', sap.ui.model.FilterOperator.EQ, false),
                            new sap.ui.model.Filter('TrainingId', sap.ui.model.FilterOperator.EQ, trainingId)
                        ],
                        and: true
                    });
                    oView.byId("idTblEnrollment").getBinding("items").filter(aFilters);
                },

                _initFilerForTablesAttendance: function (trainingId) {
                    var oView = this.getView();
                    var aFilters = new sap.ui.model.Filter({
                        filters: [
                            new sap.ui.model.Filter('IsArchived', sap.ui.model.FilterOperator.EQ, false),
                            new sap.ui.model.Filter('TrainingId', sap.ui.model.FilterOperator.EQ, trainingId)
                        ],
                        and: true
                    });
                    oView.byId("idTblAttendance").getBinding("items").filter(aFilters);
                },

                _toggleButtonsAndView: function (bEdit) {
                    var oView = this.getView();
                    // Show the appropriate action buttons
                    oView.byId("edit").setVisible(!bEdit);
                    oView.byId("save").setVisible(bEdit);
                    oView.byId("cancel").setVisible(bEdit);
                },

                handleCancelPress: function () {
                    this.getRouter().navTo("worklist", true);
                },

                handleEditPress: function () {
                    debugger;
                    var TrainingDetails = this.getModel("oModelView").getProperty("/TrainingDetails");
                    var oView = this.getView();
                    var oViewModel = this.getModel("oModelView");
                    oViewModel.setProperty("/flgCantEditUrlDates", false);
                    // if (TrainingDetails.Status === 0) {
                    this.getModel("appView").setProperty("/EditAttendance", true);
                    // this._toggleButtonsAndView(true);
                    var trainingType = this.getModel("appView").getProperty("/trainingType");
                    var othat = this;
                    var c1, c2, c3;
                    if (trainingType === 'ONLINE' || trainingType === 'VIDEO') {
                        c1 = othat._loadEditTrainingDetail("Edit");
                        c1.then(function () {
                            c2 = othat._loadEditQuestion("Edit");
                            c2.then(function () {
                                c3 = othat._initEditData();
                                c3.then(function () {
                                    othat.getView().getModel("oModelView").refresh(true);
                                    // othat._setCopyForFragment();
                                });
                            });
                        });
                    } else if (trainingType === 'OFFLINE') {
                        c1 = othat._loadEditTrainingDetail("Edit");
                        c1.then(function () {
                            c2 = othat._initEditData();
                            c2.then(function () {
                                othat.getView().getModel("oModelView").refresh(true);
                                // othat._setCopyForFragment();
                            });
                        });
                    }
                },

                // _setCopyForFragment: function () { },

                _initEditData: function () {
                    var oViewModel = this.getModel("oModelView");
                    var fU = this.getView().byId("idAttendanceFileUploader");
                    fU.setValue("");
                    var promise = jQuery.Deferred();
                    var oView = this.getView();
                    var trainingType = this.getModel("appView").getProperty("/trainingType");
                    var TrainingDetails = this.getModel("oModelView").getProperty("/TrainingDetails");
                    debugger;
                    // oView.byId("idTrSubType1").getBinding("items").filter(new Filter("TrainingTypeId", FilterOperator.EQ, TrainingDetails.TrainingTypeId))
                    if (trainingType === 'ONLINE') {
                        var aArray = [];
                        for (var x of TrainingDetails.Zones) {
                            aArray.push({
                                ZoneId: x,
                                TrainingId: this.getModel("oModelView").getProperty("/trainingId")
                            });
                        }
                        oView.getModel("oModelView").setProperty("/TrainingDetails/TrainingZone", aArray);

                        var bArray = [];
                        for (var x of TrainingDetails.Divisions) {
                            bArray.push({
                                DivisionId: x,
                                TrainingId: this.getModel("oModelView").getProperty("/trainingId")
                            });
                        }
                        oView.getModel("oModelView").setProperty("/TrainingDetails/TrainingDivision", bArray);

                        var cArray = [];
                        for (var x of TrainingDetails.Depots) {
                            cArray.push({
                                DepotId: x,
                                TrainingId: this.getModel("oModelView").getProperty("/trainingId")
                            });
                        }
                        oView.getModel("oModelView").setProperty("/TrainingDetails/TrainingDepot", cArray);
                    }
                    promise.resolve();
                    return promise;

                },

                _loadEditTrainingDetail: function (mParam) {
                    var promise = jQuery.Deferred();
                    var oView = this.getView();
                    var othat = this;
                    var oVboxProfile = oView.byId("idVbTrDetails");
                    var sFragName = mParam == "Edit" ? "EditTraining" : "ViewTraining";
                    oVboxProfile.destroyItems();
                    return Fragment.load({
                        id: oView.getId(),
                        controller: othat,
                        name: "com.knpl.pragati.Training_Learning.view.fragments." + sFragName,
                    }).then(function (oControlProfile) {
                        oView.addDependent(oControlProfile);
                        oVboxProfile.addItem(oControlProfile);
                        promise.resolve();
                        return promise;
                    });
                },

                _loadEditQuestion: function (mParam) {
                    var promise = jQuery.Deferred();
                    var oView = this.getView();
                    var othat = this;
                    var oVboxProfile = oView.byId("idVbQuestionnaire");
                    var sFragName = mParam == "Edit" ? "EditQuestionnaire" : "Questionnaire";
                    oVboxProfile.destroyItems();
                    return Fragment.load({
                        id: oView.getId(),
                        controller: othat,
                        name: "com.knpl.pragati.Training_Learning.view.fragments." + sFragName,
                    }).then(function (oControlProfile) {
                        oView.addDependent(oControlProfile);
                        oVboxProfile.addItem(oControlProfile);
                        promise.resolve();
                        return promise;
                    });
                }

            }
        );
    }
);
