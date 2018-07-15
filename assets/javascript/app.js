// Wait to run javascript until after DOM has loaded
$( document ).ready(function() {
    console.log( "ready!" );

    // VARIABLES
    // ***************************************************************************************************************

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

    // MAIN PROCESS
    //***************************************************************************************************************    

    // Run below code if submit button on form is clicked
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

        // Uploads train schedule data to the database
        database.ref().push(newTrain);

        // Empty form fields once data has been submitted
        $("#train-name").val("");
        $("#train-destination").val("");
        $("#train-first-time").val("");
        $("#train-frequency").val("");
    });

    // Looks in database for child added and will populate the data in our table
    database.ref().on("child_added", function(childSnapshot) {
      
        // Store firebase information into each child in the below variables
        var trainName = childSnapshot.val().trainName;
        var trainDestination = childSnapshot.val().trainDestination;
        var trainFirstTime = childSnapshot.val().trainFirstTime;
        var trainFrequency = parseInt(childSnapshot.val().trainFrequency);;

        // First Time (pushed back 1 day to make sure it comes before current time)
        var firstTimeConverted = moment(trainFirstTime, "HH:mm").subtract(1, "days");

        // Current Time
        var currentTime = moment();

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        var trainTimeRemainder = diffTime % trainFrequency;

        // Minutes Until Train
        var minutesTillTrain = trainFrequency - trainTimeRemainder;

        // Next Train
        var nextTrain = moment().add(minutesTillTrain, "minutes");
        var nextTrainFormatted = moment(nextTrain, "X").format("HH:mm");

        // Variables to create table
        var trainTR = $("<tr>");
        var trainNameTD = $("<td>" + trainName + "</td>");
        var trainDestinationTD = $("<td>" + trainDestination + "</td>");
        var trainFrequencyTD = $("<td>" + trainFrequency + "</td>");
        var trainNextArrivalTD = $("<td>" + nextTrainFormatted + "</td>");
        var trainMinutesAwayTD = $("<td>" + minutesTillTrain + "</td>");
      
        // Append table data to table row
        trainTR.append(trainNameTD);
        trainTR.append(trainDestinationTD);
        trainTR.append(trainFrequencyTD);
        trainTR.append(trainNextArrivalTD);
        trainTR.append(trainMinutesAwayTD);
        
        // Append table row to the table
        $("#train-table").append(trainTR);
      });
});