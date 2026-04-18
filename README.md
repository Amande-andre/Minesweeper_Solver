# 💣 IamBored — Minesweeper cheat script for démineur.eu

A browser console script to automatically reveal all safe cells on [démineur.eu](https://xn--dmineur-bya.eu/).

---

## 🚀 Quick start

1. Open [démineur.eu](https://xn--dmineur-bya.eu/) in your browser
2. Open the console (`F12` → **Console** tab)
3. Paste the script below and hit `Enter`

---

## 📋 Full script

```js
function IamBored() {
  if (!window.game.populated) {
    NewGame();
    requestuncover(0); // triggers field generation (AJAX call)

    const wait = setInterval(() => {
      if (window.game.populated) {
        clearInterval(wait);
        solveGame();
      }
    }, 100); // checks every 100ms until the field is ready
  } else {
    solveGame();
  }
}

function solveGame() {
  const field = window.game.field;
  const f = window.game.f;
  for (let i = 0; i < f; i++) {
    if (field[i] !== -1) {
      uncover(i);
    }
  }
  console.log("✅ Board solved!");
}

IamBored();
```

---

## 🔁 Use cases

### Game already in progress
Just run `IamBored()` in the console. The script detects the field is already populated and solves it immediately.

### After a page refresh / new page load
The script detects the field is empty (`populated == false`), calls `NewGame()` + `requestuncover(0)` to trigger server-side generation, then waits until the field is ready before solving.

### Brand new game (no click yet)
Same behaviour as after a refresh — the script handles everything automatically.

---

## 🛠️ Manual reveal (single cell)

If you want to play manually but cheat on a specific cell:

```js
// Reveal a cell by its index (left to right, top to bottom, starting at 0)
requestuncover(index);

// Examples:
requestuncover(0);   // top-left cell
requestuncover(80);  // bottom-right cell (9x9 grid)

// Convert (col, row) coordinates to index:
requestuncover(row * window.game.x + col);
```

---

## 🧠 How it works

| Variable | Role |
|---|---|
| `window.game.field` | The real board: `-1` = mine, `0` = empty, `1-8` = number |
| `window.game.state` | What the player sees: `-3` = hidden, `-2` = revealed mine, else = visible value |
| `window.game.populated` | `true` once mines have been placed (after the first click) |
| `window.game.f` | Total number of cells |
| `window.game.m` | Number of mines |

| Native function | Role |
|---|---|
| `NewGame()` | Resets the state, reinitializes the game |
| `requestuncover(index)` | Handles a cell click (generates field if needed, then reveals) |
| `uncover(index)` | Reveals a cell + cascades on empty neighbors + triggers win/loss |
| `CreateField(index)` | Randomly places mines while keeping the given index safe |

---

## ⚠️ Notes

- The field is generated **server-side** (`options.gen == 3`) via an AJAX call to `mbg1.cgi` — that's why the script waits for the response before solving.
- `uncover()` triggers the full game logic: cascade on empty cells, `GameLost()` on a mine, `GameWon()` when all safe cells are revealed.
- The `cheated` flag in `window.game` may be set to `true` in certain cases — your stats might not be saved.
