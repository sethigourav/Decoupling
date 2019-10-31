topazApp.directive("topazBarChart", [function () {
    return {
        restrict: "E",
        scope: {
            data: "=",
            classes: "=?",
            colorFunction: "=?",
            drilldownData: "=?",
            drilldownParam: "@?",
            title: "@?",
            yAxisLabels: "=?",
            showYAxis: "=?",
            showTotals: "=?",
            multipleAxes: "=?",
            type: "@?",
            height: "@?",
            width: "@?",
            timeInterval: "@?",
            ngModel: "=?",
            maxWidth: "@?",
            callbackFn: '&'
        },
        link: reloadableChartLinker({
            globalEvalAttributes: ["yValueFormats", "tickFormats"],
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

                var chart = topazBarChart(data, context.scope);

                // wait until chart added to DOM to refresh so line chart and bar chart align correctly.
                setTimeout(function () {
                    chart.refreshSize();
                });

                return chart;
            }
        })
    };
}]);