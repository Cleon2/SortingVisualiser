"use strict";
//Variables
let barsArray = [];
const visContainer = document.querySelector("#visualiser-container");
const bar = visContainer.children;
const btnNewArray = document.querySelector(".btn-new-array");
const bigO = document.querySelectorAll(".big-O");
const bestSpan = document.querySelector(".best-span");
const avgSpan = document.querySelector(".average-span");
const worstSpan = document.querySelector(".worst-span");
const btnContainer = document.querySelector(".btn-container");
const btn = document.querySelectorAll(".btn");
const sortbtns = document.querySelectorAll(".btn-sort");
const btnBubbleSort = document.querySelector(".btn-bubble-sort");
const btnSelectionSort = document.querySelector(".btn-selection-sort");
const btnInsertionSort = document.querySelector(".btn-insertion-sort");
const btnShellSort = document.querySelector(".btn-shell-sort");
const btnHeapSort = document.querySelector(".btn-heap-sort");
const btnMergeSort = document.querySelector(".btn-merge-sort");
const btnQuickSort = document.querySelector(".btn-quick-sort");
const elementCount = document.querySelector(".element-count");
const sliderSpeed = document.getElementById("speedRange");
const sliderSize = document.getElementById("sizeRange");
//Setting Default Speeds
let speed = 0.75;
let time = 1 / 3;
let scanSpeed = 0.0667;
//size
let size = 20;
//Functions
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function insertBar(height, visContainer) {
  const barEl = document.createElement("div");
  if (size <= 170) {
    barEl.classList.add("bar");
  } else {
    barEl.classList.add("bar-small");
  }
  barEl.style.height = `${height * 1.5}px`;
  visContainer.appendChild(barEl);
}

function load() {
  for (const btn of sortbtns) {
    btn.disabled = true;
    btn.classList.add("inProgress");
  }
}

function timeComplexity(best, avg, worst) {
  for (const label of bigO) {
    label.textContent = "";
  }
  bestSpan.textContent = best;
  avgSpan.textContent = avg;
  worstSpan.textContent = worst;
}

function initialiseBars(barsArray) {
  for (let i = 0; i < size; i++) {
    const height = randomIntFromInterval(5, 200);
    barsArray.push(height);
    insertBar(height, visContainer);
  }
}

async function completeSort() {
  for (let i = 0; i < size; i++) {
    highlightBar(i, "orange");
    await wait(0.00001);
  }
  await wait(0.1);
  for (let i = 0; i < size; i++) {
    highlightBar(i, "rgb(101, 236, 223)");
  }
}

function extractSort(e) {
  const name = e.target.classList[2];
  let sortType = "";
  for (let i = 4; i < name.length; i++) {
    if (name[i] === "-") {
      break;
    }
    sortType += name[i];
  }
  return sortType;
}

//Helper functions
function exch(barsArray, el1, el2) {
  let temp = barsArray[el1];
  barsArray[el1] = barsArray[el2];
  barsArray[el2] = temp;
}

function swap(el1, el2) {
  const style1 = window.getComputedStyle(el1);
  const style2 = window.getComputedStyle(el2);

  const transform1 = style1.getPropertyValue("height");
  const transform2 = style2.getPropertyValue("height");

  el1.style.height = transform2;
  el2.style.height = transform1;
}

function highlightBar(i, colour) {
  bar[i].style.backgroundColor = colour;
}

function disableBtns() {
  sliderSize.disabled = true;
  btnNewArray.disabled = true;
  btnNewArray.classList.add("inProgress");
  for (const btn of sortbtns) {
    btn.disabled = true;
    btn.classList.add("inProgress");
  }
}

function enableBtns() {
  sliderSize.disabled = false;
  for (const button of btn) {
    button.disabled = false;
    button.classList.remove("inProgress");
  }
}

//async helper functions

function wait(seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
}

async function toggleHighlightBar(i, colour, time) {
  bar[i].style.backgroundColor = colour;
  await wait(time);
  bar[i].style.backgroundColor = "rgba(101, 236, 223)";
}

//Sorting functions

//Bubble sort
async function bubblesort(barsArray) {
  timeComplexity("O(n)", "θ(n^2)", "Ω(n^2)");
  disableBtns();
  let j;
  let n = barsArray.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (j = 0; j < n - i - 1; j++) {
      if (barsArray[j] > barsArray[j + 1]) {
        swapped = true;
        await Promise.all([
          toggleHighlightBar(j, "red", time),
          toggleHighlightBar(j + 1, "rgba(101, 236, 223, 0.4)", time),
        ]);
        exch(barsArray, j, j + 1);
        swap(bar[j], bar[j + 1]);
        await Promise.all([
          toggleHighlightBar(j, "rgba(101, 236, 223, 0.4)", time),
          toggleHighlightBar(j + 1, "red", time),
        ]);
      }
    }
    if (!swapped) break;
    await toggleHighlightBar(j, "green", time);
  }
  await completeSort();
  enableBtns();
}

//Selection sort
async function selectionsort(barsArray) {
  timeComplexity("O(n^2)", "θ(n^2)", "Ω(n^2)");
  disableBtns();
  for (let i = 0; i < barsArray.length; i++) {
    let min = i;
    //Set bar i to green
    highlightBar(min, "green");
    for (let j = i + 1; j < barsArray.length; j++) {
      //Highlight selected bar for 0.01 seconds
      await toggleHighlightBar(j, "rgba(101, 236, 223, 0.4)", scanSpeed);
      if (barsArray[j] < barsArray[min]) {
        if (min != i) {
          //Highlight the previous min bar except for bar i to neutral
          highlightBar(min, "rgba(101, 236, 223)");
        }
        min = j;
        //Highlight current min bar in red
        highlightBar(min, "red");
      }
    }
    exch(barsArray, i, min);
    swap(bar[i], bar[min]);
    //After swapping, temporarily swap colours between i and min to indicate swapping
    await Promise.all([
      toggleHighlightBar(min, "green", time),
      toggleHighlightBar(i, "red", time),
    ]);
  }
  await completeSort();
  enableBtns();
}

//InsertionSort
async function insertionsort(barsArray) {
  timeComplexity("O(n)", "θ(n^2)", "Ω(n^2)");
  disableBtns();
  let n = barsArray.length;
  let j;
  for (let i = 1; i < n; i++) {
    await toggleHighlightBar(i, "rgba(101, 236, 223, 0.4)", scanSpeed);
    for (j = i; j > 0 && barsArray[j] < barsArray[j - 1]; j--) {
      await Promise.all([
        toggleHighlightBar(j, "red", time),
        toggleHighlightBar(j - 1, "rgba(101, 236, 223, 0.4)", time),
      ]);
      exch(barsArray, j, j - 1);
      swap(bar[j], bar[j - 1]);
      await Promise.all([
        toggleHighlightBar(j, "rgba(101, 236, 223, 0.4)", time),
        toggleHighlightBar(j - 1, "red", time),
      ]);
    }
    await toggleHighlightBar(j, "green", time);
  }
  await completeSort();
  enableBtns();
}

//ShellSort
async function shellsort(barsArray) {
  disableBtns();
  timeComplexity(
    "O(n)",
    "Not conclusive",
    "Ω(n^3/2) for sequence 1/2(3^k - 1)"
  );
  let n = barsArray.length;
  let h = 1;
  let j;
  while (h < n / 3) {
    h = 3 * h + 1;
  }
  while (h >= 1) {
    for (let i = h; i < n; i++) {
      await toggleHighlightBar(i, "rgba(101, 236, 223, 0.4)", scanSpeed);
      for (j = i; j >= h && barsArray[j] < barsArray[j - h]; j -= h) {
        await Promise.all([
          toggleHighlightBar(j, "red", time),
          toggleHighlightBar(j - h, "green", time),
        ]);
        exch(barsArray, j, j - h);
        swap(bar[j], bar[j - h]);
        await Promise.all([
          toggleHighlightBar(j, "green", time),
          toggleHighlightBar(j - h, "red", time),
        ]);
      }
    }
    h = Math.floor(h / 3);
  }
  await completeSort();
  enableBtns();
}

//MergeSort

class merge {
  static aux;

  static async mergeSort(barsArray) {
    timeComplexity("O(n log(n))", "θ(n log(n))", "Ω(n log(n))");
    disableBtns();
    this.aux = new Array(barsArray.length);
    await this.sort(barsArray, 0, barsArray.length - 1);
    await completeSort();
    enableBtns();
  }

  static async sort(barsArray, lo, hi) {
    if (hi <= lo) {
      return;
    }
    let mid = lo + Math.floor((hi - lo) / 2);
    await this.sort(barsArray, lo, mid);
    await this.sort(barsArray, mid + 1, hi);
    await this.merge(barsArray, lo, mid, hi);
  }

  static async merge(barsArray, lo, mid, hi) {
    let i = lo;
    let j = mid + 1;
    let comparisons = [];
    for (let k = lo; k <= hi; k++) {
      this.aux[k] = barsArray[k];
      await toggleHighlightBar(k, "rgba(101, 236, 223, 0.4)", scanSpeed);
    }

    let left = i;
    let right = j;
    while (left <= mid) {
      comparisons.push(toggleHighlightBar(left++, "green", scanSpeed));
      if (right <= hi) {
        comparisons.push(toggleHighlightBar(right++, "red", scanSpeed));
      }
      await Promise.all(comparisons);
      comparisons = [];
    }

    await wait(time);

    for (let k = lo; k <= hi; k++) {
      let heightI = this.aux[i] * 1.5;
      let heightJ = this.aux[j] * 1.5;
      if (i > mid) {
        bar[k].style.height = `${heightJ}px`;
        barsArray[k] = this.aux[j++];
      } else if (j > hi) {
        bar[k].style.height = `${heightI}px`;
        barsArray[k] = this.aux[i++];
      } else if (this.aux[i] < this.aux[j]) {
        bar[k].style.height = `${heightI}px`;
        barsArray[k] = this.aux[i++];
      } else {
        bar[k].style.height = `${heightJ}px`;
        barsArray[k] = this.aux[j++];
      }
    }
  }
}

class heap {
  static async sort(barsArray) {
    timeComplexity("O(n log(n))", "θ(n log(n))", "Ω(n log(n))");
    disableBtns();
    let n = barsArray.length - 1;
    for (let k = Math.floor((n - 1) / 2); k >= 0; k--) {
      await this.sink(barsArray, k, n);
    }

    while (n > 0) {
      await Promise.all([
        toggleHighlightBar(0, "yellow", time),
        toggleHighlightBar(n, "green", time),
      ]);
      swap(bar[0], bar[n]);
      await Promise.all([
        toggleHighlightBar(0, "green", time),
        toggleHighlightBar(n, "yellow", time),
      ]);
      exch(barsArray, 0, n--);
      await this.sink(barsArray, 0, n);
    }
    completeSort();
    enableBtns();
  }

  static async sink(barsArray, k, n) {
    while (2 * k + 1 <= n) {
      let j = 2 * k + 1;
      if (j < n && barsArray[j] < barsArray[j + 1]) {
        j++;
      }
      if (barsArray[j] <= barsArray[k]) {
        break;
      }
      await Promise.all([
        toggleHighlightBar(k, "red", time),
        toggleHighlightBar(j, "green", time),
      ]);
      swap(bar[k], bar[j]);
      await Promise.all([
        toggleHighlightBar(k, "green", time),
        toggleHighlightBar(j, "red", time),
      ]);
      exch(barsArray, k, j);
      k = j;
    }
  }
}

class quick {
  static async quicksort(barsArray) {
    timeComplexity("O(n log(n))", "θ(n log(n))", "Ω(n^2)");
    disableBtns();
    await this.sort(barsArray, 0, barsArray.length - 1);
    await completeSort();
    enableBtns();
  }

  static async sort(barsArray, lo, hi) {
    if (hi <= lo) {
      return;
    }
    const pivot = await this.partition(barsArray, lo, hi);
    await this.sort(barsArray, lo, pivot - 1);
    await this.sort(barsArray, pivot + 1, hi);
  }

  static async partition(barsArray, lo, hi) {
    const pivot = barsArray[lo];
    let left = lo;
    let right = hi + 1;
    while (true) {
      highlightBar(lo, "yellow");
      while (barsArray[++left] < pivot) {
        //Animate the left scan
        await toggleHighlightBar(left, "rgba(101, 236, 223, 0.4)", scanSpeed);
        if (left === hi) {
          break;
        }
      }
      //Indicate that the left pointer has stopped at a number > pivot
      highlightBar(left, "green");
      while (barsArray[--right] > pivot) {
        //animate the right scan
        await toggleHighlightBar(right, "rgba(101, 236, 223, 0.4)", scanSpeed);
      }
      //Indicate that the left pointer has stopped at a number < pivot
      highlightBar(right, "red");
      if (left >= right) {
        highlightBar(left, "rgb(101, 236, 223)");
        highlightBar(right, "orange");
        //Pause before switch
        await wait(time);
        break;
      }
      //pause before switchW
      await wait(time);
      exch(barsArray, left, right);
      swap(bar[left], bar[right]);
      await Promise.all([
        toggleHighlightBar(left, "red", time),
        toggleHighlightBar(right, "green", time),
      ]);
    }
    //////////////////////////////////////////////////
    exch(barsArray, lo, right);
    swap(bar[lo], bar[right]);
    await Promise.all([
      toggleHighlightBar(lo, "orange", time),
      toggleHighlightBar(right, "yellow", time),
    ]);
    return right;
  }
}

//Events
load();
//Event listeners
sliderSpeed.oninput = function () {
  speed = this.value;
  time = 1 / speed - 1;
  scanSpeed = (1 / speed - 1) / 5;
  console.log(scanSpeed);
  console.log(time);
};

sliderSize.oninput = function () {
  enableBtns();
  size = this.value;
  elementCount.textContent = size;
  barsArray = [];
  visContainer.innerHTML = "";
  initialiseBars(barsArray);
  console.log(barsArray);
};
btnNewArray.addEventListener("click", function () {
  timeComplexity();
  enableBtns();
  barsArray = [];
  visContainer.innerHTML = "";
  initialiseBars(barsArray);
  elementCount.textContent = size;
});

btnContainer.addEventListener("click", function (e) {
  const sortName = extractSort(e) + "sort";
  if (sortName === "heapsort") {
    heap.sort(barsArray);
  } else if (sortName === "mergesort") {
    merge.mergeSort(barsArray);
  } else if (sortName === "quicksort") {
    quick.quicksort(barsArray);
  } else {
    window[sortName](barsArray);
  }
});
