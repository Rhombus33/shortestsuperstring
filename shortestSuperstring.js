const promise = require("bluebird");
const fs = promise.promisifyAll(require("fs")); 

// read sequences from FASTA file and return them in an array contained in a promise
function readSequencesToArray() {
	const filePath = process.argv[2];
  return fs.readFileAsync(filePath, 'utf8').then(data => {
    // grab all substrings containing consecutive alphanumerical characters starting with "A"/"C"/"G"/"T"
    const sequences = data.replace(/\n/mg, '').match(/[GCTA](\w)+/gm);  

    return sequences;
	});
}

// given two nodes, find a valid overlap (if there is one) and connect them
function setDirectedEdge(node1, node2) {
  const halfOfGreatest = Math.max(node1.value.length, node2.value.length) / 2;
  const minOverlap = halfOfGreatest % 2 ? halfOfGreatest + 1 : Math.ceil(halfOfGreatest); // minimum overlap needed
  let overlap = Math.min(node1.value.length, node2.value.length); // maxium overlap possible
  let foundOverlap = false;
  
  // find largest overlap that is greater than half of the longest sequence
  // and set the node pointers to represent the directed overlap
  while (!foundOverlap && overlap >= minOverlap) {
    if (doesOverlap(node1.value, node2.value, overlap)){
      node1.next = {overlap: overlap, node: node2};
      node2.isHead = false;
      foundOverlap = true;
    } else if (doesOverlap(node2.value, node1.value, overlap)){
      node2.next = {overlap: overlap, node: node1};
      node1.isHead = false;
      foundOverlap = true;
    }
    overlap--;
  }
}

// returns if the end of str1 overlaps the beginning of str2 by length o
function doesOverlap(str1, str2, o) {
  return str1.substring(str1.length - o) === str2.substring(0, o);
}

// finds the beginning of the linkedlist and assembles the superstring
function assembleSuperstring(sequenceNodes) {
  let firstNode = null;
  let i = 0;
  let currNode = sequenceNodes[i];
  
  // find the beginning of the linked list
  // currNode should be set to first node at end of while loop
  while (firstNode === null) {
    if (currNode.isHead === true) {
      firstNode = currNode;
    } else {
      currNode = sequenceNodes[++i];
    }
  }

  // loop through the linkedlist to assemble the superstring
  let superString = firstNode.value;
  while (currNode.next) {
    superString += currNode.next.node.value.substring(currNode.next.overlap);
    currNode = currNode.next.node;
  }
  return superString;
}

// Node class to sort sequences into a linkedlist 
function Node(value) {
  this.value = value;
  this.isHead = true;
  this.next = null;
}
     
function shortestSuperstring() {
  readSequencesToArray().then(sequences => {
    // create a Node for each sequence in the array
    let sequenceNodes = sequences.map((sequence, index, array) => {
      return new Node(sequence);
    });

    // iterate over nodes and make connections
    for (let i = 0; i < sequenceNodes.length; i++) {
      for (let j = i + 1; j < sequenceNodes.length; j++) {
        setDirectedEdge(sequenceNodes[i], sequenceNodes[j]);
      }
    }
    
    // assemble and save superstring to text file
    fs.writeFileAsync("results.txt", assembleSuperstring(sequenceNodes)).then(() => {
      console.log("results of shortestSuperstring saved in results.txt!");
    })
    .catch(e => {
      console.error(e.stack);
    });

  })
  .catch(e => {
    console.error(e.stack);
  });
}

shortestSuperstring();
