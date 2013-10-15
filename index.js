/*

  tools used across the other files
  
*/

angular
  .module('digger.utils', [
    'digger.radio'
  ])

  .factory('$safeApply', [function($rootScope) {
    return function($scope, fn) {
      var phase = $scope.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if (fn) {
          $scope.$eval(fn);
        }
      } else {
        if (fn) {
          $scope.$apply(fn);
        } else {
          $scope.$apply();
        }
      }
    }
  }])


  /*
  
    load the folders from the resources tree once (but setup a radio)
    
  */
  .service('$containerTreeData', function($q, $rootScope, $containerRadio){
    var containers = {};

    function load($scope, selector){
      if(!containers[selector]){
        var deferred = $q.defer();

        $rootScope.warehouse(selector + ':tree(folder)').ship(function(root){
          $containerRadio($scope, root);
          deferred.resolve(root);
        })

        containers[selector] = deferred.promise;
      }

      return containers[selector];
    }
    
    return {
      load:load
    }
  })

  /*
  
    given a tree root and a container id - return an array of containers
    that are the ancestors for the id up to the tree root
    (if the id is found)
    
  */
  .factory('$getAncestors', function(){
    return function(root, container){
      var match = root.find('=' + container.diggerid());

      if(match.isEmpty()){
        return [];
      }

      var ancestors = [];
      var current = match;

      while(current){
        var parent = root.find('=' + current.diggerparentid());

        if(parent.isEmpty()){
          current = null;
        }
        else{
          ancestors.unshift(parent);
          current = parent;
        }
      }

      return ancestors;
    }
  })