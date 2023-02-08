/**
 * Application controller which will have the global scope functions and models and can be accessed through out the application. 
 * Functions and models shared across one or more modules should be implemented here. 
 * For independent modules create module specific controllers and declare it as a nested controller, i.e under the module specific page.
 */
module h5.application { 

     export enum MessageType {
        Information = 0,
        Warning = 1,
        Error = 2,
    }
    export class AppController {
       
        //Array of strings in this property represent names of services to be injected into this controller. Note: The services are declared in app.ts
        static $inject = ["$scope", "configService", "AppService", "RestService", "StorageService", "GridService", "m3UserService", "languageService", "$uibModal", "$interval", "$timeout", "$filter", "$q", "$window", "m3FormService", "$location"];

        constructor(private scope: IAppScope, private configService: h5.application.ConfigService, private appService: h5.application.IAppService, private restService: h5.application.RestService, private storageService: h5.application.StorageService, private gridService: h5.application.GridService, private userService: M3.IUserService, private languageService: h5.application.LanguageService, private $uibModal: ng.ui.bootstrap.IModalService, private $interval: ng.IIntervalService, private $timeout: ng.ITimeoutService, private $filter: h5.application.AppFilter, private $q: ng.IQService, private $window: ng.IWindowService, private formService: M3.FormService, private $location: ng.ILocationService) {
            this.init();
        }

        /**
        * The initialize function which will be called when the controller is created
        */
        private init() {
            this.scope.appReady = false;
            this.scope.loadingData = false;
            this.scope.statusBar = [];
            this.scope.statusBarIsCollapsed = true;
            this.scope.statusBarVisible = true;

            this.languageService.getAppLanguage().then((val: Odin.ILanguage) => {
                this.scope.languageConstants = this.languageService.languageConstants;
                this.initApplication();
            }, (errorResponse: any) => {
                Odin.Log.error("Error getting language constants " + errorResponse);
                this.scope.statusBar.push({ message: "Error getting language constants" + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
            if (this.$window.innerWidth <= 768) {
                this.scope.showSideNavLabel = false;
            } else {
                this.scope.showSideNavLabel = false;
            }
        }

        /**
        * This function will have any application specific initialization functions
        */
        private initApplication() {
            this.initGlobalConfig();
            this.initAppScope();
            this.initUIGrids();
            this.initScopeFunctions();
            this.$timeout(() => { this.scope.appReady = true; }, 5000);
            this.initApplicationConstants();
        }

        /**
        * This function will call the config service and set the global configuration model object with the configured settings 
        */
        private initGlobalConfig() {
            this.configService.getGlobalConfig().then((configData: any) => {
                this.scope.globalConfig = configData;
                this.initLanguage();
                this.initTheme();
                this.getUserContext();
                this.initModule();
            }, (errorResponse: any) => {
                Odin.Log.error("Error while getting global configuration " + errorResponse);
                this.scope.statusBar.push({ message: "Error while getting global configuration " + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
        }

        /**
        * Codes and function calls to initialize Application Scope model
        */
        private initAppScope() {
            //Initialize data objects
            this.scope.transactionStatus = {
                appConfig: false
            };
            this.scope["errorMessages"] = [];
            this.scope.infiniteScroll = {
                numToAdd: 20,
                currentItems: 20
            };
            this.scope.themes = [
                { themeId: 1, themeIcon: 'leanswiftchartreuse.png', themeName: "Theme1Name", panel: "panel-h5-theme-LC", navBar: "navbar-h5-theme-LC", sideNav: "sideNav-h5-theme-LC", button: "h5Button-h5-theme-LC", h5Grid: "h5Grid-h5-theme-LC", h5Dropdown: "h5Dropdown-h5-theme-LC", navTabs: "navtabs-h5-theme-LC", active: false, available: true },
                { themeId: 2, themeIcon: 'royalinfor.png', themeName: "Theme2Name", panel: "panel-h5-theme-RI", navBar: "navbar-h5-theme-RI", sideNav: "sideNav-h5-theme-RI", button: "h5Button-h5-theme-RI", h5Grid: "h5Grid-h5-theme-RI", h5Dropdown: "h5Dropdown-h5-theme-RI", navTabs: "navtabs-h5-theme-RI", active: false, available: true },
                { themeId: 3, themeIcon: 'summersmoothe.png', themeName: "Theme3Name", panel: "panel-h5-theme-SS", navBar: "navbar-h5-theme-SS", sideNav: "sideNav-h5-theme-SS", button: "h5Button-h5-theme-SS", h5Grid: "h5Grid-h5-theme-SS", h5Dropdown: "h5Dropdown-h5-theme-SS", navTabs: "navtabs-h5-theme-SS", active: false, available: true },
                { themeId: 4, themeIcon: 'pumkinspice.png', themeName: "Theme4Name", panel: "panel-h5-theme-PS", navBar: "navbar-h5-theme-PS", sideNav: "sideNav-h5-theme-PS", button: "h5Button-h5-theme-PS", h5Grid: "h5Grid-h5-theme-PS", h5Dropdown: "h5Dropdown-h5-theme-PS", navTabs: "navtabs-h5-theme-PS", active: false, available: true },
                { themeId: 5, themeIcon: 'visionimpared.png', themeName: "Theme5Name", panel: "panel-h5-theme-VI", navBar: "navbar-h5-theme-VI", sideNav: "sideNav-h5-theme-VI", button: "h5Button-h5-theme-VI", h5Grid: "h5Grid-h5-theme-VI", h5Dropdown: "h5Dropdown-h5-theme-VI", navTabs: "navtabs-h5-theme-VI", active: false, available: true },
                { themeId: 6, themeIcon: 'lipstickjungle.png', themeName: "Theme6Name", panel: "panel-h5-theme-LJ", navBar: "navbar-h5-theme-LJ", sideNav: "sideNav-h5-theme-LJ", button: "h5Button-h5-theme-LJ", h5Grid: "h5Grid-h5-theme-LJ", h5Dropdown: "h5Dropdown-h5-theme-LJ", navTabs: "navtabs-h5-theme-LJ", active: false, available: true },
                { themeId: 7, themeIcon: 'silverlining.png', themeName: "Theme7Name", panel: "panel-h5-theme-SL", navBar: "navbar-h5-theme-SL", sideNav: "sideNav-h5-theme-SL", button: "h5Button-h5-theme-SL", h5Grid: "h5Grid-h5-theme-SL", h5Dropdown: "h5Dropdown-h5-theme-SL", navTabs: "navtabs-h5-theme-SL", active: false, available: true },
                { themeId: 8, themeIcon: 'steelclouds.png', themeName: "Theme8Name", panel: "panel-h5-theme-SC", navBar: "navbar-h5-theme-SC", sideNav: "sideNav-h5-theme-SC", button: "h5Button-h5-theme-SC", h5Grid: "h5Grid-h5-theme-SC", h5Dropdown: "h5Dropdown-h5-theme-SC", navTabs: "navtabs-h5-theme-SC", active: false, available: true }
            ];
            this.scope.textures = [
                { textureId: 1, textureIcon: 'diamond.png', textureName: "Wallpaper1Name", appBG: "h5-texture-one", active: false, available: true },
                { textureId: 2, textureIcon: 'grid.png', textureName: "Wallpaper2Name", appBG: "h5-texture-two", active: false, available: true },
                { textureId: 3, textureIcon: 'linen.png', textureName: "Wallpaper3Name", appBG: "h5-texture-three", active: false, available: true },
                { textureId: 4, textureIcon: 'tiles.png', textureName: "Wallpaper4Name", appBG: "h5-texture-four", active: false, available: true },
                { textureId: 5, textureIcon: 'wood.png', textureName: "Wallpaper5Name", appBG: "h5-texture-five", active: false, available: true }
            ];
            this.scope.supportedLanguages = [{ officialTranslations: false, languageCode: "ar-AR", active: false, available: true }, { officialTranslations: false, languageCode: "cs-CZ", active: false, available: true },
                { officialTranslations: false, languageCode: "da-DK", active: false, available: true }, { officialTranslations: false, languageCode: "de-DE", active: false, available: true },
                { officialTranslations: false, languageCode: "el-GR", active: false, available: true }, { officialTranslations: true, languageCode: "en-US", active: true, available: true },
                { officialTranslations: false, languageCode: "es-ES", active: false, available: true }, { officialTranslations: false, languageCode: "fi-FI", active: false, available: true },
                { officialTranslations: true, languageCode: "fr-FR", active: false, available: true }, { officialTranslations: false, languageCode: "he-IL", active: false, available: true },
                { officialTranslations: false, languageCode: "hu-HU", active: false, available: true }, { officialTranslations: false, languageCode: "it-IT", active: false, available: true },
                { officialTranslations: false, languageCode: "ja-JP", active: false, available: true }, { officialTranslations: false, languageCode: "nb-NO", active: false, available: true },
                { officialTranslations: false, languageCode: "nl-NL", active: false, available: true }, { officialTranslations: false, languageCode: "pl-PL", active: false, available: true },
                { officialTranslations: false, languageCode: "pt-PT", active: false, available: true }, { officialTranslations: false, languageCode: "ru-RU", active: false, available: true },
                { officialTranslations: true, languageCode: "sv-SE", active: false, available: true }, { officialTranslations: false, languageCode: "tr-TR", active: false, available: true },
                { officialTranslations: false, languageCode: "zh-CN", active: false, available: true }, { officialTranslations: false, languageCode: "ta-IN", active: false, available: true }
            ];
 
            this.scope.views = { 
                h5Application: { url: "views/Application.html" },
                interfaceItem: { url: "views/InterfaceItem.html" },
                //warehouseBasic: { url: "views/WarehouseBasic.html" },
                //selection: { url: "views/Selection.html" },
                 //basicData: { url: "views/BasicData.html" }
                //sampleModule1: { url: "views/SampleModule1.html" }
            };
            this.scope.modules = [
                { moduleId: 1,activeIcon: 'basic-data.png', inactiveIcon: 'basic-data-na.png', heading: 'Item Creation', content: this.scope.views.interfaceItem.url, active: true, available: true },
                //{ moduleId: 2,activeIcon: 'wh-basic.png', inactiveIcon: 'wh-basic-na.png', heading: 'WH Basic', content: this.scope.views.warehouseBasic.url, active: true, available: true },
            ];
            this.scope.appConfig = {};
            this.scope.userContext = new M3.UserContext();
            this.scope["dateRef"] = new Date();

            //Function calls which initialize module specific data objects
            this.initGlobalSelection();
            this.initInterfaceItem();
            this.initWarehouseBasic();
        }

        /**
        * Initialize Global Selection model
        */
        private initGlobalSelection() {
            this.scope.globalSelection = {
                reload: true,
                transactionStatus: {
                    sampleDataList1: false,
                    sampleDataList2: false,
                    wareDataList: false,
                    uomDataList: false,
                    attributeDataList: false,
                    prdgrpDataList: false,
                    businessareaDataList: false,
                    itemgroupDataList: false,
                    planningPolicyList: false,
                    decimalList: false,
                },
                statusRange: {},
                 statusRangeWH: {},
                AcqCode:{},
                status: { selected: "20" },
                statusWH: { selected: "20" },
                AcqCodeWH: { selected: "2" },
                sampleDataList1: [],
                sampleData1: undefined,
                itemGroupList: [],
                itemGroupData: undefined,
                facilityDataList: [],
                facilityData: undefined,
                uomList: [],
                uomData: undefined,
                attributeList: [],
                attributeData: undefined,
                 prdgrpList: [],
                prdgrpData: undefined,
                 businessareaList: [],
                businessareaData: undefined,
                warehouse: {
                list: [],
                },
                warehouseDataList: [],
                warehouseData: undefined
            };
        }

        /**
        * Initialize the interfaceItem model
        */
        private initInterfaceItem() {
             this.scope.userContext = new M3.UserContext();
            let userContext = this.scope.userContext;
            //console.log("G INSIDE"+ userContext.USID);
            this.scope.interfaceItem = {
                reload: true,
                transactionStatus: {
                    sampleData1: false,
                    sampleList1: false,
                    createItems:false,
                    ItemsList: false,
                    getItemsList: false,
                    assign: false,
                    unassign: false,
                    updateItemsList: false,
                    supplierList: false, 
                    itemsupplier: false,
                    attributes: false,
                    buyerIList: false,
                    responsibleIList: false,
                    defaultresponsibleIList: false,
                },
                enablebutton:true,
                enableFields:true,
                enableDenybutton:false,
                enableUpdate:false,
                enableCreate:true,
                sampleData1: {},
                sampleList1: [],
                sampleGrid1: {},
                itemlinesGrid: {},
                selectedSampleDataGridRow: {},
                collapseSection1: false,
                userSelection: {},
                itemTypeList: [],
                priceList:[],
                supplierList:[],
                responsibleList:[],
                whresponsibleList:[],
                agreementList:[],
                lineIndex: -1,
                requestItem: "",
                authStatus: "",
                itmType: "",
                label:"pcost",
                chkItemType:"",
                chkAquCode:"",
                attrType:"",
                buyerList:[],
                finalITNO : "",
                userInput: {
                  ITNO : ""
                },
                userInput1: {}
                
            };
        }
        
        /**
        * Initialize the initWarehouseBasic model
        */
        private initWarehouseBasic() {
            this.scope.warehouseBasic = {
                reload: true,
                transactionStatus: {
                   itemnumberIList:false,
                    updateItems:false,
                    orderTypesList:false,
                },
                warehouseDataList: [],
                orderTypesList: [],
                orderTypesData: undefined,
                SUWHList: [],
                policydata: undefined,
                policyList: [],
                SUWHdata: undefined,
                itemnumberDataList: [],
                
            };
        }

        /**
        * Initialize the application constants/labels
        */
        private initApplicationConstants() {
            //Add the Constants, Labels, Options which are not need to be hard-coded and used in the application
            //this.scope.sampleModule1.sampleM3Options = [{ id: "1", name: "1-Truck Load" }, { id: "2", name: "2-Train" }, { id: "3", name: "3-Air Charter" }];
        this.scope.globalSelection.statusRange = {
                options: [
                    { id: "10", name: "10-Prel. Item"},
                    { id: "20", name: "20-Released "} 
                   ]
            };
            
            this.scope.globalSelection.itemType = {
                options: [
                    { ITTY: "301", TX40: "USD PARTS"},
                    { ITTY: "302", TX40: "PARTS OEM"},
                    { ITTY: "303", TX40: "CUSTOMER OWNED PARTS"},
                    //{ ITTY: "310", TX40: "VMI PARTS"}, 
                    { ITTY: "401", TX40: "USED EXCHANGE"}, 
                    { ITTY: "402", TX40: "EXCHANGE"} 
                   ]
            };
            
            this.scope.globalSelection.statusRangeWH = {
                options: [
                    { id: "20", name: "20-Released "} 
                   ]
            };
            
            this.scope.globalSelection.AcqCode = {
                options: [
                    { id: "1", name: "1-Manufactured"},
                    { id: "2", name: "2-Purchased"} ,
                    { id: "3", name: "3-Distributed"} ,
                    { id: "6", name: "6-Maintenance"}
                   ]
            };
            //this.loaditemType();
            //this.loadpriceList();
        }

        /**
        * Initialize the binding of controller function mapping with the module scope
        */
        private initScopeFunctions() {
            //Add function binding to the scope models which are required to access from grid scope
            //this.scope.sampleModule1.computeFunction1 = (param1, param2) => { this.computeFunction1(param1, param2); }
          this.scope.interfaceItem.processItems = () => { this.processItem(); }
             this.scope.interfaceItem.validateItem = () => { this.validateItem(); }
            this.scope.interfaceItem.removeSelectedLine = () => { this.removeSelectedLine(); }
             this.scope.interfaceItem.LinesLists = () => { this.LinesLists(); }
            this.scope.interfaceItem.Assign = () => { this.Assign();}
            this.scope.interfaceItem.unAssign = () => { this.unAssign();}
            //this.scope.interfaceItem.UnAssign = () => { this.UnAssign();}
        }

        /**
        * Initialize UI grids objects defined in all modules
        */
        private initUIGrids() {
            //Initialize the grid objects via gridService
            //this.scope.sampleModule1.sampleGrid1 = this.gridService.getSampleGrid1();
            this.scope.interfaceItem.itemlinesGrid =  this.gridService.getitemLines();
            this.initUIGridsOnRegisterApi();
        }

        /**
        * Initialize UI Grid On Register API if required
        */
        private initUIGridsOnRegisterApi() {
            //Initialize the onRegisterApi with the callback functions associated with grid events
//            this.scope.sampleModule1.sampleGrid1.onRegisterApi = (gridApi) => {
//                this.scope.sampleModule1.sampleGrid1.gridApi = gridApi;
//                this.gridService.adjustGridHeight("sampleGrid1", this.scope.sampleModule1.sampleGrid1.data.length, 500);
//
//                gridApi.cellNav.on.viewPortKeyDown(this.scope, (event: any) => {
//                    if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
//                        let cells = gridApi.cellNav.getCurrentSelection();
//                        this.copyCellContentToClipBoard(cells);
//                    }
//                });
//                gridApi.selection.on.rowSelectionChanged(this.scope, (row: any) => {
//                    //called whenever the user select a row
//                    this.sampleDataListGridRowSelected(row);
//                });
//
//                //restore the saved state of the grid which we saved before after the grid rendered successfully
//                gridApi.core.on.renderingComplete(this.scope, (handler: any) => { this.gridService.restoreGridState("sampleGrid1", gridApi); });
//                //save the state of the grid to the browser memory whenever the below events occurs
//                gridApi.core.on.columnVisibilityChanged(this.scope, (handler: any) => { this.gridService.saveGridState("sampleGrid1", gridApi); });
//                gridApi.colMovable.on.columnPositionChanged(this.scope, (handler: any) => { this.gridService.saveGridState("sampleGrid1", gridApi); });
//            };
            
                this.scope.interfaceItem.itemlinesGrid.onRegisterApi = (gridApi) => {
                this.scope.interfaceItem.itemlinesGrid.gridApi = gridApi;
                this.gridService.adjustGridHeight("itemlinesGrid", this.scope.interfaceItem.itemlinesGrid.data.length, 500);

                gridApi.cellNav.on.viewPortKeyDown(this.scope, (event: any) => {
                    if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                        let cells = gridApi.cellNav.getCurrentSelection();
                        this.copyCellContentToClipBoard(cells);
                    }
                });
                gridApi.selection.on.rowSelectionChanged(this.scope, (row: any) => {
                    //called whenever the user select a row
                    //console.log("G inside row selected change selected");
                    //this.RowSelected(row);
                    if (gridApi.selection.getSelectedRows().length == 1) { 
                        this.clearFields();
                        this.clearWHFields();
                        this.checkitemType({ITTY: row.entity.F1A230});
                        this.onRowSelected(row);
                        this.scope.interfaceItem.lineIndex = this.scope.interfaceItem.itemlinesGrid.data.indexOf(row.entity);
                        this.scope.interfaceItem.requestItem = row.entity.F1A230;
                        this.scope.interfaceItem.denymessage = "";
                        //console.log("G inside row selected index selected---"+this.scope.interfaceItem.lineIndex);
                        }else{
                        this.scope.interfaceItem.enableDenybutton = false;
                        this.scope.interfaceItem.denymessage = "";
                        this.clearFields();
                        this.scope.interfaceItem.lineIndex = -1;
                        this.scope.interfaceItem.requestItem = "";
                     }
                });

                //restore the saved state of the grid which we saved before after the grid rendered successfully
                gridApi.core.on.renderingComplete(this.scope, (handler: any) => { this.gridService.restoreGridState("itemlinesGrid", gridApi); });
                //save the state of the grid to the browser memory whenever the below events occurs
                gridApi.core.on.columnVisibilityChanged(this.scope, (handler: any) => { this.gridService.saveGridState("itemlinesGrid", gridApi); });
                gridApi.colMovable.on.columnPositionChanged(this.scope, (handler: any) => { this.gridService.saveGridState("itemlinesGrid", gridApi); });
                //gridApi.core.on.sortChanged(this.scope, (handler: any) => { this.gridService.saveGridState("itemlinesGrid", gridApi); });
            };
        }

        /**
        * Reset UI Grid Column Definitions (Required to reflect if the user changed the application language)
        */
        private resetUIGridsColumnDefs() {
            //Reset UI grids columnDefs
           // this.scope.sampleModule1.sampleGrid1.columnDefs = this.gridService.getSampleGrid1().columnDefs;
        }

        /**
        * Initialize theme on application start
        */
        private initTheme() {
            let themeId = this.storageService.getLocalData('h5.app.appName.theme.selected');
            let textureId = this.storageService.getLocalData('h5.app.appName.texture.selected');
            themeId = angular.isNumber(themeId) ? themeId : angular.isNumber(this.scope.globalConfig.defaultThemeId) ? this.scope.globalConfig.defaultThemeId : 1;
            textureId = angular.isNumber(textureId) ? textureId : angular.isNumber(this.scope.globalConfig.defaultTextureId) ? this.scope.globalConfig.defaultTextureId : 1;
            this.themeSelected(themeId);
            this.textureSelected(textureId);

            this.scope.themes.forEach((theme) => {
                if (this.scope.globalConfig.excludeThemes.indexOf(theme.themeId) > -1) {
                    theme.available = false;
                } else {
                    theme.available = true;
                }
            });
            this.scope.textures.forEach((texture) => {
                if (this.scope.globalConfig.excludeWallpapers.indexOf(texture.textureId) > -1) {
                    texture.available = false;
                } else {
                    texture.available = true;
                }
            });
        }

        /**
        * Initialize module on application start
        */
        private initModule() {
            let moduleId = this.storageService.getLocalData('h5.app.appName.module.selected');
            moduleId = angular.isNumber(moduleId) ? moduleId : 1;
            this.scope.activeModule = moduleId;
            this.scope.modules.forEach((appmodule) => {
                if (angular.equals(moduleId, appmodule.moduleId)) {
                    appmodule.active = true;
                } else {
                    appmodule.active = false;
                }
                if (this.scope.globalConfig.excludeModules.indexOf(appmodule.moduleId) > -1) {
                    appmodule.available = false;
                } else {
                    appmodule.available = true;
                }
            });
        }

        /**
        *  Initialize language on application start
        */
        private initLanguage() {
            let languageCode = this.storageService.getLocalData('h5.app.appName.language.selected');
            languageCode = angular.isString(languageCode) ? languageCode : angular.isString(this.scope.globalConfig.defaultLanguage) ? this.scope.globalConfig.defaultLanguage : "en-US";
            this.scope.currentLanguage = languageCode;
            if (!angular.equals(this.scope.currentLanguage, "en-US")) {
                this.languageService.changeAppLanguage(languageCode).then((val: Odin.ILanguage) => {
                    this.resetUIGridsColumnDefs();
                }, (errorResponse: any) => {
                    Odin.Log.error("Error getting language " + errorResponse);
                    this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });

                });
            }
            this.scope.supportedLanguages.forEach((language) => {
                if (angular.equals(language.languageCode, languageCode)) {
                    language.active = true;
                } else {
                    language.active = false;
                }
                if (this.scope.globalConfig.excludeLanguages.indexOf(language.languageCode) > -1) {
                    language.available = false;
                } else {
                    language.available = true;
                }
            });
        }

        /**
        * Set the application theme
        * @param themeId the theme id
        */
        private themeSelected(themeId: number) {
            this.scope.themes.forEach((theme) => {
                if (angular.equals(theme.themeId, themeId)) {
                    theme.active = true;
                    this.scope.theme = theme;
                } else {
                    theme.active = false;
                }
            });
            this.storageService.setLocalData('h5.app.appName.theme.selected', themeId);
        }

        /**
        * Set the application background
        * @param textureId the texture id
        */
        private textureSelected(textureId: number) {
            this.scope.textures.forEach((texture) => {
                if (angular.equals(texture.textureId, textureId)) {
                    texture.active = true;
                    this.scope.texture = texture;
                } else {
                    texture.active = false;
                }
            });
            this.storageService.setLocalData('h5.app.appName.texture.selected', textureId);
        }

        /**
        * Get User Context for the logged in H5 user
        */
        private getUserContext() {
            Odin.Log.debug("is H5 " + this.userService.isH5() + " is Iframe " + Odin.Util.isIframe());
            this.scope.loadingData = true;
            this.userService.getUserContext().then((val: M3.IUserContext) => {
                this.scope.userContext = val;
                this.loadGlobalData();
            }, (reason: any) => {
                Odin.Log.error("Can't get user context from h5 due to " + reason.errorMessage);
                this.scope.statusBar.push({ message: "Can't get user context from h5 " + [reason.errorMessage], statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });

                this.showError("Can't get user context from h5 ", [reason.errorMessage]);
                this.loadGlobalData();
            });
        }

        /**
        * Launch the H5 program or H5 link when the app runs inside the H5 client
        */
        private launchM3Program(link: string): void {
            Odin.Log.debug("H5 link to launch -->" + link);
            this.formService.launch(link);
        }

        /**
        * Trigger load application data when the user hit a specific key
        */
        private mapKeyUp(event: any) {
            //F4 : 115, ENTER : 13
            if (event.keyCode === 115) {
                //console.log("G CLICKED");
                this.loadApplicationData();
            }
        }

        /**
        * Used by infinite scroll functionality in the ui-select dropdown with large number of records
        */
        private addMoreItemsToScroll() {
            this.scope.infiniteScroll.currentItems += this.scope.infiniteScroll.numToAdd;
        };

        /**
        * Hack function to facilitate copy paste shortcut in ui grid cells
        */
        private copyCellContentToClipBoard(cells: any) {
            let hiddenTextArea = angular.element(document.getElementById("gridClipboard"));
            hiddenTextArea.val("");
            let textToCopy = '', rowId = cells[0].row.uid;
            cells.forEach((cell: any) => {
                textToCopy = textToCopy == '' ? textToCopy : textToCopy + ",";
                let cellValue = cell.row.entity[cell.col.name];
                if (angular.isDefined(cellValue)) {
                    if (cell.row.uid !== rowId) {
                        textToCopy += '\n';
                        rowId = cell.row.uid;
                    }
                    textToCopy += cellValue;
                }

            });
            hiddenTextArea.val(textToCopy);
            hiddenTextArea.select();
        }

        /**
        * Opens About Page in a modal window
        */
        private openAboutPage() {
            let options: any = {
                animation: true,
                templateUrl: "views/About.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens the modal window where user can change the application theme
        */
        private openChangeThemePage() {
            let options: any = {
                animation: true,
                templateUrl: "views/ChangeThemeModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens the modal window where user can change the application wallpaper
        */
        private openChangeWallpaperPage() {
            let options: any = {
                animation: true,
                templateUrl: "views/ChangeWallpaperModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens the modal window where user can change the application language
        */
        private openChangeAppLanguagePage() {
            let options: any = {
                animation: true,
                templateUrl: "views/ChangeLanguageModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Change the application language
        * @param languageCode the language code to change
        */
        private changeAppLanguage(languageCode: string) {
            this.scope.supportedLanguages.forEach((language) => {
                if (angular.equals(language.languageCode, languageCode)) {
                    language.active = true;
                    this.scope.currentLanguage = languageCode;
                } else {
                    language.active = false;
                }
            });
            this.languageService.changeAppLanguage(languageCode).then((val: Odin.ILanguage) => {
                this.scope.appReady = false;
                this.closeModalWindow();
                this.resetUIGridsColumnDefs();
                this.$timeout(() => { this.scope.appReady = true; }, 1000);
            }, (errorResponse: any) => {
                Odin.Log.error("Error getting language " + errorResponse);
                this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
            this.storageService.setLocalData('h5.app.appName.language.selected', languageCode);
        }

        /**
        * Close the modal window if any opened
        */
        private closeModalWindow() {
            this.scope.modalWindow.close("close");
        }

        /**
        * Close the status bar panel in the footer
        */
        private closeStatusBar() {
            this.scope.statusBarIsCollapsed = true;
            this.scope.statusBar = [];
        }

        /**
        * Remove the row item at the status bar
        */
        private removeStatusBarItemAt(index: number): void {
            if (index || index == 0) {
                this.scope.statusBar.splice(this.scope.statusBar.length - 1 - index, 1);
            }
            this.scope.statusBarIsCollapsed = this.scope.statusBar.length == 0;
        };

        /**
        * Show the error message in application error panel
        * @param error the error prefix/description to show
        * @param errorMessages array of error messages to display
        */
        private showError(error: string, errorMessages: string[]) {
            this.scope["hasError"] = true;
            this.scope["error"] = error;
            this.scope["errorMessages"] = errorMessages;
            if (angular.isObject(this.scope["destroyErrMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyErrMsgTimer"]);
            }
            this.scope["destroyErrMsgTimer"] = this.$timeout(() => { this.hideError(); }, 10000);
        }

        /**
        * Function to hide/clear the error messages
        */
        private hideError() {
            this.scope["hasError"] = false;
            this.scope["error"] = null;
            this.scope["errorMessages"] = [];
            if (angular.isObject(this.scope["destroyErrMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyErrMsgTimer"]);
            }
            this.scope["destroyErrMsgTimer"] = undefined;
        }

        /**
         * Show the warning message in application error panel
         * @param warning the warning prefix/description to show
         * @param warningMessages array of warning messages to display
         */
        private showWarning(warning: string, warningMessages: string[]) {
            this.scope["hasWarning"] = true;
            this.scope["warning"] = warning;
            this.scope["warningMessages"] = warningMessages;
            if (angular.isObject(this.scope["destroyWarnMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyWarnMsgTimer"]);
            }
            this.scope["destroyWarnMsgTimer"] = this.$timeout(() => { this.hideWarning(); }, 10000);
        }

        /**
        * Function to hide/clear the warning messages
        */
        private hideWarning() {
            this.scope["hasWarning"] = false;
            this.scope["warning"] = null;
            this.scope["warningMessages"] = null;
            if (angular.isObject(this.scope["destroyWarnMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyWarnMsgTimer"]);
            }
            this.scope["destroyWarnMsgTimer"] = undefined;
        }

        /**
        * Show the info message in application error panel
        * @param info the warning prefix/description to show
        * @param infoMessages array of info messages to display
        */
        private showInfo(info: string, infoMessages: string[]) {
            this.scope["hasInfo"] = true;
            this.scope["info"] = info;
            this.scope["infoMessages"] = infoMessages;
            if (angular.isObject(this.scope["destroyInfoMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyInfoMsgTimer"]);
            }
            this.scope["destroyInfoMsgTimer"] = this.$timeout(() => { this.hideInfo(); }, 10000);
        }

        /**
        * Function to hide/clear the info messages
        */
        private hideInfo() {
            this.scope["hasInfo"] = false;
            this.scope["info"] = null;
            this.scope["infoMessages"] = null;
            if (angular.isObject(this.scope["destroyInfoMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyInfoMsgTimer"]);
            }
            this.scope["destroyInfoMsgTimer"] = undefined;
        }
        
         /**
        * Show the showAuthError message in application error panel
        * @param error the error prefix/description to show
        * @param errorMessages array of error messages to display
        */
        private showAuthError(error: string, autherrorMessages: string[]) {
            this.scope["hasAuthError"] = true;
            this.scope["Autherror"] = error;
            this.scope["errorAuthMessages"] = autherrorMessages;
        }

        /**
        * Add function calls which are required to be called during application load data for the first time 
        */
        private loadGlobalData() {
            let userContext = this.scope.userContext;
            let globalConfig = this.scope.globalConfig;

            this.loadAppConfig(userContext.company, userContext.division, userContext.m3User, globalConfig.environment).then((val: any) => {
                if(angular.equals(this.scope.authStatus,"authorizeSuccess")){
                this.loadSampleDataList1(userContext.company, userContext.m3User);
                //this.loaditemGroupList(userContext.company);
                this.listWarehouse();
                this.loadUOMList();
                this.loaditemType();
                this.loadpriceList();
                this.loadDefaultpriceList();
                //this.loadAttributesList();
                this.loadProductGroup(userContext.company);
                this.loadBusinessArea(userContext.company);
                this.loadplanPolicyList();
                //console.log(userContext.USID);
                //let GEnv:string = "QA - 100-CTOS".substring(0,"QA - 100-CTOS".indexOf("-")).trim();
                //console.log("G Get env"+ GEnv);
                this.scope.interfaceItem.userInput1.USIDD =  { USID: userContext.USID };
                this.scope.interfaceItem.userInput1.WHUSIDD =  { USID: userContext.USID };
                this.scope.interfaceItem.userInput.SUNO = {SUNO:undefined};
                this.listFacility(userContext.company, "");
                this.scope.interfaceItem.warningPrice = true;
                this.loadApplicationData()
                this.loadDefaultFields();
                this.hideWarning();
                }else{
                  let autherrormsg = "User [ " + userContext.m3User + " ] does not have authorization, please contact system administrator.";
                  this.showAuthError(autherrormsg,null);  
                }
            });
        }

        /**
        * Auto selecting an option based on the query parameters or logged in user's details
        */
        private loadDefaultFields() {
            let userContext = this.scope.userContext;
            let appConfig = this.scope.appConfig;
            let division = angular.isString(appConfig.searchQuery.divi) ? appConfig.searchQuery.divi : userContext.division;
            let warehouse = angular.isString(appConfig.searchQuery.whlo) ? appConfig.searchQuery.whlo : userContext.WHLO;
            this.scope.globalSelection.sampleData1 = division;
            this.scope.globalSelection.warehouseData = warehouse;
        }

        /**
        * Upon calling this function will reset the application data for all modules/tabs and load the application data for the active module/tab
        */
        private loadApplicationData() {
            // console.log("G loadApplicationData");
            let categories = ['globalSelection', 'interfaceItem','warehouseBasic'];
            this.clearData(categories);
            this.resetReloadStatus();
            this.loadData(this.scope.activeModule);
        }

        /**
        * Re-initializing or clearing the data based on modules or categories/business logic should be implemented here
        * @param categories the categories to clear data
        */
        private clearData(categories: string[]) {
            categories.forEach((category) => {
                if (category == "globalSelection") {
                    //Reset data from the global selection object
                }
                if (category == "interfaceItem") {
                    //Reset data from the specific module or category
                    //console.log("G interfaceItem");
                    this.scope.globalSelection.warehouseDataList = [];
                    this.scope.globalSelection.itemGroupList = [];
                    this.scope.globalSelection.uomList = [];
                    this.scope.globalSelection.attributeList = [];
                    this.scope.globalSelection.facilityDataList = [];
                    this.scope.interfaceItem.itemTypeList = [];
                    this.scope.interfaceItem.priceList = [];
                    //this.scope.interfaceItem.supplierList = [];
                   // this.scope.interfaceItem.agreementList = [];
                    //this.scope.interfaceItem.userSelection= {};
                   // this.scope.interfaceItem.userInput = {}; 
//                    this.scope.interfaceItem.userInput.IFIN = "";
//            this.scope.interfaceItem.userInput.ITDS = "";
//            this.scope.interfaceItem.userInput.FUDS = "";
//            this.scope.interfaceItem.userInput.PRRF = "";
//            this.scope.interfaceItem.userInput.CUCD = "";
//            this.scope.interfaceItem.userInput.SAPR = "";
//            this.scope.interfaceItem.userInput.FVDT = "";
//            
//            this.scope.interfaceItem.userInput.BUYE = "";
//            this.scope.interfaceItem.userInput.SITE = "";
//            this.scope.interfaceItem.userInput.SITD = "";
//            this.scope.interfaceItem.userInput.SITT = "";
//            //this.scope.interfaceItem.userInput.RESP = "";
//            this.scope.interfaceItem.userInput.RESPD = "";
//            this.scope.interfaceItem.userInput.SUNO = "";
//            this.scope.interfaceItem.userInput.AGNB = "";
//            this.scope.interfaceItem.userInput.AGDT = "";
//            this.scope.interfaceItem.userInput.PUPR = "";
//            this.scope.globalSelection.attributeData = "";
//            this.scope.globalSelection.facilityData = "";
//            this.scope.globalSelection.itemGroupData = "";
//            this.scope.globalSelection.uomData = "";
//            this.scope.globalSelection.prdgrpData = "";
//            this.scope.globalSelection.businessareaData = "";
//            this.scope.globalSelection.warehouseData = "";
//            this.scope.interfaceItem.userSelection.itemType = "";
                }
                if (category == "warehouseBasic") {
                    //Reset data from the specific module or category
                     //console.log("G warehouseBasic");
                    this.scope.warehouseBasic.warehouseDataList = [];
                    this.scope.warehouseBasic.warehouseDataList1 = [];
                    
                }
            });
        }

        /**
        * Code for resetting reload status of all module's to stop showing loading indicator should be implemented here
        */
        private resetReloadStatus() {
            //console.log("G resetReloadStatus");
            this.scope.interfaceItem.reload = true;
            this.scope.warehouseBasic.reload = true;
        }

        /**
        * Call this function from the view when a tab/module is selected to load
        * @param moduleId the selected module id
        */
        private moduleSelected(moduleId: number) {
            //console.log("G moduleSelected");
            this.scope.activeModule = moduleId;
            this.scope.modules.forEach((appmodule) => {
                if (angular.equals(moduleId, appmodule.moduleId)) {
                    appmodule.active = true;
                } else {
                    appmodule.active = false;
                }
            });
            
            switch (this.scope.activeModule) {
                case 1:
                   this.scope.interfaceItem.reload = true; 
                    this.scope.interfaceItem.warningPrice = true;
                    break; 
                case 2:
                    this.scope.warehouseBasic.reload = true; 
                    break;  
            }
//                if(this.scope.activeModule == 1 ){
//                  
//                }
//            if(this.scope.activeModule == 2 ){
//                 
//                }
            this.storageService.setLocalData('h5.app.appName.module.selected', moduleId);
            this.loadData(this.scope.activeModule);
        }

        /**
        * This function will be called whenever the tab is selected, so add the functions calls with respect to the tab id
        * @param activeModule the module to activate/load
        */
        private loadData(activeModule: number) {
            //console.log("G loadData");
            this.refreshTransactionStatus();
            switch (activeModule) {
                case 1:
                    //Call the primary function which is the entry function for the module
                    this.interfaceItem(this.scope.interfaceItem.reload);
                    break;
                case 2:
                    this.warehouseBasic(this.scope.warehouseBasic.reload);
                    break;
                case 3:
                    break;
                case 4:
                    break;
            }
        }

        /**
        * This function will be called to iterate over the transactions states of a tab and set the loading indicator to true if there any running transactions
        */
        private refreshTransactionStatus() {
            //Global Status
            let isLoading = false;
            for (let transaction in this.scope.transactionStatus) {
                let value = this.scope.transactionStatus[transaction];
                if (value == true) {
                    isLoading = true;
                    break;
                }
            }

            for (let transaction in this.scope.globalSelection.transactionStatus) {
                let value = this.scope.globalSelection.transactionStatus[transaction];
                if (value == true) {
                    isLoading = true;
                    break;
                }
            }
            this.scope.loadingData = isLoading;
            if (isLoading) { return; }

            switch (this.scope.activeModule) {
                case 1:
                    for (let transaction in this.scope.interfaceItem.transactionStatus) {
                        let value = this.scope.interfaceItem.transactionStatus[transaction];
                        if (value == true) {
                            isLoading = true;
                            break;
                        }
                    }
                    this.scope.loadingData = isLoading;
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
            }
        }

        //************************************************Application specific functions starts************************************************

        /**
        * Load Application Configurations
        */
        private loadAppConfig(company: string, division: string, user: string, environment: string): ng.IPromise<any> {
            let deferred = this.$q.defer();
            this.scope.appConfig = this.scope.globalConfig.appConfig;
            this.scope.appConfig.searchQuery = this.$location.search();
            if (this.scope.appConfig.enableM3Authority) {
                this.scope.loadingData = true;
                this.scope.transactionStatus.appConfig = true;
                //To restrict functionalities based on logged in user's authority for a M3 Program, use the below service to set and use an authority flag
                let promise1 = this.appService.getAuthority(company, division, user, "CRS610", 1).then((result: boolean) => {
                    //this.scope.appConfig.allowSaveData = result;
                });
                
                let promises = [promise1];
                this.$q.all(promises).finally(() => {
                    deferred.resolve(this.scope.appConfig);
                    this.scope.transactionStatus.appConfig = false;
                    this.refreshTransactionStatus();
                    Odin.Log.debug("Application configurations"+JSON.stringify(this.scope.appConfig));
                });
            } else {
                  this.scope.loadingData = true;
                  this.scope.transactionStatus.appConfig = true;   
                  this.scope.authStatus = "";
                  let promise2 = this.appService.getAccessAuth("CMNUSR", user).then((AccessAuth: M3.IMIResponse) => {
                        AccessAuth.items.forEach((checkCHB1) => {
                        if(checkCHB1.CHB1 == 0){
                           this.scope.authStatus = "authorizeError"; 
                         }else{
                            this.scope.authStatus = "authorizeSuccess";
                         }
                         });

                 }, (err: M3.IMIResponse) => {
                     this.scope.authStatus = "authorizeError";
                 //this.showError("", [err.errorMessage]);
                });
                
                let promisesAuth = [promise2];
                this.$q.all(promisesAuth).finally(() => {
                    deferred.resolve(this.scope.appConfig);
                    this.scope.transactionStatus.appConfig = false;
                    this.refreshTransactionStatus();
                    Odin.Log.debug("Application configurations"+JSON.stringify(this.scope.appConfig));
                });
                //deferred.resolve(this.scope.appConfig);
            }
            return deferred.promise;
        }
        
        /**
        * validateItem
        * @param user the company
        * @param user the m3 user
        */
        private validateItem() {
            
            let ITNO: any;
            let ITNE: any;
            let ITDS: any;
            let ITTY: any;
            let PRRF: any;
            let SUNO: any;
            let AGNB: any;
            let SAPR: any;
            let PUPR: any;
            
            let BUYE: any;
            let RESP: any;
            let ATMO: any;
            let UNMS: any;
            let ITGR: any;
            let BUAR: any;
            let ITCL: any;
            let OVH1: any;
            let OVH2: any;
            //this.loadnewItemNumberWH("0-1210-33629");
            this.scope.interfaceItem.errorType = "createItemWh";
            ITNO = this.scope.interfaceItem.userInput.IFIN;
            ITNE = this.scope.interfaceItem.userInput.ITNE;
            
            ITDS = this.scope.interfaceItem.userInput.ITDS;
            ITTY = this.scope.interfaceItem.userSelection.itemType;
            
            SUNO = this.scope.interfaceItem.userInput.SUNO;
            AGNB = this.scope.interfaceItem.userInput.AGNB;
            SAPR = this.scope.interfaceItem.userInput.SAPR;
            PUPR = this.scope.interfaceItem.userInput.PUPR;
            PUPR = this.scope.interfaceItem.userInput.PUPR;
            
            BUYE = this.scope.interfaceItem.userInput.BUYE;
            
            if (!angular.isUndefined(this.scope.interfaceItem.userInput1.USIDD.USID) ) {
            if (JSON.stringify(this.scope.interfaceItem.userInput1.USIDD.USID) != undefined) {
                RESP = this.scope.interfaceItem.userInput1.USIDD.USID.replace("\"","");
                
                }
            }else{
                RESP = this.scope.interfaceItem.userInput1.USIDD;
                
            }
            
            if (!angular.isUndefined(this.scope.interfaceItem.userInput.SUNO.SUNO) ) {
            if (JSON.stringify(this.scope.interfaceItem.userInput.SUNO.SUNO) != undefined) {
                SUNO = this.scope.interfaceItem.userInput.SUNO.SUNO.replace("\"","");
                
                }
             }else{
                SUNO = this.scope.interfaceItem.userInput.SUNO;
               
              }
            if (ITNO != undefined) {
            if(angular.equals(this.scope.interfaceItem.checkITNO, ITNO)){
                
            }else{
             this.scope.interfaceItem.warningPrice = true;
             this.scope.interfaceItem.checkITNO = ITNO;   
            }
            }
            
             let userContext = this.scope.userContext;
            let GEnv1:string = userContext.TX40.substring(0,userContext.TX40.indexOf("-")).trim(); 
            if (angular.equals("QA", GEnv1)) {
                //console.log("GQA ENV POST"+GEnv1);
            }else if (angular.equals("PRD", GEnv1)){
                //console.log("GPROD ENV POST"+GEnv1);
           }
            
            //ATMO = this.scope.globalSelection.attributeData;
            ATMO = this.scope.interfaceItem.userInput.ATMO;
            UNMS = this.scope.globalSelection.uomData;
            ITGR = this.scope.globalSelection.itemGroupData;
            BUAR = this.scope.globalSelection.businessareaData;
            ITCL = this.scope.globalSelection.prdgrpData;
            OVH1 = this.scope.interfaceItem.userInput.OVH1;
            OVH2 = this.scope.interfaceItem.userInput.OVH2;
            
            this.scope.interfaceItem.enablebutton = false;
            let checkRecord;
            checkRecord = true;
            if (ITNO != undefined && !angular.equals("", ITNO)) {
            if (/[~`!#$%\^&*+=@\_\[\]\\';,/{}()|\\":<>\?]/g.test(ITNO))   
             {
                     checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Item Number, only Allowed special characters are  ' - ' and  ' . '";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
                }
                }
            
//            if (ITNO == undefined || angular.equals("", ITNO) && angular.equals("", ITDS)) {
//                     checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Enter The Item Name";
//                this.showWarning(warningMessage, null);
//                return;
//                }
            
             if (ITTY == undefined || angular.equals("", ITTY)) {
                     checkRecord = false;
                //show warning message
                let warningMessage = "Please Select Item Type";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
            if (angular.equals("301", ITTY)) {
            
            if (ITNO == undefined || angular.equals("", ITNO)) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Item Number";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
            
           }
                
                if (ITNO.slice(-2).toLowerCase().indexOf("to") == -1 && ITNO.toLowerCase().slice(-3).indexOf("usd") == -1 && ITNO.toLowerCase().slice(-2).indexOf("-r") == -1) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Suffix TO or USD or -R has to be added for this item type";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                     }
                
                if (ITNE == undefined || angular.equals("", ITNE)) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Ext Item Number";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
            
           }
                
            
                
             }
            
            
            
            if (angular.equals("303", ITTY)) {
            
            if (ITNO == undefined || angular.equals("", ITNO)) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Item Number";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
            
           }
                if (ITNO.slice(-2).toLowerCase().indexOf("co") == -1) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Suffix CO has to be added for Cust. Owned Parts";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                     }
                
                if (ITNE == undefined || angular.equals("", ITNE)) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Ext Item Number";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
            
           }
           }
            
            
            if (angular.equals("401", ITTY)) {
            
            if (ITNO == undefined || angular.equals("", ITNO)) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Item Number";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
            
           }
                
                if (ITNO.slice(-2).toLowerCase().indexOf("to") == -1 && ITNO.toLowerCase().slice(-3).indexOf("usd") == -1 && ITNO.toLowerCase().slice(-2).indexOf("-r") == -1) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Suffix TO or USD or -R has to be added for this item type";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                     }
                
           }
            
         
             if (ITDS == undefined || angular.equals("", ITDS)) {
                  checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter Item Name";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
            
             if (ITGR == undefined || angular.equals("", ITGR)) {
                  checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter Item Group";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
             if (ITCL == undefined || angular.equals("", ITCL)) {
                  checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter Product Group";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
             if (BUAR == undefined || angular.equals("", BUAR)) {
                  checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter Business Area";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
            if (UNMS == undefined || angular.equals("", UNMS)) {
                  checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter Basic U/M";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
            if (RESP == undefined || angular.equals("", RESP)) {
                  checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter Item Responsible";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
           /* if (BUYE == undefined || angular.equals("", BUYE)) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Buyer";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
            
           }*/
//            if (SUNO == undefined || angular.equals("", SUNO)) {
//               checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Enter Supplier Number";
//                this.showWarning(warningMessage, null);
//                this.scope.interfaceItem.enablebutton = true;
//                return;
//                }
//             if (PRRF == undefined || angular.equals("", PRRF)) {
//                     checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Select Price List";
//                this.showWarning(warningMessage, null);
//                return;
//                }
           
//           if (SUNO != undefined && !angular.equals("", SUNO)) {
//                 if(angular.equals("", AGNB) || AGNB == undefined){
//                     checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Enter Agreement Number";
//                this.showWarning(warningMessage, null);
//                return;
//                }
//                }
             if (angular.equals("302", ITTY) ||angular.equals("301", ITTY) || angular.equals("401", ITTY) || angular.equals("402", ITTY)) {
                if (PUPR == undefined || angular.equals("", PUPR)  || isNaN(PUPR)) {
                     checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter Valid Purchase Price";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
             }

             if (angular.equals("302", ITTY) ||angular.equals("301", ITTY) || angular.equals("401", ITTY) || angular.equals("402", ITTY)) {
                if (parseFloat(PUPR) === 0) {
                     checkRecord = false;
                //show warning message
                let warningMessage = "Valid Purchase Price must be entered.";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                }
             }

            if (angular.equals("302", ITTY)) {
             if (PUPR != undefined && !angular.equals("", PUPR)) {
                 if (AGNB == undefined || angular.equals("", AGNB)) {
                 checkRecord = false;
                //show warning message
                let warningMessage = "Please Select Valid Purchase Agreement";
                this.showWarning(warningMessage, null);
                 this.scope.interfaceItem.enablebutton = true;
                return;
                     }
                }
             }
            
          if (angular.equals("401", ITTY) || angular.equals("402", ITTY)) {
            
           if (OVH1 == undefined || angular.equals("", OVH1) || OVH1 == null) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Core Purchase Cost";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
            
           }
                
                if (OVH2 == undefined || angular.equals("", OVH2)  || OVH2 == null) {
                checkRecord = false;
                //show warning message
                let warningMessage = "Please Enter valid Core Sales Charge";
                this.showWarning(warningMessage, null);
                this.scope.interfaceItem.enablebutton = true;
                 return;
            
           }
           }
            
            
//             if (angular.equals("302", ITTY)) {
//             if (SAPR == undefined || angular.equals("", SAPR) || isNaN(SAPR)) {
//                     checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Enter Valid Sales Price";
//                this.showWarning(warningMessage, null);
//                this.scope.interfaceItem.enablebutton = true;
//                return;
//                }
//             }
            
            
//            if (angular.equals("302", ITTY)) {
//             if (SAPR != undefined && !angular.equals("", SAPR)) {
//                 if (PRRF == undefined || angular.equals("", PRRF)) {
//                 checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Select Valid Price List";
//                this.showWarning(warningMessage, null);
//                 this.scope.interfaceItem.enablebutton = true;
//                return;
//                     }
//                }
//             }
//             if (angular.equals("302", ITTY)) {
//             if (parseFloat(SAPR) < parseFloat(PUPR) && this.scope.interfaceItem.warningPrice) {
//                     checkRecord = false;
//                //show warning message
//                let warningMessage = "Warning: Sales Price is lower than Purchase Price";
//                 this.scope.interfaceItem.warningPrice = false;
//                this.showWarning(warningMessage, null);
//                 this.scope.interfaceItem.enablebutton = true;
//                return;
//                }
//              }
//            
//             if (AGNB != undefined && !angular.equals("", AGNB)) {
//             if (PUPR == undefined || angular.equals("", PUPR)  || isNaN(PUPR)) {
//                     checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Enter Valid Purchase Price";
//                this.showWarning(warningMessage, null);
//                 this.scope.interfaceItem.enablebutton = true;
//                return;
//                }
//              }
//            if (PRRF != undefined && !angular.equals("", PRRF)) {
//            if (SAPR == undefined || angular.equals("", SAPR) || isNaN(SAPR)) {
//                     checkRecord = false;
//                //show warning message
//                let warningMessage = "Please Enter Valid Sales Price";
//                this.showWarning(warningMessage, null);
//                this.scope.interfaceItem.enablebutton = true;
//                return;
//                }
 //          }
            
           if(checkRecord){
                this.processItem();
               }else{
                //console.log("G Else");
            this.scope.interfaceItem.enablebutton = true;    
            }
            
            }
        
        private splitLine() {
             let textToSplit = "G I AM REJECTING THIS ITEM FOR NOT WORKING.";
                      let textBlock="";
                      let currentWord="";
                      let finalString="";
                      let previousline="";
                      let lines: string[];
                      lines = textToSplit.split(" ");
                      //console.log("lines"+lines);
                      lines.forEach((line) => {
                          //console.log("line"+line);
                            textBlock = textBlock + line + " ";
                            currentWord = line + " ";
                           //console.log("textBlock"+textBlock);
                           //console.log("textBlock.length"+textBlock.length);
                            if(textBlock.length > 60){
                            finalString = finalString + previousline + ":";
                            //console.log("finalString"+finalString);
                            textBlock = currentWord;
                            }
                            previousline = textBlock;
                          //console.log("previousline---"+previousline);
                        });
                        finalString = finalString + previousline + ":";
                    //console.log("finalString"+finalString);
            }
        
         /**
        * processItems
        * @param user the company
        * @param user the m3 user
        */
//        private processItem() {
//            let promises = [];
//            let ITNO: any;
//            let ITNE: any;
//            let IFIN: any;
//            let ITDS: any;
//            let FUDS: any;
//            let ITTY: any;
//            let STAT: any;
//            let PRMD = "*IMP";
//            let E0PA = "PLMPROCESS";
//            let E065 = "BOD";
//            let PRRF: any;
//            let CUCD: any;
//            let FVDT: any;
//            let SAPR: any;
//            let SUNO: any;
//            let ATMO: any;
//            let UNMS: any;
//            let ITGR: any;
//            let BUYE: any;
//            let BUAR: any;
//            let ITCL: any;
//            
//            let AGNB: any;
//            let GRPI: any;
//            let PUPR: any;
//            
//           let OVH1: any;
//           let OVH2: any;  
//            
//            this.scope.interfaceItem.enablebutton = false;
//            let itemExists: boolean;
//            let userContext = this.scope.userContext;
//            let RESP = userContext.USID;
//            ITNO =  this.scope.interfaceItem.userInput.IFIN;
//            //console.log("G ITNO"+ITNO);
//            if (ITNO != undefined && !angular.equals("", ITNO)) {
//                ITNO =  ITNO.toUpperCase();
//                 //ITNO =  ITNO.replace(/(?!\w|\s)./g, '').replace(/\s+/g, ' ').replace(/_/g, "").replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
//                }
//            IFIN = this.scope.interfaceItem.userInput.IFIN;
//            ITNE = this.scope.interfaceItem.userInput.ITNE;
//            ITDS = this.scope.interfaceItem.userInput.ITDS;
//            FUDS = this.scope.interfaceItem.userInput.FUDS;
//            ITTY = this.scope.interfaceItem.userSelection.itemType;
//            STAT = this.scope.globalSelection.status.selected;
//            PRRF = this.scope.interfaceItem.userInput.PRRF.selected;
//            //console.log("G this.scope.interfaceItem.userInput.PRRF.selected----"+this.scope.interfaceItem.userInput.PRRF.selected);
//            CUCD = this.scope.interfaceItem.userInput.CUCD;
//            SUNO = this.scope.interfaceItem.userInput.SUNO;
//            BUYE = this.scope.interfaceItem.userInput.BUYE;
//            //RESP = this.scope.interfaceItem.userInput.RESP;
//            //RESP = this.scope.interfaceItem.userInput1.USIDD;
//            if (JSON.stringify(this.scope.interfaceItem.userInput1.USIDD.USID) != undefined) {
//                RESP = this.scope.interfaceItem.userInput1.USIDD.USID.replace("\"","");
//                //this.scope.interfaceItem.userInput1.USIDD =  { USID: RESP };
//                //this.scope.interfaceItem.userInput1.USIDD = RESP;
//                //console.log("G REPLACE----");
//                }else{
//                RESP = this.scope.interfaceItem.userInput1.USIDD;
//                //console.log("G NO REPLACE----");
//            }
//            //console.log("G RESP----"+RESP);
//            //ATMO = this.scope.globalSelection.attributeData;
//            ATMO = this.scope.interfaceItem.userInput.ATMO;
//            UNMS = this.scope.globalSelection.uomData;
//            ITGR = this.scope.globalSelection.itemGroupData;
//            BUAR = this.scope.globalSelection.businessareaData;
//            ITCL = this.scope.globalSelection.prdgrpData;
//            AGNB = this.scope.interfaceItem.userInput.AGNB;
//            GRPI = "40";
//            FVDT = this.scope.interfaceItem.userInput.AGDT;
//            PUPR = this.scope.interfaceItem.userInput.PUPR;
//            if (angular.equals("401", ITTY) || angular.equals("402", ITTY)) {
//            OVH1 = this.scope.interfaceItem.userInput.OVH1;
//            OVH2 = this.scope.interfaceItem.userInput.OVH2;
//            }
//            let date = new Date();
//            date.setMonth(date.getMonth());
//            let fromDate = this.$filter('date')(date, "yyyyMMdd");
//            //console.log("G ITGR" +ITGR);
//            //console.log("G RESP" +RESP);
//            itemExists = false;
//             if(ITNO == undefined){
//                 //console.log("G Inside");
//                 ITNO = "";
//             }
//            if(ITNE == undefined){
//                 //console.log("G Inside");
//                 ITNE = "";
//             }
//            if(RESP == undefined){
//                 RESP = "";
//             }
//            if(UNMS == undefined){
//                 UNMS = "";
//             }
//            if(ITGR == undefined){
//                 ITGR = "";
//             }
//            if(ATMO == undefined){
//                 ATMO = "";
//             }
//            if(ATMO == undefined){
//                 ATMO = "";
//             }
//            if(SUNO == undefined){
//                 SUNO = "";
//             }
//            if(BUYE == undefined){
//                 BUYE = "";
//             }
//            
////             if (ITGR == undefined || angular.equals("", ITGR)) {
////                 ITGR = "UA";
////                }
////             if (ITCL == undefined || angular.equals("", ITCL)) {
////               ITCL = "UA";
////                }
////             if (BUAR == undefined || angular.equals("", BUAR)) {
////               BUAR = "XX";
////                }
//
//                this.scope.loadingData = true;
//                this.scope.interfaceItem.transactionStatus.createItems = true;
//                this.scope.interfaceItem.finalITNO = "";
//                this.appService.processM3Item(userContext.company,ITNO,ITTY,ITDS,ITNE).then((valM3AddItem: M3.IMIResponse)=>{
//                itemExists = true;
//                    //this.$timeout(() => this.onTimerProcess2(ITEM,TIMER) , hoursToMilliSecond);
//                         //console.log("G valM3Item.item.ITNO"+ valM3Item.item.ITNO);
//                    this.appService.getItmRefreshCHNO(valM3AddItem.item.ITNO).then((valM3Item: M3.IMIResponse)=>{
//                    this.appService.UpdItmBasic(userContext.company,STAT,valM3Item.item.ITNO,RESP,UNMS,ITGR,BUAR,ITCL,ATMO,FUDS,valM3Item.item.CHNO).then((valUpdItmBasic: M3.IMIResponse) => {
//                    this.scope.interfaceItem.finalITNO = valM3Item.item.ITNO;
//                    console.log("G FINAL ITNO---"+ this.scope.interfaceItem.finalITNO); 
//                    console.log("G FINAL valM3Item.item.CHNO---"+ valM3Item.item.CHNO); 
//                    this.processAllOperation(valM3Item.item.ITNO,itemExists);
//                    if (angular.equals("401", ITTY) || angular.equals("402", ITTY)) {
//                    this.processAddElementValue("160", valM3Item.item.ITNO ,"NEW", OVH1, fromDate); 
//                    this.processAddElementValue("160", valM3Item.item.ITNO ,"DIRTY", OVH1, fromDate);    
//                    this.processAddElementRate("CORE01", valM3Item.item.ITNO,"NEW", OVH2, fromDate);    
//                    this.processAddElementRate("CORE01", valM3Item.item.ITNO,"DIRTY", OVH2, fromDate); 
//                     }   
//                    this.appService.getItemTypeWarehouse(ITTY).then((valMITYWC: M3.IMIResponse) => {
//                         if(valMITYWC.items.length > 0){
//                        //G Start Agreeline
//                    if((angular.equals("302", ITTY) || angular.equals("402", ITTY)) && !angular.equals("", valM3Item.item.ITNO) && !angular.equals("", SUNO) && SUNO != undefined && !angular.equals("", AGNB) && AGNB != undefined ){
//                         this.appService.getFacilityByItem("",valM3Item.item.ITNO).then((valITMFAC: M3.IMIResponse) => {
//                        valITMFAC.items.forEach((lineRec) => {
//                         //console.log("G INSIDE LOOO ITNO"+ valM3Item.item.ITNO);
//                         //console.log("G INSIDE LOOO faci"+ lineRec.FACI);
//                       this.appService.processAgreementLine(SUNO, AGNB, GRPI,lineRec.FACI, valM3Item.item.ITNO, FVDT,PUPR).then((val1: M3.IMIResponse)=>{
//                       }, (err: M3.IMIResponse)=> {
//                         // let error = "API: " + err.program + "." + err.transaction+ ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
//                          this.showError("Error Processing Agreement Lines (PPS100)", [err.errorMessage]);
//                       // this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
//                      });
//                      // promises.push(promise1);
//                       
//                     });
//
//                 }, (err: M3.IMIResponse) => {
//                 this.showError("Error occurred while retrieving Item/Facility records for Agreement Lines(PPS100)", [err.errorMessage]);
//               });
//                }  
//                         let costingDate: any;
//                         let CostingType: any;
//                         let ProductStructureType: any;
//                         let userContext = this.scope.userContext;
//                         let date1 = new Date();
//                         date1.setMonth(date1.getMonth());
//                             let GEnv:string = userContext.TX40.substring(0,userContext.TX40.indexOf("-")).trim();   
//            if (angular.equals("QA", GEnv)) {
//                         costingDate = this.$filter('date')(date1, "yyMMdd");
//                }else if (angular.equals("PRD", GEnv)){
//                         costingDate = this.$filter('date')(date1, "MMddyy");
//                }
//                         CostingType="3";
//                         ProductStructureType = "001";
//                        //console.log("G costingDate" + costingDate);
//            if(!angular.equals("", valM3Item.item.ITNO) && !angular.equals("", PUPR) && PUPR != undefined && (angular.equals("302", ITTY) ||  angular.equals("301", ITTY))){
//                this.scope.interfaceItem.filteredErrors =[];
//                 this.scope.interfaceItem.errorDisplay = false;
//                this.scope.interfaceItem.counterErrors = 0;
//                        this.appService.getFacilityByItem("",valM3Item.item.ITNO).then((valITMFACWS: M3.IMIResponse) => {
//                        //console.log("G valITMFACWS.items" + valITMFACWS.items.length);
//                            this.scope.interfaceItem.facilityCount = valITMFACWS.items.length;
//                            valITMFACWS.items.forEach((lineRecWS) => {
//                         //console.log("G INSIDE LOOO ITNO"+ valM3Item.item.ITNO);
//                        // console.log("G INSIDE LOOO faci"+ lineRecWS.FACI);
//                         this.PCS260(userContext.CONO, userContext.DIVI,lineRecWS.FACI, valM3Item.item.ITNO,costingDate,CostingType,ProductStructureType,PUPR);
//                         // promises.push(promise1);
//                       
//                     });
//
//                 }, (err: M3.IMIResponse) => {
//                 this.showError("Error occurred while retrieving Item/Facility records for PCS260,", [err.errorMessage]);
//               });
//                } 
//                  //G End Agreeline         
//            
//                valMITYWC.items.forEach((Line) => {
//                         //console.log("G INSIDE LOOO ITNO"+ valM3Item.item.ITNO);
//                         //console.log("G INSIDE LOOO WHLO"+ Line.WHLO);
//                       let promise1 = this.appService.UpdItmWhs(userContext.company,Line.WHLO,valM3Item.item.ITNO,"10",SUNO,BUYE).then((val1: M3.IMIResponse)=>{
//                       }, (err: M3.IMIResponse)=> {
//                          this.showError("Error occurred during Item basic fields update(MMS002),", [err.errorMessage]);
//               });
//                       promises.push(promise1);
//                       
//                     });
//                        
//                 this.appService.UpdItmBasicDetails(userContext.company,valM3Item.item.ITNO,ATMO).then((valUpdItmBasic: M3.IMIResponse) => {
//                 }, (err: M3.IMIResponse) => {
//               this.showError("Error occurred during Item basic fields update(MMS001),", [err.errorMessage]);
//               
//                 });    
//                this.$q.all(promises).then((results: [M3.IMIResponse]) => {
//                this.scope.interfaceItem.transactionStatus.createItems = false;
//                this.refreshTransactionStatus();
//                //this.processAllOperation(valM3Item.item.ITNO,itemExists);
//                    //console.log("G ALL PROCESS FINISHED");
//                    //console.log("G FINAL ITNO ALL PROCESS"+ this.scope.interfaceItem.finalITNO); 
//                    this.showInfo("Item is created successfully " + this.scope.interfaceItem.finalITNO +" .",null);
//                    this.scope.interfaceItem.enablebutton = true;
//                    this.appService.getItmBasic(userContext.company,this.scope.interfaceItem.finalITNO).then((valgetItmBasic: M3.IMIResponse)=>{
//                      //console.log( JSON.stringify(valgetItmBasic.items));
//                     // console.log( JSON.stringify(this.scope.warehouseBasic.ITNOW));
//                      this.scope.warehouseBasic.itemnumberDataList = valgetItmBasic.items;
//                      this.scope.warehouseBasic.ITNOW = { selected: valgetItmBasic.item.ITNO };
//                        //this.itemnumberSelected(valgetItmBasic.item.ITNO);
//                        //this.moduleSelected(2);
//                        this.scope.globalSelection.AcqCodeWH  = { selected: "2" };
//                        if(angular.equals(valgetItmBasic.item.ITTY, "302")){
//                            this.scope.interfaceItem.chkItemType = "302"; 
//                            this.scope.interfaceItem.chkAquCode = "2";
//                            this.defaultAcqCodeSelected("2");
//                    }else{
//                     this.scope.interfaceItem.chkItemType = "";
//                     this.scope.globalSelection.AcqCodeWH =  { selected:""};
//                     this.scope.interfaceItem.chkAquCode = "";
//                     this.scope.warehouseBasic.orderTypesData = "";
//                     this.scope.warehouseBasic.SUWHdata = "";   
//                     this.scope.warehouseBasic.orderTypesList = [];
//                    }
//                        this.scope.warehouseBasic.warehouseDataList = [];
//                        this.scope.warehouseBasic.warehouseDataList1 = [];
//                        this.scope.warehouseBasic.SUWHList = [];
//                        this.loadnewItemNumberWH(valgetItmBasic.item.ITNO);
//                        this.scope.interfaceItem.warningPrice = true;
//                       }, (err: M3.IMIResponse)=> {
//                          //let error = "API: " + err.program + "." + err.transaction+ ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
//                          this.showError("", [err.errorMessage]);
//                        //this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
//               });
//                }).finally(() => {
//                   //console.log("G ALL PROCESS FINISHED finally block");
//                   this.scope.interfaceItem.enablebutton = true;
//                });
//                        }else{
//                           this.scope.interfaceItem.enablebutton = true;  
//                         }
//                }, (err: M3.IMIResponse) => {
//                 this.scope.interfaceItem.enablebutton = true;
//                this.scope.interfaceItem.transactionStatus.createItems = false;
//                this.refreshTransactionStatus();
//                this.showError("Item/Warehouse Records not found (MMS002)", [err.errorMessage]);
//                 });
//                     }, (err: M3.IMIResponse) => {
//                //this.scope.interfaceItem.enablebutton = true;
//                this.scope.interfaceItem.transactionStatus.createItems = false;
//                this.refreshTransactionStatus();
//                //this.showError("Error occurred during Item basic fields update(MMS001)", [err.errorMessage]);
//                this.reprocessItem(userContext.company,STAT,valM3Item.item.ITNO,RESP,UNMS,ITGR,BUAR,ITCL,ATMO,FUDS,
//                itemExists,ITTY,OVH1,OVH2,fromDate,SUNO,AGNB,GRPI,FVDT,PUPR,BUYE,valM3Item.item.CHNO);
//               });
//                    }, (err: M3.IMIResponse)=> {
//                itemExists = false;
//                this.scope.interfaceItem.enablebutton = true;
//                this.scope.interfaceItem.transactionStatus.createItems = false;
//                this.refreshTransactionStatus();
//                this.showError("Item Creation is unsuccessful", [err.errorMessage]);
//               });
//               }, (err: M3.IMIResponse)=> {
//                itemExists = false;
//                this.scope.interfaceItem.enablebutton = true;
//                this.scope.interfaceItem.transactionStatus.createItems = false;
//                this.refreshTransactionStatus();
//                this.showError("Item Creation is unsuccessful", [err.errorMessage]);
//               });
//            
//        }
        
         /**
        * processItems
        * @param user the company
        * @param user the m3 user
        */
        private processItem() {
            let promises = [];
            let ITNO: any;
            let ITNE: any;
            let IFIN: any;
            let ITDS: any;
            let FUDS: any;
            let ITTY: any;
            let STAT: any;
            let PRMD = "*IMP";
            let E0PA = "PLMPROCESS";
            let E065 = "BOD";
            let PRRF: any;
            let CUCD: any;
            let FVDT: any;
            let SAPR: any;
            let SUNO: any;
            let ATMO: any;
            let UNMS: any;
            let ITGR: any;
            let BUYE: any;
            let BUAR: any;
            let ITCL: any;
            
            let AGNB: any;
            let GRPI: any;
            let PUPR: any;
            
           let OVH1: any;
           let OVH2: any;  
            
            this.scope.interfaceItem.enablebutton = false;
            let itemExists: boolean;
            let userContext = this.scope.userContext;
            let RESP = userContext.USID;
            ITNO =  this.scope.interfaceItem.userInput.IFIN;
            //console.log("G ITNO"+ITNO);
            if (ITNO != undefined && !angular.equals("", ITNO)) {
                ITNO =  ITNO.toUpperCase();
                 //ITNO =  ITNO.replace(/(?!\w|\s)./g, '').replace(/\s+/g, ' ').replace(/_/g, "").replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
                }
            IFIN = this.scope.interfaceItem.userInput.IFIN;
            ITNE = this.scope.interfaceItem.userInput.ITNE;
            ITDS = this.scope.interfaceItem.userInput.ITDS;
            FUDS = this.scope.interfaceItem.userInput.FUDS;
            ITTY = this.scope.interfaceItem.userSelection.itemType;
            STAT = this.scope.globalSelection.status.selected;
            PRRF = this.scope.interfaceItem.userInput.PRRF.selected;
            //console.log("G this.scope.interfaceItem.userInput.PRRF.selected----"+this.scope.interfaceItem.userInput.PRRF.selected);
            CUCD = this.scope.interfaceItem.userInput.CUCD;
            SUNO = this.scope.interfaceItem.userInput.SUNO;
            BUYE = this.scope.interfaceItem.userInput.BUYE;
            //RESP = this.scope.interfaceItem.userInput.RESP;
            //RESP = this.scope.interfaceItem.userInput1.USIDD;
            if (JSON.stringify(this.scope.interfaceItem.userInput1.USIDD.USID) != undefined) {
                RESP = this.scope.interfaceItem.userInput1.USIDD.USID.replace("\"","");
                //this.scope.interfaceItem.userInput1.USIDD =  { USID: RESP };
                //this.scope.interfaceItem.userInput1.USIDD = RESP;
                //console.log("G REPLACE----");
                }else{
                RESP = this.scope.interfaceItem.userInput1.USIDD;
                //console.log("G NO REPLACE----");
            }
            if (JSON.stringify(this.scope.interfaceItem.userInput.SUNO.SUNO) != undefined) {
                SUNO = this.scope.interfaceItem.userInput.SUNO.SUNO.replace("\"","");
                }else{
                SUNO = this.scope.interfaceItem.userInput.SUNO;
              }
            //console.log("G RESP----"+RESP);
            //ATMO = this.scope.globalSelection.attributeData;
            ATMO = this.scope.interfaceItem.userInput.ATMO;
            UNMS = this.scope.globalSelection.uomData;
            ITGR = this.scope.globalSelection.itemGroupData;
            BUAR = this.scope.globalSelection.businessareaData;
            ITCL = this.scope.globalSelection.prdgrpData;
            AGNB = this.scope.interfaceItem.userInput.AGNB;
            GRPI = "40";
            FVDT = this.scope.interfaceItem.userInput.AGDT;
            PUPR = this.scope.interfaceItem.userInput.PUPR;
            if (angular.equals("401", ITTY) || angular.equals("402", ITTY)) {
            OVH1 = this.scope.interfaceItem.userInput.OVH1;
            OVH2 = this.scope.interfaceItem.userInput.OVH2;
            }
            let date = new Date();
            date.setMonth(date.getMonth());
            let fromDate = this.$filter('date')(date, "yyyyMMdd");
            //console.log("G ITGR" +ITGR);
            //console.log("G RESP" +RESP);
            itemExists = false;
             if(ITNO == undefined){
                 //console.log("G Inside");
                 ITNO = "";
             }
            if(ITNE == undefined){
                 //console.log("G Inside");
                 ITNE = "";
             }
            if(RESP == undefined){
                 RESP = "";
             }
            if(UNMS == undefined){
                 UNMS = "";
             }
            if(ITGR == undefined){
                 ITGR = "";
             }
            if(ATMO == undefined){
                 ATMO = "";
             }
            if(ATMO == undefined){
                 ATMO = "";
             }
            if(SUNO == undefined){
                 SUNO = "";
             }
            if(BUYE == undefined){
                 BUYE = "";
             }
            
//             if (ITGR == undefined || angular.equals("", ITGR)) {
//                 ITGR = "UA";
//                }
//             if (ITCL == undefined || angular.equals("", ITCL)) {
//               ITCL = "UA";
//                }
//             if (BUAR == undefined || angular.equals("", BUAR)) {
//               BUAR = "XX";
//                }

                this.scope.loadingData = true;
                this.scope.interfaceItem.transactionStatus.createItems = true;
                this.scope.interfaceItem.finalITNO = "";
                this.appService.processM3Item(userContext.company,ITNO,ITTY,ITDS,ITNE).then((valM3AddItem: M3.IMIResponse)=>{
                itemExists = true;
                    this.$timeout(() => this.processdelayItem(valM3AddItem.item.ITNO) , 5000);
                    console.log("G 5 seconds valM3Item.item.ITNO new"+ valM3AddItem.item.ITNO);
                    this.updateItemStatus(valM3AddItem.item.ITNO); 
               }, (err: M3.IMIResponse)=> {
                itemExists = false;
                this.scope.interfaceItem.enablebutton = true;
                this.scope.interfaceItem.transactionStatus.createItems = false;
                this.refreshTransactionStatus();
                this.showError("Item Creation is unsuccessful", [err.errorMessage]);
               });
            
        }
        
        private updateItemStatus(newItemNumber: any){
            //console.log("G newItemNumber---"+newItemNumber);
//            if(!angular.equals("",this.scope.interfaceItem.requestItem) && 
//                angular.equals(newItemNumber,this.scope.interfaceItem.requestItem) &&
//                this.scope.interfaceItem.lineIndex != -1){
             this.appService.updateItemStatus("ITMAPP",newItemNumber,"90").then((valM3AddItem: M3.IMIResponse)=>{
                this.scope.interfaceItem.itemlinesGrid.data.splice(this.scope.interfaceItem.lineIndex, 1);
                this.scope.interfaceItem.lineIndex = -1;
                this.scope.interfaceItem.requestItem = "";
                 //console.log("G REMOVED FROM GRID newItemNumber---"+newItemNumber);
               }, (err: M3.IMIResponse)=> {
                });
              //  }
        }
        
        
         /**
        * processdelayItems
        * @param user the company
        * @param user the m3 user
        */
        private processdelayItem(newItemNumber: any) {
            let promises = [];
            let ITNO: any;
            let ITNE: any;
            let IFIN: any;
            let ITDS: any;
            let FUDS: any;
            let ITTY: any;
            let STAT: any;
            let PRMD = "*IMP";
            let E0PA = "PLMPROCESS";
            let E065 = "BOD";
            let PRRF: any;
            let CUCD: any;
            let FVDT: any;
            let SAPR: any;
            let SUNO: any;
            let ATMO: any;
            let UNMS: any;
            let ITGR: any;
            let BUYE: any;
            let BUAR: any;
            let ITCL: any;
            
            let AGNB: any;
            let GRPI: any;
            let PUPR: any;
            
           let OVH1: any;
           let OVH2: any; 
           let CFI5: any;  

           let MMGRWE: any;
           let MMNEWE: any;
           let MMVOLR: any;
           let MMDIM1: any;
           let MMDIM2: any;
           let MMDIM3: any;
           let MMSPE1: any;
           let MMSPE2: any;
           let MMSPE3: any;

           let VOLDIM1: any;
           let VOLDIM2: any;
           let VOLDIM3: any;
            
            this.scope.interfaceItem.enablebutton = false;
            let itemExists: boolean;
            let userContext = this.scope.userContext;
            let RESP = userContext.USID;
            ITNO =  this.scope.interfaceItem.userInput.IFIN;
            //console.log("G ITNO"+ITNO);
            if (ITNO != undefined && !angular.equals("", ITNO)) {
                ITNO =  ITNO.toUpperCase();
                 //ITNO =  ITNO.replace(/(?!\w|\s)./g, '').replace(/\s+/g, ' ').replace(/_/g, "").replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
                }
            IFIN = this.scope.interfaceItem.userInput.IFIN;
            ITNE = this.scope.interfaceItem.userInput.ITNE;
            ITDS = this.scope.interfaceItem.userInput.ITDS;
            FUDS = this.scope.interfaceItem.userInput.FUDS;
            ITTY = this.scope.interfaceItem.userSelection.itemType;
            STAT = this.scope.globalSelection.status.selected;
            PRRF = this.scope.interfaceItem.userInput.PRRF.selected;
            //console.log("G this.scope.interfaceItem.userInput.PRRF.selected----"+this.scope.interfaceItem.userInput.PRRF.selected);
            CUCD = this.scope.interfaceItem.userInput.CUCD;
            SUNO = this.scope.interfaceItem.userInput.SUNO;
            BUYE = this.scope.interfaceItem.userInput.BUYE;
            //RESP = this.scope.interfaceItem.userInput.RESP;
            //RESP = this.scope.interfaceItem.userInput1.USIDD;
            if (JSON.stringify(this.scope.interfaceItem.userInput1.USIDD.USID) != undefined) {
                RESP = this.scope.interfaceItem.userInput1.USIDD.USID.replace("\"","");
                //this.scope.interfaceItem.userInput1.USIDD =  { USID: RESP };
                //this.scope.interfaceItem.userInput1.USIDD = RESP;
                //console.log("G REPLACE----");
                }else{
                RESP = this.scope.interfaceItem.userInput1.USIDD;
                //console.log("G NO REPLACE----");
            }
            if (JSON.stringify(this.scope.interfaceItem.userInput.SUNO.SUNO) != undefined) {
                SUNO = this.scope.interfaceItem.userInput.SUNO.SUNO.replace("\"","");
                }else{
                SUNO = this.scope.interfaceItem.userInput.SUNO;
              }
            //console.log("G RESP----"+RESP);
            //ATMO = this.scope.globalSelection.attributeData;
            ATMO = this.scope.interfaceItem.userInput.ATMO;
            UNMS = this.scope.globalSelection.uomData;
            ITGR = this.scope.globalSelection.itemGroupData;
            BUAR = this.scope.globalSelection.businessareaData;
            ITCL = this.scope.globalSelection.prdgrpData;
            AGNB = this.scope.interfaceItem.userInput.AGNB;
            GRPI = "40";
            FVDT = this.scope.interfaceItem.userInput.AGDT;
            PUPR = this.scope.interfaceItem.userInput.PUPR;
            if (angular.equals("401", ITTY) || angular.equals("402", ITTY)) {
            OVH1 = this.scope.interfaceItem.userInput.OVH1;
            OVH2 = this.scope.interfaceItem.userInput.OVH2;
            }
           MMGRWE = this.scope.interfaceItem.userInput.MMGRWE;
           MMNEWE = this.scope.interfaceItem.userInput.MMNEWE;
           //MMVOLR = this.scope.interfaceItem.userInput.MMVOLR;
           MMDIM1 = this.scope.interfaceItem.userInput.MMDIM1;
           MMDIM2 = this.scope.interfaceItem.userInput.MMDIM2;
           MMDIM3 = this.scope.interfaceItem.userInput.MMDIM3;
           VOLDIM1 = this.scope.interfaceItem.userInput.MMDIM1;
           VOLDIM2 = this.scope.interfaceItem.userInput.MMDIM2;
           VOLDIM3 = this.scope.interfaceItem.userInput.MMDIM3;
           
           MMSPE1 = this.scope.interfaceItem.userInput.MMSPE1;
           MMSPE2 = this.scope.interfaceItem.userInput.MMSPE2;
           MMSPE3 = this.scope.interfaceItem.userInput.MMSPE3;
         let date = new Date();
            date.setMonth(date.getMonth());
            let fromDate = this.$filter('date')(date, "yyyyMMdd");
            //console.log("G ITGR" +ITGR);
            //console.log("G RESP" +RESP);
            itemExists = false;
             if(ITNO == undefined){
                 //console.log("G Inside");
                 ITNO = "";
             }
            if(ITNE == undefined){
                 //console.log("G Inside");
                 ITNE = "";
             }
            if(RESP == undefined){
                 RESP = "";
             }
            if(UNMS == undefined){
                 UNMS = "";
             }
            if(ITGR == undefined){
                 ITGR = "";
             }
            if(ATMO == undefined){
                 ATMO = "";
             }
            if(ATMO == undefined){
                 ATMO = "";
             }
            if(SUNO == undefined){
                 SUNO = "";
             }
            if(BUYE == undefined){
                 BUYE = "";
             }
            if(MMGRWE === undefined || MMGRWE === null  ||  MMGRWE === ""){MMGRWE = 0;} else if(parseFloat(MMGRWE) < 0){ MMGRWE = 0;}
            if(MMNEWE === undefined || MMNEWE === null || MMNEWE === ""){MMNEWE = 0;} else if(parseFloat(MMNEWE) < 0){ MMNEWE = 0;}
            if(MMDIM1 === undefined || MMDIM1 === "" ||  MMDIM1 === null){MMDIM1 = ""; VOLDIM1 = "0";} else if(parseFloat(MMDIM1) < 0){ MMDIM1 = ""; VOLDIM1 = "0";}
            if(MMDIM2 == undefined  ||  MMDIM2 === "" ||  MMDIM2 === null){MMDIM2 = "";  VOLDIM2 = "0";}else if(parseFloat(MMDIM2) < 0){MMDIM2 = "";  VOLDIM2 = "0"}
            if(MMDIM3 == undefined ||  MMDIM3 === "" ||  MMDIM3 === null){MMDIM3 = "";  VOLDIM3 = "0";}else if(parseFloat(MMDIM3) < 0){MMDIM3 = "";  VOLDIM3 = "0";}
            if(MMSPE1 === undefined || MMSPE1 === "" || MMSPE1 === null){MMSPE1 = "";}else if(parseFloat(MMSPE1) < 0){ MMSPE1 = "";}
            if(MMSPE2 === undefined || MMSPE2 === "" || MMSPE2 === null){MMSPE2 = "";}else if(parseFloat(MMSPE2) < 0){ MMSPE2 = "";}
            if(MMSPE3 === undefined || MMSPE3 === "" || MMSPE3 === null){MMSPE3 = "";}else if(parseFloat(MMSPE3) < 0){ MMSPE3 = "";}
            
            MMVOLR = parseFloat(VOLDIM1) * parseFloat(VOLDIM2) * parseFloat(VOLDIM3) ;
            console.log("G MMVOLR---"+MMVOLR);  
           // MMGRWE,MMNEWE,MMVOLR , MMDIM1,MMDIM2,MMDIM3,MMSPE1,MMSPE2,MMSPE3
            
//             if (ITGR == undefined || angular.equals("", ITGR)) {
//                 ITGR = "UA";
//                }
//             if (ITCL == undefined || angular.equals("", ITCL)) {
//               ITCL = "UA";
//                }
//             if (BUAR == undefined || angular.equals("", BUAR)) {
//               BUAR = "XX";
//                }

                this.scope.loadingData = true;
                this.scope.interfaceItem.transactionStatus.createItems = true;
                this.scope.interfaceItem.finalITNO = "";
                //this.appService.processM3Item(userContext.company,ITNO,ITTY,ITDS,ITNE).then((valM3AddItem: M3.IMIResponse)=>{
                itemExists = true;
                    //this.$timeout(() => this.onTimerProcess2(ITEM,TIMER) , hoursToMilliSecond);
                         //console.log("G valM3Item.item.ITNO"+ valM3Item.item.ITNO);
                    this.appService.getItmRefreshCHNO(newItemNumber).then((valM3Item: M3.IMIResponse)=>{
                        //PTA Part
                     if (this.scope.interfaceItem.PTAPartFlag) { 
                        CFI5 = "2";
                     }else{
                        CFI5 = "";   
                     }
                    this.appService.UpdItmBasic(userContext.company,STAT,valM3Item.item.ITNO,RESP,UNMS,ITGR,BUAR,ITCL,ATMO,FUDS,valM3Item.item.CHNO,PUPR,CFI5,this.scope.interfaceItem.userInput.DCCD,MMGRWE,MMNEWE,MMVOLR).then((valUpdItmBasic: M3.IMIResponse) => {
                    this.scope.interfaceItem.finalITNO = valM3Item.item.ITNO;
                    //console.log("G FINAL ITNO---"+ this.scope.interfaceItem.finalITNO); 
                    //console.log("G FINAL valM3Item.item.CHNO---"+ valM3Item.item.CHNO); 
                    this.processAllOperation(valM3Item.item.ITNO,itemExists);
                    if (angular.equals("401", ITTY)) {
                    this.processAddElementValue("160", valM3Item.item.ITNO ,"NEW", OVH1, fromDate); 
                    this.processAddElementValue("160", valM3Item.item.ITNO ,"DIRTY", OVH1, fromDate);    
                    this.processAddElementRate("CORE01", valM3Item.item.ITNO,"NEW", OVH2, fromDate);    
                    this.processAddElementRate("CORE01", valM3Item.item.ITNO,"DIRTY", OVH2, fromDate); 
                    this.AddItmLot(valM3Item.item.ITNO,"NEW"); 
                    this.AddItmLot(valM3Item.item.ITNO,"DIRTY"); 
                    
                     }   
                        if (angular.equals("402", ITTY)) {
                    this.processAddElementValue("160", valM3Item.item.ITNO ,"NEW", OVH1, "20220101"); 
                    this.processAddElementValue("160", valM3Item.item.ITNO ,"DIRTY", OVH1, "20220101");    
                    this.processAddElementRate("CORE01", valM3Item.item.ITNO,"NEW", OVH2, fromDate);    
                    this.processAddElementRate("CORE01", valM3Item.item.ITNO,"DIRTY", OVH2, fromDate); 
                    this.AddItmLot(valM3Item.item.ITNO,"NEW"); 
                    this.AddItmLot(valM3Item.item.ITNO,"DIRTY"); 
                    
                     } 
                    this.appService.getItemTypeWarehouse(ITTY).then((valMITYWC: M3.IMIResponse) => {
                         if(valMITYWC.items.length > 0){
                        //G Start Agreeline
                    if((angular.equals("302", ITTY) || angular.equals("402", ITTY)) && !angular.equals("", valM3Item.item.ITNO) && !angular.equals("", SUNO) && SUNO != undefined && !angular.equals("", AGNB) && AGNB != undefined ){
                         this.appService.getFacilityByItem("",valM3Item.item.ITNO).then((valITMFAC: M3.IMIResponse) => {
                        valITMFAC.items.forEach((lineRec) => {
                        //Changed from FVDT to current date - fromDate
                       this.appService.processAgreementLine(SUNO, AGNB, GRPI,lineRec.FACI, valM3Item.item.ITNO, fromDate,PUPR).then((val1: M3.IMIResponse)=>{
                       }, (err: M3.IMIResponse)=> {
                         // let error = "API: " + err.program + "." + err.transaction+ ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                          this.showError("Error Processing Agreement Lines (PPS100)", [err.errorMessage]);
                       // this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
                      });
                       //promises.push(promise2);
                       
                     });

                 }, (err: M3.IMIResponse) => {
                 this.showError("Error occurred while retrieving Item/Facility records for Agreement Lines(PPS100)", [err.errorMessage]);
               });
                }  
                         let costingDate: any;
                         let CostingType: any;
                         let ProductStructureType: any;
                         let userContext = this.scope.userContext;
                         let date1 = new Date();
                         date1.setMonth(date1.getMonth());
                             let GEnv:string = userContext.TX40.substring(0,userContext.TX40.indexOf("-")).trim();   
            if (angular.equals("QA", GEnv)) {
                         costingDate = this.$filter('date')(date1, "yyMMdd");
                }else if (angular.equals("PRD", GEnv)){
                         costingDate = this.$filter('date')(date1, "MMddyy");
                }
                         CostingType="3";
                         ProductStructureType = "001";
                        //console.log("G costingDate" + costingDate);
            if(!angular.equals("", valM3Item.item.ITNO) && !angular.equals("", PUPR) && PUPR != undefined && (angular.equals("302", ITTY) ||  angular.equals("301", ITTY))){
                this.scope.interfaceItem.filteredErrors =[];
                 this.scope.interfaceItem.errorDisplay = false;
                this.scope.interfaceItem.counterErrors = 0;
                        this.appService.getFacilityByItem("",valM3Item.item.ITNO).then((valITMFACWS: M3.IMIResponse) => {
                        console.log("G valITMFACWS.items Y--" + valITMFACWS.items.length);
                        this.scope.interfaceItem.facilityCount = valITMFACWS.items.length;
                        valITMFACWS.items.forEach((lineRecWS) => {
                        this.PCS260(userContext.CONO, userContext.DIVI,lineRecWS.FACI, valM3Item.item.ITNO,costingDate,CostingType,ProductStructureType,PUPR);
                     });

                 }, (err: M3.IMIResponse) => {
                 this.showError("Error occurred while retrieving Item/Facility records for PCS260,", [err.errorMessage]);
               });
                } 
                             
                 if(!angular.equals("", valM3Item.item.ITNO) && !angular.equals("", OVH1) && OVH1 != undefined && (angular.equals("401", ITTY) ||  angular.equals("402", ITTY))){
                this.scope.interfaceItem.filteredErrors =[];
                 //this.scope.interfaceItem.errorDisplay = false;
               // this.scope.interfaceItem.counterErrors = 0;
                        this.appService.getFacilityByItem("",valM3Item.item.ITNO).then((valITMFACWS: M3.IMIResponse) => {
                        console.log("G CAS380 DIRTY" + valM3Item.item.ITNO + "----"+OVH1);
                            this.scope.interfaceItem.facilityCount = valITMFACWS.items.length;
                            valITMFACWS.items.forEach((lineRecWS) => {
                        //k cas380 company: any, division: any,facility:any, itemnumber:any,ATA1:any,APPR:any
                         this.CAS380(userContext.CONO, userContext.DIVI,lineRecWS.FACI,valM3Item.item.ITNO,"DIRTY",OVH1);
                       
                     });

                 }, (err: M3.IMIResponse) => {
                 this.showError("Error occurred while retrieving Item/Facility records for CAS380,", [err.errorMessage]);
               });
                }            
                  //G End Agreeline         
            
                valMITYWC.items.forEach((Line) => {
                         //console.log("G INSIDE LOOO ITNO"+ valM3Item.item.ITNO);
                         //console.log("G INSIDE LOOO WHLO"+ Line.WHLO);
                       let promise1 = this.appService.UpdItmWhs(userContext.company,Line.WHLO,valM3Item.item.ITNO,"10",SUNO,BUYE).then((val1: M3.IMIResponse)=>{
                       }, (err: M3.IMIResponse)=> {
                          this.showError("Error occurred during Item basic fields update(MMS002),", [err.errorMessage]);
               });
                       promises.push(promise1);
                       
                     });
                //PTA Part
                        
                /* this.appService.UpdItmBasicDetails(userContext.company,valM3Item.item.ITNO,ATMO,this.scope.interfaceItem.userInput.DCCD).then((valUpdItmBasic: M3.IMIResponse) => {
                 }, (err: M3.IMIResponse) => {
               this.showError("Error occurred during Item basic fields update(MMS001),", [err.errorMessage]);
               
                 }); */
                             
                this.appService.UpdItmPriceDetails(userContext.company,valM3Item.item.ITNO,SUNO).then((valUpdItmBasic: M3.IMIResponse) => {
                    this.appService.UpdItmMeas(userContext.company,valM3Item.item.ITNO,MMDIM1,MMDIM2,MMDIM3,MMSPE1,MMSPE2,MMSPE3).then((valUpdItmMeas: M3.IMIResponse) => {
                    }, (err: M3.IMIResponse) => {
                    this.showError("Error occurred during Item Measure fields update(MMS200MI - UpdItmMeas),", [err.errorMessage]);
                   }); 
                 }, (err: M3.IMIResponse) => {
               this.showError("Error occurred during Item price fields update(Supplier),", [err.errorMessage]);
               this.appService.UpdItmMeas(userContext.company,valM3Item.item.ITNO,MMDIM1,MMDIM2,MMDIM3,MMSPE1,MMSPE2,MMSPE3).then((valUpdItmMeas: M3.IMIResponse) => {
                        }, (err: M3.IMIResponse) => {
                        this.showError("Error occurred during Item Measure fields update(MMS200MI - UpdItmMeas),", [err.errorMessage]);
                    }); 
                 });  
this.$q.all(promises).then((results: [M3.IMIResponse]) => {
                
                //this.processAllOperation(valM3Item.item.ITNO,itemExists);
                    //console.log("G ALL PROCESS FINISHED");
                    //console.log("G FINAL ITNO ALL PROCESS"+ this.scope.interfaceItem.finalITNO); 
                    this.showInfo("Item is created successfully " + this.scope.interfaceItem.finalITNO +" .",null);
                    this.scope.interfaceItem.enablebutton = true;
                    this.appService.getItmBasic(userContext.company,this.scope.interfaceItem.finalITNO).then((valgetItmBasic: M3.IMIResponse)=>{
                      //console.log( JSON.stringify(valgetItmBasic.items));
                     // console.log( JSON.stringify(this.scope.warehouseBasic.ITNOW));
                      this.scope.warehouseBasic.itemnumberDataList = valgetItmBasic.items;
                      this.scope.warehouseBasic.ITNOW = { selected: valgetItmBasic.item.ITNO };
                        //this.itemnumberSelected(valgetItmBasic.item.ITNO);
                        //this.moduleSelected(2);
                        this.scope.globalSelection.AcqCodeWH  = { selected: "2" };
                        if(angular.equals(valgetItmBasic.item.ITTY, "302")){
                            this.scope.interfaceItem.chkItemType = "302"; 
                            this.scope.interfaceItem.chkAquCode = "2";
                            this.defaultAcqCodeSelected("2");
                    }else{
                     this.scope.interfaceItem.chkItemType = "";
                     this.scope.globalSelection.AcqCodeWH =  { selected:""};
                     this.scope.interfaceItem.chkAquCode = "";
                     this.scope.warehouseBasic.orderTypesData = "";
                     this.scope.warehouseBasic.SUWHdata = "";   
                     this.scope.warehouseBasic.orderTypesList = [];
                    }
                        this.scope.warehouseBasic.warehouseDataList = [];
                        this.scope.warehouseBasic.warehouseDataList1 = [];
                        this.scope.warehouseBasic.SUWHList = [];
                        this.scope.warehouseBasic.policydata = "";
                        this.loadnewItemNumberWH(valgetItmBasic.item.ITNO);
                        this.scope.interfaceItem.warningPrice = true;
                       }, (err: M3.IMIResponse)=> {
                          //let error = "API: " + err.program + "." + err.transaction+ ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                          this.showError("", [err.errorMessage]);
                        //this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
               });
                }).finally(() => {
                   //console.log("G ALL PROCESS FINISHED finally block");
                    this.scope.interfaceItem.enablebutton = true;
                    this.scope.interfaceItem.transactionStatus.createItems = false;
                    this.refreshTransactionStatus();
                });
                        }else{
                          this.scope.interfaceItem.enablebutton = true;
                          this.scope.interfaceItem.transactionStatus.createItems = false;
                          this.refreshTransactionStatus();  
                         }
                }, (err: M3.IMIResponse) => {
                 this.scope.interfaceItem.enablebutton = true;
                this.scope.interfaceItem.transactionStatus.createItems = false;
                this.refreshTransactionStatus();
                this.showError("Item/Warehouse Records not found (MMS002)", [err.errorMessage]);
                 });
                     }, (err: M3.IMIResponse) => {
                //this.scope.interfaceItem.enablebutton = true;
                this.scope.interfaceItem.transactionStatus.createItems = false;
                this.refreshTransactionStatus();
                //this.showError("Error occurred during Item basic fields update(MMS001)", [err.errorMessage]);
                this.reprocessItem(userContext.company,STAT,valM3Item.item.ITNO,RESP,UNMS,ITGR,BUAR,ITCL,ATMO,FUDS,
                itemExists,ITTY,OVH1,OVH2,fromDate,SUNO,AGNB,GRPI,FVDT,PUPR,BUYE,valM3Item.item.CHNO,MMGRWE,MMNEWE,MMVOLR,MMDIM1,MMDIM2,MMDIM3,MMSPE1,MMSPE2,MMSPE3);
               });
                    }, (err: M3.IMIResponse)=> {
                itemExists = false;
                this.scope.interfaceItem.enablebutton = true;
                this.scope.interfaceItem.transactionStatus.createItems = false;
                this.refreshTransactionStatus();
                this.showError("Item Creation is unsuccessful", [err.errorMessage]);
               });

            
        }
        
        private reprocessItem(company:string ,STAT: any,ITNO: any,RESP: any,UNMS: any,ITGR: any,BUAR: any,ITCL: any,ATMO: any,FUDS: any,
        itemExists:boolean,ITTY: any,OVH1: any,OVH2: any,fromDate: any,SUNO: any,AGNB: any,GRPI: any,FVDT: any,PUPR: any,BUYE: any,CHNO: any,MMGRWE: any,MMNEWE: any,MMVOLR: any, MMDIM1: any,MMDIM2: any,MMDIM3: any,MMSPE1: any,MMSPE2: any,MMSPE3: any) {
                this.scope.loadingData = true;
                this.scope.interfaceItem.transactionStatus.createItems = true;
            let promises = [];
                 this.appService.getItmRefreshCHNO(ITNO).then((valM3Item: M3.IMIResponse)=>{
                    let CFI5: any;
                    CFI5 = "";
                    if (this.scope.interfaceItem.PTAPartFlag) { 
                        CFI5 = "2";
                     }else{
                        CFI5 = "";   
                     }
                    this.appService.UpdItmBasic(company,STAT,ITNO,RESP,UNMS,ITGR,BUAR,ITCL,ATMO,FUDS,valM3Item.item.CHNO,PUPR,CFI5,this.scope.interfaceItem.userInput.DCCD,MMGRWE,MMNEWE,MMVOLR).then((valUpdItmBasic: M3.IMIResponse) => {
                    this.scope.interfaceItem.finalITNO = ITNO;
                    this.processAllOperation(ITNO,itemExists);
                    if (angular.equals("401", ITTY) ) {
                    this.processAddElementValue("160", ITNO ,"NEW", OVH1, fromDate); 
                    this.processAddElementValue("160", ITNO ,"DIRTY", OVH1, fromDate);    
                    this.processAddElementRate("CORE01", ITNO,"NEW", OVH2, fromDate);    
                    this.processAddElementRate("CORE01", ITNO,"DIRTY", OVH2, fromDate); 
                    this.AddItmLot(valM3Item.item.ITNO,"NEW"); 
                    this.AddItmLot(valM3Item.item.ITNO,"DIRTY"); 
                    }   
                        if (angular.equals("402", ITTY)) {
                    this.processAddElementValue("160", ITNO ,"NEW", OVH1, "20220101"); 
                    this.processAddElementValue("160", ITNO ,"DIRTY", OVH1, "20220101");    
                    this.processAddElementRate("CORE01", ITNO,"NEW", OVH2, fromDate);    
                    this.processAddElementRate("CORE01", ITNO,"DIRTY", OVH2, fromDate); 
                    this.AddItmLot(valM3Item.item.ITNO,"NEW"); 
                    this.AddItmLot(valM3Item.item.ITNO,"DIRTY"); 
                    }  
                    this.appService.getItemTypeWarehouse(ITTY).then((valMITYWC: M3.IMIResponse) => {
                         if(valMITYWC.items.length > 0){
                    if((angular.equals("302", ITTY) || angular.equals("402", ITTY)) && !angular.equals("", ITNO) && !angular.equals("", SUNO) && SUNO != undefined && !angular.equals("", AGNB) && AGNB != undefined ){
                         this.appService.getFacilityByItem("",ITNO).then((valITMFAC: M3.IMIResponse) => {
                        valITMFAC.items.forEach((lineRec) => {
                            //Changed from FVDT to current date - fromDate
                       this.appService.processAgreementLine(SUNO, AGNB, GRPI,lineRec.FACI, ITNO, fromDate,PUPR).then((val1: M3.IMIResponse)=>{
                       }, (err: M3.IMIResponse)=> {
                          this.showError("Error Processing Agreement Lines (PPS100)", [err.errorMessage]);
                      });
                       
                     });

                 }, (err: M3.IMIResponse) => {
                 this.showError("Error occurred while retrieving Item/Facility records for Agreement Lines(PPS100)", [err.errorMessage]);
               });
                }  
                         let costingDate: any;
                         let CostingType: any;
                         let ProductStructureType: any;
                         let userContext = this.scope.userContext;
                         let date1 = new Date();
                         date1.setMonth(date1.getMonth());
                             let GEnv:string = userContext.TX40.substring(0,userContext.TX40.indexOf("-")).trim();   
            if (angular.equals("QA", GEnv)) {
                         costingDate = this.$filter('date')(date1, "yyMMdd");
                }else if (angular.equals("PRD", GEnv)){
                         costingDate = this.$filter('date')(date1, "MMddyy");
                }
                         CostingType="3";
                         ProductStructureType = "001";
                       
            if(!angular.equals("", ITNO) && !angular.equals("", PUPR) && PUPR != undefined && (angular.equals("302", ITTY) ||  angular.equals("301", ITTY))){
                this.scope.interfaceItem.filteredErrors =[];
                 this.scope.interfaceItem.errorDisplay = false;
                this.scope.interfaceItem.counterErrors = 0;
                        this.appService.getFacilityByItem("",ITNO).then((valITMFACWS: M3.IMIResponse) => {
                        
                            this.scope.interfaceItem.facilityCount = valITMFACWS.items.length;
                            valITMFACWS.items.forEach((lineRecWS) => {
                        this.PCS260(userContext.CONO, userContext.DIVI,lineRecWS.FACI, ITNO,costingDate,CostingType,ProductStructureType,PUPR);
                         
                       
                     });

                 }, (err: M3.IMIResponse) => {
                 this.showError("Error occurred while retrieving Item/Facility records for PCS260,", [err.errorMessage]);
               });
                } 
                             
                             
                if(!angular.equals("", ITNO) && !angular.equals("", OVH1) && OVH1 != undefined && (angular.equals("401", ITTY) ||  angular.equals("402", ITTY))){
                this.scope.interfaceItem.filteredErrors =[];
                 //this.scope.interfaceItem.errorDisplay = false;
                //this.scope.interfaceItem.counterErrors = 0;
                        this.appService.getFacilityByItem("",ITNO).then((valITMFACWS: M3.IMIResponse) => {
                        console.log("G CAS380 DIRTY "+ITNO +"----"+OVH1);
                            this.scope.interfaceItem.facilityCount = valITMFACWS.items.length;
                            valITMFACWS.items.forEach((lineRecWS) => {
                       //k cas380 company: any, division: any,facility:any, itemnumber:any,ATA1:any,APPR:any
                         this.CAS380(userContext.CONO, userContext.DIVI,lineRecWS.FACI,ITNO,"DIRTY",OVH1);  
                       
                     });

                 }, (err: M3.IMIResponse) => {
                 this.showError("Error occurred while retrieving Item/Facility records for CAS380,", [err.errorMessage]);
               });
                }             
                      
            
                valMITYWC.items.forEach((Line) => {
                       let promise1 = this.appService.UpdItmWhs(userContext.company,Line.WHLO,ITNO,"10",SUNO,BUYE).then((val1: M3.IMIResponse)=>{
                       }, (err: M3.IMIResponse)=> {
                          this.showError("Error occurred during Item basic fields update(MMS002),", [err.errorMessage]);
               });
                       promises.push(promise1);
                       
                     });
                //PTA Part     
                /* this.appService.UpdItmBasicDetails(userContext.company,ITNO,ATMO,this.scope.interfaceItem.userInput.DCCD).then((valUpdItmBasic: M3.IMIResponse) => {
                 }, (err: M3.IMIResponse) => {
               this.showError("Error occurred during Item basic fields update(MMS001),", [err.errorMessage]);
               
                 });*/
                             
                 this.appService.UpdItmPriceDetails(userContext.company,valM3Item.item.ITNO,SUNO).then((valUpdItmBasic: M3.IMIResponse) => {
                    this.appService.UpdItmMeas(userContext.company,valM3Item.item.ITNO,MMDIM1,MMDIM2,MMDIM3,MMSPE1,MMSPE2,MMSPE3).then((valUpdItmMeas: M3.IMIResponse) => {
                    }, (err: M3.IMIResponse) => {
                    this.showError("Error occurred during Item Measure fields update(MMS200MI - UpdItmMeas),", [err.errorMessage]);
                   }); 
                 }, (err: M3.IMIResponse) => {
               this.showError("Error occurred during Item price fields update(Supplier),", [err.errorMessage]);
               this.appService.UpdItmMeas(userContext.company,valM3Item.item.ITNO,MMDIM1,MMDIM2,MMDIM3,MMSPE1,MMSPE2,MMSPE3).then((valUpdItmMeas: M3.IMIResponse) => {
                    }, (err: M3.IMIResponse) => { 
                    this.showError("Error occurred during Item Measure fields update(MMS200MI - UpdItmMeas),", [err.errorMessage]);
                }); 
               
                 });
                this.$q.all(promises).then((results: [M3.IMIResponse]) => {
                this.scope.interfaceItem.transactionStatus.createItems = false;
                this.refreshTransactionStatus();
                
                    this.showInfo("Item is created successfully " + this.scope.interfaceItem.finalITNO +" .",null);
                    this.scope.interfaceItem.enablebutton = true;
                    this.appService.getItmBasic(userContext.company,this.scope.interfaceItem.finalITNO).then((valgetItmBasic: M3.IMIResponse)=>{
                      
                      this.scope.warehouseBasic.itemnumberDataList = valgetItmBasic.items;
                      this.scope.warehouseBasic.ITNOW = { selected: valgetItmBasic.item.ITNO };
                       
                        this.scope.globalSelection.AcqCodeWH  = { selected: "2" };
                        if(angular.equals(valgetItmBasic.item.ITTY, "302")){
                            this.scope.interfaceItem.chkItemType = "302"; 
                            this.scope.interfaceItem.chkAquCode = "2";
                            this.defaultAcqCodeSelected("2");
                    }else{
                     this.scope.interfaceItem.chkItemType = "";
                     this.scope.globalSelection.AcqCodeWH =  { selected:""};
                     this.scope.interfaceItem.chkAquCode = "";
                     this.scope.warehouseBasic.orderTypesData = "";
                     this.scope.warehouseBasic.SUWHdata = "";   
                     this.scope.warehouseBasic.orderTypesList = [];
                    }
                        this.scope.warehouseBasic.warehouseDataList = [];
                        this.scope.warehouseBasic.warehouseDataList1 = [];
                        this.scope.warehouseBasic.SUWHList = [];
                        this.loadnewItemNumberWH(valgetItmBasic.item.ITNO);
                        this.scope.interfaceItem.warningPrice = true;
                       }, (err: M3.IMIResponse)=> {
                          this.showError("", [err.errorMessage]);
               });
                }).finally(() => {
                  
                   this.scope.interfaceItem.enablebutton = true;
                });
                        }else{
                           this.scope.interfaceItem.enablebutton = true;  
                         }
                }, (err: M3.IMIResponse) => {
                 this.scope.interfaceItem.enablebutton = true;
                this.scope.interfaceItem.transactionStatus.createItems = false;
                this.refreshTransactionStatus();
                this.showError("Item/Warehouse Records not found (MMS002)", [err.errorMessage]);
                 });
                     }, (err: M3.IMIResponse) => {
                         this.scope.interfaceItem.enablebutton = true;
                this.scope.interfaceItem.transactionStatus.createItems = false;
                this.refreshTransactionStatus();
                this.showError("Error occurred during Item basic fields updates (MMS001)", [err.errorMessage]);
               
               });
               }, (err: M3.IMIResponse)=> {
                itemExists = false;
                this.scope.interfaceItem.enablebutton = true;
                this.scope.interfaceItem.transactionStatus.createItems = false;
                this.refreshTransactionStatus();
                this.showError("Item Creation is unsuccessful", [err.errorMessage]);
               });
//               }, (err: M3.IMIResponse)=> {
//                itemExists = false;
//                this.scope.interfaceItem.enablebutton = true;
//                this.scope.interfaceItem.transactionStatus.createItems = false;
//                this.refreshTransactionStatus();
//                this.showError("Item Creation is unsuccessful", [err.errorMessage]);
//               });
            
        }
        
        
                /**
        * processItems
        * @param user the company
        * @param user the m3 user
        */
        private processAllOperation(ITNOS:any,itemExist:boolean) {
            let promises = [];
            let ITNO: any;
            let IFIN: any;
            let ITDS: any;
            let FUDS: any;
            let ITTY: any;
            let STAT: any;
            let PRRF: any;
            let CUCD: any;
            let FVDT: any;
            let SAPR: any;
             let SUNO: any;
            let SITE: any;
            let SITD: any;
            let SITT: any;
            let AGNB: any;
            let GRPI: any;
             let PUPR: any;
             var UNMS;
            let itemExists: boolean;
            let userContext = this.scope.userContext;
            let RESP = userContext.USID;
            ITNO = ITNOS;
            itemExists = itemExist;
            IFIN = this.scope.interfaceItem.userInput.IFIN;
            ITDS = this.scope.interfaceItem.userInput.ITDS;
            FUDS = this.scope.interfaceItem.userInput.FUDS;
            ITTY = this.scope.interfaceItem.userSelection.itemType;
            STAT = this.scope.globalSelection.status.selected;
            PRRF = this.scope.interfaceItem.userInput.PRRF.selected;
            CUCD = this.scope.interfaceItem.userInput.CUCD;
            SUNO = this.scope.interfaceItem.userInput.SUNO;
            SITE = this.scope.interfaceItem.userInput.SITE;
            UNMS = this.scope.globalSelection.uomData;
            if (SITE != undefined && !angular.equals("", SITE)) {
                SITE =  SITE.toUpperCase( )
                }
            if (JSON.stringify(this.scope.interfaceItem.userInput.SUNO.SUNO) != undefined) {
                SUNO = this.scope.interfaceItem.userInput.SUNO.SUNO.replace("\"","");
                }else{
                SUNO = this.scope.interfaceItem.userInput.SUNO;
              }
            SITD = this.scope.interfaceItem.userInput.SITD;
            SITT = this.scope.interfaceItem.userInput.SITT;
            AGNB = this.scope.interfaceItem.userInput.AGNB;
            GRPI = "50";
            PUPR = this.scope.interfaceItem.userInput.PUPR;
            let date = new Date();
            date.setMonth(date.getMonth());
            let fromDate = this.$filter('date')(date, "yyyyMMdd");
            
            FVDT = this.scope.interfaceItem.userInput.FVDT;
            SAPR = this.scope.interfaceItem.userInput.SAPR;
              
            if(!angular.equals("", SUNO) && (angular.equals("302", ITTY) || angular.equals("401", ITTY) || angular.equals("402", ITTY))){    
             let promiseItemSupplier =  this.appService.AddItemSupplier(ITNO,SUNO,"4").then((valItemSupplier: M3.IMIResponse) => {
                 this.appService.UpdItemSupplier(ITNO,SUNO,SITE,SITD,SITT, UNMS).then((valUpdItemSupplier: M3.IMIResponse) => {
                  
            }, (err: M3.IMIResponse) => {
                this.showError("", [err.errorMessage]);
            });
            }, (err: M3.IMIResponse) => {
                this.showError("", [err.errorMessage]);
            });
              promises.push(promiseItemSupplier);  
                }
            if(PRRF != undefined && !angular.equals("", PRRF) && (angular.equals("302", ITTY) || angular.equals("401", ITTY) || angular.equals("402", ITTY))){
            let promiseAddBasePrice =    this.appService.processAddBasePrice(PRRF, CUCD, FVDT, ITNO, SAPR).then((val1: M3.IMIResponse)=>{
             }, (err: M3.IMIResponse)=> {
                this.showError("", [err.errorMessage]);
             });  
              promises.push(promiseAddBasePrice);  
            }
        }
        
        
     
  
        private Gcheckvalues(): void{
  
            let costingDate: any;
                         let CostingType: any;
                         let ProductStructureType: any;
                         let userContext = this.scope.userContext;
                         let date1 = new Date();
                         date1.setMonth(date1.getMonth());
                         costingDate = this.$filter('date')(date1, "MMddyy");
                         CostingType="3";
                         ProductStructureType = "001";
                        
                         this.scope.interfaceItem.filteredErrors =[];
                         this.scope.interfaceItem.counterErrors = 0;
            
                        this.appService.getFacilityByItem("","01-2610").then((valITMFACWS: M3.IMIResponse) => {
                            
                            this.scope.interfaceItem.facilityCount = valITMFACWS.items.length;
                        valITMFACWS.items.forEach((lineRecWS) => {
                        this.PCS260(userContext.CONO, userContext.DIVI,lineRecWS.FACI, "01-2610",costingDate,CostingType,ProductStructureType,"10.10");
                         
                       
                     });

                 }, (err: M3.IMIResponse) => {
                 this.showError("", [err.errorMessage]);
               });
              
         
           
        }

        
        private clearFields(): void{
            //this.scope.interfaceItem.userInput.IFIN = "";
            this.scope.interfaceItem.userInput.IFIN = "";
            this.scope.interfaceItem.userInput.ITDS = "";
            this.scope.interfaceItem.userInput.FUDS = "";
            this.scope.interfaceItem.userInput.PRRF = "";
            this.scope.interfaceItem.userInput.CUCD = "";
            this.scope.interfaceItem.userInput.SAPR = "";
            this.scope.interfaceItem.userInput.FVDT = "";
            
            this.scope.interfaceItem.userInput.BUYE = "";
            this.scope.interfaceItem.userInput.SITE = "";
            this.scope.interfaceItem.userInput.SITD = "";
            this.scope.interfaceItem.userInput.SITT = "";
            //this.scope.interfaceItem.userInput.RESP = "";
            this.scope.interfaceItem.userInput1.USIDD = "";
            this.scope.interfaceItem.userInput.SUNO = "";
            this.scope.interfaceItem.userInput.AGNB = "";
            this.scope.interfaceItem.userInput.AGDT = "";
            this.scope.interfaceItem.userInput.PUPR = "";
            this.scope.globalSelection.attributeData = "";
            this.scope.globalSelection.facilityData = "";
            this.scope.globalSelection.itemGroupData = "";
            this.scope.globalSelection.uomData = "";
            this.scope.globalSelection.prdgrpData = "";
            this.scope.globalSelection.businessareaData = "";
            this.scope.globalSelection.warehouseData = "";
            this.scope.interfaceItem.userSelection.itemType = "";
            this.scope.interfaceItem.userInput.ITNE = "";
            this.scope.interfaceItem.userInput.OVH1 = "";
            this.scope.interfaceItem.userInput.OVH2 = "";
            this.scope.interfaceItem.userInput.PRRF = { selected: ""};
            this.scope.interfaceItem.agreementList = [];
            this.scope.interfaceItem.userInput.DCCD = "";

            this.scope.interfaceItem.userInput.MMGRWE = "";
            this.scope.interfaceItem.userInput.MMNEWE = "";
            this.scope.interfaceItem.userInput.MMVOLR = "";
            this.scope.interfaceItem.userInput.MMDIM1 = "";
            this.scope.interfaceItem.userInput.MMDIM2 = "";
            this.scope.interfaceItem.userInput.MMDIM3 = "";
            this.scope.interfaceItem.userInput.MMSPE1 = "";
            this.scope.interfaceItem.userInput.MMSPE2 = "";
            this.scope.interfaceItem.userInput.MMSPE3 = "";
            this.removeSpecialChars();
            }
        
         private clearFields1(): void{
            //this.scope.interfaceItem.userInput.IFIN = "";
            this.scope.interfaceItem.userInput.IFIN = "";
            this.scope.interfaceItem.userInput.ITDS = "";
            this.scope.interfaceItem.userInput.FUDS = "";
            this.scope.interfaceItem.userInput.PRRF = "";
            this.scope.interfaceItem.userInput.CUCD = "";
            this.scope.interfaceItem.userInput.SAPR = "";
            this.scope.interfaceItem.userInput.FVDT = "";
            
            this.scope.interfaceItem.userInput.BUYE = "";
            this.scope.interfaceItem.userInput.SITE = "";
            this.scope.interfaceItem.userInput.SITD = "";
            this.scope.interfaceItem.userInput.SITT = "";
            //this.scope.interfaceItem.userInput.RESP = "";
            this.scope.interfaceItem.userInput1.USIDD = "";
            this.scope.interfaceItem.userInput.SUNO = "";
            this.scope.interfaceItem.userInput.AGNB = "";
            this.scope.interfaceItem.userInput.AGDT = "";
            this.scope.interfaceItem.userInput.PUPR = "";
            this.scope.globalSelection.attributeData = "";
            this.scope.globalSelection.facilityData = "";
            this.scope.globalSelection.itemGroupData = "";
            this.scope.globalSelection.uomData = "";
            this.scope.globalSelection.prdgrpData = "";
            this.scope.globalSelection.businessareaData = "";
            this.scope.globalSelection.warehouseData = "";
            this.scope.interfaceItem.userSelection.itemType = "";
            this.scope.interfaceItem.userInput.ITNE = "";
            this.scope.interfaceItem.userInput.OVH1 = "";
            this.scope.interfaceItem.userInput.OVH2 = "";
            this.scope.interfaceItem.userInput.PRRF = { selected: ""};
            this.scope.interfaceItem.itemlinesGrid.gridApi.selection.clearSelectedRows();
             this.scope.interfaceItem.agreementList = [];
             this.scope.interfaceItem.userInput.DCCD = "";

            this.scope.interfaceItem.userInput.MMGRWE = "";
            this.scope.interfaceItem.userInput.MMNEWE = "";
            this.scope.interfaceItem.userInput.MMVOLR = "";
            this.scope.interfaceItem.userInput.MMDIM1 = "";
            this.scope.interfaceItem.userInput.MMDIM2 = "";
            this.scope.interfaceItem.userInput.MMDIM3 = "";
            this.scope.interfaceItem.userInput.MMSPE1 = "";
            this.scope.interfaceItem.userInput.MMSPE2 = "";
            this.scope.interfaceItem.userInput.MMSPE3 = "";
            this.removeSpecialChars();
            }
        
         private clearWHFields(): void{
            //this.scope.interfaceItem.userInput.IFIN = "";
            this.scope.interfaceItem.userInput.LOQT = "";
            this.scope.interfaceItem.userInput.LEA1 = "";
            this.scope.interfaceItem.userInput.UNMU = "";
            this.scope.warehouseBasic.warehouseDataList1 = [];
            this.scope.warehouseBasic.orderTypesList = [];
            this.scope.interfaceItem.chkAquCode = "";
            this.scope.warehouseBasic.SUWHdata = "";
            this.scope.globalSelection.AcqCodeWH =  { selected:""};
            this.scope.warehouseBasic.orderTypesData = "";
             
             }
        
        private removeSpecialChars(): void {
}
        
        private clearWH(): void {
            this.scope.warehouseBasic.warehouseDataList1 = [];
           //k cas380 company: any, division: any,facility:any, itemnumber:any,ATA1:any,APPR:any
//            this.CAS380("301", "USA","WI","JT TEST APP2","DIRTY","10");
//            this.CAS380("301", "USA","WI","JT TEST APP2","NEW","10");
//            
//            this.CAS380("301", "USA","KC","JT TEST APP2","DIRTY","20");
//            this.CAS380("301", "USA","KC","JT TEST APP2","NEW","20");
//            
//            this.CAS380("301", "USA","ATL","JT TEST APP2","DIRTY","30");
//            this.CAS380("301", "USA","ATL","JT TEST APP2","NEW","30");
//            
//            this.CAS380("301", "USA","LYN","JT TEST APP2","DIRTY","40");
//            this.CAS380("301", "USA","LYN","JT TEST APP2","NEW","40");
//            
//            this.CAS380("301", "USA","OH","JT TEST APP2","DIRTY","50");
//            this.CAS380("301", "USA","OH","JT TEST APP2","NEW","50");
            
        }
        
        /**
        * Load the customerReturnLinesLists list
        * @param company the logged in user's company
        */
        private LinesLists(): void {
            //this.splitLine();
             this.scope.interfaceItem.enableUpdate = false;
            this.scope.loadingData = true;
            this.scope.interfaceItem.transactionStatus.ItemsList = true;
            this.appService.getItemList("PLMPROCESS","BOD").then((val: M3.IMIResponse) => {
                this.scope.interfaceItem.itemlinesGrid.data = val.items;
               /*this.appService.getPriceListData("PLMPROCESS","BOD",).then((val4: M3.IMIResponse) => {
                        retLine1.ITDS = val4.item.ITDS;
                    }, (err: M3.IMIResponse) => {
                        let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                        this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    });*/
                //this.gridService.adjustGridHeight("linesGrid", 15, 500);
                this.gridService.adjustGridHeight("itemlinesGrid", val.items.length, 500);
                 this.scope.interfaceItem.transactionStatus.ItemsList = false;
                this.refreshTransactionStatus();
               if (val.items.length==0) {
                //show warning message
               this.scope.interfaceItem.itemlinesGrid.data = [];
               this.gridService.adjustGridHeight("itemlinesGrid", val.items.length, 500);
                let warningMessage = "No lines are available";
                this.showWarning(warningMessage, null);
                return;
            }
            }, (err: M3.IMIResponse) => {
                 this.scope.interfaceItem.transactionStatus.ItemsList = false;
                this.refreshTransactionStatus();
                if (err.errorCode.length>0) {
                //show warning message
               this.scope.interfaceItem.itemlinesGrid.data = [];
               this.gridService.adjustGridHeight("itemlinesGrid", 0, 500);
                let warningMessage = "No lines are available";
                this.showWarning(warningMessage, null);
                return;
            }
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
            

        }
        
        
        /**
        * Load the getRequestItemLines list
        * 
        */
        private getRequestItemLines(): void {
            this.scope.interfaceItem.enableDenybutton = false;
            this.scope.loadingData = true;
            this.scope.interfaceItem.transactionStatus.ItemsList = true;
            let queryStatement = "F1PK01,F1PK02,F1PK03,F1PK04,F1PK05,F1PK06,F1PK07,F1PK08,F1A230,F1A130,F1A030,F1A121,F1A330,F1A430,F1A530,F1A630,F1A730,F1A830,F1A930,F1N096,F1N196,F1N296,F1DAT1,F1DAT2,F1RGDT,F1RGTM,F1A122,F1N396 from CUGEX1 where F1A030 =  '" + "10" + "'"  +" and F1FILE =  '" + "ITMAPP" + "'";
            this.appService.getItemLines(queryStatement).then((val: M3.IMIResponse) => {
                 val.items.forEach((item: any) => {
                     
                     
                     item.F1N096 = this.$filter('number')(item.F1N096, 4);
                     item.F1N196 = this.$filter('number')(item.F1N196, 4);
                     item.F1N296 = this.$filter('number')(item.F1N296, 4);
                     item.F1N396 = this.$filter('number')(item.F1N396, 0).replace(",","");
                      console.log("g item.F1N396.length-----  "+item.F1N396.length);
                     if (item.F1N396.length < 6) {
                         item.F1N396 = '0'+""+item.F1N396;
                      }
                     console.log("g item.F1N396-----"+item.F1N396);
                     item.F1DTTM = item.F1DAT1+""+this.$filter('number')(item.F1N396, 0).replace(",","");
                     console.log("g substring item.F1N396-----"+item.F1N396.substring(0,2)+":"+item.F1N396.substring(2,4)+":"+item.F1N396.substring(4,6));
                     
                     item.F1N396 = item.F1N396.substring(0,2)+":"+item.F1N396.substring(2,4)+":"+item.F1N396.substring(4,6);
                     
                     if(angular.equals("0",item.F1DAT1)){
                     item.F1DAT1 = "";    
                     }
                     if(angular.equals("0",item.F1DAT2)){
                     item.F1DAT2 = "";    
                     }
                     if(!angular.equals("",item.F1A830)){
                     item.F1A830 = "Assigned to " + item.F1A830;    
                     }
                     if(!angular.equals("",item.F1A730)){
                     item.F1A730 = item.F1A730.substring(0,2)+":"+item.F1A730.substring(2,4)+":"+item.F1A730.substring(4,6);    
                     }
                     
            });
                
                
                //this.scope.interfaceItem.itemlinesGrid.data =  this.$filter('orderBy')(val.items, "F1RGTM", true); G DESCENDING SORTING
                console.log(val.items);
                let sortedLines = []; 
                sortedLines =  this.$filter('orderBy')(val.items, "F1DTTM"); 
                //sortedLines =  this.$filter('orderBy')(val.items, "F1DTTM", true); 
                //console.log(this.scope.interfaceItem.itemlinesGrid.data);
               // this.scope.interfaceItem.itemlinesGrid.data =  val.items;
                val.items = sortedLines;
                console.log(sortedLines);
                this.scope.interfaceItem.itemlinesGrid.data =  this.$filter('orderBy')(val.items, "F1A122");
                 console.log(val.items);
                
                this.gridService.adjustGridHeight("itemlinesGrid", 5, 500);
                 this.scope.interfaceItem.transactionStatus.ItemsList = false;
                this.refreshTransactionStatus();
               if (val.items.length==0) {
                //show warning message
               this.scope.interfaceItem.itemlinesGrid.data = [];
               this.gridService.adjustGridHeight("itemlinesGrid", val.items.length, 500);
                let warningMessage = "No lines are available.";
                this.showWarning(warningMessage, null);
                return;
            }
            }, (err: M3.IMIResponse) => {
                 this.scope.interfaceItem.transactionStatus.ItemsList = false;
                this.refreshTransactionStatus();
                if (err.errorCode.length>0) {
                //show warning message
               this.scope.interfaceItem.itemlinesGrid.data = [];
               this.gridService.adjustGridHeight("itemlinesGrid", 0, 500);
                let warningMessage = "No lines are available";
                this.showWarning(warningMessage, null);
                return;
            }
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
               // this.showError(error, [err.errorMessage]);
               // this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
            

        }
        
        /**
        * Load the Item Type
        * @param user the company
        * @param user the m3 user
        */
        private loaditemType() {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.sampleDataList1 = true;
            this.appService.getItemType("").then((val: M3.IMIResponse) => {
                this.scope.interfaceItem.itemTypeList = val.items;
            }, (err: M3.IMIResponse) => {
                this.showError("Error Loading Item Type", [err.errorMessage]);
             }).finally(() => {
                this.scope.globalSelection.transactionStatus.sampleDataList1 = false;
                this.refreshTransactionStatus();
            });
        }
        
        private Assign() {
        this.scope.interfaceItem.errorType = "assignItem";
        let selectedRows = this.scope.interfaceItem.itemlinesGrid.gridApi.selection.getSelectedRows();
        let selectedRow = this.scope.interfaceItem.selectedRow;
        let checkAssignDetails;
            checkAssignDetails = true;
            
            if (selectedRows.length != 1) {
                let warningMessage = "Please select a row"; 
                this.showWarning(warningMessage, null);
                return;
            }
            this.clearFields();
             //console.log("selectedRow.isSelected--"+selectedRow.isSelected);
            if (selectedRow.isSelected) {
                
            let userContext = this.scope.userContext;

            this.scope.loadingData = true;
            this.scope.interfaceItem.transactionStatus.assign = true;
            let queryStatement = "F1PK01,F1PK02,F1A030,F1A830 from CUGEX1 where F1A030 =  '" + "10" + "'" +" and F1PK01 =  '" + selectedRow.entity.F1PK01 + "'"   +" and F1FILE =  '" + "ITMAPP" + "'";
            this.appService.getItemLines(queryStatement).then((val: M3.IMIResponse) => {
            //console.log("G ASSIGN val.items.length --"+val.items.length);
                
            val.items.forEach((item: any) => {
            //console.log("G out item.F1A830 --"+item.F1A830);
            if (item.F1A830 == undefined || angular.equals("", item.F1A830) ||  angular.equals(userContext.USID.trim(), item.F1A830.trim())) {
                //console.log("G in item.F1A830 --"+item.F1A830);
                //console.log("G userContext.USID --"+userContext.USID);
            let promises = []
          //  this.scope.loadingData = true;
            //this.scope.interfaceItem.transactionStatus.updateItemsList = true;
            let currentDate: any = new Date(); 
                currentDate.setDate(currentDate.getDate()); 
                let curmonth = "0"+(currentDate.getMonth()+1);
                let curdate = "0"+currentDate.getDate();
                curmonth = curmonth.slice(-2);
                curdate = curdate.slice(-2);
                let hours:any = currentDate.getHours();
                let minutes:any = currentDate.getMinutes();
                let seconds:any = currentDate.getSeconds();
                if (hours < 10) { 
                        hours = '0' + hours; 
                    }
               if (minutes < 10) { 
                        minutes = '0' + minutes; 
                    } 
                    if (seconds < 10) { 
                        seconds = '0' + seconds; 
                    } 
                let assignDate = currentDate.getFullYear()+"" + curmonth +""  + curdate;
                let assignTime = hours+""+minutes+""+seconds;    
               let promise1 = this.appService.updateItemFields("ITMAPP",item.F1PK01,userContext.USID,assignTime).then((valM3AddItem: M3.IMIResponse)=>{
                 selectedRow.entity.F1A830 = "Assigned to " + userContext.USID;
                 item.F1A830  = userContext.USID;
                 selectedRow.entity.F1A730 = assignTime.substring(0,2)+":"+assignTime.substring(2,4)+":"+assignTime.substring(4,6); 
                 
               }, (err: M3.IMIResponse)=> {
                   this.showError("Error while updating Assign Details ", [err.errorMessage]);
                   checkAssignDetails = false;
                });
                 promises.push(promise1);
               let promise2 = this.appService.processM3ItemDates("ITMAPP",item.F1PK01,assignDate).then((valM3AddItem: M3.IMIResponse)=>{
                 selectedRow.entity.F1DAT2 = assignDate;
                  
               }, (err: M3.IMIResponse)=> {
                   this.showError("Error while updating Assign Detail ", [err.errorMessage]);
                   checkAssignDetails = false;
                }); 
                promises.push(promise2);
                this.$q.all(promises).then((results: [M3.IMIResponse]) => {
                    
            if(checkAssignDetails){
            this.scope.interfaceItem.userSelection.itemType =  selectedRow.entity.F1A230;
            this.scope.interfaceItem.userInput.IFIN = selectedRow.entity.F1PK01;
            this.scope.interfaceItem.userInput.ITDS = selectedRow.entity.F1A130;
            this.scope.interfaceItem.userInput.FUDS =  selectedRow.entity.F1A121;
            this.scope.globalSelection.uomData =  selectedRow.entity.F1A330;
            this.AssignLstGeneralCode(selectedRow.entity.F1A330);    
            if (selectedRow.entity.F1A430 != undefined && !angular.equals("", selectedRow.entity.F1A430)) {
            this.scope.interfaceItem.userInput.SUNO =  { SUNO: selectedRow.entity.F1A430 };
            this.supplierSelected({SUNO: selectedRow.entity.F1A430});
            }
            this.scope.interfaceItem.userInput.SITE = selectedRow.entity.F1A530;
            if (selectedRow.entity.F1N096 != undefined && !angular.equals("", selectedRow.entity.F1N096)) {
            this.scope.interfaceItem.userInput.PUPR = parseFloat(selectedRow.entity.F1N096);
            }else{
                this.scope.interfaceItem.userInput.PUPR = "";
            }
            if (selectedRow.entity.F1N196 != undefined && !angular.equals("", selectedRow.entity.F1N196)) {
            this.scope.interfaceItem.userInput.OVH1 = parseFloat(selectedRow.entity.F1N196);
            }else{
                this.scope.interfaceItem.userInput.OVH1 = "";
            }
            if (selectedRow.entity.F1N296 != undefined && !angular.equals("", selectedRow.entity.F1N296)) {
            this.scope.interfaceItem.userInput.OVH2 = parseFloat(selectedRow.entity.F1N296);
            }else{
                this.scope.interfaceItem.userInput.OVH2 = "";
            }
            this.scope.interfaceItem.userInput1.USIDD =  { USID: selectedRow.entity.F1A930 };
                if(angular.equals("302", selectedRow.entity.F1A230)|| angular.equals("401", selectedRow.entity.F1A230) || angular.equals("402", selectedRow.entity.F1A230)){
                //this.scope.interfaceItem.userInput.PRRF = { selected: "LIST PRICE"};
                //this.scope.interfaceItem.userInput.CUCD = this.scope.interfaceItem.defaultCUCD;
                //this.scope.interfaceItem.userInput.FVDT = this.scope.interfaceItem.defaultFromDate;
                this.calculateQty();
                    //console.log("G CUCD--"+this.scope.interfaceItem.defaultCUCD);
                    //console.log("G DEFAULT FROMDATE--"+this.scope.interfaceItem.defaultFromDate);
                    //console.log();
                
            }
            }   
                let assignMessage = "Item "+ selectedRow.entity.F1PK01 +" is assigned to " + item.F1A830.toLowerCase(); 
                this.showWarning(assignMessage, null);    
                this.scope.interfaceItem.enableDenybutton = true;
                });
            
            }else{
                selectedRow.entity.F1A830 = "Assigned to " + item.F1A830;
                selectedRow.entity.F1A730 = item.F1A730.substring(0,2)+":"+item.F1A730.substring(2,4)+":"+item.F1A730.substring(4,6); 
                selectedRow.entity.F1DAT2 = item.F1DAT2;
            let warningassignMessage = "Item "+ selectedRow.entity.F1PK01 +" is already assigned to " + item.F1A830.toLowerCase(); 
            this.showWarning(warningassignMessage, null);
                this.scope.interfaceItem.enableDenybutton = true;
                //this.scope.interfaceItem.transactionStatus.assign = false;
               // this.refreshTransactionStatus();
                
            }         
            });
                if(val.items.length == 0){
                // this.scope.interfaceItem.transactionStatus.assign = false;
                //this.refreshTransactionStatus();
                let warningItemExistsMessage = "Item "+ selectedRow.entity.F1PK01 +" is already created in M3"; 
                this.showWarning(warningItemExistsMessage, null);  
                    this.scope.interfaceItem.enableDenybutton = false;
               } 
            this.scope.interfaceItem.transactionStatus.assign = false;
            this.refreshTransactionStatus();
            
            }, (err: M3.IMIResponse) => {
                 this.scope.interfaceItem.transactionStatus.assign = false;
                this.refreshTransactionStatus();
                let warningItemExistsMessage = "Item "+ selectedRow.entity.F1PK01 +" is already created in M3"; 
                this.showWarning(warningItemExistsMessage, null);
                this.scope.interfaceItem.enableDenybutton = false;
            });
            }else{
                 }
    }
        
        private unAssign() {
        this.scope.interfaceItem.errorType = "assignItem";
        let selectedRows = this.scope.interfaceItem.itemlinesGrid.gridApi.selection.getSelectedRows();
        let selectedRow = this.scope.interfaceItem.selectedRow;
        let checkunAssignDetails;
            checkunAssignDetails = true;
            
            if (selectedRows.length != 1) {
                let warningMessage = "Please select a row"; 
                this.showWarning(warningMessage, null);
                return;
            }
           
             //console.log("selectedRow.isSelected--"+selectedRow.isSelected);
            if (selectedRow.isSelected) {
                
            let userContext = this.scope.userContext;

            this.scope.loadingData = true;
            this.scope.interfaceItem.transactionStatus.unassign = true;
             let queryStatement = "F1PK01,F1PK02,F1A030,F1A830 from CUGEX1 where F1A030 =  '" + "10" + "'" +" and F1PK01 =  '" + selectedRow.entity.F1PK01 + "'" +" and F1FILE =  '" + "ITMAPP" + "'";
            this.appService.getItemLines(queryStatement).then((val: M3.IMIResponse) => {
            val.items.forEach((item: any) => {
            if (angular.equals(userContext.USID.trim(), item.F1A830.trim()) && !angular.equals("", item.F1A830)) {
            
            let promises = []
            let promise1 = this.appService.unAssignItemFields("ITMAPP",item.F1PK01,"","").then((valM3AddItem: M3.IMIResponse)=>{
                 selectedRow.entity.F1A830 = "";
                 selectedRow.entity.F1A730 = ""; 
                   //console.log("G updateItemFields =  ");
               
               }, (err: M3.IMIResponse)=> {
                   this.showError("Error while updating UnAssign Assign time Details ", [err.errorMessage]);
                   checkunAssignDetails = false;
                });
                 promises.push(promise1);
               let promise2 = this.appService.unAssignM3ItemDates("ITMAPP",item.F1PK01,"").then((valM3AddItem: M3.IMIResponse)=>{
                 selectedRow.entity.F1DAT2 = "";
                 //console.log("G processM3ItemDates =  "); 
               
               }, (err: M3.IMIResponse)=> {
                   this.showError("Error while updating UnAssign Assign date Detail ", [err.errorMessage]);
                   checkunAssignDetails = false;
                }); 
                promises.push(promise2);
                this.$q.all(promises).then((results: [M3.IMIResponse]) => {
                    
                if(checkunAssignDetails){
                this.clearFields();
                let warningassignMessage = "Item "+ item.F1PK01 +" is unassigned "; 
                this.showWarning(warningassignMessage, null);
                this.scope.interfaceItem.enableDenybutton = false;
                }   
                
                this.scope.interfaceItem.transactionStatus.unassign = false;
                this.refreshTransactionStatus();
                });
            
            }else if (!angular.equals(userContext.USID.trim(), item.F1A830.trim()) && !angular.equals("", item.F1A830)) {
                selectedRow.entity.F1A830 = "Assigned to " + item.F1A830;
                selectedRow.entity.F1A730 = item.F1A730.substring(0,2)+":"+item.F1A730.substring(2,4)+":"+item.F1A730.substring(4,6); 
                selectedRow.entity.F1DAT2 = item.F1DAT2;
            let warningassignMessage = "Item "+ item.F1PK01 +" is  assigned to " + item.F1A830.toLowerCase(); 
            this.showWarning(warningassignMessage, null);
            this.scope.interfaceItem.enableDenybutton = true;    
                
            }else{
               let warningassignMessage = "Item "+ item.F1PK01 +" is already unassigned"; 
                this.showWarning(warningassignMessage, null);
               this.scope.interfaceItem.enableDenybutton = false; 
            }         
            });
               if(val.items.length ==0){
                let warningItemExistsMessage = "Item "+ selectedRow.entity.F1PK01 +" is already created in M3"; 
                this.showWarning(warningItemExistsMessage, null);  
               this.scope.interfaceItem.enableDenybutton = false;
               } 
            this.scope.interfaceItem.transactionStatus.unassign = false;
            this.refreshTransactionStatus();
            
            }, (err: M3.IMIResponse) => {
                 this.scope.interfaceItem.transactionStatus.unassign = false;
                this.refreshTransactionStatus();
                let warningItemExistsMessage = "Item "+ selectedRow.entity.F1PK01 +" is already created in M3"; 
                this.showWarning(warningItemExistsMessage, null);
                this.scope.interfaceItem.enableDenybutton = false;
            });
            }else{
                 }
    }
        
        private onRowSelected(selectedRow: any) {
            this.scope.interfaceItem.selectedRow = selectedRow;
            
             if(selectedRow.entity.F1A830 != undefined && !angular.equals("", selectedRow.entity.F1A830)){
             this.scope.interfaceItem.enableDenybutton = true;
             }else{
             this.scope.interfaceItem.enableDenybutton = false;
             }
}
        
         /**
        * Load the Item Type
        * @param user the company
        * @param user the m3 user
        */
        private checkitemType(checkitemType: any) {
             if (angular.isUndefined(checkitemType) ) {
               this.scope.interfaceItem.enableFields = true;
                 this.scope.interfaceItem.userInput.CUCD = "";
                this.scope.interfaceItem.userInput.SAPR = "";
                this.scope.interfaceItem.userInput.FVDT = "";
                this.scope.interfaceItem.userInput.PRRF = "";
                 this.scope.interfaceItem.userInput.PUPR = "";
                return;
            }
            //console.log("G checkitemType.ITTY-----"+checkitemType.ITTY);
            if(angular.equals("310", checkitemType.ITTY) || angular.equals("303", checkitemType.ITTY)){
                this.scope.interfaceItem.userInput.AGNB = "";
                this.scope.interfaceItem.userInput.PUPR = "";
                this.scope.interfaceItem.userInput.CUCD = "";
                this.scope.interfaceItem.userInput.SAPR = "";
                this.scope.interfaceItem.userInput.FVDT = "";
                this.scope.interfaceItem.userInput.PRRF = "";
            this.scope.interfaceItem.enableFields = false;
            }else{
            this.scope.interfaceItem.enableFields = true;
                
           }
            if(angular.equals("301", checkitemType.ITTY) || angular.equals("303", checkitemType.ITTY)){
                this.scope.interfaceItem.itmType = "show";
            }else{
                this.scope.interfaceItem.itmType = "show";
                this.scope.interfaceItem.userInput.ITNE = "";
            }
            if(angular.equals("401", checkitemType.ITTY) || angular.equals("402", checkitemType.ITTY)){
                this.scope.interfaceItem.attrType = "show";
                this.scope.interfaceItem.userInput.ATMO = "CORE";
               }else{
                this.scope.interfaceItem.userInput.ATMO = "";
                this.scope.interfaceItem.attrType = "hide";
                this.scope.interfaceItem.userInput.OVH1 = "";
                this.scope.interfaceItem.userInput.OVH2 = "";
                }
            
             if(angular.equals("302", checkitemType.ITTY)|| angular.equals("401", checkitemType.ITTY) || angular.equals("402", checkitemType.ITTY)){
                if (this.scope.interfaceItem.ecommFlag) {
                    this.scope.interfaceItem.userInput.PRRF = { selected: "ECOMM" };
                    this.scope.interfaceItem.userInput.CUCD = this.scope.interfaceItem.defaultECOMMCUCD;
                    this.scope.interfaceItem.userInput.FVDT = this.scope.interfaceItem.defaultECOMMFromDate;
                    console.log("G ITEMTYPE CHANGE----" + this.scope.interfaceItem.defaultMODA);
                }
                else {
                if(angular.equals(this.scope.interfaceItem.defaultMODA, "1")){
                    this.scope.interfaceItem.userInput.PRRF = { selected: "SUPPLIER"};
                    this.scope.interfaceItem.userInput.CUCD = this.scope.interfaceItem.defaultSUPPCUCD;
                    this.scope.interfaceItem.userInput.FVDT = this.scope.interfaceItem.defaultFromDate;  
                }else{
                   this.scope.interfaceItem.userInput.PRRF = { selected: "LIST PRICE"};
                   this.scope.interfaceItem.userInput.CUCD = this.scope.interfaceItem.defaultCUCD;
                    this.scope.interfaceItem.userInput.FVDT = this.scope.interfaceItem.defaultFromDate;
                    }
                }
                
            }else{
                this.scope.interfaceItem.userInput.PRRF = { selected: ""};
                this.scope.interfaceItem.userInput.CUCD = "";
                this.scope.interfaceItem.userInput.FVDT = "";
                this.scope.interfaceItem.userInput.SAPR = "";
            }
            
            if(angular.equals("401", checkitemType.ITTY)){
                this.scope.interfaceItem.label = "cost";
            }else if(angular.equals("402", checkitemType.ITTY)){
                this.scope.interfaceItem.label = "pprice";
            }else{
                 this.scope.interfaceItem.label = "pcost";
                }
            
//            if(angular.equals("302", checkitemType.ITTY)){
//                 this.scope.interfaceItem.chkItemType = "302"; 
//            }else{
//                 this.scope.interfaceItem.chkItemType = ""; 
//                }
          
        }
        
         private getProductGroup(itemGroup: any) {
             if (angular.isUndefined(itemGroup)) {
               this.scope.globalSelection.itemGroupList = [];
               return;
            }
             //console.log("G itemGroup-----"+JSON.stringify(itemGroup));
             this.scope.globalSelection.itemGroupData = "";
             this.scope.globalSelection.itemGroupList = [];
             this.loaditemGroupList(itemGroup);
        }
        
        private getDecimals(UM: any) {
            this.scope.interfaceItem.userInput.DCCD = "";  
             if (angular.isUndefined(UM)) {
                return;
            }
             //console.log("G DCCD-----"+UM.STKY);
             this.LstGeneralCode(UM);
        }
        
        
        
          /**
        * Load the supplier list with details
        * @param company the company
        */
        private loadSupp(): void {
            if (this.scope.interfaceItem.userInput.SUN1.length < 6) {
                return;
            }
            this.supplierSelectedTXT(this.scope.interfaceItem.userInput.SUN1)
            
        }
        
        
        
         /**
        * Load the supplier list with details
        * @param company the company
        */
        private loadSupplierList(searchInput: string): void {
            if (angular.isUndefined(searchInput) || searchInput.length < 2) {
                return;
            }
             let newSearchQuery = "SearchFields:SUNO;SUNM " + searchInput + "*";
            
            this.scope.interfaceItem.transactionStatus.supplierList = true;
            
            this.appService.searchSupplier(newSearchQuery).then((val: M3.IMIResponse) => {
               console.log("G filteredLines");
               console.log(val.items);
                let filteredLines = this.$filter('filter')(val.items, (value: any) => {
                if(!angular.equals("2", value.SUTY) && !angular.equals("90", value.STAT)){
                return true; 
                        }else{
                    return false; 
                    }
               });
                console.log(filteredLines);
                //this.scope.interfaceItem.supplierList = val.items; //Remove SUTY = 2 AND STAT = 90
                this.scope.interfaceItem.supplierList = filteredLines;
                this.scope.interfaceItem.transactionStatus.supplierList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                this.scope.interfaceItem.transactionStatus.supplierList = false;
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            
                this.refreshTransactionStatus();
            });
        }
        
         /**
        * Load the Buyer
        * @param user the company
        * @param user the m3 user
        */
        private loadBuyer(searchInput: string) {
            
             if (angular.isUndefined(searchInput) || searchInput.length < 2) {
                return;
            }
             let newSearchQuery = "SearchFields:USID;TX40 " + searchInput + "*";
            this.scope.loadingData = true;
            this.scope.interfaceItem.transactionStatus.buyerIList = true;
            this.appService.getUser(newSearchQuery).then((val: M3.IMIResponse) => {
                
                this.scope.interfaceItem.buyerList = val.items;
                this.scope.interfaceItem.transactionStatus.buyerIList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Buyer", [err.errorMessage]);
                //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.interfaceItem.transactionStatus.buyerIList = false;
                this.refreshTransactionStatus();
            });
        }
    
      /**
        * Load the loadResponsible
        * @param user the company
        * @param user the m3 user
        */
        private loadResponsible(searchInput: string) {
            
             if (angular.isUndefined(searchInput) || searchInput.length < 2) {
                return;
            }
            
             let newSearchQuery = "SearchFields:USID;TX40 " + searchInput + "*";
            
            this.scope.loadingData = true;
            this.scope.interfaceItem.transactionStatus.responsibleIList = true;
            this.appService.getResponsible(newSearchQuery).then((val: M3.IMIResponse) => {
             
                this.scope.interfaceItem.responsibleList = val.items;
                this.scope.interfaceItem.transactionStatus.responsibleIList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Responsible", [err.errorMessage]);
                //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.interfaceItem.transactionStatus.responsibleIList = false;
                this.refreshTransactionStatus();
            });
        }
        
        /**
        * Load the wh loadResponsible
        * @param user the company
        * @param user the m3 user
        */
        private whloadResponsible(searchInput: string) {
            
             if (angular.isUndefined(searchInput) || searchInput.length < 2) {
                return;
            }
            
             let newSearchQuery = "SearchFields:USID;TX40 " + searchInput + "*";
            
            this.scope.loadingData = true;
            this.scope.interfaceItem.transactionStatus.responsibleIList = true;
            this.appService.getResponsible(newSearchQuery).then((val: M3.IMIResponse) => {
             
                this.scope.interfaceItem.whresponsibleList = val.items;
                this.scope.interfaceItem.transactionStatus.responsibleIList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Responsible", [err.errorMessage]);
                //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.interfaceItem.transactionStatus.responsibleIList = false;
                this.refreshTransactionStatus();
            });
        }
        
        /**
        * Load the loadResponsible
        * @param user the company
        * @param user the m3 user
        */
        private loadDefaultResponsible(USID: any) {
            this.scope.loadingData = true;
            this.scope.interfaceItem.transactionStatus.defaultresponsibleIList = true;
            this.appService.getDefaultResponsible(USID).then((val: M3.IMIResponse) => {
                
                this.scope.interfaceItem.userInput1.USIDD =  { USID: val.item.USID };
                this.scope.interfaceItem.transactionStatus.defaultresponsibleIList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Responsible", [err.errorMessage]);
                //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.interfaceItem.transactionStatus.defaultresponsibleIList = false;
                this.refreshTransactionStatus();
            });
        }
        
        /**
        * Load the supplier list with details
        * @param company the company
        */
        private supplierSelectedTXT(selectedSUNO: any): void {
            
            this.scope.interfaceItem.userInput.AGNB = "";
            this.scope.interfaceItem.transactionStatus.supplierList = true;
            this.appService.LstAgrHeadBySup(selectedSUNO).then((val: M3.IMIResponse) => {
                this.scope.interfaceItem.agreementList = val.items;
                this.scope.interfaceItem.transactionStatus.supplierList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                this.scope.interfaceItem.transactionStatus.supplierList = false;
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            
                this.refreshTransactionStatus();
            });
        }
        
          private responsibleSelected(selectedRESP: any): void {
               if (angular.isUndefined(selectedRESP)) {
               this.scope.interfaceItem.userInput1.USIDD = {USID: undefined};
               this.scope.interfaceItem.userInput1.USIDD = "";
                   }
              }
        
        private whresponsibleSelected(selectedRESP: any): void {
               if (angular.isUndefined(selectedRESP)) {
               this.scope.interfaceItem.userInput1.WHUSIDD = {USID: undefined};
               this.scope.interfaceItem.userInput1.WHUSIDD = "";
                   }
              }
                 /**
        * Load the supplier list with details
        * @param company the company
        */
        private supplierSelected(selectedSUNO: any): void {
            let ITTY: any;
            let newSAPR: any;
             ITTY = this.scope.interfaceItem.userSelection.itemType;
            this.scope.interfaceItem.userInput.AGNB = "";
            this.scope.interfaceItem.userInput.MULT = "";
            //if (angular.isUndefined(selectedSUNO) || angular.equals("310", ITTY) || angular.equals("", ITTY)) {// Remove ITTY blank check
            if (angular.isUndefined(selectedSUNO) || angular.equals("310", ITTY)) {
                this.scope.interfaceItem.userInput.SUNO = {SUNO:undefined};
                this.scope.interfaceItem.userInput.SUNO= "";
                return;
            }
            // if (!angular.equals("303", ITTY) && !angular.equals("", ITTY)) { Remove ITTY blank check 
             if (!angular.equals("303", ITTY)) {
                 
            this.appService.getMultiplier("CIDMAS",selectedSUNO.SUNO).then((valMultiplier: M3.IMIResponse) => {
               if(valMultiplier.items.length > 0){
                valMultiplier.items.forEach((line) => {
                   
                    if(!angular.equals("", line.N096)  && parseFloat(line.N096) != 0 && parseFloat(line.N096) != 0.0 && parseFloat(line.N096) != 0.000000){
                    this.scope.interfaceItem.userInput.MULT = parseFloat(parseFloat(line.N096).toFixed(2));
                        if(this.scope.interfaceItem.userInput.PUPR != undefined && !angular.equals("", this.scope.interfaceItem.userInput.PUPR) 
                    && this.scope.interfaceItem.userInput.PUPR != null){
                        
                      //  this.scope.interfaceItem.userInput.SAPR = parseFloat((this.scope.interfaceItem.userInput.PUPR * parseFloat(line.N096)).toFixed(3));
                      newSAPR = (this.scope.interfaceItem.userInput.PUPR / parseFloat(line.N096));
                      this.scope.interfaceItem.userInput.SAPR = parseFloat(newSAPR.toFixed(2));
                        }
                    }else{
                        
                   //this.scope.interfaceItem.userInput.MULT= 2.00;
                        this.scope.interfaceItem.userInput.MULT= 0.3;
                    if(this.scope.interfaceItem.userInput.PUPR != undefined && !angular.equals("", this.scope.interfaceItem.userInput.PUPR)){
                      //newSAPR = (this.scope.interfaceItem.userInput.PUPR * this.scope.interfaceItem.userInput.MULT);
                        newSAPR = (this.scope.interfaceItem.userInput.PUPR / this.scope.interfaceItem.userInput.MULT);
                      this.scope.interfaceItem.userInput.SAPR = parseFloat(newSAPR.toFixed(2));
                    } 
               
                  }
                });
               }else{
                   //this.scope.interfaceItem.userInput.MULT= 2.00;
                   this.scope.interfaceItem.userInput.MULT= 0.3;
                    if(this.scope.interfaceItem.userInput.PUPR != undefined && !angular.equals("", this.scope.interfaceItem.userInput.PUPR)){
                      //newSAPR = (this.scope.interfaceItem.userInput.PUPR * this.scope.interfaceItem.userInput.MULT);
                        newSAPR = (this.scope.interfaceItem.userInput.PUPR / this.scope.interfaceItem.userInput.MULT);
                      this.scope.interfaceItem.userInput.SAPR = parseFloat(newSAPR.toFixed(2));
                    }
               }
            }, (err: M3.IMIResponse) => {
               this.scope.interfaceItem.userInput.MULT = "";
               // this.scope.interfaceItem.userInput.MULT= 2.00;
                this.scope.interfaceItem.userInput.MULT= 0.3;
                    if(this.scope.interfaceItem.userInput.PUPR != undefined && !angular.equals("", this.scope.interfaceItem.userInput.PUPR)){
                      //newSAPR = (this.scope.interfaceItem.userInput.PUPR * this.scope.interfaceItem.userInput.MULT);
                        newSAPR = (this.scope.interfaceItem.userInput.PUPR / this.scope.interfaceItem.userInput.MULT);
                      this.scope.interfaceItem.userInput.SAPR = parseFloat(newSAPR.toFixed(2));
                    }
            });
 
//KP                 
//              this.scope.interfaceItem.userInput.MULT= 0.3;
//                    if(this.scope.interfaceItem.userInput.PUPR != undefined && !angular.equals("", this.scope.interfaceItem.userInput.PUPR)){
//                      //newSAPR = (this.scope.interfaceItem.userInput.PUPR * this.scope.interfaceItem.userInput.MULT);
//                        newSAPR = (this.scope.interfaceItem.userInput.PUPR / this.scope.interfaceItem.userInput.MULT);
//                      this.scope.interfaceItem.userInput.SAPR = parseFloat(newSAPR.toFixed(2));
//                    }     
//KP            
            
            this.scope.interfaceItem.transactionStatus.supplierList = true;
            this.appService.LstAgrHeadBySup(selectedSUNO.SUNO).then((val: M3.IMIResponse) => {
                this.scope.interfaceItem.agreementList = val.items;
                this.scope.interfaceItem.userInput.AGNB = val.item.AGNB;
                this.scope.interfaceItem.userInput.AGDT = val.item.FVDT;
                this.scope.interfaceItem.transactionStatus.supplierList = false;
                this.refreshTransactionStatus();
                if (this.scope.interfaceItem.ecommFlag) {
                    this.scope.interfaceItem.userInput.PRRF = { selected: "ECOMM" };
                    this.scope.interfaceItem.userInput.CUCD = this.scope.interfaceItem.defaultECOMMCUCD;
                    this.scope.interfaceItem.userInput.FVDT = this.scope.interfaceItem.defaultECOMMFromDate;
                    console.log("G SUPPLIER SELECT ----" + this.scope.interfaceItem.ecommFlag);
                }
                else {
                    console.log("G selectedSUNO.SUNO---" + selectedSUNO.SUNO);
                    console.log("G val.item.AGNB---" + val.item.AGNB);
                       
             let queryMPAGRHStatement = "AHSUNO,AHAGNB,AHMODA from MPAGRH where AHSUNO =  '" + selectedSUNO.SUNO  + "' and AHAGNB = '" + val.item.AGNB  + "'";
             this.appService.getMPAGRHData(queryMPAGRHStatement).then((valMPAGRHD: M3.IMIResponse) => {
                if (angular.isDefined(valMPAGRHD.item)) {
                    if(angular.equals(valMPAGRHD.item.AHMODA, "1")){
                    this.scope.interfaceItem.userInput.PRRF = { selected: "SUPPLIER"};
                   this.scope.interfaceItem.defaultMODA = "1";
                    this.scope.interfaceItem.userInput.CUCD = this.scope.interfaceItem.defaultSUPPCUCD;
                    this.scope.interfaceItem.userInput.FVDT = this.scope.interfaceItem.defaultSUPPFromDate;  
                    }else{
                     this.scope.interfaceItem.userInput.PRRF = { selected: "LIST PRICE"};
                     this.scope.interfaceItem.defaultMODA = "0";
                     this.scope.interfaceItem.userInput.CUCD = this.scope.interfaceItem.defaultCUCD;
                     this.scope.interfaceItem.userInput.FVDT = this.scope.interfaceItem.defaultFromDate;  
                    }
                    }else{
                   
                }
             }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                //this.showError(error, [err.errorMessage]);
               // this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
        }   
                
                
                
                
            }, (err: M3.IMIResponse) => {
                this.scope.interfaceItem.transactionStatus.supplierList = false;
                this.refreshTransactionStatus();
            });
         }
        }
        
        private calculateQty(): void{
            let ITTY: any;
            let newSAPR: any;
             ITTY = this.scope.interfaceItem.userSelection.itemType;
            if (angular.equals("", ITTY) && ITTY == undefined) {
                this.scope.interfaceItem.userInput.MULT="";
                this.scope.interfaceItem.userInput.SAPR="";
                return;
            }
            
            if (angular.equals("", this.scope.interfaceItem.userInput.PUPR) || this.scope.interfaceItem.userInput.PUPR==null) {
                this.scope.interfaceItem.userInput.SAPR = "";
                return;
            }
            //if (!angular.equals("303", ITTY) && !angular.equals("", ITTY) && ITTY != undefined) { Remove ITTY Check for sales price calc.
             if (!angular.equals("303", ITTY)) {
                  if(this.scope.interfaceItem.userInput.PUPR != undefined && !angular.equals("", this.scope.interfaceItem.userInput.PUPR)){
                    if(!angular.equals("", this.scope.interfaceItem.userInput.MULT)  && 
                         this.scope.interfaceItem.userInput.MULT != 0.00 && 
                         this.scope.interfaceItem.userInput.MULT !=0.0){
                    //console.log("G IN 3---"+this.scope.interfaceItem.userInput.PUPR);
                        newSAPR = (this.scope.interfaceItem.userInput.PUPR / this.scope.interfaceItem.userInput.MULT);
                   this.scope.interfaceItem.userInput.SAPR = parseFloat(newSAPR.toFixed(2));
                    }
                      } 
                 }    
        }
        
         /**
        * Load the Price List
        * @param user the company
        * @param user the m3 user
        */
        private loadpriceList() {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.sampleDataList1 = true;
            this.appService.getPriceList().then((val: M3.IMIResponse) => {
                this.scope.interfaceItem.priceList = val.items;
               
            }, (err: M3.IMIResponse) => {
               // let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Price List", [err.errorMessage]);
             //this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
               }).finally(() => {
                this.scope.globalSelection.transactionStatus.sampleDataList1 = false;
                this.refreshTransactionStatus();
            });
            
           
        }
        
        private loadDefaultpriceList() {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.sampleDataList1 = true;
            this.scope.interfaceItem.defaultCUCD = "";
            this.scope.interfaceItem.defaultFromDate = ""; 
            this.scope.interfaceItem.defaultMODA = "0";
            this.appService.getDefaultPriceList("LIST PRICE","1").then((val: M3.IMIResponse) => {
                val.items.forEach((Line) => {
                this.scope.interfaceItem.defaultCUCD = Line.CUCD;
                this.scope.interfaceItem.defaultFromDate = Line.FVDT; 
                });
                
                
              
            }, (err: M3.IMIResponse) => {
               // let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Price List", [err.errorMessage]);
             //this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
               }).finally(() => {
                this.scope.globalSelection.transactionStatus.sampleDataList1 = false;
                this.refreshTransactionStatus();
            });
            
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.sampleDataList1 = true;
            this.scope.interfaceItem.defaultSUPPCUCD = "";
            this.scope.interfaceItem.defaultSUPPFromDate = ""; 
                
              this.appService.getDefaultPriceList("SUPPLIER","1").then((val: M3.IMIResponse) => {
                val.items.forEach((Line) => {
                this.scope.interfaceItem.defaultSUPPCUCD = Line.CUCD;
                this.scope.interfaceItem.defaultSUPPFromDate = Line.FVDT; 
                });
                  
                  
              
            }, (err: M3.IMIResponse) => {
               // let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Price List", [err.errorMessage]);
             //this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
               }).finally(() => {
                this.scope.globalSelection.transactionStatus.sampleDataList1 = false;
                this.refreshTransactionStatus();
            });

            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.sampleDataList1 = true;
            this.scope.interfaceItem.defaultECOMMCUCD = "";
            this.scope.interfaceItem.defaultECOMMFromDate = "";
            this.appService.getDefaultPriceList("ECOMM", "1").then((valECOMM: M3.IMIResponse) => {
                    valECOMM.items.forEach((Line) => {
                        this.scope.interfaceItem.defaultECOMMCUCD = Line.CUCD;
                        this.scope.interfaceItem.defaultECOMMFromDate = Line.FVDT;
                    });
                    console.log("G LOAD DEFLT  this.scope.interfaceItem.defaultECOMMCUCD----" + this.scope.interfaceItem.defaultECOMMCUCD);
                    console.log("G LOAD DEFLT this.scope.interfaceItem.defaultECOMMFromDate----" + this.scope.interfaceItem.defaultECOMMFromDate);
            }, (err: M3.IMIResponse) => {
               // let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
               this.showError("Error Loading Price List", [err.errorMessage]);
             //this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
               }).finally(() => {
                this.scope.globalSelection.transactionStatus.sampleDataList1 = false;
                this.refreshTransactionStatus();
            });
        }
        
         /**
        * Load the Price List
        * @param user the company
        * @param user the m3 user
        */
        private loadpriceListFields(priceListrow: any) {
            
            if (angular.isUndefined(priceListrow) ) {
                this.scope.interfaceItem.userInput.CUCD = "";
                this.scope.interfaceItem.userInput.FVDT = "";
                return;
            }
            this.scope.interfaceItem.userInput.CUCD = priceListrow.CUCD;
            this.scope.interfaceItem.userInput.FVDT = priceListrow.FVDT;
        }
        
        /**
        * Load the Agreement fields
        * @param user the company
        * @param user the m3 user
        */
        private loadAgreementFields(row: any) {
            
            if (angular.isUndefined(row) ) {
                return;
            }
            this.scope.interfaceItem.userInput.AGDT = row.FVDT;
            if (this.scope.interfaceItem.ecommFlag) {
                this.scope.interfaceItem.userInput.PRRF = { selected: "ECOMM" };
                this.scope.interfaceItem.userInput.CUCD = this.scope.interfaceItem.defaultECOMMCUCD;
                this.scope.interfaceItem.userInput.FVDT = this.scope.interfaceItem.defaultECOMMFromDate;
            }
            else {
            let queryMPAGRHStatement = "AHSUNO,AHAGNB,AHMODA from MPAGRH where AHSUNO =  '" + this.scope.interfaceItem.userInput.SUNO  + "' and AHAGNB = '" + row.AGNB  + "'";
             this.appService.getMPAGRHData(queryMPAGRHStatement).then((valMPAGRHD: M3.IMIResponse) => {
                if (angular.isDefined(valMPAGRHD.item)) {
                    if(angular.equals(valMPAGRHD.item.AHMODA, "1")){
                    this.scope.interfaceItem.userInput.PRRF = { selected: "SUPPLIER"};
                   this.scope.interfaceItem.defaultMODA = "1";
                    this.scope.interfaceItem.userInput.CUCD = this.scope.interfaceItem.defaultSUPPCUCD;
                    this.scope.interfaceItem.userInput.FVDT = this.scope.interfaceItem.defaultSUPPFromDate;  
                    }else{
                     this.scope.interfaceItem.userInput.PRRF = { selected: "LIST PRICE"};
                     this.scope.interfaceItem.defaultMODA = "0";
                     this.scope.interfaceItem.userInput.CUCD = this.scope.interfaceItem.defaultCUCD;
                     this.scope.interfaceItem.userInput.FVDT = this.scope.interfaceItem.defaultFromDate;  
                    }
                    }else{
                   
                }
             }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                //this.showError(error, [err.errorMessage]);
               // this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
        }    
            
            
        }
        
         private listWarehouse() {
            
             this.scope.globalSelection.warehouse.list.forEach((eachWarehouse) => {
                
                 });
             
             this.scope.globalSelection.warehouseDataList.forEach((eachWarehouse) => {
                
                 });
            
        }
         
         /** 
        * Load the Buyer
        * @param user the company
        * @param user the m3 user
        */
        private loadItemNumber(searchInput: string) {
             
             if (angular.isUndefined(searchInput) || searchInput.length < 2) {
                return;
            }
             let newSearchQuery = "SearchFields:ITNO " + searchInput + "*";
            this.scope.loadingData = true;
            this.scope.warehouseBasic.transactionStatus.itemnumberIList = true;
            this.appService.getItemNumberForWH(newSearchQuery).then((val: M3.IMIResponse) => {
                
                this.scope.warehouseBasic.itemnumberDataList = val.items;
                this.scope.warehouseBasic.transactionStatus.itemnumberIList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.warehouseBasic.transactionStatus.itemnumberIList = false;
                this.refreshTransactionStatus();
            });
        }
        
        /**
        * validateItem
        * @param user the company
        * @param user the m3 user
        */
        private validateUpdateItem() {
            let ITNO: any;
            let STAT: any;
            let WHLO: any;
            let finalWHLO: any;
            let PUIT: any;
            let SUWH: any;
            let ORTY :any;
            this.scope.interfaceItem.errorType = "createItemWh";
            //console.log(this.scope.warehouseBasic.ITNOW);
            //console.log(this.scope.warehouseBasic.ITNOW.selected);
            ITNO = this.scope.warehouseBasic.ITNOW.selected;
            STAT = this.scope.globalSelection.statusWH.selected;
            WHLO = this.scope.warehouseBasic.warehouseDataList1;
            let checkRecordWH;
            checkRecordWH = true;
            if (ITNO == undefined || angular.equals("", ITNO)) {
                     checkRecordWH = false;
                //show warning message
                let warningMessage = "Please Enter The Item Number";
                this.showWarning(warningMessage, null);
                return;
                }

            
             if (STAT == undefined || angular.equals("", STAT)) {
                     checkRecordWH = false;
                //show warning message
                let warningMessage = "Please Select Status";
                this.showWarning(warningMessage, null);
                return;
                }
            if (WHLO == undefined || this.scope.warehouseBasic.warehouseDataList1.length == 0) {
                     checkRecordWH = false;
                //show warning message
                let warningMessage = "Please Select Warehouse";
                this.showWarning(warningMessage, null);
                return;
                }
            if(angular.equals("302", this.scope.interfaceItem.chkItemType)){
                 PUIT = this.scope.globalSelection.AcqCodeWH.selected;
                 ORTY = this.scope.warehouseBasic.orderTypesData;
                 SUWH = this.scope.warehouseBasic.SUWHdata;
                if (PUIT == undefined || angular.equals("", PUIT)) {
                     checkRecordWH = false;
                //show warning message
                let warningMessage = "Please select Acquisition Code";
                this.showWarning(warningMessage, null);
                return;
                }
                
                if (ORTY == undefined  || angular.equals("", ORTY)) {
                     checkRecordWH = false;
                //show warning message
                let warningMessage = "Please Select Order Type";
                this.showWarning(warningMessage, null);
                return;
                }
                
                if(angular.equals(PUIT, "3")){
                if (SUWH == undefined  || angular.equals("", SUWH)) {
                     checkRecordWH = false;
                //show warning message
                let warningMessage = "Please Select Supplying Warehouse";
                this.showWarning(warningMessage, null);
                return;
                }
                this.scope.warehouseBasic.warehouseDataList1.forEach((Warehouse) => {
                 
                 if(Warehouse.WHLO  == undefined){
                     finalWHLO =  Warehouse;
                     }else{
                     finalWHLO =  Warehouse.WHLO;
                     }
                if(!checkRecordWH){
                     return;
                     }
                if (angular.equals(SUWH, finalWHLO)) {
                     checkRecordWH = false;
                //show warning message
                let warningMessage = "Supplying warehouse must be different from current warehouse";
                this.showWarning(warningMessage, null);
                return;
                }
                 
         });
          }
         }else{
              this.scope.globalSelection.AcqCodeWH = {selected:""};
              this.scope.warehouseBasic.orderTypesData = "";
              this.scope.warehouseBasic.SUWHdata = "";  
            
            }   
           if(checkRecordWH){
                this.updateWH();
               }else{
             
            }
            }
        
        private updateWH() {
             let promises = [];
            let userContext = this.scope.userContext;
            let ITNO: any;
            let STAT: any;
            let finalWHLO: any;
            let PUIT: any;
            let SUWH: any;
            let PLCD: any;
            let WHRESP: any;
            let WHLEA1: any;
            let WHLOQT: any;
            let WHUNMU: any;
            let errorM3Exists: boolean;
            errorM3Exists = false;
            let BUYE: any;
            
            ITNO = this.scope.warehouseBasic.ITNOW.selected;
            STAT = this.scope.globalSelection.statusWH.selected;
            
            WHLEA1 = this.scope.interfaceItem.userInput.LEA1;
            WHLOQT = this.scope.interfaceItem.userInput.LOQT;
            WHUNMU = this.scope.interfaceItem.userInput.UNMU;
            PLCD  = this.scope.warehouseBasic.policydata;
            BUYE = this.scope.interfaceItem.userInput.BUYE;
            this.scope.loadingData = true;
            this.scope.warehouseBasic.transactionStatus.updateItems = true;
            let ORTY :any;
                 PUIT = this.scope.globalSelection.AcqCodeWH.selected;
                 ORTY = this.scope.warehouseBasic.orderTypesData;
                 SUWH = this.scope.warehouseBasic.SUWHdata;
                 if (PUIT  != undefined && !angular.equals("", PUIT)) {}else{PUIT = "";}
                 if (PUIT  != undefined && !angular.equals("", PUIT)) {
                  ORTY = this.scope.warehouseBasic.orderTypesData;
                  if (ORTY  != undefined && !angular.equals("", ORTY)) {}else{ORTY = "";}
                  }else{ORTY = "";}
               if (SUWH  != undefined && !angular.equals("", SUWH)) {}else{SUWH = ""; }
               if (PLCD  != undefined && !angular.equals("", PLCD)) {}else{PLCD = "";}
            //console.log(this.scope.interfaceItem.userInput1.WHUSIDD.USID);
            //console.log(this.scope.interfaceItem.userInput1.WHUSIDD);
            if (!angular.isUndefined(this.scope.interfaceItem.userInput1.WHUSIDD.USID) ) {
            if (JSON.stringify(this.scope.interfaceItem.userInput1.WHUSIDD.USID) != undefined) {
                WHRESP = this.scope.interfaceItem.userInput1.WHUSIDD.USID.replace("\"","");
                //console.log("G IF--"+this.scope.interfaceItem.userInput1.WHUSIDD.USID);
                //console.log("G IF"+this.scope.interfaceItem.userInput1.WHUSIDD);
                
                }
            }else{
                WHRESP = this.scope.interfaceItem.userInput1.WHUSIDD;
                //console.log("G else--"+this.scope.interfaceItem.userInput1.WHUSIDD.USID);
                //console.log("G else--"+this.scope.interfaceItem.userInput1.WHUSIDD);
            }
             if (WHRESP  == undefined ) { WHRESP = "";}
             if (WHLEA1  == undefined ) { WHLEA1 = "";}
             if (WHLOQT  == undefined ) { WHLOQT = "";}
             if (WHUNMU  == undefined ) { WHUNMU = "";}
             if (BUYE == undefined || angular.equals("", BUYE)) {BUYE = "";}
            
            if(angular.equals("302", this.scope.interfaceItem.chkItemType)){
                if(!angular.equals(PUIT, "3")){ SUWH = ""; this.scope.warehouseBasic.SUWHdata = "";}
                this.scope.warehouseBasic.warehouseDataList1.forEach((Warehouse) => {
                 
                 if(Warehouse.WHLO  == undefined){
                     finalWHLO =  Warehouse;
                     }else{
                     finalWHLO =  Warehouse.WHLO;
                     }
                 
                 let promiseItmWhsWH = this.appService.UpdItmWhsWH302(userContext.company,finalWHLO,ITNO,STAT,PUIT,ORTY,SUWH,WHRESP,WHLEA1,WHLOQT,WHUNMU,PLCD,BUYE).then((val1: M3.IMIResponse)=>{
                     
                       }, (err: M3.IMIResponse)=> {
                           errorM3Exists = true;
                          //let error = "API: " + err.program + "." + err.transaction+ ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                          this.showError("", [err.errorMessage]);
                       // this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
               });
                  promises.push(promiseItmWhsWH);
            }); 
            }else{
                 this.scope.warehouseBasic.warehouseDataList1.forEach((Warehouse) => {
                 
                 if(Warehouse.WHLO  == undefined){finalWHLO =  Warehouse;}
                 else
                 {finalWHLO =  Warehouse.WHLO;}
                 
                 let promiseItmWhsWH = this.appService.UpdItmWhsWH(userContext.company,finalWHLO,ITNO,STAT,WHRESP,WHLEA1,WHLOQT,WHUNMU,PLCD,BUYE).then((val1: M3.IMIResponse)=>{
                     //this.showInfo("Item is updated successfully " + ITNO +" .",null);
                       }, (err: M3.IMIResponse)=> {
                            errorM3Exists = true;
                           //let error = "API: " + err.program + "." + err.transaction+ ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                          this.showError("", [err.errorMessage]);
                       // this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
               });
                  promises.push(promiseItmWhsWH);
         });
                
            }
             
            this.$q.all(promises).then((results: [M3.IMIResponse]) => {
               
                this.$timeout(() => {
                if(!errorM3Exists) {
                this.showInfo("Item is updated successfully: " + ITNO +".",null); 
                }
                this.scope.warehouseBasic.transactionStatus.updateItems = false;
                this.refreshTransactionStatus();
                }, 3000); 
                 
                }).finally(() => {
                this.$timeout(() => { 
                this.scope.warehouseBasic.transactionStatus.updateItems = false;
                this.refreshTransactionStatus();
                }, 3000);
                   
                });
        }
        


        /**
        * Load the sample data list 1 (divisions)
        * @param user the company
        * @param user the m3 user
        */
        private loadSampleDataList1(company: string, user: string) {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.sampleDataList1 = true;
            this.appService.getDivisionList(company, null).then((val: M3.IMIResponse) => {
                this.scope.globalSelection.sampleDataList1 = val.items;
            }, (err: M3.IMIResponse) => {
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.globalSelection.transactionStatus.sampleDataList1 = false;
                this.refreshTransactionStatus();
            });
        }

        /**
        * Load the sample data list 2 (warehouses)
        * @param company the company
        */
        private loadWarehouseList(company: string): void {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.wareDataList = true;
            this.appService.getWarehouseList(company).then((val: M3.IMIResponse) => {
                this.scope.warehouseBasic.warehouseDataList = val.items;
                //this.scope.globalSelection.warehouseDataList1 = val.items;
            }, (err: M3.IMIResponse) => {
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.globalSelection.transactionStatus.wareDataList = false;
                this.refreshTransactionStatus();
            });
        }
        

        
         /**
        * Load the sample data list 2 (warehouses)
        * @param company the company
        */
        private itemnumberSelectedWH(selectedITNO:any): void {
           // console.log("G itemnumberONSelected ITEM NUMBER "+selectedITNO);
            this.scope.warehouseBasic.warehouseDataList = [];
            //console.log("G JSON"+ JSON.stringify(selectedITNO));
            if (angular.isUndefined(selectedITNO) || selectedITNO.length < 1) {
                return;
            }
            let userContext = this.scope.userContext;
            let filteredReturnLines:any[] =[];
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.wareDataList = true;
            
            this.appService.getWarehouseList(userContext.company).then((val: M3.IMIResponse) => {
                this.appService.getWarehouseListMITBAL(this.scope.warehouseBasic.ITNOW.selected).then((valMITBAL: M3.IMIResponse) => {
                valMITBAL.items.forEach((Line) => {
                 this.$filter('filter')(val.items, (value: any) => {
                if(angular.equals(Line.WHLO, value.WHLO)){
                    filteredReturnLines.push(value);
                   
                return true; 
                        }else{
                    return false; 
                    }
                    });
                });

                    filteredReturnLines.forEach((lineWHLO) => {
               
                });
                this.scope.warehouseBasic.warehouseDataList = filteredReturnLines;
                
            }, (err: M3.IMIResponse) => {
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
               
            }, (err: M3.IMIResponse) => {
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.globalSelection.transactionStatus.wareDataList = false;
                this.refreshTransactionStatus();
            });
        }
        
        private enableAcqcode(selectedITNO:any):void{
           let queryStatement = "MMITTY,MMITNO from MITMAS where MMITNO =  '" + selectedITNO  + "'";
             this.appService.getMITMASData(queryStatement).then((valMITMAS: M3.IMIResponse) => {
                if (angular.isDefined(valMITMAS.item)) {
                    if(angular.equals(valMITMAS.item.MMITTY, "302")){
                      this.scope.interfaceItem.chkItemType = "302"; 
                    }else{
                     this.scope.interfaceItem.chkItemType = "";   
                    }
                    }else{
                    this.scope.interfaceItem.chkItemType = "";
                }
             }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                //this.showError(error, [err.errorMessage]);
               // this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }); 
        
        }
        
        
        private ONAcqCodeSelected(selectedPUIT:any): void {
            let ORTY: any;
            let MINAME: any;
            let TRANSACTION: any;
            
            this.scope.warehouseBasic.orderTypesData = "";
            if (angular.isUndefined(selectedPUIT)) {
                this.scope.warehouseBasic.orderTypesList = [];
                this.scope.interfaceItem.chkAquCode = "";
                this.scope.warehouseBasic.SUWHdata = "";
                this.scope.globalSelection.AcqCodeWH =  { selected:""};
                this.scope.warehouseBasic.orderTypesData = "";
               return;
            }
          
            
            let userContext = this.scope.userContext;
            this.scope.loadingData = true;
            this.scope.warehouseBasic.transactionStatus.orderTypesList = true;
            
            if(angular.equals(selectedPUIT.id, "1")){ 
            this.scope.interfaceItem.chkAquCode = "1"; 
                ORTY = "";
                MINAME = "PMS120MI";
                TRANSACTION = "LstOrderType";
            }
            if(angular.equals(selectedPUIT.id, "2")){ 
            ORTY = "";
            this.scope.interfaceItem.chkAquCode = "2"; 
                MINAME = "PPS095MI";
                TRANSACTION = "LstOrderType";
            }
            if(angular.equals(selectedPUIT.id, "3")){
                ORTY = "";
                this.scope.interfaceItem.chkAquCode = "3";  
                //MINAME = "CMS100MI";
                //TRANSACTION = "LstDisOrdTyp";
                MINAME = "CRS200MI";
                TRANSACTION = "LstOrderType";
            }
            if(angular.equals(selectedPUIT.id, "6")){ 
            ORTY = "";
            this.scope.interfaceItem.chkAquCode = "6"; 
                //MINAME = "CMS100MI";
                //TRANSACTION = "LstMntOrderTp";
                MINAME = "MOS120MI";
                TRANSACTION = "List";
            }
            this.appService.getorderTypeList(ORTY,MINAME,TRANSACTION).then((orderTypeList: M3.IMIResponse) => {
                this.scope.warehouseBasic.orderTypesList = orderTypeList.items;
              }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                //this.showError(error, [err.errorMessage]);
               // this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.warehouseBasic.transactionStatus.orderTypesList = false;
                this.refreshTransactionStatus();
            });
            
            
        }
        
        private defaultAcqCodeSelected(defselectedPUIT:any): void {
            let ORTY: any;
            let MINAME: any;
            let TRANSACTION: any;
            
             
            if (angular.isUndefined(defselectedPUIT)) {
                this.scope.warehouseBasic.orderTypesList = [];
                return;
            }
           
            
            let userContext = this.scope.userContext;
            //this.scope.loadingData = true;
            //this.scope.warehouseBasic.transactionStatus.orderTypesList = true;
            
            
            if(angular.equals(defselectedPUIT, "2")){ 
            ORTY = "";
            this.scope.interfaceItem.chkAquCode = "2"; 
                MINAME = "PPS095MI";
                TRANSACTION = "LstOrderType";
            }
            this.appService.getorderTypeList(ORTY,MINAME,TRANSACTION).then((orderTypeList: M3.IMIResponse) => {
                this.scope.warehouseBasic.orderTypesList = orderTypeList.items;
             }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                //this.showError(error, [err.errorMessage]);
               // this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.warehouseBasic.transactionStatus.orderTypesList = false;
                this.refreshTransactionStatus();
            });
            
            
        }
        
         /**
        * Load the sample data list 2 (warehouses)
        * @param company the company
        */
        private itemnumberONSelected(selectedITNO:any): void {
            this.scope.interfaceItem.chkItemType = "";
           
            this.scope.warehouseBasic.warehouseDataList = [];
            this.scope.warehouseBasic.SUWHList = [];
            this.scope.warehouseBasic.policydata = "";
           if (angular.isUndefined(selectedITNO)) {
               this.scope.warehouseBasic.warehouseDataList1 = [];
                return;
            }
            let userContext = this.scope.userContext;
            let filteredReturnLines:any[] =[];
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.wareDataList = true;
            
            this.scope.globalSelection.AcqCodeWH  = { selected: "2" };
             this.scope.interfaceItem.chkAquCode = "2";
            let queryStatement = "MMITTY,MMITNO from MITMAS where MMITNO =  '" + selectedITNO.ITNO  + "'";
             this.appService.getMITMASData(queryStatement).then((valMITMAS: M3.IMIResponse) => {
                if (angular.isDefined(valMITMAS.item)) {
                    if(angular.equals(valMITMAS.item.MMITTY, "302")){
                      this.scope.interfaceItem.chkItemType = "302"; 
                      this.defaultAcqCodeSelected("2");
                    }else{
                     this.scope.interfaceItem.chkItemType = "";   
                    }
                    }else{
                    this.scope.interfaceItem.chkItemType = "";
                }
             }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                //this.showError(error, [err.errorMessage]);
               // this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
            
            
            
            this.appService.getWarehouseList(userContext.company).then((val: M3.IMIResponse) => {
                this.appService.getWarehouseListMITBAL(selectedITNO.ITNO).then((valMITBAL: M3.IMIResponse) => {
                valMITBAL.items.forEach((Line) => {
                 this.$filter('filter')(val.items, (value: any) => {
                if(angular.equals(Line.WHLO, value.WHLO)){
                    filteredReturnLines.push(value);
                    
                return true; 
                        }else{
                    return false; 
                    }
                    });
                });

                    filteredReturnLines.forEach((lineWHLO) => {
               
                });
                    this.$timeout(() => { this.scope.warehouseBasic.warehouseDataList = filteredReturnLines; this.scope.warehouseBasic.SUWHList = filteredReturnLines; console.log("G SET WAREHOUSE"); }, 1000);
                
                
            }, (err: M3.IMIResponse) => {
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
                
            }, (err: M3.IMIResponse) => {
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.globalSelection.transactionStatus.wareDataList = false;
                this.refreshTransactionStatus();
            });
        }
        
        
        private loadnewItemNumberWH(selectedITNO:any): void {
           
            this.scope.warehouseBasic.warehouseDataList = [];
            this.scope.warehouseBasic.SUWHList = [];
            
           if (angular.isUndefined(selectedITNO)) {
                return;
            }
            let userContext = this.scope.userContext;
            let filteredReturnLines:any[] =[];
            //this.scope.loadingData = true;
            //this.scope.globalSelection.transactionStatus.wareDataList = true;
            //console.log("G INSI"+userContext.company);
            this.appService.getWarehouseList(userContext.company).then((val: M3.IMIResponse) => {
                this.appService.getWarehouseListMITBAL(selectedITNO).then((valMITBAL: M3.IMIResponse) => {
                valMITBAL.items.forEach((Line) => {
                 this.$filter('filter')(val.items, (value: any) => {
                if(angular.equals(Line.WHLO, value.WHLO)){
                    filteredReturnLines.push(value);
                    
                return true; 
                        }else{
                    return false; 
                    }
                    });
                });

                    filteredReturnLines.forEach((lineWHLO) => {
               
                });
                this.scope.warehouseBasic.warehouseDataList = filteredReturnLines;
                this.scope.warehouseBasic.SUWHList = filteredReturnLines;
                
            }, (err: M3.IMIResponse) => {
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
                
            }, (err: M3.IMIResponse) => {
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.globalSelection.transactionStatus.wareDataList = false;
                this.refreshTransactionStatus();
            });
        }
        
         /**
        * Load the sample data list 2 (warehouses)
        * @param company the company
        */
        private loadAllWarehouse(): void {
            let selectedITNO: any = this.scope.warehouseBasic.ITNOW.selected;
            this.scope.warehouseBasic.warehouseDataList = [];
                this.scope.warehouseBasic.warehouseDataList1 = [];
            
           if (angular.isUndefined(selectedITNO)) {
                return;
            }
            let userContext = this.scope.userContext;
            let filteredReturnLines:any[] =[];
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.wareDataList = true;
            
            this.appService.getWarehouseList(userContext.company).then((val: M3.IMIResponse) => {
                this.appService.getWarehouseListMITBAL(selectedITNO).then((valMITBAL: M3.IMIResponse) => {
                valMITBAL.items.forEach((Line) => {
                 this.$filter('filter')(val.items, (value: any) => {
                if(angular.equals(Line.WHLO, value.WHLO)){
                    filteredReturnLines.push(value);
                return true; 
                        }else{
                    return false; 
                    }
                    });
                });

                this.scope.warehouseBasic.warehouseDataList = filteredReturnLines;
                this.scope.warehouseBasic.warehouseDataList1 = filteredReturnLines;
               
            }, (err: M3.IMIResponse) => {
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            });
                
            }, (err: M3.IMIResponse) => {
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.globalSelection.transactionStatus.wareDataList = false;
                this.refreshTransactionStatus();
            });
        }
        
         
        
       
        
        /**
        * Load the sample data list 2 (warehouses)
        * @param company the company
        */
        private loadWarehouseList1(company: string): void {
             let userContext = this.scope.userContext;
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.wareDataList = true;
         
            this.appService.getWarehouseList(userContext.company).then((val: M3.IMIResponse) => {
              
                this.scope.warehouseBasic.warehouseDataList = val.items;
               
            }, (err: M3.IMIResponse) => {
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.globalSelection.transactionStatus.wareDataList = false;
                this.refreshTransactionStatus();
            });
        }
        
        /**
        * Load the sample data list 2 (warehouses)
        * @param company the company
        */
        private loadWarehouseList2(company: string): void {
             let userContext = this.scope.userContext;
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.wareDataList = true;
         
            this.appService.getWarehouseList(userContext.company).then((val: M3.IMIResponse) => {
                
                this.scope.warehouseBasic.warehouseDataList = val.items;
                this.scope.warehouseBasic.warehouseDataList1 = val.items;
               
            }, (err: M3.IMIResponse) => {
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.globalSelection.transactionStatus.wareDataList = false;
                this.refreshTransactionStatus();
            });
        }
        
        /**
        * Load the sample data list 2 (item group)
        * @param company the company
        */
        private loaditemGroupList(itemGroup: any): void {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.itemgroupDataList = true;
            //this.appService.getItemGroupList(company).then((val: M3.IMIResponse) => {
            this.appService.getItemGroup("ITGR",itemGroup.PK02).then((val: M3.IMIResponse) => {
                this.scope.globalSelection.itemGroupList = val.items;
            }, (err: M3.IMIResponse) => {
               // let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Item Group", [err.errorMessage]);
               //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.globalSelection.transactionStatus.itemgroupDataList = false;
                this.refreshTransactionStatus();
            });
        }
        
        private LstGeneralCode(UM: any): void {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.decimalList = true;
            this.scope.interfaceItem.userInput.DCCD = "";
            //this.appService.getItemGroupList(company).then((val: M3.IMIResponse) => {
            this.appService.getDecimals("UNIT",UM.STKY).then((val: M3.IMIResponse) => {
                //this.scope.globalSelection.itemGroupList = val.items;
               
                val.items.forEach((item) => {
                     //console.log("G item.DCCD n-----"+item.PARM.trim());
                    if (item.PARM != null && item.PARM != "" && item.PARM.trim().length >= 4  && parseInt(item.PARM.trim().substring(3,4)) > 0) {
                    this.scope.interfaceItem.userInput.DCCD = item.PARM.trim().substring(3,4);
                        //console.log("G item.DCCD-----"+item.PARM.trim().substring(3,4));
                    }else{
                        this.scope.interfaceItem.userInput.DCCD =  "";
                    }
               });
            }, (err: M3.IMIResponse) => {
               // let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading LstGeneralCode", [err.errorMessage]);
               //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.globalSelection.transactionStatus.decimalList = false;
                this.refreshTransactionStatus();
            });
        }
        
           private AssignLstGeneralCode(UM: any): void {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.decimalList = true;
            this.scope.interfaceItem.userInput.DCCD = "";
            //this.appService.getItemGroupList(company).then((val: M3.IMIResponse) => {
            this.appService.getDecimals("UNIT",UM.trim()).then((val: M3.IMIResponse) => {
                //this.scope.globalSelection.itemGroupList = val.items;
               
                val.items.forEach((item) => {
                     //console.log("G item.DCCD n-----"+item.PARM.trim());
                    if (item.PARM != null && item.PARM != "" && item.PARM.trim().length >= 4  && parseInt(item.PARM.trim().substring(3,4)) > 0) {
                    this.scope.interfaceItem.userInput.DCCD = item.PARM.trim().substring(3,4);
                        //console.log("G item.DCCD-----"+item.PARM.trim().substring(3,4));
                    }else{
                        this.scope.interfaceItem.userInput.DCCD =  "";
                    }
               });
            }, (err: M3.IMIResponse) => {
               // let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading LstGeneralCode", [err.errorMessage]);
               //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.globalSelection.transactionStatus.decimalList = false;
                this.refreshTransactionStatus();
            });
        }
        
         /**
        * Load the sample data list 2 (UOM)
        * @param company the company
        */
        private loadUOMList(): void {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.uomDataList = true;
            this.appService.getUOMList("","UNIT").then((val: M3.IMIResponse) => {
                this.scope.globalSelection.uomList = val.items;
            }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Basic U/M", [err.errorMessage]);
                //this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
               }).finally(() => {
                this.scope.globalSelection.transactionStatus.uomDataList = false;
                this.refreshTransactionStatus();
            });
        }
        
         /**
        * Load the loadAttributesList ()
        * @param company the company
        */
        private loadAttributesList(): void {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.attributeDataList = true;
            this.appService.getAttributesList("").then((val: M3.IMIResponse) => {
                this.scope.globalSelection.attributeList = val.items;
            }, (err: M3.IMIResponse) => {
               // let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Attributes", [err.errorMessage]);
             //this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
               }).finally(() => {
                this.scope.globalSelection.transactionStatus.attributeDataList = false;
                this.refreshTransactionStatus();
            });
        }
         /**
        * Load the loadProductGroup ()
        * @param company the company
        */
        private loadProductGroup(company: string): void {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.prdgrpDataList = true;
           // this.appService.getProductGroup(company).then((val: M3.IMIResponse) => {
                this.appService.getProductGroupList("ITCL","ITCL").then((val: M3.IMIResponse) => {
                this.scope.globalSelection.prdgrpList = val.items;
                 
            }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Product Group", [err.errorMessage]);
             //this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
               }).finally(() => {
                this.scope.globalSelection.transactionStatus.prdgrpDataList = false;
                this.refreshTransactionStatus();
            });
        }
         /**
        * Load the loadBusinessArea ()
        * @param company the company
        */
        private loadBusinessArea(company: string): void {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.businessareaDataList = true;
            this.appService.getBusinessArea(company).then((val: M3.IMIResponse) => {
                this.scope.globalSelection.businessareaList = val.items;
            }, (err: M3.IMIResponse) => {
                //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Business Area", [err.errorMessage]);
            // this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
               }).finally(() => {
                this.scope.globalSelection.transactionStatus.businessareaDataList = false;
                this.refreshTransactionStatus();
            });
            
        }
        
        private processAddElementValue(CEID: string, OVK1: string,OVK2: string, OVHE: string, VFDT: string): void {
           this.appService.AddElementValue(CEID, OVK1,OVK2, OVHE, VFDT).then((val1: M3.IMIResponse)=>{
             
            }, (err: M3.IMIResponse)=> {
                 //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                  //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
                 this.showError("Error in PPS280MI for Adding Element Value", [err.errorMessage]); 
                //this.showError(error, [err.errorMessage]);
                //this.refreshTransactionStatus();
           });
           }
       private AddItmLot(ITNO: string, BANO: string): void {
           this.appService.AddItmLot(ITNO, BANO).then((val1: M3.IMIResponse)=>{
             
            }, (err: M3.IMIResponse)=> {
                 //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                  //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
                 this.showError("Error in MMS235MI for Adding Itm Lot", [err.errorMessage]); 
                //this.showError(error, [err.errorMessage]);
                //this.refreshTransactionStatus();
           });
           } 
        
        private processAddElementRate(SCEL: string, OBV1: string,OBV2: string, OVHE: string, VFDT: string): void {
           this.appService.AddElementRate(SCEL, OBV1,OBV2, OVHE, VFDT).then((val1: M3.IMIResponse)=>{
            
            }, (err: M3.IMIResponse)=> {
                 //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                  //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
                 this.showError("Error in OIS015MI for Adding Element Rate", [err.errorMessage]); 
                //this.showError(error, [err.errorMessage]);
                //this.refreshTransactionStatus();
           });
           }

        /**
        * Load the interfaceItem
        * @param reLoad the reLoad flag reference
        */
        private interfaceItem(reLoad: boolean): void {
            let userContext = this.scope.userContext;
            let selectedSampleData1 = this.scope.globalSelection.sampleData1;

            if (reLoad) {
                this.clearData(["interfaceItem"]);
            }
//            if (angular.isUndefined(selectedSampleData1) ||  selectedSampleData1 == "") {
//                //show warning message
//                let warningMessage = "Please select a division";
//                this.showWarning(warningMessage, null);
//                return;
//            }

            //Add functions calls / business logics below which are required when this module is requested to load by an user
            if (reLoad && angular.equals(this.scope.authStatus,"authorizeSuccess")) {
                this.loaditemType();
                this.loadpriceList();
                this.loadDefaultpriceList();
                this.listFacility(userContext.company, "");
                //this.loadWarehouseList(userContext.company);
                //this.loaditemGroupList(userContext.company);
                this.loadUOMList();
                //this.loadAttributesList();
                this.loadProductGroup(userContext.company);
                this.loadBusinessArea(userContext.company);
            }
            this.scope.interfaceItem.reload = false;
        }
        
         /**
        * Load the warehouseBasic
        * @param reLoad the reLoad flag reference
        */
        private warehouseBasic(reLoad: boolean): void {
             
            let userContext = this.scope.userContext;
            let selectedSampleData1 = this.scope.globalSelection.sampleData1;
            if (reLoad) {
                this.clearData(["warehouseBasic"]);
            }


            //Add functions calls / business logics below which are required when this module is requested to load by an user
            if (reLoad) {
                //console.log("G reLoad warehouseBasic");
                //this.itemnumberSelected(this.scope.warehouseBasic.ITNOW.selected);
               
            }
             this.scope.warehouseBasic.reload = false;
        }

        /**
        * Load the Sample list for sample module 1
        * @param company the logged in user's company
        */
        private listFacility(company: string, division: string): void {
            this.scope.loadingData = true;
            this.scope.interfaceItem.transactionStatus.sampleList1 = true;
            this.appService.getFacilityList(company, "").then((val: M3.IMIResponse) => {
                this.scope.globalSelection.facilityDataList = val.items;
            }, (err: M3.IMIResponse) => {
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
             this.scope.statusBar.push({message:error+" "+err.errorMessage,statusBarMessageType:h5.application.MessageType.Error,timestamp:new Date()});
               }).finally(() => {
                this.scope.interfaceItem.transactionStatus.sampleList1 = false;
                this.refreshTransactionStatus();
            });
        }

        /**
        * Called when a Row is selected in the Sample Data List Grid
        * @param selectedRow the selected row object
        */
        private RowSelected(selectedRow: any) {
            this.scope.interfaceItem.selectedSampleDataGridRow = selectedRow.entity;
             if (selectedRow.isSelected) {
            this.scope.interfaceItem.enableUpdate = true;
                 this.scope.interfaceItem.enableCreate = false;
            this.scope.interfaceItem.userInput.IFIN = selectedRow.entity.ITNO;
            this.scope.interfaceItem.userInput.ITNO = selectedRow.entity.ITNO;
            this.scope.interfaceItem.userInput.ITDS = selectedRow.entity.ITDS;
            this.scope.globalSelection.status.selected = selectedRow.entity.STAT;
            this.scope.interfaceItem.userInput.FUDS =  selectedRow.entity.FUDS;
            this.scope.interfaceItem.userSelection.itemType =  selectedRow.entity.ITTY;
                  
            }else{
                 this.scope.interfaceItem.enableUpdate = false;
                 this.scope.interfaceItem.enableCreate = true;
                 
                 }
        }
        


        private PCS260(company: any, division: any,facility:any, itemnumber:any,costingDate:any,CostingType:any,ProductStructureType:any,CostingSum1:any) {
           //GQA
           // var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:add="http://your.company.net/PCS260/Add"> <soapenv:Header><cred:lws><!--Optional:--><cred:company>'+company+'</cred:company><!--Optional:--><cred:division>'+division+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><add:Add><add:PCS260><add:W1FACI>'+facility+'</add:W1FACI><add:W1ITNO>'+itemnumber+'</add:W1ITNO><add:W1PCTP>'+CostingType+'</add:W1PCTP><!--Optional:--><add:W1STRT></add:W1STRT><!--Optional:--><add:W1VASE></add:W1VASE><!--Optional:--><add:W1RORN></add:W1RORN><add:W1PCDT>'+costingDate+'</add:W1PCDT><add:WWCSU1>'+CostingSum1+'</add:WWCSU1><add:WWMAUM>0</add:WWMAUM></add:PCS260></add:Add></soapenv:Body></soapenv:Envelope>';
           //PRD 
           //var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:add="http://your.company.net/PCS260/Add"> <soapenv:Header><cred:lws><!--Optional:--><cred:company>'+company+'</cred:company><!--Optional:--><cred:division>'+division+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><add:Add><add:PCS260><add:W1FACI>'+facility+'</add:W1FACI><add:W1ITNO>'+itemnumber+'</add:W1ITNO><add:W1PCTP>'+CostingType+'</add:W1PCTP><!--Optional:--><add:W1STRT></add:W1STRT><!--Optional:--><add:W1VASE></add:W1VASE><!--Optional:--><add:W1RORN></add:W1RORN><add:W1PCDT>'+costingDate+'</add:W1PCDT><add:WWCSU1>'+CostingSum1+'</add:WWCSU1></add:PCS260></add:Add></soapenv:Body></soapenv:Envelope>';                 
           
            let userContext = this.scope.userContext;
            let GEnv:string = userContext.TX40.substring(0,userContext.TX40.indexOf("-")).trim();   
            if (angular.equals("QA", GEnv)) {
                //console.log("GQA ENV "+GEnv);
            //var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:add="http://your.company.net/PCS260/Add"> <soapenv:Header><cred:lws><!--Optional:--><cred:company>'+company+'</cred:company><!--Optional:--><cred:division>'+division+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><add:Add><add:PCS260><add:W1FACI>'+facility+'</add:W1FACI><add:W1ITNO>'+itemnumber+'</add:W1ITNO><add:W1PCTP>'+CostingType+'</add:W1PCTP><!--Optional:--><add:W1STRT></add:W1STRT><!--Optional:--><add:W1VASE></add:W1VASE><!--Optional:--><add:W1RORN></add:W1RORN><add:W1PCDT>'+costingDate+'</add:W1PCDT><add:WWCSU1>'+CostingSum1+'</add:WWCSU1><add:WWMAUM>0</add:WWMAUM></add:PCS260></add:Add></soapenv:Body></soapenv:Envelope>';
            var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:add="http://your.company.net/PCS260WS/Add"> <soapenv:Header><cred:lws><!--Optional:--><cred:company>'+company+'</cred:company><!--Optional:--><cred:division>'+division+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><add:Add><add:PCS260><add:FACI>'+facility+'</add:FACI><add:ITNO>'+itemnumber+'</add:ITNO><add:PCTP>'+CostingType+'</add:PCTP><add:PCDT>'+costingDate+'</add:PCDT><add:CSU1>'+parseFloat(CostingSum1.toFixed(4))+'</add:CSU1></add:PCS260></add:Add></soapenv:Body></soapenv:Envelope>';
            
                this.doRequest(strXml,itemnumber,facility);
            }else if (angular.equals("PRD", GEnv)){
                //console.log("GPROD ENV "+GEnv);
           //PRD 
            //var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:add="http://your.company.net/PCS260/Add"> <soapenv:Header><cred:lws><!--Optional:--><cred:company>'+company+'</cred:company><!--Optional:--><cred:division>'+division+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><add:Add><add:PCS260><add:W1FACI>'+facility+'</add:W1FACI><add:W1ITNO>'+itemnumber+'</add:W1ITNO><add:W1PCTP>'+CostingType+'</add:W1PCTP><!--Optional:--><add:W1STRT></add:W1STRT><!--Optional:--><add:W1VASE></add:W1VASE><!--Optional:--><add:W1RORN></add:W1RORN><add:W1PCDT>'+costingDate+'</add:W1PCDT><add:WWCSU1>'+CostingSum1+'</add:WWCSU1></add:PCS260></add:Add></soapenv:Body></soapenv:Envelope>';                 
            var strXml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:add="http://your.company.net/PCS260WS/Add"> <soapenv:Header><cred:lws><!--Optional:--><cred:company>'+company+'</cred:company><!--Optional:--><cred:division>'+division+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><add:Add><add:PCS260><add:FACI>'+facility+'</add:FACI><add:ITNO>'+itemnumber+'</add:ITNO><add:PCTP>'+CostingType+'</add:PCTP><add:PCDT>'+costingDate+'</add:PCDT><add:CSU1>'+parseFloat(CostingSum1.toFixed(4))+'</add:CSU1></add:PCS260></add:Add></soapenv:Body></soapenv:Envelope>';  
                this.doRequest(strXml,itemnumber,facility);
            }
             //this.doRequest(strXml,itemnumber,facility);
        }
        
        

        private doRequest(strXml: string,ITNO: string,FACI: string) {
          // this.scope.interfaceItem.filteredErrors =[];
            var __this = this;
            __this.scope.interfaceItem.errormessagecheck = "";
            //__this.scope.interfaceItem.filteredErrors =[];
            var xmlhttp = new XMLHttpRequest();
            let userContext = this.scope.userContext;
            let GEnv:string = userContext.TX40.substring(0,userContext.TX40.indexOf("-")).trim();   
            if (angular.equals("QA", GEnv)) {
                //console.log("GQA ENV POST-N"+GEnv);
                 //xmlhttp.open('POST', 'https://uosqa.cloud.infor.com:7443/infor/CustomerApi/M3ItemCreationApp/PCS260', true);
                xmlhttp.open('POST', 'https://uosqa.cloud.infor.com:7443/infor/CustomerApi/M3ItemCreationPCS260/PCS260WS', true);
            }else if (angular.equals("PRD", GEnv)){
                //console.log("GPROD ENV POST"+GEnv);
                //xmlhttp.open('POST', 'https://uosprod.cloud.infor.com:7443/infor/CustomerApi/M3ItemCreationApp/PCS260', true);
                xmlhttp.open('POST', 'https://uosprod.cloud.infor.com:7443/infor/CustomerApi/M3ItemCreationPCS260/PCS260WS', true);
            
           }
            // xmlhttp.open('POST', 'https://uosqa.cloud.infor.com:7443/infor/CustomerApi/M3ItemCreationApp/PCS260', true);
            //prod
            //xmlhttp.open('POST', 'https://uosprod.cloud.infor.com:7443/infor/CustomerApi/M3ItemCreationApp/PCS260', true);
            
            xmlhttp.onreadystatechange = function () {
               if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                  // console.log(xmlhttp.responseText);
                   
                   __this.scope.interfaceItem.counterErrors++;
                    if(parseInt(__this.scope.interfaceItem.counterErrors) == parseInt(__this.scope.interfaceItem.facilityCount)){
                        if(__this.scope.interfaceItem.errorDisplay){
                       // __this.$timeout(() => { __this.showerrormessage(__this.scope.interfaceItem.errormessagecheck,__this.scope.interfaceItem.filteredErrors); }, 5000);
                            }
                }
               }
                if (xmlhttp.readyState == 4 ){
                if (xmlhttp.status == 500) {
                }
                    
                     if (xmlhttp.status !== 200) { 
                    let finalString: any = xmlhttp.responseText;
                    __this.scope.interfaceItem.errorDisplay = true;
                    __this.scope.interfaceItem.errormessagecheck = "Item "+ ITNO + "Facility "+ FACI + finalString.substring(finalString.indexOf("faultstring") + 12,finalString.lastIndexOf("faultstring") - 2);
                    __this.scope.interfaceItem.counterErrors++;
                    __this.scope.interfaceItem.filteredErrors.push("Item : "+ ITNO + " Facility : "+ FACI +" "+ finalString.substring(finalString.indexOf("faultstring") + 12 ,finalString.lastIndexOf("faultstring") - 2));
                    if(parseInt(__this.scope.interfaceItem.counterErrors) == parseInt(__this.scope.interfaceItem.facilityCount)){
                      // __this.$timeout(() => { __this.showerrormessage(__this.scope.interfaceItem.errormessagecheck,__this.scope.interfaceItem.filteredErrors);}, 5000);
                }
                         let errorresponse: any = xmlhttp.responseText;
                         let MSG: any = errorresponse.substring(errorresponse.indexOf("faultstring") + 12,errorresponse.lastIndexOf("faultstring") - 2);
                         __this.pcs260Log( ITNO, FACI, "", "", MSG);
                     }
                }
                
           };
           xmlhttp.setRequestHeader('Content-Type', 'text/xml');
          
           xmlhttp.send(strXml);
       }
        
        public pcs260Log( ITNO:any, FACI:any, PCDT:any, CSU1:any, MSG:any): void{
             this.appService.pcs260Log("PCS260ITMC", ITNO, FACI, PCDT, CSU1, MSG).then((val1: M3.IMIResponse)=>{
           
            }, (err: M3.IMIResponse)=> {
           });
            }
        
        
        private CAS380(company: any, division: any,facility:any, itemnumber:any,ATA1:any,APPR:any) {
           let userContext = this.scope.userContext;
            let GEnv:string = userContext.TX40.substring(0,userContext.TX40.indexOf("-")).trim();   
            if (angular.equals("QA", GEnv)) {
                //console.log("GQA ENV "+GEnv);
            var strCAS380Xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:add="http://your.company.net/CAS380WS/AddAverageCost"> <soapenv:Header><cred:lws><!--Optional:--><cred:company>'+company+'</cred:company><!--Optional:--><cred:division>'+division+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><add:AddAverageCost><add:CAS380><add:ATA1>'+ATA1+'</add:ATA1><add:ITNO>'+itemnumber+'</add:ITNO><add:APPR>'+APPR.toFixed(4)+'</add:APPR><add:FACI>'+facility+'</add:FACI></add:CAS380></add:AddAverageCost></soapenv:Body></soapenv:Envelope>';
             //console.log("GQA strCAS380Xml "+strCAS380Xml);
                this.doCAS380Request(strCAS380Xml,itemnumber,facility);
            }else if (angular.equals("PRD", GEnv)){
                 var strCAS380Xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cred="http://lawson.com/ws/credentials" xmlns:add="http://your.company.net/CAS380WS/AddAverageCost"> <soapenv:Header><cred:lws><!--Optional:--><cred:company>'+company+'</cred:company><!--Optional:--><cred:division>'+division+'</cred:division></cred:lws></soapenv:Header><soapenv:Body><add:AddAverageCost><add:CAS380><add:ATA1>'+ATA1+'</add:ATA1><add:ITNO>'+itemnumber+'</add:ITNO><add:APPR>'+APPR.toFixed(4)+'</add:APPR><add:FACI>'+facility+'</add:FACI></add:CAS380></add:AddAverageCost></soapenv:Body></soapenv:Envelope>';
             //console.log("GPRD strCAS380Xml "+strCAS380Xml);
                this.doCAS380Request(strCAS380Xml,itemnumber,facility);
           }
             //this.doRequest(strXml,itemnumber,facility);
        }
        
        private doCAS380Request(strCAS380Xml: string,ITNO: string,FACI: string) {
          // this.scope.interfaceItem.filteredErrors =[]; 
            var __this = this;
            var xmlhttps = new XMLHttpRequest();
            let userContext = this.scope.userContext;
            let GEnv:string = userContext.TX40.substring(0,userContext.TX40.indexOf("-")).trim();   
            if (angular.equals("QA", GEnv)) {
                //console.log("GQA ENV POST-N"+GEnv);
                 xmlhttps.open('POST', 'https://uosqa.cloud.infor.com:7443/infor/CustomerApi/M3AddAverageCostH5App/CAS380', true);
            }else if (angular.equals("PRD", GEnv)){
                //console.log("GPROD ENV POST"+GEnv);
                //xmlhttps.open('POST', '', true);
                 xmlhttps.open('POST', 'https://uosprod.cloud.infor.com:7443/infor/CustomerApi/M3ItemCreationCAS380WS/CAS380WS', true);
            
           }
            xmlhttps.onreadystatechange = function () {
               if (xmlhttps.readyState == 4 && xmlhttps.status == 200) {
                   //console.log(xmlhttps.responseText);
               }
                if (xmlhttps.readyState == 4 ){
                if (xmlhttps.status == 500) {
                   //console.log(xmlhttp.response);
                   //console.log(xmlhttps.responseText);
                }
                }
           };
           xmlhttps.setRequestHeader('Content-Type', 'text/xml');
           xmlhttps.send(strCAS380Xml);
       }
        
          private showerrormessage(errormssg:any,errormssges:any) {
            this.showWarning("PCS260", errormssges);
            //console.log("g calling"+errormssg);
              //console.log("g calling errors"+errormssges);
            //return;
            }
        
        public removeSelectedLine() : void {
          this.openSendMailModal();
}
 /*       
                public removeSelectedLine() : void {
            let lines = this.scope.interfaceItem.itemlinesGrid.data;
            let selectedRows = this.scope.interfaceItem.itemlinesGrid.gridApi.selection.getSelectedRows();
            let checkNotAssigned: boolean;
            checkNotAssigned = false;
            if(selectedRows.length > 0){
            selectedRows.forEach((selectedRow: any) => {
                let index = lines.lastIndexOf(selectedRow);
                if(selectedRow.F1A830 == undefined || angular.equals("", selectedRow.F1A830)){
                this.deleteItemRequest(selectedRow.F1PK01);
                console.log(selectedRow.F1PK01);
                console.log(JSON.stringify(selectedRow));
                lines.splice(index, 1);
                checkNotAssigned = true;
                }else{
                     console.log(selectedRow.F1PK01 + "----" + selectedRow.F1A830);
                     let warningAssignMessage = "Item " + selectedRow.F1PK01 + " is already [ " + selectedRow.F1A830 + " ] , Please UnAssign to delete."; 
                     this.showWarning(warningAssignMessage, null);
                }
            });
            if(checkNotAssigned){
            this.scope.interfaceItem.itemlinesGrid.gridApi.selection.clearSelectedRows();
            this.gridService.adjustGridHeight("itemlinesGrid", this.scope.interfaceItem.itemlinesGrid.data.length, 500);
            //let deletedMessage = "Selected row is deleted successfully."; 
            //this.showWarning(deletedMessage, null);
            }
            }
}*/
        
        public denySelectedLine() : void {
            let lines = this.scope.interfaceItem.itemlinesGrid.data;
            let selectedRows = this.scope.interfaceItem.itemlinesGrid.gridApi.selection.getSelectedRows();
            let checkNotAssigned: boolean;
            checkNotAssigned = false;
            if(selectedRows.length > 0){
            selectedRows.forEach((selectedRow: any) => {
                let index = lines.lastIndexOf(selectedRow);
                if(selectedRow.F1A830 != undefined || !angular.equals("", selectedRow.F1A830)){
                this.denyItemRequest(selectedRow.F1PK01);
                //console.log(selectedRow.F1PK01);
                //console.log(JSON.stringify(selectedRow));
                lines.splice(index, 1);
                checkNotAssigned = true;
                }else{
                 //    console.log(selectedRow.F1PK01 + "----" + selectedRow.F1A830);
                 //    let warningAssignMessage = "Item " + selectedRow.F1PK01 + " is already [ " + selectedRow.F1A830 + " ] , Please UnAssign to delete."; 
                 //    this.showWarning(warningAssignMessage, null);
                }
            });
            if(checkNotAssigned){
            this.scope.interfaceItem.itemlinesGrid.gridApi.selection.clearSelectedRows();
            this.gridService.adjustGridHeight("itemlinesGrid", this.scope.interfaceItem.itemlinesGrid.data.length, 500);
            //let deletedMessage = "Selected row is deleted successfully."; 
            //this.showWarning(deletedMessage, null);
            }
            }
}
        
        private deleteItemRequest(ITNO: string): void {
           this.appService.deleteItemRequest("ITMAPP",ITNO).then((val1: M3.IMIResponse)=>{
            let deletedItemMessage = "Item Request [ " + ITNO + " ] is deleted successfully."; 
            this.showWarning(deletedItemMessage, null);
            //if(angular.equals(ITNO, this.scope.interfaceItem.userInput.IFIN)){
            //    this.clearFields();
            //}
            }, (err: M3.IMIResponse)=> {
                 //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                  //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
                 this.showError("Error in Deleting Requested Item", [err.errorMessage]); 
                //this.showError(error, [err.errorMessage]);
                //this.refreshTransactionStatus();
           });
           }
        
        private denyItemRequest(ITNO: string): void {
            let denyMessage =  this.scope.interfaceItem.denymessage;
            this.appService.denyItemRequest("ITMAPP",ITNO,denyMessage).then((val1: M3.IMIResponse)=>{
            this.appService.updateItemStatus("ITMAPP",ITNO,"95").then((valM3AddItem: M3.IMIResponse)=>{
               let deletedItemMessage = "Item Request [ " + ITNO + " ] is deleted."; 
               this.showWarning(deletedItemMessage, null);
               this.closeModalWindow();
               this.clearFields();   
               this.scope.interfaceItem.enableDenybutton = false;
               }, (err: M3.IMIResponse)=> {
                    this.showError("Error in Denying Requested Item", [err.errorMessage]);
                });
            }, (err: M3.IMIResponse)=> {
                 //let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                  //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
                 this.showError("Error in Deleting Requested Item", [err.errorMessage]); 
                //this.showError(error, [err.errorMessage]);
                //this.refreshTransactionStatus();
           });
            
           }
        
        private openSendMailModal() {
            this.scope.interfaceItem.enableReasonbutton = false;
            let options: any = {
                animation: true,
                templateUrl: "views/SendEmailModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }
        
        private enableConfirm(): void{
            if(this.scope.interfaceItem.denymessage != undefined &&
            !angular.equals("", this.scope.interfaceItem.denymessage)){
            this.scope.interfaceItem.enableReasonbutton = true;
            }else{
            this.scope.interfaceItem.enableReasonbutton = false;
            }
    }
        
        
    private loadplanPolicyList(): void {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.planningPolicyList = true;
            this.appService.getplanningPolicy("PLCD").then((valPP: M3.IMIResponse) => {
                this.scope.warehouseBasic.policyList =  valPP.items;
            }, (err: M3.IMIResponse) => {
               // let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError("Error Loading Planning Policy List", [err.errorMessage]);
               //this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: this.scope.statusBarMessagetype.Error, timestamp: new Date() });
            }).finally(() => {
                this.scope.globalSelection.transactionStatus.planningPolicyList = false;
                this.refreshTransactionStatus();
            });
}    
 

     private triggerEcomm(Ecomm:any): void {
        console.log(Ecomm);  
        let ITTY: any;
                ITTY = this.scope.interfaceItem.userSelection.itemType;
                if (angular.equals("302", ITTY) || angular.equals("401", ITTY) || angular.equals("402", ITTY)) {
                    if (this.scope.interfaceItem.ecommFlag) { 
                        this.scope.interfaceItem.userInput.PRRF = { selected: "ECOMM" };
                        this.scope.interfaceItem.userInput.CUCD = this.scope.interfaceItem.defaultECOMMCUCD;
                        this.scope.interfaceItem.userInput.FVDT = this.scope.interfaceItem.defaultECOMMFromDate;
                        console.log(this.scope.interfaceItem.ecommFlag);
                    }
                    else {
                        let SUNO: any; 
                        let AGNB: any;
                        SUNO = this.scope.interfaceItem.userInput.SUNO;
                        AGNB = this.scope.interfaceItem.userInput.AGNB;
                        console.log(this.scope.interfaceItem.ecommFlag + "G triggerEcomm -------" + SUNO);
                        console.log(this.scope.interfaceItem.ecommFlag + "G triggerEcomm -------" + AGNB);
                        if (SUNO === undefined || AGNB === undefined || angular.equals("", SUNO) || angular.equals("", AGNB)) {
                            console.log(this.scope.interfaceItem.ecommFlag + "-------" + "G FALSE Blank");
                            this.scope.interfaceItem.userInput.PRRF = { selected: "" };
                            this.scope.interfaceItem.userInput.CUCD = "";
                            this.scope.interfaceItem.userInput.FVDT = "";
                            return;
                        }
                        var queryMPAGRHStatement = "AHSUNO,AHAGNB,AHMODA from MPAGRH where AHSUNO =  '" + this.scope.interfaceItem.userInput.SUNO + "' and AHAGNB = '" + this.scope.interfaceItem.userInput.AGNB + "'";
                        this.appService.getMPAGRHData(queryMPAGRHStatement).then((valMPAGRHD: M3.IMIResponse) => {
                            if (angular.isDefined(valMPAGRHD.item)) {
                                if (angular.equals(valMPAGRHD.item.AHMODA, "1")) {
                                    this.scope.interfaceItem.userInput.PRRF = { selected: "SUPPLIER" };
                                    this.scope.interfaceItem.defaultMODA = "1";
                                    this.scope.interfaceItem.userInput.CUCD = this.scope.interfaceItem.defaultSUPPCUCD;
                                    this.scope.interfaceItem.userInput.FVDT = this.scope.interfaceItem.defaultSUPPFromDate;
                                }
                                else {
                                    this.scope.interfaceItem.userInput.PRRF = { selected: "LIST PRICE" };
                                    this.scope.interfaceItem.defaultMODA = "0";
                                    this.scope.interfaceItem.userInput.CUCD = this.scope.interfaceItem.defaultCUCD;
                                    this.scope.interfaceItem.userInput.FVDT = this.scope.interfaceItem.defaultFromDate;
                                }
                                console.log(this.scope.interfaceItem.ecommFlag + "-------" + "G FALSE NOT Blank-----" + valMPAGRHD.item.AHMODA);
                            }
                            else {
                            }
                        }, (err: M3.IMIResponse) => {
                            this.scope.interfaceItem.userInput.PRRF = { selected: "" };
                            this.scope.interfaceItem.userInput.CUCD = "";
                            this.scope.interfaceItem.userInput.FVDT = ""; 
                        });
                    }
                }
                else {
                    this.scope.interfaceItem.userInput.PRRF = { selected: "" };
                    this.scope.interfaceItem.userInput.CUCD = "";
                    this.scope.interfaceItem.userInput.FVDT = "";
                }
    
    } 
    
    private triggerPTAPartFlag(triggerPTAPartFlag:any): void {
        console.log(triggerPTAPartFlag); 
    }
   
        //*************************************************Application specific functions ends*************************************************/

    }
}