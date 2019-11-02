﻿topazApp.controller('AssetRecordConsistencyController', ['$scope', '$server', function ($scope, $server) {
    window.assetRecordConsistencyController = $scope;

    $scope.on("selectionBoxesLoaded", function () {
        $server.bindData("AssetRecordConsistencyAssetData", $scope, "assetRecordConsistencyAssetData");
        $server.bindData("AssetRecordConsistencyOrganizationData", $scope, "assetRecordConsistencyOrganizationData", { callback: function (d) { $scope.organizationUrls = d.urls } });
        $server.bindData("AssetRecordConsistencyLocationData", $scope, "assetRecordConsistencyLocationData", { callback: function (d) { $scope.locationUrls = d.urls } });
    });

    $scope.buttonFormatter = {
        systemRecordConsistency: function (d) {
            return (parseFloat(d.systemRecordConsistency) * 100).round(1) + '%';
        },
        assetSystemRecordConsistencyData: function (d) {
            return '<button class="btn btn-default skinny" onclick="viewAsset(\'{0}\',{1});return false;">View</button>'.format(encodeURIComponent(d.assetId), parseFloat(d.systemRecordConsistency));
        },
    };

    $scope.modelInput = {
        manufacturer: $scope.urlParameters.Manufacturer,
        manufacturerExact: $scope.urlParameters.ManufacturerExact,
        modelNo: $scope.urlParameters.ModelNo,
        modelNoExact: $scope.urlParameters.ModelNoExact,
        valid: true
    };

    $scope.showingData = false;

    window.viewAsset = function (assetId, score) {
        assetId = decodeURIComponent(assetId);

        var $scope = assetRecordConsistencyController;

        $scope.showingData = true;

        var systems = $scope.assetRecordConsistencyAssetData.matrix[assetId];

        var bestKnown = systems.filter(function (system) {
            return system.name == "Best known";
        })[0];

        systems = systems.filter(function (system) {
            return system != bestKnown;
        });
 
        $scope.selectedModels.systems = systems;
        $scope.selectedModels.bestKnown = bestKnown;
        $scope.selectedModels.assetId = assetId;
        $scope.selectedModels.consistency = score;

        $scope.$apply();

        //headerScope.updateHeader();
    };
    
    $scope.employeeSelectionBox.visible = true;
    $scope.rawData.url = "AssetRecordConsistencyRawData";

    
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
                "ModelDescExact": $scope.modelInput.nounExact
            });
        }
    };
}]);