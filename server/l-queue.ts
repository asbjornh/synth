// Adapted from https://github.com/hungntit/lqueue
class LQueue<T> {
  head: Node<T> | null;
  tail: Node<T> | null;
  length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  enqueue(data: T) {
    var tmp = new Node(data);
    tmp.data = data;
    tmp.next = null;
    this.length++;
    if (this.head == null) {
      this.tail = this.head = tmp;
      return;
    }
    // @ts-ignore
    this.tail.next = tmp;
    // @ts-ignore
    this.tail = this.tail.next;
  }

  enqueueAll(list: T[]) {
    for (var i = 0; i < list.length; i++) {
      this.enqueue(list[i]);
    }
  }

  dequeue() {
    if (this.head == null) {
      return null;
    }
    this.length--;
    var data = this.head.data;
    var tmp = this.head;
    this.head = this.head.next;
    if (this.head == null) {
      this.tail = null;
    }
    tmp.next = null;
    return data;
  }

  dequeueAll(fn: (data: T | null) => void) {
    while (this.head != null) {
      fn(this.dequeue());
    }
  }

  first() {
    if (this.head != null) {
      return this.head.data;
    }
    return null;
  }

  last() {
    if (this.tail != null) {
      return this.tail.data;
    }
    return null;
  }

  isEmpty() {
    return this.length === 0;
  }

  clear() {
    if (this.head == null) return;
    var tmp = null;
    while (this.head != null) {
      tmp = this.head;
      this.head = this.head.next;
      tmp.next = null;
      this.length--;
    }
    this.tail = null;
  }

  forEach(fn: (data: T | null) => void) {
    let tmp = this.head;
    while (tmp != null) {
      fn(tmp.data);
      tmp = tmp.next;
    }
  }
}

class Node<T> {
  data: T;
  next: Node<T> | null;
  constructor(data: T) {
    this.data = data;
    this.next = null;
  }
}

export { LQueue };
