topazApp.controller('PetersenController', ['$scope', '$server', '$http', function ($scope, $server, $http) {
    
    $scope.on("selectionBoxesLoaded", function () {
        $scope.applyFilterButtonEnabled = true;
    });


    $scope.rawData.url = "PetersenRawData"

    $scope.locationSelectionBox.visible = false;

    $scope.goFilter = {

        submit: function () {
            $scope.applyFilterClicked = true;

                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                }

                var querystring = window.location.search.substring(1);

                // code to call API's and bind scope variables

                $http.post("/API/OrganizationFootprintData" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {

                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;

                    $scope.footprintOrgData = data;
                    $scope.organizationUrls = data.urls;                   
                });
                
                $http.post("/API/OrganizationDurationData" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {

                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;

                    $scope.durationOrgData = data;                    
                    $scope.organizationUrls = data.urls;
                });

                $http.post("/API/DurationParetoChartData" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {

                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;

                    $scope.durationParetoChartData = data;
                    $scope.organizationUrls = data.urls;
                });

                $http.post("/API/ThresholdBarChartData" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {

                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;

                    $scope.thresholdBarChartData = data;
                    $scope.organizationUrls = data.urls;
                });


                $http.post("/API/PetersenFullTableData" + '?hash_id=' + Math.random(), querystring, config)
                .success(function (data) {

                    data = typeof data === 'string' && data && (data[0] == '{' || data[0] == '[' || data == "true" || data == "false") ? eval('(' + data + ')') : data;

                    $scope.fullTableData = data;
                    $scope.organizationUrls = data.urls;
                });                
            }
    };

}]);