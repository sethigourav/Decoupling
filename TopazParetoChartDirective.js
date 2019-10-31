topazApp.directive("topazParetoChart", [function () {
    return {
        restrict: "E",
        scope: {
            data: "=",
            classes: "=?",
            yValueFormats: "=?",
            drilldownData: "=?",
            title: "@?",
            yAxisLabels: "=?",
            tickFormats: "=?",
            showYAxis: "=?",
            showTotals: "=?",
            type: "@?",
            height: "@?",
            width: "@?",
            maxWidth: "@?"
        },
        link: reloadableChartLinker({
            init: function (context) {
                context.scope.$watch("drilldownData", function (newValue, oldValue) {
                    if (typeof newValue !== 'undefined' && typeof context.chart !== 'undefined') {
                        context.chart.setDrilldownData(newValue);
                    }
                });
            },
            loadChart: function (context, data) {
                var args = cloneObject(context.scope);

                var chart = topazParetoChart(data, args);

                // wait until chart added to DOM to refresh so line chart and bar chart align correctly.
                setTimeout(function () {
                    chart.refreshSize();
                });

                return chart;
            }
        })
    };
}]);