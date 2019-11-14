topazApp.controller('InventoryAgeController', ['$scope', '$server','$http', function ($scope, $server, $http) {

    $scope.checkCostDataHidden();

    $scope.on("selectionBoxesLoaded", function () {
        $scope.applyFilterButtonEnabled = true
    });
   
    $scope.rawData.url = "InventoryAgeRawData";
    $scope.locationSelectionBox.visible = false;
    
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
               
                $http.post("/API/OrganizationInventoryAgeCount" + '?hash_id=' + Math.random(), querystring, config)
                    .success(function (data) {
                  
                        data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                        $scope.organizationUrls = data.urls;
                        $scope.organizationCountAgeData = data;
            
                    });
               
                $http.post("/API/OrganizationInventoryAgeCost" + '?hash_id=' + Math.random(), querystring, config)
                    .success(function (data) {
           
                        data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                        $scope.organizationUrls = data.urls;
                        $scope.organizationCostAgeData = data;                        
      
                    });

                $http.post("/API/OrganizationInventoryAgePercentCount" + '?hash_id=' + Math.random(), querystring, config)
                    .success(function (data) {
           
                        data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                        $scope.organizationUrls = data.urls;
                        $scope.organizationPercentCountAgeData = data;
                    });

                    
                $http.post("/API/OrganizationInventoryAgePercentCost" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {
       
                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                    $scope.organizationUrls = data.urls;
                    $scope.organizationPercentCostAgeData = data;
                });

                $http.post("/API/LocationInventoryAgeCount" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {
       
                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                    $scope.organizationUrls = data.urls;
                    $scope.locationCountAgeData = data;
                });
              
                $http.post("/API/LocationInventoryAgeCost" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {
       
                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                    $scope.locationUrls = data.urls;
                    $scope.locationCostAgeData = data;
                });

                $http.post("/API/LocationInventoryAgePercentCount" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {
       
                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                    $scope.locationUrls = data.urls;
                    $scope.locationPercentCountAgeData = data;
                });

                $http.post("/API/LocationInventoryAgePercentCost" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {
       
                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;
                    $scope.locationUrls = data.urls;
                    $scope.locationPercentCostAgeData = data;
                });

            }
            else {
                $scope.applyFilterClicked = false;
            }
        }
    };

}]);
