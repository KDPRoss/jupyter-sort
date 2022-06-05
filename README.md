# Jupyter-Notebook Cell Sorter

Problem: When editing a Jupyter notebook, it often makes
sense to work incrementally, editing cells
out-of-textual-order, which can leave the final notebook in
a state whereby it wouldn't run top-to-bottom.

Solution(ish(?)): This repo! It turns out that Jupyter
notebooks are just giant JSON blobs. Hacked this Node code
together after realising this (and being unable to find a
function in Jupyter Lab to do this out-of-the-box).

## What does this code do?

Reads a Jupyter `.ipynb` file, backs it up, sorts the cells
by `execution_count` (i.e., the last time when the cell was
run, according to Jupyter ... all sorts of corner cases
could make this wrong ... cells missing `execution_count`
are jammed at the end), and writes the notebook back out,
overwriting the notebook's file.

## How to use it?

- Grab the code.

- Run `npm install`.

- Run `node index.js {path-to-notebook}`.

- Enjoy winning at life ... or, at least, at using Jupyter.

- (Optional) If you have the notebook open in Jupyter, it
  will *not* automatically refresh after this; run the
  `Reload Notebook from Disk` function to get them in-synch.

## FAQ

- Is this code supported?

  - This code is absolutely, totally, and in all other ways
    unsupported. Use it at your risk; it's not my fault if
    it formats your machine, launches the nukes, or
    unleashes an AGI that destroys humanity (although, I'd
    be *incredibly* surprised if it did something other than
    re-ordering the cells in your notebook).

- Can I make my own Jupyter kernel for my favourite niche
  language?

  - You better believe you can; have a look at
  [metakernel](https://github.com/Calysto/metakernel): It's
  brilliant.

- Are Jupyter notebooks the best?

  - Probably not ... but they're certainly in the top 1% of
    goodness across all known everythings in the universe.
