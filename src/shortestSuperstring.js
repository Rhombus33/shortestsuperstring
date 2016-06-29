const helpers = require('./helpers.js');
const Node = require('./node_class.js');

function shortestSuperstring() {
  helpers.readSequencesToArray().then(sequences => {

    // create a Node for each sequence in the array
    let sequenceNodes = sequences.map((sequence, index, array) => {
      return new Node(sequence);
    });

    // iterate over nodes and make connections
    for (let i = 0; i < sequenceNodes.length; i++) {
      for (let j = i + 1; j < sequenceNodes.length; j++) {
        helpers.setDirectedEdge(sequenceNodes[i], sequenceNodes[j]);
      }
    }
    
    // assemble and save superstring to text file
    helpers.writeToFile('results.txt', helpers.assembleSuperstring(sequenceNodes));

  })
  .catch(e => {
    console.error(e.stack);
  });
}

shortestSuperstring();
