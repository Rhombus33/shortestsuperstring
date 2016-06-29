// Node class to help sort sequences into a linkedlist 
class Node {
  constructor(value) {
	  this.value = value;
	  this.isHead = true;
	  this.next = null;
  }
}

module.exports = Node;
