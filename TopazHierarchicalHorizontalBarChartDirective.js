topazApp.directive("topazHierarchicalHorizontalBarChart", [function () {
//topazApp.directive("toCh", [function () {
    return {
        restrict: "E",
        scope: {
            data: "=",
            ngModel: "=?",
            classes: "=?",
            chartWidth: "=?",
            chartHeight: "=?",
            showBackButton: "=?",
            marginLeft: "=?"
        },
        link: reloadableChartLinker({
            init: function (context) {

            },
            loadChart: function (context, data) {
                var jsondata = JSON.parse(data);
                var scope = context.scope;
                var args = {
                    container: context.element,
                    chartWidth: scope.chartWidth,
                    chartHeight: scope.chartHeight,
                    classes: scope.classes,
                    showBackButton: scope.showBackButton,
                    marginLeft: scope.marginLeft
                    //classes: scope.classes
                };
                return hierarchicalHorizontalBarChartMap(jsondata, args);
            }
        })
    };
}]);