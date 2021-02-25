"use strict";

// Print all entries, across all of the sources, in chronological order.

function sync_sorted_merge(logSources, printer) {
  // console.log(
  //   "---------------------------\nlogSources: \n",
  //   logSources,
  //   "\nend log sources\n---------------------------"
  // );
  // printer.print(logSources[0].last)
  let sorted = [];

	let early1 = Infinity;
	let early1Idx = null;
  while (true) {
    // iterate through logSources and identify the earliest and second earliest entries
    // we need to ensure that the logsource we use for our initial value
    let early2 = Infinity;
    let early2Idx = null;
		console.log(early1Idx, early2Idx)
    for (let i = 0; i < logSources.length; i++) {
      const source = logSources[i];
      // console.log(source.last.date, early1)
      // if the source is already drained then we don't care
      if (source.drained) {
        continue;
      } else if (source.last.date < early1) {
        early2 = early1;
        early2Idx = early1Idx;
        early1 = source.last.date;
        early1Idx = i;
      } else if (source.last.date < early2) {
        early2 = source.last.date;
        early2Idx = i;
      }
    }

    // NOTE: at this point, if early2Idx is null, then we only have one relevant entry and it will be added to sorted appropriately by the below while loop

    // our base case is that early1Idx remains as null, meaning that all sources are drained and we can now print our results
    // another way we could accomplish this is by splicing the source from logSources array as they are drained. Our base case would then be that logSources.length === 0. This is less efficient because it requires array.splice method (O(n))

    if (early1Idx !== null) {
      // we use early1 to begin adding to sorted
      const source = logSources[early1Idx];
      while (!source.drained && source.last.date < early2) {
        sorted.push(source.last);
				source.pop();
				console.log('hits')
			}
			// at this point we know that either the source is drained or it comes after source at early 2. In either case, we want to make early1 the old early2.
			// we let early 2 be reset at the top of our while loop

			// NOTE: right now we are refinding early1 and early2 in our first for loop
			// 	it is only necessary to do this on the first loop. From that point forward we only need to find our next early2 and early2idx. This is a mild optimization that I can implement later
			early1 = early2
			early1Idx = early2Idx
			console.log('hits2', early1Idx, early2Idx)
			continue
    } else {
      break;
    }
  }
  // this completes the required printing of sorted entries
  sorted.forEach((source) => printer.print(source));
  // performs a check on our solution's print order and gives an idea of efficiency
  printer.done();
  return console.log("Sync sort complete.");
}

module.exports = sync_sorted_merge;
