define(['angular','ops-mgr/overview/module-name'], function (angular,moduleName) {

    var directive = function () {
        return {
            restrict: "EA",
            scope:true,
            controllerAs:'vm',
            bindToController: {
                panelTitle: "@",
                refreshIntervalTime: "@"
            },
            templateUrl: 'js/ops-mgr/overview/feed-status-indicator/feed-status-indicator-template.html',
            controller: "FeedStatusIndicatorController",
            link: function ($scope, element, attrs) {

            }
        }

    };

    var controller = function ($scope, $element, $http, $interval, $timeout, OpsManagerFeedService) {
        var self = this;
        this.chartApi = {};
        this.dataLoaded = false;
        this.feedSummaryData = null;
        this.chartData = [];
        this.dataMap = {'Healthy':{count:0, color:'#009933'},'Unhealthy':{count:0,color:'#FF0000'}};
        initializePieChart();


        $scope.$watch(
            function () {
                return OpsManagerFeedService.feedUnhealthyCount
            },
            function (newVal) {
                self.dataMap.Unhealthy.count = newVal;
                updateChartData();
                }
        );
        $scope.$watch(
            function () {
                return OpsManagerFeedService.feedHealthyCount
            },
            function (newVal) {
                self.dataMap.Healthy.count = newVal;
                updateChartData();
            }
        );
        $scope.$watch(
            function () {
                return OpsManagerFeedService.feedSummaryData
            },
            function (newVal) {
                self.feedSummaryData = newVal;
                  }
        );

        function updateChartData(){
            angular.forEach(self.chartData,function(row,i){
                row.value = self.dataMap[row.key].count;
            });
            var title = (self.dataMap.Healthy.count+self.dataMap.Unhealthy.count)+" Total";
            self.chartOptions.chart.title=title
            self.dataLoaded = true;
            if(self.chartApi.update) {
                self.chartApi.update();
            }
        }

        this.updateChart = function(){
            if(self.chartApi.update) {
                self.chartApi.update();
            }
        }

        this.chartOptions = {
            chart: {
                type: 'pieChart',
                x: function(d){return d.key;},
                y: function(d){return d.value;},
                showLabels: false,
                duration: 100,
                height:150,
                transitionDuration:500,
                labelThreshold: 0.01,
                labelSunbeamLayout: false,
                "margin":{"top":10,"right":10,"bottom":10,"left":10},
                donut:true,
                donutRatio:0.65,
                showLegend:false,
                refreshDataOnly: false,
                color:function(d){
                    return self.dataMap[d.key].color;
                },
                valueFormat: function(d){
                    return parseInt(d);
                },
                dispatch: {

                }
            }
        };

        function initializePieChart() {
                self.chartData.push({key: "Healthy", value: 0})
                self.chartData.push({key: "Unhealthy", value: 0})
        }



        $scope.$on('$destroy', function () {

        });
    };

    angular.module(moduleName).controller('FeedStatusIndicatorController', ["$scope","$element","$http","$interval","$timeout","OpsManagerFeedService",controller]);


    angular.module(moduleName)
        .directive('tbaFeedStatusIndicator', directive);

});



