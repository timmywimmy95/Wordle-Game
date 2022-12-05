$(() => {
  const categories = {
    news: ['today'],
    coffee: ['grind', 'water', 'steam'],
    random: ['watch', 'spray'],
  };
  //Randomises the word chosen after category is selected (clicked by user)
  const wordRandomizer = (arr) => {
    let rand = Math.floor(Math.random() * arr.length);
    return arr[rand].toUpperCase();
  };

  //Creating First Page
  const startPage = (categories) => {
    $('.board').remove();
    const body = $('body');

    body.append(
      "<div class='start-page' id='start-page'>Choose a Category</div>"
    );

    //Create Game Category List
    for (const [category, words] of Object.entries(categories)) {
      $('#start-page').append(
        $(
          `<div class="start-page category">${
            category[0].toUpperCase() + category.slice(1).toLowerCase()
          }</div>`
        )
      );
    }
    $('.category').click((e) => {
      e.preventDefault();
      let categorySelected = e.currentTarget.innerText;
      let arr = categories[categorySelected.toLowerCase()];
      let word = wordRandomizer(arr);

      // Empty out page
      $('#start-page').remove();

      // Show game board with hidden selected word
      const body = $('body');
      let board = $(`<div class="board"></div>`);
      body.append(board);

      board.append($("<div data-state='active' class='guess'></div>"));
      let guess = $(".guess[data-state='active']");

      word.split('').forEach((letter, i) => {
        guess.append(`<div data-state='active' class=letter id=${i}></div>`);
      });
      userTyping(word);
      // userSubmit();
    });
  };

  //All typing functions (backspace, enter, listening for keyboard press)
  const userTyping = (word) => {
    let userGuess = [''];
    let userWin = false;
    let attempt = 0;
    let triesLeft = 6;
    let board = $('.board');
    console.log(word);
    document.addEventListener('keydown', keyPressed);

    function backspace(e) {
      if (JSON.stringify([userGuess[0]]) === JSON.stringify([''])) {
        return;
      }
      if (e.key === 'Backspace') {
        let lastIndex = userGuess.length - 2;
        userGuess.splice(lastIndex, 1);
        console.log(userGuess);
        let letterDiv = $(`#${lastIndex}.letter[data-state='active']`);
        letterDiv.text('');
        return;
      }
    }
    function enter(e) {
      if (e.key === 'Enter') {
        let userAnswer = userGuess.slice(0, 5);
        let answer = word.toLowerCase().split('');

        userAnswer.forEach((letter, index) => {
          // correct position & letter
          if (letter === answer[index]) {
            $(`#${index}.letter[data-state='active']`).toggleClass('correct');
          }
          // wrong position correct letter
          else if (answer.includes(letter)) {
            $(`#${index}.letter[data-state='active']`).toggleClass(
              'half-correct'
            );
          }
          // wrong position wrong letter
          else {
            $(`#${index}.letter[data-state='active']`).toggleClass('wrong');
          }
        });

        let currentDiv = $(".guess[data-state='active']");
        currentDiv.attr('data-state', 'disabled');
        currentDiv.find('.letter').attr('data-state', 'disabled');
        attempt += 1;
        triesLeft -= 1;

        //Check if user's submitted answer and correct answer is the same.
        if (JSON.stringify(userAnswer) === JSON.stringify(answer)) {
          userWin = true;
        } else {
          userWin = false;
        }

        if (attempt < 6 && userWin === false) {
          board.append(
            $(`<div data-state='active' class='guess' id=${attempt}></div>`)
          );

          let guess = $(`.board div:last`);
          word.split('').forEach((letter, i) => {
            guess.append(
              `<div data-state='active' class=letter id=${i}></div>`
            );
          });
        }

        //Check for win or lose scenario
        if (attempt < 6 && userWin === true) {
          board.append("<h2 class='start-page'>You scored a point today!</h2>");
          setTimeout(() => {
            startPage(categories);
          }, 3000);
          document.removeEventListener('keydown', keyPressed);
        } else if (attempt === 6 && userWin === false) {
          board.append("<h2 class='start-page'>Try again tomorrow!</h2>");
          setTimeout(() => {
            startPage(categories);
          }, 3000);
          document.removeEventListener('keydown', keyPressed);
        }
        //Empties out temporary array that stores user's typed guess (dynamic) & user's submitted answer
        userGuess = [''];
        userAnswer = [''];
      }
    }
    function newLetter(e) {
      if (userGuess.length < 6) {
        // add in a new letter, splice in the last value instead of push
        let lastIndex = userGuess.length - 1;
        let az = /^[a-z]$/;
        if (az.test(e.key)) {
          console.log(e.key);
          userGuess.splice(lastIndex, 1, e.key);
          let letterDiv = $(`#${lastIndex}.letter[data-state='active']`);
          letterDiv.text(e.key);
          userGuess.push('');
          console.log(userGuess);
        }
      }
    }
    function keyPressed(e) {
      newLetter(e);
      backspace(e);
      enter(e);
    }
  };

  startPage(categories);
});
