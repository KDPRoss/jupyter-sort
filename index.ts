import * as _ from 'lodash';
import * as fs from 'fs-extra';

// Some constants; could make configurable; meh.
const backupQ = true;
const backupSuffix = '-backup';

const fail = (s: string): never => {
  console.error(s);
  process.exit(1);
};

interface Cell {
  cell_type: string;
  execution_count: number | undefined;
}

// Could do this with a `reduce`, but I think that this is
// more clear.
const groupCells = (cells: Array<Cell>): [Array<[number, Array<Cell>]>, Array<Cell>] => {
  const numberedGroups: Array<[number, Array<Cell>]> = [];
  const unnumbered: Array<Cell> = [];
  let cur: Array<Cell> = [];

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

const main = async () => {
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

    const nbString = await fs.readFile(f, 'utf-8');
    console.log('  Read notebook file.');

    if (backupQ) {
      const backupFilename = `${f}${backupSuffix}`;

      await fs.writeFile(backupFilename, nbString);
      console.log(`  Wrote backup to '${backupFilename}'.`);
    }

    const nb = JSON.parse(nbString);

    // Cells very well may be missing an `execution_count`;
    // not much we can do about this: Partition those out
    // and shove them (in stable order) at the end.
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

    await fs.writeFile(f, JSON.stringify(nbOut));
    console.log(`  Wrote output to ${f}.`);

    console.log('\nHave a nice day! :~}');
  } catch (e) {
    fail(`FAIL: '${e}'`);
  }
};

main();
