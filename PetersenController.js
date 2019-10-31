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
            }
    };

}]);