topazApp.controller('PetersenController', ['$scope', '$server', function ($scope, $server) {
    $scope.on("selectionBoxesLoaded", function () {
        $server.bindData("OrganizationFootprintData", $scope, "footprintOrgData", { callback: function (d) { $scope.organizationUrls = d.urls } });
        $server.bindData("OrganizationDurationData", $scope, "durationOrgData", { callback: function (d) { $scope.organizationUrls = d.urls } });
        $server.bindData("DurationParetoChartData", $scope, "durationParetoChartData");
        $server.bindData("ThresholdBarChartData", $scope, "thresholdBarChartData", {
            callback: function (d) {
                $scope.organizationUrls = d.urls
            }
        });
        $server.bindData("PetersenFullTableData", $scope, "fullTableData");;
    });


    $scope.rawData.url = "PetersenRawData"

    $scope.locationSelectionBox.visible = false;
}]);