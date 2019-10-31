topazApp.controller('InventoryDashboardController', ['$scope', '$server', '$http', function ($scope, $server, $http) {

    //var someEvent = false;

    $scope.on("selectionBoxesLoaded", function () {
        $scope.applyFilterButtonEnabled = true
    });

    $scope.fiveYearsAgo = moment().subtract(5, "year").format("MM/YYYY");

    $scope.mapModels = {};
    $scope.applyFilterClicked = false;
    $scope.inventorySummaryStatistics = true;
    $scope.inventoryCount = true;
   // $scope.mapModels.mapData = true;
    $scope.inventoryAssets = true;
    $scope.deployability = true;
    $scope.inventoryStatusCounts = true;
    $scope.commonality = true;
    $scope.cmisRm = true;
    $scope.inventoryAssetsRows = true;
    $scope.ccData = true;
    

    $scope.goFilter = {

        submit: function () {

            $scope.submitValues();

            if ($scope.urlParameters.Organization || $scope.urlParameters.Location || $scope.urlParameters.Employee || $scope.urlParameters.AssetID || $scope.urlParameters.SerialNo || $scope.urlParameters.Manufacturer || $scope.urlParameters.ModelNo || $scope.urlParameters.ModelDesc || $scope.urlParameters.CapitalInput) {
                $scope.applyFilterClicked = true;



                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }

                }

                var querystring = window.location.search.substring(1);

                $scope.inventorySummaryStatistics = undefined;
                $scope.assetCount = undefined;
                $http.post("/API/InventorySummaryStatistics" + '?hash_id=' + Math.random(), querystring, config)
                    .success(function (data) {
                  
                        data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                        $scope.inventorySummaryStatistics = data;
                        $scope.assetCount = data.assetCount;
            
                    });

                $scope.inventoryCount = undefined;
                $http.post("/API/InventoryCount" + '?hash_id=' + Math.random(), querystring, config)
                    .success(function (data) {
           
                        data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                        $scope.inventoryCount = data;
      
                    });

                $scope.mapModels.mapData = undefined;
                $scope.inventoryAssets = undefined;
                $http.post("/API/InventoryAssets" + '?hash_id=' + Math.random(), querystring, config)
                    .success(function (data) {
                  
                        data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                        $scope.inventoryAssets = data;
                        asset = data;


                        if (asset && asset.length > 0) {
                            $scope.mapModels.mapData = asset.map(function (a) {
                                return {
                                    type: "Circle",
                                    id: a.assetId,
                                    department: a.bu,
                                    status: a.propertyStatus,
                                    region: a.region || "Unknown",
                                    city: a.city || "Unknown",
                                    state: a.stateAbbr || "Unknown",
                                    country: a.countryIsoAbbr3 || "Unknown",
                                    lat: a.latitude || 31.7534666,
                                    lon: a.longitude || -76.0015521,
                                    building: a.building,
                                    amount: 1
                                };
                            });
                        }
                        else {
                            $scope.mapModels.mapData = {};
                        }

                        updateUserLocation();


                    });

                $scope.deployability = undefined;
                $http.post("/API/InventoryDeployabilitySummary" + '?hash_id=' + Math.random(), querystring, config)
                    .success(function (data) {
                        data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                        $scope.deployability = data;
                    });

                $scope.inventoryStatusCounts = undefined;
                $http.post("/API/InventoryStatusCounts" + '?hash_id=' + Math.random(), querystring, config)
                    .success(function (data) {
                        data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                        $scope.inventoryStatusCounts = data;
                        $scope.organizationUrls = data.organizationUrls;
                        $scope.locationUrls = data.locationUrls;
                    });

                $scope.commonality = undefined;
                $http.post("/API/InventoryCommonalitySummary" + '?hash_id=' + Math.random(), querystring, config)
                    .success(function (data) {
                        data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                        $scope.commonality = data;
                    });

                $scope.cmisRm = undefined;
                $http.post("/API/InventoryCmisRepairMaintenanceData" + '?hash_id=' + Math.random(), querystring, config)
                    .success(function (data) {
                        data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                        $scope.cmisRm = data;
                        $scope.repairCount = data.repairCount;
                        $scope.sootCount = data.sootCount;
                        $scope.repairHours = data.repairHours;
                        $scope.monthConstant = data.monthConstant;
                    });

                $scope.inventoryAssetsRows = undefined;
                $http.post("/API/InventoryAssetsRows" + '?hash_id=' + Math.random(), querystring, config)
                    .success(function (data) {
                        data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                        $scope.inventoryAssetsRows = data;

                    });

                $scope.ccData = undefined;
                $http.post("/API/InventoryCommonCatalog" + '?hash_id=' + Math.random(), querystring, config)
                    .success(function (data) {
                        data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                        $scope.ccData = data;

                    });


                $scope.$watchGroup(['assetCount', 'repairCount'], function (newValues, oldValues, scope) {
                    if ($scope.assetCount != null && $scope.repairCount != null) {
                        $scope.repairCountPerAssetPerMonth = $scope.repairCount / $scope.assetCount / $scope.monthConstant;
                        $scope.sootCountPerAssetPerMonth = $scope.sootCount / $scope.assetCount / $scope.monthConstant;
                        $scope.repairHoursPerAssetPerMonth = $scope.repairHours / $scope.assetCount / $scope.monthConstant;
                    }
                });


                


                var childScope = angular.element('#child').scope();
                childScope.goFilter.submit();

            }
            else {
                $scope.applyFilterClicked = false;
            }

        }
    }



    $scope.employeeSelectionBox.visible = true;
        $scope.rawData.url = "InventoryRawData";

        $scope.assetInput = {
            assetId: $scope.urlParameters.AssetID,
            assetIdExact: typeof $scope.urlParameters.AssetIDExact === 'undefined' ? true : $scope.urlParameters.AssetIDExact,
            serialNo: $scope.urlParameters.SerialNo,
            lowerWeight: $scope.urlParameters.MinWeight,
            upperWeight: $scope.urlParameters.MaxWeight,
            valid: true
        };

        $scope.modelInput = {
            manufacturer: $scope.urlParameters.Manufacturer,
            manufacturerExact: $scope.urlParameters.ManufacturerExact,
            modelNo: $scope.urlParameters.ModelNo,
            modelNoExact: $scope.urlParameters.ModelNoExact,
            noun: $scope.urlParameters.ModelDesc,
            nounExact: $scope.urlParameters.ModelDescExact,
            valid: true
        };

        $scope.capitalInput = {

            capitalExact: $scope.urlParameters.CapitalExact,
            expenseExact: $scope.urlParameters.ExpenseExact,
            toolingExact: $scope.urlParameters.ToolingExact,
            other: $scope.urlParameters.other,
            valid: true
        };

        $scope.validateUserInput = function () {
            //TODO validate user input:
            // weights are numbers
            // minweight less than maxweight
            $scope.modelInput.valid = true;
            $scope.assetInput.valid = true;

            return true;
        };

        $scope.submitValues = function () {
            if ($scope.validateUserInput()) {
                $scope.updateUrlParameters({
                    "AssetID": $scope.assetInput.assetId,
                    "AssetIDExact": $scope.assetInput.assetIdExact,
                    "SerialNo": $scope.assetInput.serialNo,
                    "MinWeight": $scope.assetInput.lowerWeight,
                    "MaxWeight": $scope.assetInput.upperWeight,
                    "Manufacturer": $scope.modelInput.manufacturer,
                    "ManufacturerExact": $scope.modelInput.manufacturerExact,
                    "ModelNo": $scope.modelInput.modelNo,
                    "ModelNoExact": $scope.modelInput.modelNoExact,
                    "ModelDesc": $scope.modelInput.noun,
                    "ModelDescExact": $scope.modelInput.nounExact,
                    "CapitalExact": $scope.capitalInput.capitalExact,
                    "ExpenseExact": $scope.capitalInput.expenseExact
                });
            }
        };

        function updateUserLocation() {
        if ($scope.mapModels.map && $scope.mapModels.map.setUserLocation && $scope.user) {
            $scope.mapModels.map.setUserLocation($scope.user.latitude, $scope.user.longitude);
        }
    }

}]);