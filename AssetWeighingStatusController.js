topazApp.controller('AssetWeighingStatusController', ['$scope', '$server', function ($scope, $server) {
    $scope.on("selectionBoxesLoaded", function () {
        $server.bindData("OrganizationWeighedUnweighedAssetCounts", $scope, "organizationWeighedUnweighedAssetCounts", { callback: function (d) { $scope.organizationUrls = d.urls }});
        $server.bindData("LocationWeighedUnweighedAssetCounts", $scope, "locationWeighedUnweighedAssetCounts", { callback: function (d) { $scope.locationUrls = d.urls } });
        $server.bindData("WeighedUnweighedAssetTable", $scope, "weighedUnweighedAssetTable");
        $server.bindData("WeighedUnweighedModelTable", $scope, "weighedUnweighedModelTable");
    });

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