// @ts-ignore
sap.ui.define(
    [
        "com/knpl/pragati/SchemeOffers/controller/BaseController",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Sorter",
        "sap/ui/core/Fragment",
        "sap/ui/Device",
        "sap/m/MessageToast",
        "sap/m/MessageBox",
        "sap/ui/core/mvc/XMLView",
        "sap/ui/core/ValueState",
        "com/knpl/pragati/SchemeOffers/controller/Validator",
        "com/knpl/pragati/SchemeOffers/model/customInt",
        "com/knpl/pragati/SchemeOffers/model/cmbxDtype2",
        "com/knpl/pragati/SchemeOffers/model/ArrayDType1",
    ],

    function (
        BaseController,
        Filter,
        FilterOperator,
        JSONModel,
        Sorter,
        Fragment,
        Device,
        MessageToast,
        MessageBox,
        XMLView,
        ValueState,
        Validator,
        customInt,
        cmbxDtype2,
        ArrayDType1
    ) {
        "use strict";

        return BaseController.extend(
            "com.knpl.pragati.SchemeOffers.controller.AddOfferPage", {
            customInt: customInt,
            cmbxDtype2: cmbxDtype2,
            ArrayDType1: ArrayDType1,

            onInit: function () {
                //Router Object
                this.oRouter = this.getRouter();
                sap.ui.getCore().attachValidationError(function (oEvent) {
                    if (oEvent.getParameter("element").getRequired()) {
                        oEvent.getParameter("element").setValueState(ValueState.Error);
                    } else {
                        oEvent.getParameter("element").setValueState(ValueState.None);
                    }
                });
                sap.ui.getCore().attachValidationSuccess(function (oEvent) {
                    oEvent.getParameter("element").setValueState(ValueState.None);
                });


                this.getOwnerComponent()
                    .getRouter()
                    .getRoute("AddOfferPage")
                    .attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                this._initData();
            },

            _initData: function () {
                var oView = this.getView();

                var oBonusValidity = [];

                for (var i = 0; i <= 12; i++) {
                    oBonusValidity.push({
                        key: i
                    });
                }
                var oDataControl = {
                    FormTitle: "Add Offer Details",
                    HasTillDate: false,
                    ImageLoaded: false,
                    BonusValidity: oBonusValidity,
                    RedemptionCycle: [],
                    modeEdit: false,
                    mode: "add",
                    StartDate: "",
                    EndDate: "",
                    MinDate: new Date(),
                    LoggedInUser: {},
                    OfferType: {
                        BasicInformation: true,
                        ApplicableProducts: true,
                        RewardRatio: true,
                        ApplicablePainters: true,
                        ApplicablePainterProducts: true,
                        AdditionalReward: true,
                        EarnedPointsCondition: false,
                        ProductValueCondition: false,
                        RedemptionCycleCondition: false,
                    },
                    Search: {
                        PainterVh: {
                            ZoneId: "",
                            DivisionId: "",
                            DepotId: "",
                            PainterType: "",
                            ArcheType: "",
                            MembershipCard: "",
                            Name: "",
                            Mobile: ""
                        },
                        DepotVh: {
                            DepotId: "",
                            Division: ""
                        }
                    },
                    Dialog: {
                        Bonus1: {},
                        Key1: "",
                        Bonus2: {},
                        Key2: "",
                        ProdVH: "",
                        PackVH: "",
                        ProdVH2: ""
                    },
                    MultiCombo: {
                        Zones: [],
                        Divisions: [],
                        Depots: [],
                        ArcheTypes: [],
                        PainterType: [],
                        Potential: [],
                        PainterProducts: [],
                        ApplicableProducts: [],
                        BonusApplicableProducts: [],
                        PCat1: [],
                        PCat2: [],
                        PCat3: [],
                        PCat4: [],
                        PClass1: [],
                        PClass2: [],
                        PClass3: [],
                        PClass4: [],
                        AppProd1: [],
                        AppProd2: [],
                        AppProd3: [],
                        AppProd4: [],
                        AppPacks1: [],
                        AppPacks2: [],
                        AppPacks3: [],
                        AppPacks4: [],
                        Painters: [],
                        Reward: [],
                        Reward2: [],
                    },
                    Rbtn: {
                        PCat1: 0,
                        PCat2: 0,
                        PCat3: 0,
                        PCat4: 0,
                        PClass1: 0,
                        PClass2: 0,
                        PClass3: 0,
                        PClass4: 0,
                        AppProd1: 0,
                        AppProd2: 0,
                        AppProd3: 0,
                        AppProd4: 0,
                        AppPacks1: 0,
                        AppPacks2: 0,
                        AppPacks3: 0,
                        AppPacks4: 0,
                        Rewards: 0,
                        BRewards: 0,
                        TopAll: 0,
                        Zones: 0,
                        Divisions: 0,
                        Depots: 0,
                        AppPainter: 0,
                        ParentOffer: 0,
                        BrReqVol: 0,
                        BrReqCash: 0,
                        BrReqPercent: 0,
                        Bns2ReqPercent: 0,
                    },
                    MultiEnabled: {
                        PCat1: false,
                        PClass1: false,
                        PClass2: false,
                        AppProd1: false,
                        AppProd2: false,
                        AppPacks1: false,
                        AppPacks2: false,
                        PCat2: false,
                        PCat3: false,
                        PCat4: false,
                        PClass3: false,
                        PClass4: false,
                        AppProd3: false,
                        AppProd4: false,
                        AppPacks3: false,
                        AppPacks4: false,
                        Rewards: false,
                        BRewards: false,
                        Zones: false,
                        Divisions: false,
                        Depots: false,
                        AppPainter: false,
                        ParentOffer: false,
                    },
                    Table: {
                        Table1: [],
                        Table2: [],
                        Table3: [],
                        Table4: [],
                        Table5: [],
                        Table6: [],
                        Table7: [],
                        Table8: [],


                    },
                    oData: {
                        Products: [],
                        Packs: [],
                        PerGrowth: [{
                            Name: "1"
                        },
                        {
                            Name: "2"
                        },
                        {
                            Name: "3"
                        },
                        {
                            Name: "4"
                        },
                        {
                            Name: "5"
                        },
                        ],
                        Rewards: [{
                            key: 1,
                            Name: "TV",
                        },
                        {
                            key: 2,
                            Name: "Washing Machine",
                        },
                        {
                            key: 3,
                            Name: "Fridge",
                        },
                        ],
                    },
                    Fields: {
                        Date1: null,
                        Date2: null,
                        ParentOfferTitle: "",
                        RewardRationCount: 1,
                        PainterCount: ""
                    },
                    Hash: {
                        PCat1: {},
                        PCat2: {},
                        PCat3: {},
                        PCat4: {},
                        PClass1: {},
                        PClass2: {},
                        PClass3: {},
                        PClass4: {},
                        AppProd1: {},
                        AppProd2: {},
                        AppProd3: {},
                        AppProd4: {},
                        AppPack1: {},
                        AppPack2: {},
                        AppPack3: {},
                        AppPack4: {},
                        Potential: {},
                        PainterType: {},
                        ArcheType: {},
                        Zone: {},
                        Division: {},
                        Depot: {},
                        Painter: {}
                    },

                };
                var oConrtrolModel = new JSONModel(oDataControl);

                var oDataView = {
                    OfferTypeId: "",
                    Title: "",
                    Description: "",
                    Criteria: "",
                    StartDate: null,
                    EndDate: null,
                    addInfoEditible:false,
                    IsSpecificZone: false,
                    IsSpecificDivision: false,
                    IsSpecificDepot: false,
                    IsSpecificApplicableProductCategory: false,
                    IsSpecificApplicableProductClassification: false,
                    IsSpecificApplicableProduct: false,
                    IsSpecificApplicablePack: false,
                    IsSpecificRewardRatio: false,
                    PointSlabUpperLimit: "",
                    PointSlabLowerLimit: "",
                    PainterGrowth: "",
                    PurchaseStartDate: null,
                    PurchaseEndDate: null,
                    BonusApplicableTopPainter: "",
                    PerformanceStartDate: null,
                    PerformanceEndDate: null,
                    RedemptionCycle: 1,
                    OfferRewardRatio: [],
                    OfferBonusRewardRatio: [],
                    PainterSelection: 0,
                    OfferSpecificPainter: [],
                    ParentOfferId: 0,
                    BonusDescription: "",
                    InputType: 0,
                    IsMultiRewardAllowed: false,
                    OfferStatus: null,
                    OfferApplicableProductCategory: [],
                    BonusInputType: 0,
                    OfferEarnedPointsCondition: [],
                    OfferProductValueCondition: [],
                    OfferRedemptionCycleCondition: [],
                    IsSpecificAchieverCount: false,
                    OfferAchiever:[],
                    OfferConditions: {
                        IsEarnedPointsCondition: false,
                        IsProductValueCondition: false,
                        IsRedemptionCycleCondition: false
                    }

                    


                };
                var oViewMOdel = new JSONModel(oDataView);
                oView.setModel(oViewMOdel, "oModelView");
                oView.setModel(oConrtrolModel, "oModelControl");

                // adding the fragment
                this._showFormFragment("ChangeDetail2");
                //get products data
                this._getLoggedInUserDeatils();
                this._getProductsData([]);
                this._getPacksData();
                //this._setDefaultValues();
                this._destroyDialogs();
                this._onClearMgsClass();
                //this._SampleFunction();
            },
            _onClearMgsClass: function () {
                // does not remove the manually set ValueStateText we set in onValueStatePress():
                //this._clearPress;
                sap.ui.getCore().getMessageManager().removeAllMessages();
            },

            _SampleFunction: function () {
                this.getView().byId("wizardViewBranching");
            },
            _showFormFragment: function (sFragmentName) {
                var oVbox = this.getView().byId("oVbxSmtTbl");
                var oView = this.getView();
                oVbox.destroyItems();
                var othat = this;
                oVbox.addItem(new XMLView({
                    viewName: "com.knpl.pragati.SchemeOffers.view.fragment.WizardOfferDetails",
                    id: oView.createId("wizardViewBranching")
                }));
                // this._getFormFragment(sFragmentName).then(function (oVBox) {
                //     oView.addDependent(oVBox);
                //     objSection.addItem(oVBox);
                //     othat._enableSteps();
                //     //othat._setDataValue.call(othat);
                //     //othat._setUploadCollectionMethod.call(othat);
                // });

            },

            wizardCompletedHandler: function () {

            },
            onActivate: function () {

            },
            additionalInfoValidation: function () {
                var oWizard = this.getView().byId('CreateProductWizard');
                var name = [];
                oWizard.validateStep(this.byId("ProductInfoStep"));

            },
            _enableSteps: function () {
                var cView = this.getView()
                var oWizard = cView.byId('CreateProductWizard');
                var oStepsL = oWizard.getSteps().length;
                var oStep = this.getView().byId("ProductTypeStep");

                //oWizard.setCurrentStep(this.getView().byId("idStep1"));
                //oWizard.setShowNextButton(true)
                oWizard.goToStep(oStep);

                oWizard.setShowNextButton(false)
                //oSteps.goToStep(cView.byId("idStep1"));
                //oSteps.setShowNextButton(false);
            },

            _getFormFragment: function (sFragmentName) {
                var oView = this.getView();
                var othat = this;
                // if (!this._formFragments) {
                this._formFragments = Fragment.load({
                    id: oView.getId(),
                    name: "com.knpl.pragati.SchemeOffers.view.fragment." + sFragmentName,
                    controller: othat,
                }).then(function (oFragament) {
                    return oFragament;
                });
                // }

                return this._formFragments;
            },

            onPressBreadcrumbLink: function () {
                this._navToHome();
            },

            onPressCancel: function () {
                this._navToHome();
            },

            onPressSave: function () {
                var oView = this.getView();
                var oValidate = new Validator();
                var oForm = oView.byId("vBoxForms");
                var oWizardView = oView.byId("wizardViewBranching");
                var oSteps = oWizardView.byId("CreateProductWizard").getSteps();
                var bFlagValidate = oValidate.validate(oSteps, true);

                var sFile = oWizardView.byId("idFileUpload").oFileUpload.files[0];
                var bFileFlag = false;
                var aTableValidation = this._CheckTableValidation();
                var aTableBonusValidation = this._CheckTableBonusValidation()
                var bTableCondition1 = this._CheckTableCondition1();
                var bTableCondition2 = this._CheckTableCondition2();
                var bTableCondition3 = this._CheckTableCondition3();
                if (bFlagValidate == false) {
                    MessageToast.show("Kindly Input All the Mandatory(*) fields.");
                    return;
                }
                //check if it has file
                if (sFile !== undefined) {
                    bFileFlag = true;
                }
                if (!bFileFlag) {
                    //MessageToast.show("Kindly upload an image to continue.");
                    //return
                }
                if (!aTableValidation[0]) {
                    MessageToast.show(aTableValidation[1]);
                    return;
                }
                if (!aTableBonusValidation[0]) {
                    MessageToast.show(aTableBonusValidation[1]);
                    return;
                }
                if (!bTableCondition1[0]) {
                    MessageToast.show(bTableCondition1[1]);
                    return;
                }
                if (!bTableCondition2[0]) {
                    MessageToast.show(bTableCondition2[1]);
                    return;
                }
                if (!bTableCondition3[0]) {
                    MessageToast.show(bTableCondition3[1]);
                    return;
                }
                //validate the data

                this._postDataToSave(bFileFlag);
            },

            onAfterRendering: function () {
                // this.getView().byId("startDate").setMinDate(new Date());

            },

           
            _postDataToSave: function (bFileFlag) {
                var c1, c1B, c2, c3, c4, c5, c5A, c5A1, c6, c7;
                var othat = this;

                c1 = othat._CreatePayloadPart1();
                //Create PayLoadPart1 Removing the 1.empty values 2. Converting the Values into Ineger;s
                // Create the Payload 2 in this we set the Bolean Values of All/Specific to the respective backend fields;
                // _CreatePayloadPart3 this is used to set the value of the elements in the array
                // create payload 4 and 5 used for table 1,2 and table 3,4
                //othat._CreatePayloadPart2();othat._UploadFile(mParam1, bFileFlag);
                c1.then(function (oPayload) {
                    c1B = othat._CreatePayLoadPart1AForEndDate(oPayload);
                    c1B.then(function (oPayload) {
                        c2 = othat._CreatePayloadPart2(oPayload);
                        c2.then(function (oPayload) {
                            c3 = othat._CreatePayloadPart3(oPayload);
                            c3.then(function (oPayLoad) {
                                c4 = othat._CreatePayLoadPart4(oPayLoad);
                                c4.then(function (oPayLoad) {
                                    c5 = othat._CreatePayLoadPart5(oPayLoad);
                                    c5.then(function (oPayLoad) {
                                        c5A1 = othat._CreatePayLoadConditions(oPayLoad);
                                        c5A1.then(function () {
                                            c5A = othat._CreateWorkFlowData(oPayLoad);
                                            c5A.then(function () {
                                                c6 = othat._CreateOffer(oPayLoad);
                                                c6.then(function (oData) {
                                                    c7 = othat._UploadFile(oData, bFileFlag);
                                                });
                                            })
                                        })
                                    });
                                });
                            });
                        });
                    })
                });
            },
            _CreateOffer: function (oPayLoad) {
                var promise = jQuery.Deferred();
                var othat = this;
                var oView = this.getView();
                var oDataModel = oView.getModel();
                //console.log(oPayLoad);
                return new Promise((resolve, reject) => {
                    oDataModel.create("/OfferSet", oPayLoad, {
                        success: function (data) {
                            MessageToast.show("Offer Successfully Created.");
                            othat._navToHome();
                            resolve(data);
                        },
                        error: function (data) {
                            MessageToast.show("Error In Creating the Schemes.");
                            reject(data);
                        },
                    });
                });
            },
            _UploadFile: function (mParam1, mParam2) {
                var promise = jQuery.Deferred();
                if (!mParam2) {
                    //console.log("no image uploaded")
                    promise.resolve();
                    return promise;
                }
                var oView = this.getView();
                var oWizardView = oView.byId("wizardViewBranching");
                var oFile = oWizardView.byId("idFileUpload").oFileUpload.files[0];
                var sServiceUrl = this.getOwnerComponent(this)
                    .getManifestObject()
                    .getEntry("/sap.app").dataSources.mainService.uri;

                var data = mParam1;
                var sUrl = "/KNPL_PAINTER_API/api/v2/odata.svc/" + "OfferSet(" + data["Id"] + ")/$value";
                new Promise((resolve, reject) => {
                    jQuery.ajax({
                        method: "PUT",
                        url: sUrl,
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: oFile,
                        success: function (data) {
                            resolve();
                        },
                        error: function () {
                            resolve();
                        },
                    });
                });
            },
            _NavBack: function () { },

            _RemoveEmptyValue: function (mParam) {
                var obj = Object.assign({}, mParam);
                // remove string values
                var oNew = Object.entries(obj).reduce(
                    (a, [k, v]) => (v === "" ? a : ((a[k] = v), a)), {}
                );
                // remove the null values
                var oNew2 = Object.entries(oNew).reduce(
                    (a, [k, v]) => (v === null ? a : ((a[k] = v), a)), {}
                );

                return oNew2;
            },
            onUploadFileTypeMis: function () {
                MessageToast.show("Kindly upload a file of type jpg,jpeg,png");
            },
            onExit: function () {

            },

        }
        );
    }
);