const promise = require("bluebird");
const fs = promise.promisifyAll(require("fs")); 

// returns if the end of str1 overlaps the beginning of str2 by length o
function doesOverlap(str1, str2, o) {
  return str1.substring(str1.length - o) === str2.substring(0, o);
}

module.exports = {

  // read sequences from FASTA file and return them in an array contained in a promise
  readSequencesToArray : (testfilepath) => {
    const filePath = testfilepath ? testfilepath : process.argv[2];
    return fs.readFileAsync(filePath, 'utf8').then(data => {
      // return all sequences in an array
      return data.replace(/\n/mg, '').match(/[GCTA](\w)+/gm);  
    });
  },

  // given two nodes, find a valid overlap (if there is one) and connect them
  setDirectedEdge : (node1, node2) => {
    // length of the smaller sequence must be at least half + 1 of the longer one
    if (Math.max(node1.value.length, node2.value.length) / 2 > 
      Math.min(node1.value.length, node2.value.length)) {
      return;
    }

    const halfOfGreatest = Math.max(node1.value.length, node2.value.length) / 2;
    const minOverlap = halfOfGreatest % 2  === 0 ? halfOfGreatest + 1 : Math.ceil(halfOfGreatest); // minimum overlap needed
    let overlap = Math.min(node1.value.length, node2.value.length); // maxium overlap possible
    
    // find largest overlap that is longer than half of the longer sequence
    // and set the node pointers to represent the directed overlap
    while (overlap >= minOverlap) {
      if (doesOverlap(node1.value, node2.value, overlap)){
        node1.next = {overlap: overlap, node: node2};
        node2.isHead = false;
        return
      } else if (doesOverlap(node2.value, node1.value, overlap)){
        node2.next = {overlap: overlap, node: node1};
        node1.isHead = false;
        return
      }
      overlap--;
    }
  },

  // finds the beginning of the linkedlist and assembles the superstring
  assembleSuperstring : sequenceNodes => {
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
  },

  writeToFile : (location, text) => {
    return fs.writeFileAsync(location, text).then( () => {
      console.log("results of shortestSuperstring saved in results.txt!");
    });
  },

};
