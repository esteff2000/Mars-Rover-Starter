class Rover {
   constructor(position) {
      this.position = position
      this.mode = 'NORMAL'
      this.generatorWatts = 110
   }
   receiveMessage(message) {
      let resultsObject = {
         message: message.name
      }
      resultsObject.results = []
      for(let i = 0; i < message.commands.length;i++) {
         let command = message.commands[i];
         if (command.commandType == 'STATUS_CHECK') {
            resultsObject.results.push(
               {
                  completed: true,
                  roverStatus: {
                     mode: this.mode,
                     generatorWatts: this.generatorWatts,
                     position: this.position
                  }
               }
            )
         } else if(command.commandType == 'MODE_CHANGE') {
            this.mode = command.value
            resultsObject.results.push(
               {
                  completed: true
               }
            )
         } else if(command.commandType == "MOVE") {
            if (this.mode == 'LOW_POWER') {
               resultsObject.results.push(
                  {
                     completed: false
                  }
               )
            } else {
               this.position = command.value
               resultsObject.results.push(
                  {
                     completed : true
                  }
               )
            }

         }

      } return resultsObject
   } 
}

module.exports = Rover;