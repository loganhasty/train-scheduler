// Steps to complete:
// 1. Hook up HTML
// 2. Hook up firebase
// 3. Hook up Add Train button input
// 4. Store inputs in Firebase
// 5. Calculate next arrival time of train and minutes away (moment.js)
// 6. Update HTML table with new train info


 //Initialize Firebase
var config = {
    apiKey: "AIzaSyBQ0hwbrVS8roxIMqTbLGqNseiCNxbyVC0",
    authDomain: "loganbase-4b7c8.firebaseapp.com",
    databaseURL: "https://loganbase-4b7c8.firebaseio.com",
    projectId: "loganbase-4b7c8",
    storageBucket: "loganbase-4b7c8.appspot.com",
    messagingSenderId: "797132361572"
};
firebase.initializeApp(config);

var database = firebase.database();

// Add train button input

// event listener for button
$("#add-train-btn").on("click", function (event) {
    event.preventDefault()

    // Store input fields as variables
    var trainName = $("#train-name-input").val().trim()
    var trainDestination = $("#destination-input").val().trim()
    var firstTrainTime = $("#first-train-time-input").val()
    var trainFrequency = $("#frequency-input").val().trim()

    // Log values to console
    console.log(trainName)
    console.log(trainDestination)
    console.log(firstTrainTime)
    console.log(trainFrequency)

    var newTrain = {
        name: trainName,
        destination: trainDestination,
        time: firstTrainTime,
        frequency: trainFrequency
    }
    console.log(newTrain)
    database.ref().push(newTrain)


    alert("Train successfully added")

    $("#train-name-input").val("")
    $("#destination-input").val("")
    $("#first-train-time-input").val("")
    $("#frequency-input").val("")
})

database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    var trainName = childSnapshot.val().name
    var trainDestination = childSnapshot.val().destination
    var firstTrainTime = childSnapshot.val().time
    var trainFrequency = childSnapshot.val().frequency

    // Do math on when next train arrives

    var firstTrainTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log(firstTrainTimeConverted);

    var currentTime = moment()
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime)

    var timeRemainder = diffTime % trainFrequency;
    console.log(timeRemainder);

    var tMinutesTillTrain = trainFrequency - timeRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    nextTrain = moment(nextTrain).format("hh:mm");



    // Add train data into table

    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
        trainFrequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td>");
});
