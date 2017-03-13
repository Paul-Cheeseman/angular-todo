angular.module('RouteControllers', [])


	//****************************************************************************************
    .controller('HomeController', function($scope, store) {
        $scope.title = "Welcome To Angular Todo!";

        //Logged in/out msg
        if (store.get('username')) {
            $scope.userMsg = " - User: " + store.get('username') + " currently logged in";
        }

    })


	//****************************************************************************************
    .controller('RegisterController', function($scope, $location, UserAPIService, store) {


        //Logged in/out msg
        if (store.get('username')) {
            $scope.userMsg = " - User: " + store.get('username') + " currently logged in";
        }
 
        $scope.registrationUser = {};
        var URL = "https://morning-castle-91468.herokuapp.com/";


        validate = function(){
        	//If ghe local data is present, user logged in so redirect to their todo list
	      	if (store.get('authToken')) {
    	 	  		$location.path("/todo");
    		}
    		else{
    			console.log("Validating - Login Error");
    		}
        };
            

 
	    $scope.login = function(){
        	UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.data).then(function(results){
        		$scope.token = results.data.token;
                store.set('username', $scope.registrationUser.username);
                store.set('authToken', $scope.token);

                //Function to redicrect on successful login
                validate();

        	}).catch(function(err) {
        		console.log(err.data);
        	});
        };


        $scope.submitForm = function() {
            if ($scope.registrationForm.$valid) {
                $scope.registrationUser.username = $scope.user.username;
                $scope.registrationUser.password = $scope.user.password;
 
                UserAPIService.callAPI(URL + "accounts/register/", $scope.registrationUser).then(function(results) {
                    $scope.data = results.data;
                    console.log("You have successfully registered to Angular Todo");
                    $scope.login();

                }).catch(function(err) {
                    alert("Oops! Something went wrong!");
                    console.log(err);
                });

            }
        };
    })


//****************************************************************************************	
    .controller('LoginController', function($scope, $location, UserAPIService, store) {
        $scope.title = "LOGIN!";

        //Logged in/out msg
        if (store.get('username')) {
            $scope.userMsg = " - User: " + store.get('username') + " currently logged in";
        }


		var URL = "https://morning-castle-91468.herokuapp.com/";

		//creating empty object, that will be populated with login info which can then be fired off
        $scope.loggingInUser = {};


     	validate = function(){
        	//If ghe local data is present, user logged in so redirect to their todo list
     		console.log("Validate Running");

	      	if (store.get('authToken')) {
	      		$location.path("/todo");
    		}
    		else{
    			console.log("Validating - Login Error");
    		}
        };


		$scope.login = function(){
        	UserAPIService.callAPI(URL + "accounts/api-token-auth/", $scope.loggingInUser).then(function(results){
        		$scope.token = results.data.token;
                store.set('username', $scope.loggingInUser.username);
                store.set('authToken', $scope.token);

                //Function to redicrect on successful login
                validate();

        	}).catch(function(err) {
        		console.log(err.data);
        	});
        };


		$scope.submitLoginForm = function(){
            if ($scope.loginForm.$valid) {
                $scope.loggingInUser.username = $scope.userLogin.username;
                $scope.loggingInUser.password = $scope.userLogin.password;
        		
        		console.log($scope.loggingInUser.username);
        		console.log($scope.loggingInUser.password);
				
				$scope.login();

				//console.log("Calling Validate");
				//Delay on call put in as presumably login() hadn't finished running
				//setTimeout(validate(),2000);
				//console.log("Finished with Validate");

    		}

		};

    })


    //****************************************************************************************
	.controller('LogOutController', function($scope, store) {

		if (store.get('username')){
			$scope.userLogOutName = store.get('username');
			$scope.logOutMsg = "You have been logged out";
			//console.log($scope.userLogOutName);

			//remove the local data
        	$scope.authToken = store.remove('authToken');
	        $scope.username = store.remove('username');
		}
		else{
			$scope.logOutMsg = "Your not logged in, please login before logging out";
		}


		 

    })


	//****************************************************************************************	
	.controller('TodoController', function($scope, $location, TodoAPIService, store) {
        var URL = "https://morning-castle-91468.herokuapp.com/";

        //Logged in/out msg
        if (store.get('username')) {
            $scope.userMsg = " - User: " + store.get('username') + " currently logged in";
        }
 
 		//If the locally stored data is not rpesent, user not logged in, so direct to registration page
    	if (!store.get('authToken')) {
        	$location.path("/accounts/register");
    	}


        $scope.authToken = store.get('authToken');
        $scope.username = store.get('username');
 
        $scope.todos = [];
        
      

        TodoAPIService.getTodos(URL + "todo/", $scope.username, $scope.authToken).then(function(results) {
            $scope.todos = results.data || [];
            console.log($scope.todos);
        }).catch(function(err) {
            console.log(err);
        });


    	$scope.editTodo = function(id) {
	        $location.path("/todo/edit/" + id);
    	};

 
	    $scope.deleteTodo = function(id) {
    	    TodoAPIService.deleteTodo(URL + "todo/" + id, $scope.username, $scope.authToken).then(function(results) {
        	    console.log(results);
        	}).catch(function(err) {
                console.log(err);
        	});
    	};


        $scope.submitForm = function() {
            if ($scope.todoForm.$valid) {
                $scope.todo.username = $scope.username;
                $scope.todos.push($scope.todo);
 
                TodoAPIService.createTodo(URL + "todo/", $scope.todo, $scope.authToken).then(function(results) {
                    console.log("Posting:");
                    console.log(results);                    


					// Code to retrieve ('get') user data after initial creation ('post') so that server generated id 
					// will be present in $scope.todos ASAP, enabling newly created ‘todo’ item to be edited 
					// immediately, without the need for manual internvention to refresh. 
    	    		TodoAPIService.getTodos(URL + "todo/", $scope.username, $scope.authToken).then(function(results) {
		    	        $scope.todos = results.data || [];
                    	console.log("Retrieving:");	    	        
            			console.log($scope.todos);
        			}).catch(function(err) {
			            console.log(err);
    	    		});


                }).catch(function(err) {
                    console.log(err);
                });

            }
        };
    })


	//****************************************************************************************
	.controller('EditTodoController', function($scope, $location, $routeParams, TodoAPIService, store) {
        
        //Logged in/out msg
        if (store.get('username')) {
            $scope.userMsg = " - User: " + store.get('username') + " currently logged in";
        }


        var id = $routeParams.id;
        var URL = "https://morning-castle-91468.herokuapp.com/";
 
        console.log("id testing: " +id);

        TodoAPIService.getTodos(URL + "todo/" + id, $scope.username, store.get('authToken')).then(function(results) {
            $scope.todo = results.data;

        }).catch(function(err) {
            console.log(err);
        });
 
        $scope.submitForm = function() {
            if ($scope.todoForm.$valid) {
                $scope.todo.username = $scope.username;
 
                TodoAPIService.editTodo(URL + "todo/" + id, $scope.todo, store.get('authToken')).then(function(results) {
                    $location.path("/todo");
                }).catch(function(err) {
                    console.log(err);
                });
            }
        };
    });
