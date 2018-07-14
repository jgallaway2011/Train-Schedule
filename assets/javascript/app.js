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
    database.ref().on("child_added", function(childSnapshot) {
      
        // Store everything into a variable.
        var trainName = childSnapshot.val().trainName;
        var trainDestination = childSnapshot.val().trainDestination;
        var trainFirstTime = childSnapshot.val().trainFirstTime;
        var trainFrequency = parseInt(childSnapshot.val().trainFrequency);

        console.log(trainName);
        console.log(trainDestination);
        console.log(moment(trainFirstTime, "X").format("HH:mm"));
        console.log(trainFrequency);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(trainFirstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var trainTimeRemainder = diffTime % trainFrequency;
    console.log("Train Time Reamainder:" + trainTimeRemainder);

    // Minute Until Train
    var minutesTillTrain = trainFrequency - trainTimeRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesTillTrain);

    // Next Train
    var nextTrain = moment().add(minutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

        var trainTR = $("<tr>");
        var trainNameTD = $("<td>" + trainName + "</td>");
        var trainDestinationTD = $("<td>" + trainDestination + "</td>");
        var trainFrequencyTD = $("<td>" + trainFrequency + "</td>");
        var trainNextArrivalTD = $("<td>" + nextTrain + "</td>");
        var trainMinutesAwayTD = $("<td>" + minutesTillTrain + "</td>");
      
        trainTR.append(trainNameTD);
        trainTR.append(trainDestinationTD);
        trainTR.append(trainFrequencyTD);
        trainTR.append(trainNextArrivalTD);
        trainTR.append(trainMinutesAwayTD);
        
        $("#train-table").append(trainTR);
      });
});