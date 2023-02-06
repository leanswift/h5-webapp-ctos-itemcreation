/**
 * Service class to implement functions to retrieve, push data via Rest API with generic business logics if required. Will be used by the controller.
 */
module h5.application {

    export interface IAppService {
        getAuthority(company: string, division: string, m3User: string, programName: string, charAt: number): ng.IPromise<boolean>;
        getDivisionList(company: string, division: string): ng.IPromise<M3.IMIResponse>;
        getWarehouseList(company: string): ng.IPromise<M3.IMIResponse>;
        getWarehouseListMITBAL(ITNO: string): ng.IPromise<M3.IMIResponse>;
        getFacilityList(company: string, division: string): ng.IPromise<M3.IMIResponse>;
        getItemGroupList(ITGR: string): ng.IPromise<M3.IMIResponse>;
        getUOMList(DIVI: string, STCO: string): ng.IPromise<M3.IMIResponse>;
        getUser(searchBuyer: string): ng.IPromise<M3.IMIResponse>;
        getResponsible(searchRESP: string): ng.IPromise<M3.IMIResponse>;
        getDefaultResponsible(USID: string): ng.IPromise<M3.IMIResponse>;
        getItemNumberForWH(searchITNO: string): ng.IPromise<M3.IMIResponse>;
        getAttributesList(ATMO: string): ng.IPromise<M3.IMIResponse>;
        getLocation(CONO: string, WHLO: string, WHSL: string): ng.IPromise<M3.IMIResponse>;
        processInterfaceItem(PRMD: string, E0PA: string, E065: string, ITNO: string, IFIN: string, ITDS: string,FUDS: string,ITTY: string,STAT: string): ng.IPromise<M3.IMIResponse>;
        getItemList(E0PA: string, E065: string): ng.IPromise<M3.IMIResponse>;
        getItemType(division: string): ng.IPromise<M3.IMIResponse>;
        processAddBasePrice(PRRF: string, CUCD: string, FVDT: string, ITNO: string, SAPR: string): ng.IPromise<M3.IMIResponse>;
        getPriceList(): ng.IPromise<M3.IMIResponse>;
        getDefaultPriceList(PRRF: string,NFTR: string): ng.IPromise<M3.IMIResponse>;
        processItemWarehouse(PRMD: string, E0PA: string, E065: string, WHLO: string,IFIN: string,STAT: string): ng.IPromise<M3.IMIResponse>;
        processItemFacility(PRMD: string, E0PA: string, E065: string, FACI: string, IFIN: string, STAT: string): ng.IPromise<M3.IMIResponse>;
        getSupplierList(company: string): ng.IPromise<M3.IMIResponse>;
        searchSupplier(searchInput: string): ng.IPromise<M3.IMIResponse>;
        LstAgrHeadBySup(SUNO: string): ng.IPromise<M3.IMIResponse>;
        processAgreementLine(SUNO: string, AGNB: string, GRPI: string, FACI: string, ITNO: string,FVDT: string,PUPR: any): ng.IPromise<M3.IMIResponse>;        
        AddItemSupplier(ITNO: string, SUNO: string,LCLV: string): ng.IPromise<M3.IMIResponse>;
        UpdItemSupplier(ITNO: string, SUNO: string,SITE: string,SITD: string,SITT: string, UNMS: string): ng.IPromise<M3.IMIResponse>;
        AddAlias(ALWT: string, ALWQ: string,ITNO: string, POPN: string): ng.IPromise<M3.IMIResponse>;
        AddAttrModel(ATMO: string, TX40: string): ng.IPromise<M3.IMIResponse>;
        AddAttribute(ATID: string, ATVC: string,TX30: string, COBT: string): ng.IPromise<M3.IMIResponse>;
        AddAttrValue(ATID: string): ng.IPromise<M3.IMIResponse>;
        AddDefaultVal(ATID: string): ng.IPromise<M3.IMIResponse>;
        processM3Item(CONO: string,ITNO: string,ITTY: string, ITDS: string,ITNE: string): ng.IPromise<M3.IMIResponse>;
        getItmBasic(CONO: string,ITNO: string): ng.IPromise<M3.IMIResponse>;
        getItmRefreshCHNO(ITNO: string): ng.IPromise<M3.IMIResponse>;
        UpdItmBasic(CONO: string,STAT: string,ITNO: string, RESP: string,UNMS: string,ITGR: string,BUAR: string,ITCL: string, ATMO: string, FUDS: string, CHNO: any,PUPR: any,CFI5: any,DCCD: string,MMGRWE: any,MMNEWE: any,MMVOLR: any): ng.IPromise<M3.IMIResponse>;
        UpdItmBasicDetails(CONO: string,ITNO: string, ATMO: string,DCCD: string): ng.IPromise<M3.IMIResponse>;
        UpdItmPriceDetails(CONO: string,ITNO: string, SUNO: string): ng.IPromise<M3.IMIResponse>;
        UpdItmWhs(CONO: string,WHLO: string,ITNO: string,STAT:string,SUNO: string,BUYE: string): ng.IPromise<M3.IMIResponse>;
        UpdItmWhsWH302(CONO: string,WHLO: string,ITNO: string,STAT:string,PUIT: string,ORTY: string,SUWH: string,WHRESP: string,WHLEA1: string,WHLOQT: string,WHUNMU: string,PLCD: string,BUYE: string): ng.IPromise<M3.IMIResponse>;
        UpdItmWhsWH(CONO: string,WHLO: string,ITNO: string,STAT:string,WHRESP: string,WHLEA1: string,WHLOQT: string,WHUNMU: string,PLCD: string,BUYE: string): ng.IPromise<M3.IMIResponse>;
        getItemTypeWarehouse(ITTY: string): ng.IPromise<M3.IMIResponse>;
        getFacilityByItem(CONO: string, ITNO: string): ng.IPromise<M3.IMIResponse>;
        getProductGroup(CONO: string): ng.IPromise<M3.IMIResponse>;
        getBusinessArea(CONO: string): ng.IPromise<M3.IMIResponse>;
        AddElementValue(CEID: string, OVK1: string,OVK2: string, OVHE: any, VFDT: string): ng.IPromise<M3.IMIResponse>;
        AddElementRate(SCEL: string, OBV1: string,OBV2: string, OVHE: any, VFDT: string): ng.IPromise<M3.IMIResponse>;
        getMITMASData(queryStatement: string): ng.IPromise<M3.IMIResponse>;
        getMPAGRHData(queryStatement: string): ng.IPromise<M3.IMIResponse>;
        getorderTypeList(ORTY: string,MINAME: string,TRANSACTION: string): ng.IPromise<M3.IMIResponse>;
        getMultiplier(FILE: string,PK01: string): ng.IPromise<M3.IMIResponse>;
        
        getItemLines(queryStatement: string): ng.IPromise<M3.IMIResponse>;
        updateItemStatus(FILE:string , ITNO: string, STAT: string): ng.IPromise<M3.IMIResponse>;
        AddAlphaKPI(FILE:string , ITNO: string, STAT: string): ng.IPromise<M3.IMIResponse>;
        
        updateItemFields(FILE: string , ITNO: string, AssignStatus: string, AssignTime: string): ng.IPromise<M3.IMIResponse>;
        processM3ItemDates(FILE: string,ITNO: string,AssigntDate: string): ng.IPromise<M3.IMIResponse>;
        unAssignItemFields(FILE: string , ITNO: string, AssignStatus: string, AssignTime: string): ng.IPromise<M3.IMIResponse>;  
        unAssignM3ItemDates(FILE: string,ITNO: string,AssigntDate: string): ng.IPromise<M3.IMIResponse>; 
        getItemGroup(FILE: string , PK01: string): ng.IPromise<M3.IMIResponse>;
        getDecimals(STCO: string , STKY: string): ng.IPromise<M3.IMIResponse>;
        getProductGroupList(FILE: string , PK01: string): ng.IPromise<M3.IMIResponse>;
        
        pcs260Log(FILE: string , ITNO: string, FACI: string, PCDT: string, CSU1: string, MSG: string): ng.IPromise<M3.IMIResponse>;
        
        AddItmLot(ITNO: string, BANO: string): ng.IPromise<M3.IMIResponse>;
        getAccessAuth(FILE: string , PK02: string): ng.IPromise<M3.IMIResponse>;
        deleteItemRequest(FILE: string,ITNO: string): ng.IPromise<M3.IMIResponse>;
        denyItemRequest(FILE: string,ITNO: string,REAS: string): ng.IPromise<M3.IMIResponse>;
        getplanningPolicy(PLCD: string): ng.IPromise<M3.IMIResponse>;

        UpdItmMeas(CONO: string,ITNO: string, MMDIM1: string,MMDIM2: string,MMDIM3: string, MMSPE1: string,MMSPE2: string,MMSPE3: string): ng.IPromise<M3.IMIResponse>;
    }

    export class AppService implements IAppService {

        static $inject = ["RestService", "$filter", "$q"];

        constructor(private restService: h5.application.IRestService, private $filter: h5.application.AppFilter, private $q: ng.IQService) {
        }

        public getAuthority(company: string, division: string, m3User: string, programName: string, charAt: number): ng.IPromise<boolean> {
            let request = {
                DIVI: division,
                USID: m3User,
                PGNM: programName
            };
            return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30_arl", request).then((val: M3.IMIResponse) => {
                if (angular.equals([], val.items)) {
                    request.DIVI = "";
                    return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30_arl", request).then((val: M3.IMIResponse) => {
                        if (angular.equals([], val.items)) {
                            return false;
                        } else {
                            let test = val.item.ALO;
                            if (charAt < test.length() && '1' == test.charAt(charAt)) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    });
                } else {
                    let test = val.item.ALO;
                    if (charAt < test.length() && '1' == test.charAt(charAt)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
        }

        public getDivisionList(company: string, division: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                DIVI: division
            };
            return this.restService.executeM3MIRestService("MNS100MI", "LstDivisions", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public getItemLines(queryStatement: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                SEPC: "#",
                HDRS: "1",
                QERY: queryStatement
            };
            return this.restService.executeM3MIRestService("EXPORTMI", "SelectPad", requestData,0).then((val: M3.IMIResponse) => {
                let responses = [];
                val.items.forEach((item, index) => {
                    if (index > 0) {
                        let response = {};
                        let replyField: string = item.REPL;
                        let fields = replyField.split("#");
                        let keyValuewithblank=""; 
                        fields.forEach((field) => {
                            let keyValue = field.split(" ");
                            keyValuewithblank = "";
                            for (let i = 1; i < keyValue.length; i++) {
                             keyValuewithblank = keyValuewithblank + " " +keyValue[i];
                            }
                            response[keyValue[0]] = keyValuewithblank.trim();
                        });
                        responses.push(response);
                    }
                });
                val.items = responses;
                val.item = responses[0];
                return val;
            });
        }
         public getUOMList(DIVI: string, STCO: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                DIVI: "",
                STCO: "UNIT"
            };
            return this.restService.executeM3MIRestService("MDBREADMI", "SelCSYTAB00", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getUser(searchQuery: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                SQRY: searchQuery,
            };
            return this.restService.executeM3MIRestService("MDBREADMI", "LstCMNUSR00", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
         public getResponsible(searchRESP: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                SQRY: searchRESP,
            };
            return this.restService.executeM3MIRestService("MDBREADMI", "LstCMNUSR00", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        public getDefaultResponsible(USID: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                USID: USID,
            };
            return this.restService.executeM3MIRestService("MNS150MI", "GetUserData", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getItemNumberForWH(searchITNO: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                SQRY: searchITNO,
            };
            return this.restService.executeM3MIRestService("MDBREADMI", "LstMITMAS00", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
       
        
        public getLocation(CONO: string, WHLO: string, WHSL: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: CONO,
                WHLO: WHLO,
                WHSL: WHSL,
            };
            return this.restService.executeM3MIRestService("MMS010MI", "ListLocations", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
       
        public getItemTypeWarehouse(ITTY: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                ITTY: ITTY,
            };
            return this.restService.executeM3MIRestService("MDBREADMI", "SelMITYWC00", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getAttributesList(ATMO: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                ATMO: ""
               
            };
            return this.restService.executeM3MIRestService("ATS050MI", "LstAttrModel", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getProductGroup(CONO: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                //ATMO: ""
            };
            return this.restService.executeM3MIRestService("CRS035MI", "LstProductGroup", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getBusinessArea(CONO: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: ""
               
            };
            return this.restService.executeM3MIRestService("CRS036MI", "LstBusinessArea", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
      
        public getWarehouseList(company: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company
            };
            return this.restService.executeM3MIRestService("MMS005MI", "LstWarehouses", requestData, 10000).then((val: M3.IMIResponse) => { return val; });
        }
        public getWarehouseListMITBAL(ITNO: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                ITNO: ITNO
            };
            return this.restService.executeM3MIRestService("MDBREADMI", "SelMITBAL10", requestData, 10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getItemGroupList(ITGR: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                ITGR: ""
            };
            return this.restService.executeM3MIRestService("CRS025MI", "LstItemGroup", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
       public getDecimals(STCO: string , STKY: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                STCO: STCO,
                STKY: STKY
            };
            return this.restService.executeM3MIRestService("CRS175MI", "LstGeneralCode", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public getFacilityList(company: string, facility: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                FACI: facility
            };
            return this.restService.executeM3MIRestService("CRS008MI", "ListFacility", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public getFacilityByItem(CONO: string, ITNO: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: CONO,
                ITNO: ITNO
            };
            return this.restService.executeM3MIRestService("MMS200MI", "LstFacByItem", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        
        public getItemList(E0PA: string, E065: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                E0PA: E0PA,
                E065: E065
            };
            return this.restService.executeM3MIRestService("MHS001MI", "LstIntItmMst", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public processInterfaceItem(PRMD: string, E0PA: string, E065: string, ITNO: string, IFIN: string, ITDS: string,FUDS: string,ITTY: string,STAT: string): ng.IPromise<M3.IMIResponse>{
            let returnTypeFinal = "";
//            if(angular.isDefined(returnType)){
//                returnTypeFinal = returnType.split("-")[0];
//            }
//             console.log(PRFL);
//             console.log(CONO);
//             console.log(WHLO);
//             console.log(E0PA);
//             console.log(E065);
//             console.log(CUNO);
//             console.log(ITNO);
//             console.log(WHSL);
//             console.log(ReturnQty);
//             console.log(REPN);
//             console.log(RELI);
//             console.log(RESP);
            let requestData = {
                PRMD: PRMD,
                E0PA: E0PA,
                E065: E065,
                ITNO: ITNO,
                IFIN: IFIN,
                ITDS: ITDS,
                FUDS: FUDS,
                ITTY: ITTY,
                STAT: STAT,
            };
            return this.restService.executeM3MIRestService("MHS001MI", "AddIntItmMst", requestData).then((val: M3.IMIResponse) => { return val; });
        }
           public processM3Item(CONO: string,ITNO: string,ITTY: string, ITDS: string, ITNE: string): ng.IPromise<M3.IMIResponse>{
            let returnTypeFinal = "";
            let requestData = {
                CONO: CONO,
                ITNO: ITNO,
                ITTY: ITTY,
                ITDS: ITDS,
                ITNE: ITNE
            };
            return this.restService.executeM3MIRestService("MMS200MI", "AddItmViaItmTyp", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public UpdItmBasic(CONO: string,STAT: string,ITNO: string, RESP: string,UNMS: string,ITGR: string,BUAR: string,ITCL: string, ATMO: string, FUDS: string, CHNO: any,PUPR: any,CFI5: any,DCCD: string,MMGRWE: any,MMNEWE: any,MMVOLR: any): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                CONO: CONO,
                STAT: STAT,
                ITNO: ITNO,
                RESP: RESP,
                UNMS: UNMS,
                ITGR: ITGR,
                BUAR: BUAR,
                ITCL: ITCL,
                FUDS: FUDS,
                //ATMO: ATMO,
                CHNO: CHNO,
                CFI2: PUPR.toFixed(2),
                CFI5: CFI5,
                DCCD: DCCD,
                GRWE: MMGRWE.toFixed(3),
                NEWE: MMNEWE.toFixed(3),
                VOL3: MMVOLR.toFixed(3) 
            };
            return this.restService.executeM3MIRestService("MMS200MI", "UpdItmBasic", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getItmBasic(CONO: string,ITNO: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                CONO: CONO,
                ITNO: ITNO,
                
            };
            return this.restService.executeM3MIRestService("MMS200MI", "GetItmBasic", requestData,10).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getItmRefreshCHNO(ITNO: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                //CONO: CONO,
                ITNO: ITNO,
                
            };
            return this.restService.executeM3MIRestService("MMS200MI", "Get", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public UpdItmBasicDetails(CONO: string,ITNO: string, ATMO: string,DCCD: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                CONO: CONO,
                ITNO: ITNO,
                ATMO: ATMO,
                DCCD: DCCD,
            };
            return this.restService.executeM3MIRestService("MMS200MI", "UpdItmBasic", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public UpdItmPriceDetails(CONO: string,ITNO: string, SUNO: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                CONO: CONO,
                ITNO: ITNO,
                SUNO: SUNO
            };
            return this.restService.executeM3MIRestService("MMS200MI", "UpdItmPrice", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public UpdItmMeas(CONO: string,ITNO: string, MMDIM1: string,MMDIM2: string,MMDIM3: string, MMSPE1: string,MMSPE2: string,MMSPE3: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                CONO: CONO,
                ITNO: ITNO,
                DIM1: MMDIM1,
                DIM2: MMDIM2,
                DIM3: MMDIM3,
                SPE1: MMSPE1,
                SPE2: MMSPE2,
                SPE3: MMSPE3 
            };
            return this.restService.executeM3MIRestService("MMS200MI", "UpdItmMeas", requestData).then((val: M3.IMIResponse) => { return val; });
        }




         public UpdItmWhs(CONO: string,WHLO: string,ITNO: string,STAT: string,SUNO: string,BUYE: string): ng.IPromise<M3.IMIResponse>{
             let requestData :any;
             if(SUNO != undefined && !angular.equals("", SUNO))
             {
              requestData = {
                CONO: CONO,
                WHLO: WHLO,
                ITNO: ITNO,
                STAT: STAT,
                SUNO: SUNO,
                //BUYE: BUYE,
            };
            }else{
                requestData = {
                CONO: CONO,
                WHLO: WHLO,
                ITNO: ITNO,
                STAT: STAT,
                //BUYE: BUYE,
            }; 
             }
            return this.restService.executeM3MIRestService("MMS200MI", "UpdItmWhs", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public UpdItmWhsWH(CONO: string,WHLO: string,ITNO: string,STAT: string,WHRESP: string,WHLEA1: string,WHLOQT: string,WHUNMU: string,PLCD: string,BUYE: string): ng.IPromise<M3.IMIResponse>{
            let requestData :any;
            if(PLCD != undefined && !angular.equals("", PLCD) && angular.equals("", BUYE))
             {
                requestData = {CONO: CONO,WHLO: WHLO,ITNO: ITNO,STAT: STAT,RESP: WHRESP,LEA1: WHLEA1, LOQT: WHLOQT,UNMU: WHUNMU,PLCD: PLCD,};
             }else if((PLCD == undefined || angular.equals("", PLCD)) && !angular.equals("", BUYE))
             {
                requestData = {CONO: CONO,WHLO: WHLO,ITNO: ITNO,STAT: STAT,RESP: WHRESP,LEA1: WHLEA1, LOQT: WHLOQT,UNMU: WHUNMU,BUYE: BUYE,};
             }else if(PLCD != undefined && !angular.equals("", PLCD) && !angular.equals("", BUYE))
             {
                requestData = {CONO: CONO,WHLO: WHLO,ITNO: ITNO,STAT: STAT,RESP: WHRESP,LEA1: WHLEA1, LOQT: WHLOQT,UNMU: WHUNMU,PLCD: PLCD,BUYE: BUYE,};
             }else{
                requestData = {CONO: CONO,WHLO: WHLO,ITNO: ITNO,STAT: STAT,RESP: WHRESP,LEA1: WHLEA1,LOQT: WHLOQT,UNMU: WHUNMU,};
            }
            return this.restService.executeM3MIRestService("MMS200MI", "UpdItmWhs", requestData).then((val: M3.IMIResponse) => { return val; });
        }
         public UpdItmWhsWH302(CONO: string,WHLO: string,ITNO: string,STAT: string,PUIT: string,ORTY: string,SUWH: string,WHRESP: string,WHLEA1: string,WHLOQT: string,WHUNMU: string,PLCD: string,BUYE: string): ng.IPromise<M3.IMIResponse>{
            let requestData :any;
            if(PLCD != undefined && !angular.equals("", PLCD) && angular.equals("", BUYE))
             {
              requestData = {CONO: CONO, WHLO: WHLO,ITNO: ITNO,STAT: STAT,PUIT: PUIT,ORTY: ORTY,SUWH: SUWH,RESP: WHRESP,LEA1: WHLEA1,LOQT: WHLOQT,UNMU: WHUNMU,PLCD: PLCD,};
            }else if((PLCD == undefined || angular.equals("", PLCD)) && !angular.equals("", BUYE))
            {
              requestData = {CONO: CONO,WHLO: WHLO,ITNO: ITNO,STAT: STAT,PUIT: PUIT,ORTY: ORTY,SUWH: SUWH,RESP: WHRESP,LEA1: WHLEA1,LOQT: WHLOQT,UNMU: WHUNMU,BUYE: BUYE,};
            }else if(PLCD != undefined && !angular.equals("", PLCD) && !angular.equals("", BUYE))
             {
              requestData = {CONO: CONO, WHLO: WHLO,ITNO: ITNO,STAT: STAT,PUIT: PUIT,ORTY: ORTY,SUWH: SUWH,RESP: WHRESP,LEA1: WHLEA1,LOQT: WHLOQT,UNMU: WHUNMU,PLCD: PLCD,BUYE: BUYE,};
            }else{
              requestData = {CONO: CONO,WHLO: WHLO,ITNO: ITNO,STAT: STAT,PUIT: PUIT,ORTY: ORTY,SUWH: SUWH,RESP: WHRESP,LEA1: WHLEA1,LOQT: WHLOQT,UNMU: WHUNMU,};
            }
            return this.restService.executeM3MIRestService("MMS200MI", "UpdItmWhs", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public processAgreementLine(SUNO: string, AGNB: string, GRPI: string, FACI: string, ITNO: string,FVDT: string,PUPR: any): ng.IPromise<M3.IMIResponse>{
            let returnTypeFinal = "";
            let requestData = {
                SUNO: SUNO,
                AGNB: AGNB,
                GRPI: GRPI,
                OBV1: FACI,
                OBV2: ITNO,
                FVDT: FVDT,
                PUPR: PUPR.toFixed(2),
            };
            return this.restService.executeM3MIRestService("PPS100MI", "AddAgrLine", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
           public processItemWarehouse(PRMD: string, E0PA: string, E065: string, WHLO: string,IFIN: string,STAT: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                PRMD: PRMD,
                E0PA: E0PA,
                E065: E065,
                WHLO: WHLO,
                IFIN: IFIN,
                STAT: STAT,
            };
            return this.restService.executeM3MIRestService("MHS002MI", "AddIntItmWhs", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
          public processItemFacility(PRMD: string, E0PA: string, E065: string, FACI: string, IFIN: string, STAT: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                PRMD: PRMD,
                E0PA: E0PA,
                E065: E065,
                FACI: FACI,
                IFIN: IFIN,
                STAT: STAT,
            };
            return this.restService.executeM3MIRestService("MHS003MI", "AddIntItmFac", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public processAddBasePrice(PRRF: string, CUCD: string, FVDT: string, ITNO: string, SAPR: string): ng.IPromise<M3.IMIResponse>{
            let requestData :any;
            if(angular.equals("SUPPLIER", PRRF)){
                 requestData = {
                    PRRF: PRRF,
                    CUCD: CUCD,
                    FVDT: FVDT,
                    ITNO: ITNO,
                    SAPR: SAPR,
                    NTCD: "1",
                };
            }else{
                 requestData = {
                    PRRF: PRRF,
                    CUCD: CUCD,
                    FVDT: FVDT,
                    ITNO: ITNO,
                    SAPR: SAPR,
                    NTCD: "0",
                };
            }

            
            return this.restService.executeM3MIRestService("OIS017MI", "AddBasePrice", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        
        
        public AddElementValue(CEID: string, OVK1: string,OVK2: string, OVHE: any, VFDT: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                CEID: CEID,
                OVK1: OVK1,
                OVK2: OVK2,
                OVHE: OVHE.toFixed(2),
                VFDT: VFDT,
                CUCD: "USD",
                CRTP: "1"
                
            };
            return this.restService.executeM3MIRestService("PPS280MI", "AddElementValue", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public AddItmLot(ITNO: string, BANO: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ITNO: ITNO,
                BANO: BANO
                
            };
            return this.restService.executeM3MIRestService("MMS235MI", "AddItmLot", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
    public AddElementRate(SCEL: string, OBV1: string,OBV2: string, OVHE: any, VFDT: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                SCEL: SCEL,
                OBV1: OBV1,
                OBV2: OBV2,
                OVHE: OVHE.toFixed(2),
                FVDT: VFDT,
                CUCD: "USD",
                CRTP: "1"
            };
            return this.restService.executeM3MIRestService("OIS015MI", "AddElementRate", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        
        public getItemType(division: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                DIVI: ""
            };
            //return this.restService.executeM3MIRestService("CMS100MI", "Lst_ItemType", requestData,0).then((val: M3.IMIResponse) => { return val; });
       return this.restService.executeM3MIRestService("MDBREADMI", "SelMITTTY00", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        public getPriceList(): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                //DIVI: ""
            };
            return this.restService.executeM3MIRestService("OIS017MI", "LstPriceList", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getSupplierList(company: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company
                
            };
            return this.restService.executeM3MIRestService("CRS620MI", "LstSuppliers", requestData, 10000).then((val: M3.IMIResponse) => { return val; });
        }
        public searchSupplier(searchInput: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                SQRY: searchInput
            };
            return this.restService.executeM3MIRestService("CRS620MI", "SearchSupplier", requestData).then((val: M3.IMIResponse) => { return val; })
        }
        public LstAgrHeadBySup(SUNO: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                SUNO: SUNO
            };
            return this.restService.executeM3MIRestService("PPS100MI", "LstAgrHeadBySup", requestData).then((val: M3.IMIResponse) => { return val; })
        }
        
        public AddItemSupplier(ITNO: string, SUNO: string, LCLV: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ITNO: ITNO,
                SUNO: SUNO,
                LCLV: LCLV,
            };
            return this.restService.executeM3MIRestService("PPS040MI", "AddItemSupplier", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public UpdItemSupplier(ITNO: string, SUNO: string,SITE: string,SITD: string,SITT: string, UNMS: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ITNO: ITNO,
                SUNO: SUNO,
                SITE: SITE,
                SITD: SITD,
                SITT: SITT,
                ORTY: "?",
                PUUN: UNMS,
                PPUN: UNMS,
            };
            return this.restService.executeM3MIRestService("PPS040MI", "UpdItemSupplier", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public AddAlias(ALWT: string, ALWQ: string,ITNO: string, POPN: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ALWT: ALWT,
                ALWQ: ALWQ,
                ITNO: ITNO,
                POPN: POPN,
            };
            return this.restService.executeM3MIRestService("MMS025MI", "AddAlias", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        
        public AddAttrModel(ATMO: string, TX40: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ATMO: ATMO,
                TX40: TX40,
               
            };
            return this.restService.executeM3MIRestService("ATS050MI", "AddAttrModel", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public AddAttribute(ATID: string, ATVC: string,TX30: string, COBT: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ATID: ATID,
                ATVC: ATVC,
                TX30: TX30,
                COBT: COBT,
            };
            return this.restService.executeM3MIRestService("ATS010MI", "AddAttribute", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public AddAttrValue(ATID: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ATID: ATID,
            };
            return this.restService.executeM3MIRestService("ATS020MI", "AddAttrValue", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public AddDefaultVal(ATID: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                ATID: ATID,
            };
            return this.restService.executeM3MIRestService("ATS030MI", "AddDefaultVal", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getDefaultPriceList(PRRF: string,NFTR: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                PRRF: PRRF,
                NFTR: NFTR
            };
            return this.restService.executeM3MIRestService("OIS017MI", "LstPriceList", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        public getMultiplier(FILE: string,PK01: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                FILE: FILE,
                PK01: PK01
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "GetFieldValue", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        public updateItemStatus(FILE: string , ITNO: string, STAT: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                FILE: FILE,
                PK01: ITNO,
                A030: STAT 
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "ChgFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public updateItemFields(FILE: string , ITNO: string, AssignStatus: string, AssignTime: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                FILE: FILE,
                PK01: ITNO,
                A830: AssignStatus,
                A730: AssignTime 
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "ChgFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public pcs260Log(FILE: string , ITNO: string, FACI: string, PCDT: string, CSU1: string, MSG: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                FILE: FILE,
                PK01: ITNO,
                PK02: FACI,
                A030: PCDT,
                A130: CSU1,
                A121: MSG 
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "AddFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public unAssignItemFields(FILE: string , ITNO: string, AssignStatus: string, AssignTime: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                FILE: FILE,
                PK01: ITNO,
                A830: AssignStatus,
                A730: AssignTime 
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "ChgFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        
         public AddAlphaKPI(FILE:string , ITNO: string, USDF: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                FILE: FILE,
                PK01: ITNO,
                AL30: USDF 
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "AddAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public processM3ItemDates(FILE: string,ITNO: string,AssignDate: string): ng.IPromise<M3.IMIResponse>{
            let returnTypeFinal = "";
            let requestData = {
                FILE: FILE,
                PK01: ITNO,
                DAT2: AssignDate,
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "ChgFieldValueEx", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public unAssignM3ItemDates(FILE: string,ITNO: string,AssignDate: string): ng.IPromise<M3.IMIResponse>{
            let returnTypeFinal = "";
            let requestData = {
                FILE: FILE,
                PK01: ITNO,
                DAT2: AssignDate,
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "ChgFieldValueEx", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
         public getMITMASData(queryStatement: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                SEPC: "#",
                HDRS: "1",
                QERY: queryStatement
            };
            return this.restService.executeM3MIRestService("EXPORTMI", "SelectPad", requestData,0).then((val: M3.IMIResponse) => {
                let responses = [];
                val.items.forEach((item, index) => {
                    if (index > 0) {
                        let response = {};
                        let replyField: string = item.REPL;
                        let fields = replyField.split("#");
                        fields.forEach((field) => {
                            let keyValue = field.split(" ");
                            response[keyValue[0]] = keyValue[1];
                        });
                        responses.push(response);
                    }
                });
                val.items = responses;
                val.item = responses[0];
                console.log("G MITMAS -----"); 
                 console.log(JSON.stringify(val));
                return val;
            });
        }
        
         public getMPAGRHData(queryStatement: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                SEPC: "#",
                HDRS: "1",
                QERY: queryStatement
            };
            return this.restService.executeM3MIRestService("EXPORTMI", "SelectPad", requestData,0).then((val: M3.IMIResponse) => {
                let responses = [];
                val.items.forEach((item, index) => {
                    if (index > 0) {
                        let response = {};
                        let replyField: string = item.REPL;
                        let fields = replyField.split("#");
                        fields.forEach((field) => {
                            let keyValue = field.split(" ");
                            response[keyValue[0]] = keyValue[1];
                        });
                        responses.push(response);
                    }
                });
                val.items = responses;
                val.item = responses[0];
                console.log("G MPAGRH -----"); 
                 console.log(JSON.stringify(val));
                return val;
            });
        }
        
        public getorderTypeList(ORTY: string,MINAME: string,TRANSACTION: string): ng.IPromise<M3.IMIResponse> {
            let requestData:any;
            if (angular.equals("CRS200MI", MINAME)) {
               requestData = {
                ORTY: "",
                TTYP: 51
            }; 
            }else{
                requestData = {
                ORTY: ""
            };
            }
            return this.restService.executeM3MIRestService(MINAME, TRANSACTION, requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getItemGroup(FILE: string , PK01: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                FILE: FILE,
                PK01: PK01
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "LstFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public getProductGroupList(FILE: string , PK01: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                FILE: FILE,
                PK01: PK01
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "LstFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getAccessAuth(FILE: string , PK02: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                FILE: FILE,
                PK01: "   ",
                PK02: PK02
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "GetFieldValueEx", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public deleteItemRequest(FILE: string,ITNO: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                FILE: FILE,
                PK01: ITNO,
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "DelFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public denyItemRequest(FILE: string,ITNO: string,REAS: string): ng.IPromise<M3.IMIResponse>{
            let requestData = {
                FILE: FILE,
                PK01: ITNO,
                A122: REAS
            };
            return this.restService.executeM3MIRestService("CUSEXTMI", "ChgFieldValueEx", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getplanningPolicy(PLCD: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                PLCD: ""
            };
            return this.restService.executeM3MIRestService("MMS037MI", "LstPlanPolicy", requestData,10000).then((val: M3.IMIResponse) => { return val; });
        }
        
        
    }
}