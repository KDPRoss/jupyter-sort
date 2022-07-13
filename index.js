// @ts-check
const _ = require('lodash');
const fs = require('fs-extra');

// Some constants; could make configurable; meh.
const backupQ = true;
const backupSuffix = '-backup';

const fail = (s) => {
  console.error(s);
  process.exit(1);
};

// Could do this with a `reduce`, but I think that this is
// more clear.
const groupCells = (cells) => {
  const numberedGroups = [];
  const unnumbered = [];
  let cur = [];

  cells.forEach((c) => {
    cur.push(c);

    if ('code' === c.cell_type) {
      if (c.execution_count) {
        numberedGroups.push([c.execution_count, cur]);
      } else {
        unnumbered.push(...cur);
      }

      cur = [];
    }
  });

  unnumbered.push(...cur);

  return [ numberedGroups, unnumbered ];
};

const main = () => {
  [
    '/----------------------------------------------------\\',
    '|                                                    |',
    "| Welcome to K.D.P.'s Hacky Jupyter-Notebook Sorter! |",
    '|                                                    |',
    '\\----------------------------------------------------/\t',
  ].forEach((s) => console.log(s));

  if (3 !== process.argv.length) {
    fail(`Need exactly 3 arguments; received ${process.argv.length}.`);
  }

  try {
    const f = process.argv[ 2 ];
    console.log(`Processing '${f}' ...`);

    const nbString = fs.readFileSync(f).toString();
    console.log('  Read notebook file.');

    if (backupQ) {
      const backupFilename = `${f}${backupSuffix}`;

      fs.writeFileSync(backupFilename, nbString);
      console.log(`  Wrote backup to '${backupFilename}'.`);
    }

    // Cells very well may be missing an `execution_count`;
    // not much we can do about this: Partition those out
    // and shove them (in stable order) at the end.
    const nb = JSON.parse(nbString);

    const [ numbered, unnumbered ] = groupCells(nb.cells);
    const cells = [
      ..._.flatten(_.sortBy(numbered, ([ pos ]) => pos).map(([ _, cell ]) => cell)),
      ...unnumbered
    ];

    const nbOut = {
      ...nb,
      cells,
    };
    console.log(`  Sorted ${numbered.length} cells; ${cells.length} total output cells.`);

    fs.writeFileSync(f, JSON.stringify(nbOut));
    console.log(`  Wrote output to ${f}.`);

    console.log('\nHave a nice day! :~}');
  } catch (e) {
    fail(`FAIL: '${e}'`);
  }
};

main();
