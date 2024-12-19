export class Heap  {

    // Construct Heap with comparator
    constructor (compare = (a, b) => a - b)  {
        this.heap = []; 
        this.compare = compare; 
    }

    parent(index) {
        return Math.floor((index-1)/2); 
    }

    leftChild(index) {
        return 2 * index + 1; 
    }

    rightChild(index) {
        return 2 * index + 2; 
    }
    size() {
        return this.heap.length; 
    }

    isEmpty()  {
       return this.size() === 0; 
    }

    peek() {
        if (this.heap.length === 0) {
            throw new Error("heap is empty");
        } 
        return this.heap[0]; 
    }

    swap (i, j) {
        if (i < 0 || j < 0 || i >= this.heap.length || j >= this.heap.length) {
            throw new Error("one or more index is out of bounds")
        } 
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    add(value) {
        this.heap.push(value); 
        this.moveUp(this.heap.length - 1); 
    }

    // helper function for add: recursively move up index
    moveUp(index) {
        const parentIndex = this.parent(index); 
        if (index > 0 && this.compare(this.heap[index], this.heap[parentIndex]) <= 0) {
             this.swap(index, parentIndex); 
             this.moveUp(parentIndex); 
        }
    }

    remove() {
       if (this.isEmpty()) {
        throw new Error("list is empty")
       } 

       const firstElem = this.heap[0]; 
       this.heap[0] = this.heap[this.heap.length-1]; 
       this.heap.pop(); 
       this.moveDown(0); 
       return firstElem; 
    }

    // helper function for remove: recursively move down index
    moveDown(index) {
        const leftIndex = this.leftChild(index);
        const rightIndex = this.rightChild(index);
        if (leftIndex < this.heap.length && rightIndex >= this.heap.length 
            && this.compare(this.heap[index], this.heap[leftIndex]) > 0) {
                // Case 1: there is only a left child
                this.swap(index, leftIndex); 
                this.moveDown(leftIndex);
        } else if (leftIndex < this.heap.length && rightIndex < this.heap.length) {
            if (this.compare(this.heap[leftIndex], this.heap[rightIndex]) < 0 
                && this.compare(this.heap[index], this.heap[leftIndex]) > 0) {
                    // Case 2: left child is smaller and parent is greater 
                    this.swap(index, leftIndex); 
                    this.moveDown(leftIndex); 
            } else if (this.compare(this.heap[leftIndex], this.heap[rightIndex]) >= 0 
                && this.compare(this.heap[index], this.heap[rightIndex]) > 0) {
                    // Case 3: right childer is smaller and parent is greater 
                    this.swap(index, rightIndex); 
                    this.moveDown(rightIndex); 
            }
        }
    }


}