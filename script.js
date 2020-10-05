function startGame() {
  let game = new Game();
  game.start();
}

class Card {
  constructor(id) {
    this.id = id;
  }
  match() {
    document.getElementById(this.id).classList.remove("dismatch");
    document.getElementById(this.id).classList.add("match");
  }
  close() {
    let element = document.getElementById(this.id);
    element.parentElement.classList.remove("open");
    element.classList.remove("dismatch");
  }
  dismatch() {
    let element = document.getElementById(this.id);
    element.classList.add("dismatch");
  }
  getValue() {
    return document.getElementById(this.id).innerHTML;
  }
}
class Game {
  constructor(name) {
    this.name = name;
  }
  start() {
    //берем иконки и смешиваем их
    let field = document.querySelector(".content"),
      cards = Array.prototype.slice.call(document.querySelectorAll(".front")),
      classArray = [], //массив с классами
      clickCounter = [], //счетчик кликов для открытия и закрытия карточек
      iconArray = [], //массив иконок
      pairsCounter = 0, //счетчик открытых пар
      time = 59, //время для игры
      timer = false, //таймер
      cardClassCounter = 0,
      eventListenerIsAdded = false,
      parentClassListArray = undefined,
      timerOnPage = document.querySelector(".timer"); //таймер на страницу
    document.querySelectorAll(".button").forEach((element) => {
      //навесили на кнопку рестарт игры
      element.onclick = restart;
    });

    randomIcons(); //запуск рандома иконок и листенер кнопки
    listener();
    function shuffleArray(array) {
      var currentIndex = array.length,
        temporaryValue,
        randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    function randomIcons() {
      cards.forEach((card) => iconArray.push(card.innerHTML));

      let randomIconArr = shuffleArray(iconArray);

      for (let i = 0; i < cards.length; i++) {
        cards[i].innerHTML = randomIconArr[i];
      }
      for (let i = 0; i < cards.length; i++) {
        classArray.push(new Card(i));
      }
    }

    function listener() {
      if (!eventListenerIsAdded) {
        field.addEventListener("click", function (event) {
          handler(event);
        });
      }
    }

    function handler(event) {
      if (!timer) {
        timer = setInterval(showTime, 1000);
      }
      parentClassListArray = Array.prototype.slice.call(
        event.target.parentElement.classList
      );//массив с классами у родительского элемента

      //ниже: если нашли класс Кард, то продолжили обрабатывать карточку, если не нашли, то проходим мимо
      if (
        parentClassListArray.find(function (el) {
          if (el == "card") {
            return true;
          }
        })
      ) {
        if (
          //если нажимаем на уже подощедший элемент, то ничего с ним не делаем
          Array.prototype.slice
            .call(event.target.classList)
            .find(function (el) {
              if (el == "match") {
                return true;
              }
            })
        ) {
          return;
        }

        if (clickCounter.length == 2) {
          classArray[clickCounter[0]].close();
          classArray[clickCounter[1]].close();
          resetClickCounter();
          //resetClickCounter(this);
        } //если есть две открытые карточки на момент открытия третьей, то закрываем их

        parentClassListArray.forEach((element) => {
          if (element == "open") {
            cardClassCounter++;
          }
        }); //обработка повторного нажатия на карточку, если открыта - закрываем, если нет - открываем и сверяем, есть ли открытые, и, если есть, то сравниваем их между собой далее
        if (cardClassCounter) {
          event.target.parentElement.classList.remove("open");
          resetClickCounter();
        } else {
          event.target.parentElement.classList.add("open");
          clickCounter.push(event.target.previousElementSibling.id);

          checkCards();
        }
      }
    }
    function resetClickCounter() {
      //заодно проверим, все ли пары совпали
      if (pairsCounter == iconArray.length / 2) {
        win();
      }
      clickCounter = [];
      cardClassCounter = 0;
    }

    function checkCards() {
      if (clickCounter.length <= 1) {
        return;
      }
      if (clickCounter.length == 2) {
        if (
          classArray[clickCounter[0]].getValue() ==
          classArray[clickCounter[1]].getValue()
        ) {
          classArray[clickCounter[0]].match();
          classArray[clickCounter[1]].match();
          pairsCounter++;
          resetClickCounter();
        } else {
          classArray[clickCounter[0]].dismatch();
          classArray[clickCounter[1]].dismatch();
          //resetClickCounter()
        }
      }
    }
    function win() {
      clearInterval(timer);
      document.querySelector(".winner").classList.add("active");
      //остановить таймер
    }
    function lose() {
      document.querySelector(".loser").classList.add("active");
    }

    function showTime() {
      var mins = Math.floor(time / 60);
      var secs = time - 60 * mins;

      if (time) {
        if (secs < 10) {
          time--;
          timerOnPage.innerHTML = "0" + mins + ":0" + secs;
        } else {
          time--;
          timerOnPage.innerHTML = "0" + mins + ":" + secs;
        }
      } else {
        timerOnPage.innerHTML = "00:00";
        clearInterval(timer);
        timer = false;
        lose();
      }
    }

    function restart() {
      document.querySelector(".loser").classList.remove("active");
      document.querySelector(".winner").classList.remove("active");
      // cards.forEach((card) => {
      //   card.classList.remove("match");
      //   card.classList.remove("dismatch");
      // });
      document
        .querySelectorAll(".open")
        .forEach((card) => card.classList.remove("open"));
      document
        .querySelectorAll(".match")
        .forEach((card) => card.classList.remove("match"));
      document
        .querySelectorAll(".dismatch")
        .forEach((card) => card.classList.remove("dismatch"));
      //а сейчас мы сбросим:
      timerOnPage.innerHTML = "01:00";
      (cardClassCounter = 0),
        (parentClassListArray = undefined),
        (classArray = []), //массив с классами
        (clickCounter = []), //счетчик кликов для открытия и закрытия карточек
        (iconArray = []), //массив иконок
        (pairsCounter = 0), //счетчик открытых пар
        (time = 59), //время для игры
        (timer = false), //таймер
        randomIcons();
    }
  }
}

startGame();
