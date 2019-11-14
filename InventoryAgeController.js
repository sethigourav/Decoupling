topazApp.controller('InventoryAgeController', ['$scope', '$server', function ($scope, $server) {

    $scope.checkCostDataHidden();

    $scope.on("selectionBoxesLoaded", function () {
        $server.bindData("OrganizationInventoryAgeCount", $scope, "organizationCountAgeData", { callback: function (d) { $scope.organizationUrls = d.urls } });
        $server.bindData("OrganizationInventoryAgeCost", $scope, "organizationCostAgeData", { callback: function (d) { $scope.organizationUrls = d.urls } });
        $server.bindData("OrganizationInventoryAgePercentCount", $scope, "organizationPercentCountAgeData", { callback: function (d) { $scope.organizationUrls = d.urls } });
        $server.bindData("OrganizationInventoryAgePercentCost", $scope, "organizationPercentCostAgeData", { callback: function (d) { $scope.organizationUrls = d.urls } });
        $server.bindData("LocationInventoryAgeCount", $scope, "locationCountAgeData", { callback: function (d) { $scope.locationUrls = d.urls } });
        $server.bindData("LocationInventoryAgeCost", $scope, "locationCostAgeData", { callback: function (d) { $scope.locationUrls = d.urls } });
        $server.bindData("LocationInventoryAgePercentCount", $scope, "locationPercentCountAgeData", { callback: function (d) { $scope.locationUrls = d.urls } });
        $server.bindData("LocationInventoryAgePercentCost", $scope, "locationPercentCostAgeData", { callback: function (d) { $scope.locationUrls = d.urls } });
    });

    $scope.rawData.url = "InventoryAgeRawData";
    


}]);
