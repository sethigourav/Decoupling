//This wraps around the topazLineChart and passes parameters
// '@' = text or percentages, '=' = true/false, '?' = optional parameter
topazApp.directive("topazLineChart", [function () {
    return {
        restrict: "E",
        scope: {
            data: "=",
            classes: "=?",
            drilldownData: "=?",
            title: "@?",
            yAxisLabels: "=?",
            showYAxis: "=?",
            showTotals: "=?",
            multipleAxes: "=?",
            origins: "=?",
            showLegend: "=?",
            reverseLegend: "=?",
            stacked: "=?",
            lineTooltip: "=?",
            cumulative: "=?",
            baseline: "=?",
            type: "@?",
            height: "@?",
            width: "@?",
            maxWidth: "@?",
            ngModel: "=?",
            separateLineLayer: "=?",
            showGrid: "=?",
            hideExcessDates: "=?",
            comparelinesTooltip: "=?"
        },
        link: reloadableChartLinker({
            globalEvalAttributes: ["yValueFormats", "tickFormats"],
            init: function (context) {
            },
            loadChart: function (context, data) {
                return topazLineChart(data, context.scope);
            }
        })
    };
}]);