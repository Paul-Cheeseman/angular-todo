

//angular.module('TodoDirective',[]).directive('todoNavbar', function() {
angular.module('TodoNavBarDirective',[]).directive('todoNavbar', function() {
  return {
    restrict: 'E',    // A -> attribute, E -> element
    templateUrl: 'templates/directives/todo-navbar.html'
  };
});


angular.module('TodoTableDirective',[]).directive('todoTable', function() {
  return {
    restrict: 'E',    // A -> attribute, E -> element
    templateUrl: 'templates/directives/todo-table.html'
  };
});

