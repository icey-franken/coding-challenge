"use strict";

// Print all entries, across all of the sources, in chronological order.

function sync_sorted_merge(logSources, printer) {
  let sorted = [];
  // sort initial logSources array from earliest to latest
  logSources.sort((a, b) => (a.last.date > b.last.date ? 1 : -1));
  // console.log(
  //   "---------------------------\nlogSources: \n",
  //   logSources,
  //   "\nend log sources\n---------------------------"
  // );
  let i = 0;
  // iterate from 0 to length - 1.
  // NOTE: we go to length -1 because at the last entry we can just fill our sorted array (there is nothing to compare to)
  while (i < logSources.length - 1) {
    // we know that logSources[i] is the earliest entry
    // we add entries from logSource[i] until its date is > logSource[i+1].last.date
    const source = logSources[i];
    const cutoff_date = logSources[i + 1].last.date;
    while (!source.drained && source.last.date <= cutoff_date) {
      // add earliest entry to sorted array
			// sorted.push(source.last);
			printer.print(source.last)
      // pop the added entry to get to the next entry for this source
      source.pop();
    }

    // if a source is drained, then we can move on to the next entry: i ++
    // 	in this way we move past drained sources as they no longer matter
    if (source.drained) {
      i++;
      // else if a source is not drained then we need to resort it - we do this with insertion.
      // 	iterate from j = i + 1 to logSources.length to find swap index
      // 	swap current source with source at swap index
      // 	in this case we do NOT increment i and instead we continue with same value of i
    } else {
      // resortLogSources(logSources, i)
      let j = i;
      // find swap index
      while (
        j < logSources.length - 1 &&
        logSources[j+1].last.date < source.last.date
      ) {
        j++;
			}
			// console.log(i, j)
      const temp = logSources[i];
      logSources[i] = logSources[j];
      logSources[j] = temp;
    }
  }
  // at this point (once we break out of main while loop) we know that the only remaining entries are all from the source at the end of logSources
  const lastSource = logSources[logSources.length - 1];
  while (!lastSource.drained) {
		// sorted.push(lastSource.last);
		printer.print(lastSource.last)
    lastSource.pop();
  }
  // this completes the required printing of sorted entries
  // sorted.forEach((source) => printer.print(source));
  // performs a check on our solution's print order and gives an idea of efficiency
  printer.done();
  return console.log("Sync sort complete.");
}

module.exports = sync_sorted_merge;
