(function() {
	function timer(seconds) {
		this.time = seconds;
		this.paused = true;
	}
	
	var app = angular.module('EventApp', [])
		.filter('timeFormat', function() {
			return function(n, len) {
				var num = parseInt(n, 10);
				len = parseInt(len, 10);
				if (isNaN(num) || isNaN(len)) {
					return n;
				}
				num = ''+num;
				while (num.length < len) {
					num = '0'+num;
				}
				return num;
			}	
		});
	
	app.controller('EventController', ["$scope", "$interval", function($scope, $interval) {
		$scope.timer = {};
		$scope.timer.time = {};
		$scope.timer.time.minutes = 0;
		$scope.timer.time.seconds = 0;
		$scope.timer.paused = true;
		$scope.timer.setTime = function(count) {
			$scope.timer.time.minutes = count;
			$scope.timer.time.seconds = 0;
			$scope.timer.paused = false;
		}
		$scope.players = [];
		$scope.pairings = [];
		$scope.sound = new Audio('john.mp3');
		$interval(function() {
			var i = 0;
			if(!$scope.timer.paused) {
				if($scope.timer.time.seconds <= 0 && $scope.timer.time.minutes != 0) {
					$scope.timer.time.minutes--;
					$scope.timer.time.seconds = 59;
				} else if($scope.timer.time.seconds <= 0) {
					$scope.timer.paused = true;
					$scope.sound.play();
				} else {
					$scope.timer.time.seconds--;
				}
			}
		}, 1000);
		
		$scope.removePlayer = function(player) {
			for(var i=0; i < $scope.players.length; i++) {
				if(player.name == $scope.players[i].name) {
					$scope.players.splice(i, 1);
				}
			}
		};
		
		$scope.saveScores = function() {
			for(var i=0; i < $scope.pairings.length; i++) {
				if($scope.pairings[i].player1.score == undefined) {
					$scope.pairings[i].player1.score = 0;
					$scope.pairings[i].player2.score = 0;
				}
				$scope.pairings[i].player1.score += $scope.pairings[i].score1 * 1;
				$scope.pairings[i].player2.score += $scope.pairings[i].score2 * 1;
			}
		}
		
		$scope.generateSeating = function() {
			$scope.players = $scope.shuffle($scope.players);
		}
		
		$scope.generatePairings = function() {
			$scope.pairings = [];
			for(var i=0; i < $scope.players.length; i++) {
				$scope.players[i].assigned = false;
				if($scope.players[i].matches == undefined) {
					$scope.players[i].matches = [];
				}
				
				if($scope.players[i].score == undefined) {
					$scope.players[i].score = 0;
				}
			}
			
			//Reorder players by score
			$scope.players.sort(function(a, b){ return b.score - a.score});
			
			if($scope.players[0].score == 0) {
				$scope.players = $scope.shuffle($scope.players);
			}
			
			for(var i=0; i < $scope.players.length; i++) {
				// Pick a random opponent witht he same record that hasn't been paired with
				if($scope.hasPlayed($scope.players[i], $scope.players[i+1])) {
					// Figure it out
				}
				
				$scope.pairings.push({player1: $scope.players[i], player2: $scope.players[i+1]});
				i++;
			}
		};
		
	$scope.hasPlayed = function(a, b) {
		for(var i=0; i < a.matches.length; i++) {
			if(a.matches.opponent == b.name) {
				return true;
			}
		}
		return false;
	}
	
	$scope.shuffle = function (o){
    	for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    	return o;
	}
	
	}]);
	
	app.controller('PlayerController', ["$scope", function($scope) {
		$scope.player = {};
		this.addPlayer = function(players) {
			console.log(players);
			players.push($scope.player);
			$scope.player = {};
		};
	}]);
	
	
})();