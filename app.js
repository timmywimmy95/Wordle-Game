$(() => {
  let counter = 0;
  let timerInterval;

  const categories = {
    news: ['today'],
    coffee: ['grind', 'latte', 'mocha'],
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
    $('.timer').remove();
    const body = $('body');
    $('header').append(
      `<h1 id="title"class="animate__animated animate__slideInDown">Wrodle</h1>`
    );

    body.append(
      "<div class='start-page animate__animated animate__fadeIn' id='start-page'>Choose a Category</div>"
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
      let counter = 0;
      const clock = () => {
        counter++;
        let min = Math.floor(counter / 60);
        let sec = counter % 60;
        let minDOM = $('.mins');
        let secDom = $('.secs');

        //seconds less than 10, min less than 10
        if (counter % 60 < 10 && min < 10) {
          secDom.text(`0${sec}`);
          minDOM.text(`0${min}`);
          console.log(min, sec, 'case 1');
        }
        // seconds more than 9, min less than 10
        else if (counter % 60 > 9 && min < 10) {
          secDom.text(`${sec}`);
          minDOM.text(`0${min}`);
          console.log(min, sec, 'case 2');
        }
        // seconds more than 9, min is more than 9
        else if (counter % 60 > 9 && min > 9) {
          secDom.text(`${sec}`);
          minDOM.text(`${min}`);
          console.log(min, sec, 'case 3');
        }
        // seconds less than 10, min is more than 9
        else if (counter % 60 < 10 && min > 9) {
          secDom.text(`0${sec}`);
          minDOM.text(`${min}`);
          console.log(min, sec, 'case 4');
        }
      };

      timerInterval = setInterval(clock, 1000);
      // Empty out page
      $('#start-page').remove();
      // Remove Wordle Title
      $('#title').remove();
      // Replace Timer @ Wordle Title Position

      let timer = $(
        `<h2 class="animate__animated animate__slideInDown timer"><span class="mins">00</span>:<span class="secs">00</span></h2>`
      );
      $('#title').remove();
      $('header').append(timer);

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
            $(`#${index}.letter[data-state='active']`)
              .toggleClass('correct')
              .addClass('animate__animated animate__flipInX');
          }
          // wrong position correct letter
          else if (answer.includes(letter)) {
            $(`#${index}.letter[data-state='active']`)
              .toggleClass('half-correct')
              .addClass('animate__animated animate__flipInX');
          }
          // wrong position wrong letter
          else {
            $(`#${index}.letter[data-state='active']`)
              .toggleClass('wrong')
              .addClass('animate__animated animate__flipInX');
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
          clearInterval(timerInterval);
          setTimeout(() => {
            startPage(categories);
          }, 3000);
          document.removeEventListener('keydown', keyPressed);
        } else if (attempt === 6 && userWin === false) {
          board.append("<h2 class='start-page'>Try again tomorrow!</h2>");
          clearInterval(timerInterval);
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
          userGuess.splice(lastIndex, 1, e.key);
          let letterDiv = $(`#${lastIndex}.letter[data-state='active']`);
          letterDiv.addClass('animate__animated animate__headShake');
          letterDiv.text(e.key);
          userGuess.push('');
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
