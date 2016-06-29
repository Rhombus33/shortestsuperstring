const helpers = require('./helpers.js');
const Node = require('./node_class.js');

function shortestSuperstring(testfilepath) {
  return helpers.readSequencesToArray(testfilepath).then(sequences => {   
    
    // return empty string if file is empty
    if (sequences === null) return '';

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
    // assemble superstring
    return helpers.assembleSuperstring(sequenceNodes);
  })
  .then(superstring => {

    // save superstring to text file
    return helpers.writeToFile('results.txt', superstring);

  })
  .catch(e => {
    console.error(e.stack);
  });
}

// if the script is not being run by a test, invoke the function immediately
if (module.parent === null) {
  shortestSuperstring();
}

module.exports = shortestSuperstring;
