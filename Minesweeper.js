function IamBored() {
    NewGame();
  if (!window.game.populated) {
    NewGame();
    requestuncover(0); // Triger AJAX, we must wait the populate
    
    const wait = setInterval(() => {
      if (window.game.populated) {
        clearInterval(wait);
        solveGame();
      }
    }, 100);
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
  console.log("Such a lazy person...");
}