topazApp.controller('MyHazardsDashboardController', ['$scope', '$server', '$http', function ($scope, $server, $http) {

    $scope.dateRangeSubmitVisible = false;

    $scope.on("selectionBoxesLoaded", function () {
        $scope.applyFilterButtonEnabled = true
    });

    $scope.goFilter = {

        submit: function () {

            if ($scope.dateRangeSelectionBox.presets.selection == "(Start Date / End Date: Specified Below)") {

                $scope.dateRangeSelectionBox.submit();
            }

            $scope.applyFilterClicked = true;



            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }

            }

            var querystring = window.location.search.substring(1);


         
                $scope.YTDHazrad = undefined;
                $scope.Ytd_Open_Hazards = undefined;
                $scope.All_Open = undefined;
                $scope.High_Risk_Hazards = undefined;
                $scope.High_Risk_Open = undefined;
                $scope.Percentage_Employee = undefined;
                $scope.Percentage_Manager = undefined;
                $scope.Percentage_Unique_Contributer = undefined;
            
            $http.post("/API/GetMyHazardsDashboardResultData" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {

                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;

                    $scope.myHazardsDashboardAnalysisData = data;
                    $scope.YTDHazrad = data.YTDHazardCount;
                    $scope.Ytd_Open_Hazards = data.YTDOpenHazardsCount;
                    $scope.All_Open = data.AllOpenCount;
                    $scope.High_Risk_Hazards = data.YTDHighRiskHazardsCount;
                    $scope.High_Risk_Open = data.AllHighRiskOpenCount;
                    $scope.Percentage_Employee = data.percentageHazardCountByEmployee;
                    $scope.Percentage_Manager = data.percentageHazardCountByManager;
                    $scope.Percentage_Unique_Contributer = data.UniqueContributorCount;
                });


      
                $scope.hazardsFoundFixedData = undefined;
            
            $http.post("/API/GetMonthlyHazardsFoundFixedData" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {

                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                    $scope.monthlyHazardsFoundFixedAnalysisData = data;
                    $scope.hazardsFoundFixedData = data;

                });

            
                $scope.riskData = undefined;
            
            $http.post("/API/GetMonthlyRiskIdentifiedMitigatedData" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {

                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                    $scope.monthlyRiskIdentifiedMitigatedAnalysisData = data;


                    data.RISK_LEVEL.map(function (d) {
                        d.y = parseInt(d.y);
                    });

                    data.MITIGATED_RISK_LEVEL.map(function (d) {
                        d.y = parseInt(d.y);
                    });

                    $scope.riskData =
                        [
                            {
                                area: false,
                                areaClass: undefined,
                                areaOpacity: undefined,
                                label: "Risk Mitigated",
                                lineClass: "info0",
                                lineType: "curve",
                                pointClass: "info0",
                                pointRadius: undefined,
                                strokeWidth: undefined,
                                points: data.MITIGATED_RISK_LEVEL
                            },
                            {
                                area: false,
                                areaClass: undefined,
                                areaOpacity: undefined,
                                label: "Risk Identified",
                                lineClass: "info1",
                                lineType: "curve",
                                pointClass: "info1",
                                pointRadius: undefined,
                                strokeWidth: undefined,
                                points: data.RISK_LEVEL
                            }
                        ];

                });

            $scope.classificationData = undefined;
            $http.post("/API/ClassificationData" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {
                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                    $scope.classificationData = data;
                    $scope.classificationDataClasses = ['info0', 'info2', 'noColor'];
                });

            $scope.processActivityData = undefined;
            $http.post("/API/ProcessActivityData" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {
                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                    $scope.processActivityData = data;
                    $scope.processActivityDataClasses = ['info0', 'info2', 'noColor'];
                });

            $scope.hazardsDescriptionData = undefined;
            $http.post("/API/HazardsDescriptionData" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {
                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                    $scope.hazardsDescriptionData = data;
                });

        }
    }
    $scope.on("selectionBoxesLoaded", function () {
        

    });
    //COMMON CODE START
    if ($scope.organizationSelectionBox.visible)
        $scope.organizationSelectionBox.visible = false;
    if (!$scope.dateRangeSelectionBox.visible) {
        $scope.dateRangeSelectionBox.visible = true;
        $scope.dateRangeSelectionBox.defaultValue = "Year-to-date";
    }
    if (!$scope.departmentSelectionBox.visible)
        $scope.departmentSelectionBox.visible = true;
    //COMMON CODE END
}]);