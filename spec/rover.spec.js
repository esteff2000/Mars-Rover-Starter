const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function () {
  test('constructor sets position and default values for mode and generatorWatts', function () {
    let testRover = new Rover(12)
    expect(testRover.position).toBe(12)
    expect(testRover.mode).toBe('NORMAL')
    expect(testRover.generatorWatts).toBe(110)
  });
});

describe("Message received", function () {
  test('response returned by receiveMessage contains the name of the message', function () {
    let testMessage = new Message("Test", [new Command("MOVE")]);
    expect(new Rover(12).receiveMessage(testMessage).message).toBe("Test")
  });
});

describe("2 commands received", function () {
  test('response returned by receiveMessage includes two results if two commands are sent in the message', function(){
    let commands = [new Command ('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')]
    let message = new Message('Test message with two commands', commands)
    let resultsObject = new Rover(12).receiveMessage(message)
    expect(resultsObject.results.length).toBe(2)
    
  });
});

describe("Status check", function () {
  test('reponds correctly to the status check command', function(){
    let message = new Message('Status check', [new Command('STATUS_CHECK')])
    let resultsObject = new Rover(12).receiveMessage(message) 
    expect(resultsObject.results[0].roverStatus.mode).toBe('NORMAL');
    expect(resultsObject.results[0].roverStatus.generatorWatts).toBe(110);
    expect(resultsObject.results[0].roverStatus.position).toBe(12);
  });
});

describe("Mode change", function () {
  test('responds correctly to the mode change command', function(){
    let message = new Message('Change mode', [new Command('MODE_CHANGE', 'LOW_POWER')])
    let rover = new Rover(12);
    let resultsObject = rover.receiveMessage(message);
    expect(resultsObject.results[0].completed).toBe(true);
    expect(rover.mode).toBe('LOW_POWER');
  })
});

describe("Low power mode response", function () {
  test('responds with a false compelted value when attempting to move in LOW_POWER mode', function(){

    let message = new Message('Low power mode', [new Command('MOVE', 314)]);
    let rover = new Rover(12);
    rover.mode = 'LOW_POWER'
    let resultsObject = rover.receiveMessage(message);
    expect(resultsObject.results[0].completed).toBe(false);
  })
});

describe("Move position", function () {
  test("A MOVE command will update the rover's position with the position value in the command", function(){
    let message = new Message('Move rover', [new Command('MOVE', 314)])
    let rover = new Rover(12)
    let resultsObject = rover.receiveMessage(message);
    expect(resultsObject.results[0].completed).toBe(true);
    expect(rover.position).toBe(314);
  })
});