var config = {
    apiKey: "AIzaSyAIt0P2DoeDadhT2Ohn0wkQONFDgnv_CWM",
    authDomain: "crg-firebase.firebaseapp.com",
    databaseURL: "https://crg-firebase.firebaseio.com",
    projectId: "crg-firebase",
    storageBucket: "",
    messagingSenderId: "958050179303"
};
firebase.initializeApp(config);

var database = firebase.database().ref('/train-scheduler/');

$("#addTrainSubmit").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#trainNameInput").val().trim();
    var trainDestination = $("#trainDestinationInput").val().trim();
    var trainStart = $("#firstTrainInput").val().trim();
    var trainFrequency = $("#frequencyInput").val().trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        name: trainName,
        dest: trainDestination,
        start: trainStart,
        rate: trainFrequency
    };

    database.push(newTrain);

    // console.log(newTrain.name);
    // console.log(newTrain.dest);
    // console.log(newTrain.start);
    // console.log(newTrain.rate);

    // Clears all of the text-boxes
    $("#trainNameInput").val("");
    $("#trainDestinationInput").val("");
    $("#firstTrainInput").val("");
    $("#frequencyInput").val("");
});

database.on('child_added', function (childSnapshot) {
    //console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().dest;
    var trainStart = childSnapshot.val().start;
    var trainFrequency = childSnapshot.val().rate;

    // console.log(trainName);
    // console.log(trainDestination);
    // console.log(trainStart);
    // console.log(trainFrequency);

    // First Time (pushed back 1 year to make sure it comes before current time)
    var trainStartConverted = moment(trainStart, "HH:mm").subtract(1, "years");
    var currentTime = moment(currentTime).format("HH:mm");
    var diffTime = moment().diff(moment(trainStartConverted), "minutes");
    var tMinutesTillTrain = trainFrequency - (diffTime % trainFrequency);

    // Next Train
    var trainNext;
    if (trainStart > currentTime) {
        trainNext = moment(trainStart, "HH:mm");
    } else {
        trainNext = moment().add(tMinutesTillTrain, "minutes");
    }
    //console.log("ARRIVAL TIME: " + moment(trainNext).format("HH:mm"));


    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainStart),
        $("<td>").text(trainFrequency),
        $("<td>").text(moment(trainNext).format("HH:mm"))
    );

    // Append the new row to the table
    $('#currentTime').text(`Current Time = ${currentTime}`);
    $("#trainTable > tbody").append(newRow);
})