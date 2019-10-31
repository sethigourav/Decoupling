topazApp.directive('topazDonutChart', function () {
    return {
        restrict: 'E',
        scope: {
            data: "=",
            classes: "=?",
            sliceLabels: "=?",
            label: "=?",
            labelSize: "@?",
            tooltip: "=?",
            valueFormatter: "=?",
            tooltipValueFormatter: "=?",
            ngModel: "=?",
            fullLabels: "=?"
        },
        link: reloadableChartLinker({
            init: function (context) {

            },
            loadChart: function (context, data) {
                var scope = context.scope;
                var attrs = context.attrs;

                if (!scope.classes) {
                    scope.classes = {};

                    scope.data.forEach(function (d, i) {
                        scope.classes[d.key] = "info" + i;
                    });
                }

                var args = cloneObject(context.scope);
                args.container = d3.select(context.element.node());
                args.tooltip = attrs.tooltip ? scope.tooltip : true;

                return topazDonutChart(data, args);
            }
        })
    };
});