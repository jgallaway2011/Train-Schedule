$( document ).ready(function() {
    console.log( "ready!" );

    // VARIABLES
    // ***************************************************************************************************************

    // Initialize Firebase
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCx-Bch_24M73NNlmrMeNn8OqeYBnQwRXM",
        authDomain: "timetable-e2d39.firebaseapp.com",
        databaseURL: "https://timetable-e2d39.firebaseio.com",
        projectId: "timetable-e2d39",
        storageBucket: "timetable-e2d39.appspot.com",
        messagingSenderId: "364187128718"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    // FUNCTIONS
    //****************************************************************************************************************


    // MAIN PROCESS
    //***************************************************************************************************************    

    // Run below code if any with a class of cartoonButton is clicked
    $("#train-submit").on("click", function (event) {
        event.preventDefault();

        // Extract inputs from form
        var trainName = $("#train-name").val().trim();
        var trainDestination = $("#train-destination").val().trim();
        var trainFirstTime = moment($("#train-first-time").val().trim(), "HH:mm").format("X");
        var trainFrequency = parseInt($("#train-frequency").val().trim());

        // Local object to be sent to Firebase database
        var newTrain = {
            trainName: trainName,
            trainDestination: trainDestination,
            trainFirstTime: trainFirstTime,
            trainFrequency: trainFrequency
        };

        // Uploads employee data to the database
        database.ref().push(newTrain);

        // Logs everything to console
        console.log(newTrain.trainName);
        console.log(newTrain.trainDestination);
        console.log(newTrain.trainFirstTime);
        console.log(newTrain.trainFrequency);

        $("#train-name").val("");
        $("#train-destination").val("");
        $("#train-first-time").val("");
        $("#train-frequency").val("");
    });

    // Looks in database for child added and will populate the data in our table
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());
      
        // Store everything into a variable.
        var trainName = childSnapshot.val().trainName;
        var trainDestination = childSnapshot.val().trainDestination;
        var trainFirstTime = childSnapshot.val().trainFirstTime;
        var trainFrequency = parseInt(childSnapshot.val().trainFrequency);
      
        // Employee Info
        console.log(trainName);
        console.log(trainDestination);
        console.log(trainFirstTime);
        console.log(trainFrequency);
      
        // var nextArrival = moment().diff(moment(train, "X"), "months");
        // console.log(empMonths);

        var trainTR = $("<tr>");
        var trainNameTD = $("<td>" + trainName + "</td>");
        var trainDestinationTD = $("<td>" + trainDestination + "</td>");
        var trainFrequencyTD = $("<td>" + trainFrequency + "</td>");
      
        trainTR.append(trainNameTD);
        trainTR.append(trainDestinationTD);
        trainTR.append(trainFrequencyTD);
        
        $("#train-table").append(trainTR);
      });
});