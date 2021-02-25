"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

async function asyncSortedMerge(logSources, printer) {
  // sort initial logSources array from earliest to latest
  logSources.sort((a, b) => (a.last.date > b.last.date ? 1 : -1));
  const len = logSources.length;
  let i = 0;
  // iterate from 0 to length - 1.
  // NOTE: we go to length -1 because at the last entry we can just fill our sorted array (there is nothing to compare to)
  while (i < len) {
    // the first entry at logSources[i] is guaranteed to always be our earliest entry
    const source = logSources[i];
    // conditionally define our cutoff date to handle the case where logSources[i+1] is undefined
    const cutoff_date = i + 1 < len ? logSources[i + 1].last.date : Infinity;
    // we print each entry from the current source until the source is drained or the source date is greater than the cutoff date (defined by date at logSources[i+1])
    while (!source.drained && source.last.date <= cutoff_date) {
      // print earliest entry
      printer.print(source.last);
      // call the pop method to move to the next entry in source
      await source.popAsync();
    }

    // if a source is drained, then we can move on to the next source in logSources by incrementing i
    // 	in this way we move past drained sources as they no longer matter
    // otherwise if a source is not drained, then we need to "resort" logSources
    // 	swap source at i with source at i + 1 until order is restored
    source.drained ? i++ : resortLogSources(logSources, i);
  }
  printer.done();

  return new Promise((resolve, reject) => {
    resolve(console.log("Async sort complete."));
  });
}

// a "bubble sort" for a single value (at index i) out of place in an otherwise sorted array
function resortLogSources(logSources, i) {
  let j = i;
  while (
    j < logSources.length - 1 &&
    logSources[j + 1].last.date < logSources[j].last.date
  ) {
    swap(logSources, j, j + 1);
    j++;
  }
}

function swap(logSources, idx1, idx2) {
  const temp = logSources[idx1];
  logSources[idx1] = logSources[idx2];
  logSources[idx2] = temp;
}

module.exports = asyncSortedMerge;
