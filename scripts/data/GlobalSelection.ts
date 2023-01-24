module h5.application {

    export interface IGlobalSelection {

        reload: boolean;
        transactionStatus: {
            sampleDataList1: boolean;
            sampleDataList2: boolean;
            wareDataList: boolean;
            itemgroupDataList: boolean;
            planningPolicyList: boolean;
             uomDataList: boolean;
            attributeDataList: boolean;
            prdgrpDataList: boolean;
             businessareaDataList: boolean;
            decimalList: boolean;
        };
        sampleDataList1: any;
        sampleData1: any;
        warehouseDataList: any;
        warehouseDataList1?: any;
        warehouseData: any;
        itemGroupList: any;
        itemGroupData: any;
        uomList: any;
        uomData: any;
        attributeList: any;
        attributeData: any;
        prdgrpList: any;
        prdgrpData: any;
        businessareaList: any;
        businessareaData: any;
        facilityDataList: any;
        facilityData: any;
        statusRange: any;
        itemType?: any;
        statusRangeWH: any;
        AcqCode: any;
        status: any;
        statusWH: any;
        AcqCodeWH: any;
        warehouse: {
        list: any;
            };
    }
}