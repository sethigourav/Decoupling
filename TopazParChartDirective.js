topazApp.directive("topazParChart", [function () {
    return {
        restrict: "E",
        scope: {
            data: "=",
            classes: "=?",
            yValueFormats: "=?",
            drilldownData: "=?",
            drilldownParam: "@?",
            title: "@?",
            yAxisLabels: "=?",
            tickFormats: "=?",
            showYAxis: "=?",
            showTotals: "=?",
            multipleAxes: "=?",
            type: "@?",
            height: "@?",
            width: "@?",
            maxWidth: "@?",
            callbackFn: '&'
        },
        link: reloadableChartLinker({
            init: function (context) {
            },
            loadChart: function (context, data) {
                if (context.scope.drilldownData && !context.scope.drilldownParam) {
                    if (context.scope.drilldownData == context.scope.$parent.organizationUrls) {
                        context.scope.drilldownParam = "Organization";
                    } else if (context.scope.drilldownData == context.scope.$parent.locationUrls) {
                        context.scope.drilldownParam = "Location";
                    } else if (context.scope.drilldownData == context.scope.$parent.employeeUrls) {
                        context.scope.drilldownParam = "Employee";
                    } else if (context.scope.drilldownData == context.scope.$parent.departmentUrls) {
                        context.scope.drilldownParam = "Department";
                    }
                }
                return dashboard(data, context.scope);
            }
        })
    };
}]);