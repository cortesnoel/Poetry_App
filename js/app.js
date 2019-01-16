let NLUApp = angular.module('NLUApp', ['ngRoute','angularUtils.directives.dirPagination']);

NLUApp.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/authorlist', {
      templateUrl: 'views/authorlist.html',
      controller: 'naturalUnderstanding'
    })
    .when('/search', {
      templateUrl: 'views/search.html',
      controller: 'naturalUnderstanding'
    })
    .otherwise({
      redirectTo: '/search'
    })
}]);

NLUApp.controller('naturalUnderstanding' , ["$scope", "$http", function ($scope, $http) {

  $scope.author = {
    name: "",
    title: "",
    lines: ""
  }

  $scope.primaryData=4;

  angular.element("#error").hide();
  angular.element("#searchList").contents().hide();
  angular.element("#displayLines").contents().hide();
  angular.element("#searchFullList").contents().hide();
  angular.element("#displayListSelection").contents().hide();


//window.onload to have API call load once with window and not on each page load; not in each function
//Have to remove window.onload for call of method in the view with ng-init on <body>
  $scope.preLoad = function () {
    console.log("preLoad GET AJAX");

    $http({
      method: 'GET',
      url: 'http://localhost:8080/users/63f03b1f-a413-4bf3-8160-f857ccf4329d'
      })
        .then(function successCallback(data){
            console.log("Successful GET data");

            $scope.primaryData = data;

            console.log($scope.primaryData);
        }, function errorCallback(data){
            console.log("preLoad() GET AJAX failed");
        });
      };


  //Header Links Functions
  $scope.authorListLink = function () {
    $scope.authorList();

    angular.element("#searchFullList").contents().hide();
    angular.element("#displayListSelection").contents().hide();
    angular.element("#fullList").contents().show();
  }
  $scope.searchLink = function () {
    console.log($scope.primaryData);

    angular.element("#searchList").contents().hide();
    angular.element("#displayLines").contents().hide();
    angular.element("#formAuthor").contents().show();
    angular.element("#error").hide();
  }


  $scope.authorList = function () {
    console.log("authorList() GET AJAX");
    $scope.uniqueData = [];

    if(angular.isArray($scope.primaryData)) {
      console.log("if");

      for(i=0;i<$scope.primaryData.length;i++) {
            $scope.uniqueData[$scope.primaryData[i].author] = 1;
        }
        $scope.uniqueData = Object.keys($scope.uniqueData);
        console.log($scope.uniqueData);
    }else{
      console.log("else");

      $http({
        method: 'GET',
        url: 'http://poetrydb.org/author/*'
        })
          .then(function successCallback(data){
              console.log("Successful GET data");

            for(i=0;i<data.data.length;i++) {
                  $scope.uniqueData[data.data[i].author] = 1;
              }
              $scope.uniqueData = Object.keys($scope.uniqueData);
            //  console.log($scope.uniqueData);


            //  console.log(data);
          }, function errorCallback(data){
              console.log("authorList() GET AJAX failed");
        });
    }
  };


  $scope.chooseAuthorList = function (name) {
    $scope.author.name = name;

    $scope.searchRequest();
  }


  $scope.searchRequest = function () {
      console.log("searchRequest() GET AJAX");

      $http({
        method: 'GET',
        url: 'http://poetrydb.org/author/'+$scope.author.name
        })
          .then(function successCallback(data){
              console.log("Successful GET data");
              $scope.searchData = data.data;

              if(data.data.status==404) {
                console.log("Error message fired: Author name not found(404)");
                angular.element("#error").show();
                return;
              }else{
                angular.element("#formAuthor").contents().hide();
                angular.element("#searchList").contents().show();
                angular.element("#fullList").contents().hide();
                angular.element("#searchFullList").contents().show();
              }

              console.log($scope.searchData);
          }, function errorCallback(data){
              console.log("searchRequest() GET AJAX failed");
          });
  };


  $scope.chooseTitle = function(title, name, lines) {
    console.log("chooseTitle() function");

    $scope.author.title = title;
    $scope.author.name = name;
    $scope.author.lines = lines;
    //$scope.choosePoem();

    angular.element("#searchList").contents().hide();
    angular.element("#displayLines").contents().show();

    angular.element("#searchFullList").contents().hide();
    angular.element("#displayListSelection").contents().show();

    console.log($scope.author.title);
    console.log($scope.author.name);
    console.log($scope.author.lines);
  };

  /*$scope.choosePoem = function () {
    console.log("choosePoem() GET AJAX");

    $http({
      method: 'GET',
      url: 'http://poetrydb.org/title/'+$scope.author.title
      })
        .then(function successCallback(data){
            console.log("Successful GET data");
            $scope.responsePoem = data.data[0].lines;

            console.log(data);
        }, function errorCallback(data){
            console.log("choosePoem() GET AJAX failed");
        });
      };*/

}]);
