topazApp.controller('AssetWeighingStatusController', ['$scope', '$server', '$http',function ($scope, $server, $http) {
    
    $scope.on("selectionBoxesLoaded", function () {
        $scope.applyFilterButtonEnabled = true;        
    });

    $scope.goFilter = {

        submit: function () {
            $scope.applyFilterClicked = true;

                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                }

                var querystring = window.location.search.substring(1);

                $http.post("/API/OrganizationWeighedUnweighedAssetCounts" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {

                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;

                    $scope.organizationWeighedUnweighedAssetCounts = data;   
                    $scope.organizationUrls = data.urls                                  
                });

                $http.post("/API/LocationWeighedUnweighedAssetCounts" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {

                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;

                    $scope.locationWeighedUnweighedAssetCounts = data;   
                    $scope.organizationUrls = data.urls                                  
                });

                $http.post("/API/WeighedUnweighedAssetTable" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {

                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;

                    $scope.weighedUnweighedAssetTable = data;                                                  
                });

                $http.post("/API/WeighedUnweighedModelTable" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {

                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;

                    $scope.weighedUnweighedModelTable = data;                                                  
                });
            }
    };

    $scope.calculateTotal = function (key, totals) {
        if (key == 'unweighed' || key == 'weighed') {
            return totals[key];
        } else {
            return totals['weighed'] / (parseFloat(totals['weighed']) + parseFloat(totals['unweighed']));
        }
    };

    $scope.employeeSelectionBox.visible = true;

    $scope.rawData.url = "WeighedUnweighedAssetRawData";
}]);