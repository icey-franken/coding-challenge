"use strict";

// Print all entries, across all of the sources, in chronological order.

function sync_sorted_merge(logSources, printer) {
  // sort initial logSources array from earliest to latest
  logSources.sort((a, b) => (a.last.date > b.last.date ? 1 : -1));
  const len = logSources.length;
  let i = 0;
  // iterate through the sorted logSources array
  while (i < len) {
    // the first entry at logSources[i] is guaranteed to always be our earliest entry
    const source = logSources[i];
    // conditionally define cutoff date to handle case where logSources[i+1] is undefined
    const cutoff_date = i + 1 < len ? logSources[i + 1].last.date : Infinity;
    // we print and pop each entry from the current source until the source is drained or the source's entry date is greater than the cutoff date
    while (!source.drained && source.last.date <= cutoff_date) {
      printer.print(source.last);
      source.pop();
    }
    // if a source is drained, move on to the next source in logSources by incrementing i
    // otherwise we need to "resort" logSources (swap source at i with source at i + 1 until order is restored) and repeat outer while loop with same i
    source.drained ? i++ : resortLogSources(logSources, i);
	}

  printer.done();
  return console.log("Sync sort complete.");
}

// a "bubble sort" for a single value (at index i) out of place in an otherwise sorted array
function resortLogSources(logSources, i) {
  let j = i;
  while (
    j < logSources.length - 1 &&
    logSources[j + 1].last.date < logSources[j].last.date
  ) {
    const temp = logSources[j];
    logSources[j] = logSources[j + 1];
    logSources[j + 1] = temp;
    j++;
  }
}

module.exports = sync_sorted_merge;
