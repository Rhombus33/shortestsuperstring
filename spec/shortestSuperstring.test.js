// require libraries
const assert = require('chai').assert;
const fs = require("fs");

// require functions to test
const Node = require('../src/node_class.js');
const helpers = require('../src/helpers.js');
const shortestSuperstring = require('../src/shortestSuperstring.js');

describe('Finding Shortest Superstring', () => {

  describe('Parsing FASTA', () => {

    it('should parse single-line sequences', done => {
      helpers.readSequencesToArray('./spec/test_text/three_singleline.txt').then(sequenceArray => {
        assert.equal(sequenceArray.length, 3);
        assert.equal(sequenceArray[0], "ATTAGACCTG");
        assert.equal(sequenceArray[1], "CCTGCCGGAA");
        assert.equal(sequenceArray[2], "AGACCTGCCG");
        done();
      });
    });

    it('should parse multi-line sequences', done => {
      helpers.readSequencesToArray('./spec/test_text/three_multiline.txt').then(sequenceArray => {
        assert.equal(sequenceArray.length, 3);
        assert.equal(sequenceArray[0], "ATTAGACCTG");
        assert.equal(sequenceArray[1], "CCTGCCGGAACCTGCCGGAA");
        assert.equal(sequenceArray[2], "AGACCTGCCGAGACCTGCCGAGACCTGCCG");
        done();
      });
    });

  });

  describe('Get directed edge', () => {

    let nodeA, nodeB, nodeC, nodeD;
    beforeEach(() => {
      nodeA = new Node("AAAAGGGGG");
      nodeB = new Node("GGGGGCCCC");
      nodeC = new Node("TTTTAAAAA");
      nodeD = new Node("AAGG"); 
    });

    it('should connect valid directed edge', () => {
      helpers.setDirectedEdge(nodeA, nodeB);
      assert.equal(nodeA.next.node, nodeB);
      assert.equal(nodeB.next, null);
    });

    it('should not connect non-overlapping edge', () => {
      helpers.setDirectedEdge(nodeB, nodeC);
      assert.equal(nodeB.next, null);
      assert.equal(nodeC.next, null);
    });

    it('should not connect overlapping edge that is too short', () => {
      helpers.setDirectedEdge(nodeC, nodeD);
      assert.equal(nodeC.next, null);
      assert.equal(nodeD.next, null);
    });

  });

  describe('Assemble superstring from linkedlist', () => {

    // create a valid linkedlist exmaple
    let nodeA, nodeB, nodeC, nodeD;
    nodeA = new Node("AAAAGGGGG");
    nodeB = new Node("GGGGGCCCC");
    nodeC = new Node("GCCCCAAAA");
    nodeD = new Node("CAAAATTTT");
    nodeA.next = {overlap: 5, node: nodeB};
    nodeB.next = {overlap: 5, node: nodeC};
    nodeB.isHead = false; 
    nodeC.next = {overlap: 5, node: nodeD};
    nodeC.isHead = false;
    nodeD.isHead = false;
    const sequenceNodes = [nodeA, nodeB, nodeA, nodeD];

    it('should assemble superstring', () => {
      const results = helpers.assembleSuperstring(sequenceNodes);
      assert.equal(results, 'AAAAGGGGGCCCCAAAATTTT');
    });

  });

  describe('Main function', () => {

    it('should return return an empty string for an empty data set', (done) => {
      shortestSuperstring('./spec/test_text/empty.txt').then(() => {
        const results = fs.readFileSync('results.txt', 'utf8');
        assert.equal(results, ''); 
        done();
      });
    });

    it('should return the correct superstring from a FASTA file (small set)', (done) => {
      shortestSuperstring('./spec/test_text/small_dataset.txt').then(() => {
        const results = fs.readFileSync('results.txt', 'utf8');
        assert.equal(results, 'AAAAGGGGGCCCCAAAATTTT'); 
        done();
      });
    });


    it('should return the correct superstring from a FASTA file (Rosalind data set)', (done) => {
      shortestSuperstring('./spec/test_text/rosalind_test_data1.txt').then(() => {
        const results = fs.readFileSync('results.txt', 'utf8');
        const correctSuperstring = fs.readFileSync('./spec/test_text/rosalind_test_result1.txt', 'utf8');
        assert.equal(results, correctSuperstring); 
        done();
      });
    });

  });

});