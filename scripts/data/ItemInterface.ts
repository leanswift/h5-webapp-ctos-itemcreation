module h5.application {
    export interface IInterfaceItem {
        
        reload: boolean;
        transactionStatus: { 
            createItems: boolean;
            ItemsList: boolean;
            getItemsList: boolean;
            assign: boolean;
            unassign: boolean;
            updateItemsList: boolean;
            sampleData1: boolean;
            sampleList1: boolean;
            supplierList:boolean;
            itemsupplier:boolean;
            attributes:boolean;
            buyerIList: boolean;
             responsibleIList: boolean;
             defaultresponsibleIList: boolean;
        };
        sampleData1: any;
        sampleList1: any[];
        sampleGrid1: IUIGrid;
        selectedSampleDataGridRow: any;
        collapseSection1: boolean;
        enableUpdate: boolean;
        enableCreate: boolean;
        userSelection: {
            itemType?: any;
        };
        userInput: {
            ITNO?: string;
            IFIN?: string;
            ITNE?: string;
            ITDS?: string;
            FUDS?: string;
            E0PA?: string;
            E065?: string;
            PRRF?: any;
            CUCD?: string;
            FVDT?: string;
            SAPR?: any;
            AGNB?: string;
            AGDT?: string;
            SUNO?: any;
            PUPR?: any;
            SUN1?: string;
            ATMO?: string;
            //USID?: any;
            MULT?: any;
            SITE?: string;
            SITD?: string;
            SITT?: string;
            OVH1?: any;
            OVH2?: any;
            BUYE?: string;
            
            LEA1?: any;
            LOQT?: any;
            UNMU?: any;
            DCCD?: string;
           
            MMGRWE?: any;
            MMNEWE?: any;
            MMVOLR?: any;
            MMDIM1?: any;
            MMDIM2?: any;
            MMDIM3?: any;
            MMSPE1?: any;
            MMSPE2?: any;
            MMSPE3?: any; 
            
        };
        userInput1: {
        USIDD?: any;
        WHUSIDD?: any;
            };
        enablebutton:boolean;
        warningPrice?:boolean;
        enableFields?:boolean;
        enableDenybutton?:boolean;
        enableReasonbutton?:boolean;
        finalITNO: string;
        checkITNO?: string;
        errorType?: string;
        authStatus?: string;
        processItems?(): void;
        validateItem?(): void;
        LinesLists?(): void;
        Assign?(): void;
        unAssign?(): void;
        itemlinesGrid: IUIGrid;
        removeSelectedLine?(): void;
        collapseItems?: boolean;
        errorDisplay?: boolean;
        itemTypeList: any;
        priceList: any;
        supplierList: any;
        buyerList: any;
        responsibleList: any;
        whresponsibleList: any;
        agreementList: any;
        selectedRow?: any;
        errormessagecheck?: string;
        itmType: string;
        attrType: string;
        lineIndex?: any;
        requestItem?: any;
        defaultCUCD?: string;
        defaultSUPPCUCD?: string;
        defaultSUPPFromDate?: string;
        defaultECOMMCUCD?: string;
        defaultECOMMFromDate?: string;
        ecommFlag?: boolean;
        PTAPartFlag?: boolean;
        fragileFlag?: boolean;
        hazardousFlag?: boolean;
        notreturnFlag?: boolean;
        defaultMODA?: any;
        label: string;
        chkItemType: string;
        chkAquCode: string;
        defaultFromDate?: string;
        filteredErrors?:any[] ;
        counterErrors?: any;
        denymessage?: string;
        facilityCount?: any;
    }
}