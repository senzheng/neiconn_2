angular.module('orderview',['customFilters','ui.bootstrap'])
       .controller('orderCtrl', function ($scope, $http){
          
          
         $scope.hightlightnumber = null;
       $scope.item = [];
       $scope.preview = false;
       $scope.dispu = false;
       var	data = [{"_id" : "trip001", "name" : "order001", "status" : 1}, {"_id" : "trip002", "name" : "order002", "status" : 1},
                         {"_id" : "trip003", "name" : "order003", "status" : 1}, {"_id" : "trip004", "name" : "order004", "status" : 1},
                         {"_id" : "trip005", "name" : "order005", "status" : 2}, {"_id" : "trip006", "name" : "order006", "status" : 1},
                         {"_id" : "trip007", "name" : "order007", "status" : 2}, {"_id" : "trip008", "name" : "order008", "status" : 1},
                         {"_id" : "trip009", "name" : "order009", "status" : 1}, {"_id" : "trip010", "name" : "order010", "status" : 3},
                         {"_id" : "trip011", "name" : "order011", "status" : 5}, {"_id" : "trip012", "name" : "order012", "status" : 1},
                         {"_id" : "trip013", "name" : "order013", "status" : 1}, {"_id" : "trip014", "name" : "order014", "status" : 4}]
         
         $scope.select = function (num) {
                     $scope.item.length = 0;
                     for(var i = 0; i < data.length; i++){
                         if(num === 0){
                             $scope.before = false;
                              $scope.after = false;
                               $scope.all = true;

                           $scope.item.push(data[i]);
                         }else if(data[i].status === num){
                            $scope.item.push(data[i]);
                            if(data[i].status === 1){
                              $scope.before = true;
                              $scope.after = false;
                              $scope.all = false;
                            }else{
                              $scope.before = false;
                              $scope.after = true;
                              $scope.all = false; }       
                          }
                        }

                        $scope.preview = false;
         	
         }


         $scope.chooseTrip = function (id, name){
            $scope.hightlightnumber = null;
            $scope.name = name;
            $scope.orderID = id;
            $scope.payment = "FULL PAYMENT";
            $scope.status = "Ready";
            $scope.paid = "$3000.00";
            $scope.preview = true;
            $scope.hightlightnumber = id;
         }


         $scope.dispute = function (){
            $scope.dispu = true;
            $scope.preview = false;
         }

         $scope.back = function(){
            $scope.dispu = false;
         }

       	  //$scope.switches = $scope.tripItem && $scope.reviewD;

       });