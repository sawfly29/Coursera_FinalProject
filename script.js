(function () {
  var classArray = [],//массив с классами
    clickCounter = [],
    openCounter = [];//счетчик нажатий
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
    constructor(time) {
      this.time = time;
    }
  }

  let field = document.querySelector(".content");
  let cards = Array.prototype.slice.call(document.querySelectorAll(".front"));

  (function () {
    //берем иконки и смешиваем их

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

    let iconArray = [];
    cards.forEach((card) => iconArray.push(card.innerHTML));

    let randomIconArr = shuffleArray(iconArray);

    for (i = 0; i < cards.length; i++) {
      cards[i].innerHTML = randomIconArr[i];
    }
  })();

  (function () {
    //массив с классами и привязкой по id к своему элементу. Это проще, чем привязка по классу, хотя можно выпендриться и работать с классами

    for (i = 0; i < cards.length; i++) {
      classArray.push(new Card(i));
    }
  })();

  field.addEventListener("click", function (event) {
    handler(event);
  });

  function handler(event) {
    
    let cardClassCounter = 0,
      parentClassListArray = Array.prototype.slice.call(
        event.target.parentElement.classList
      );
    //ниже: если нашли класс Кард, то продолжили обрабатывать карточку, если не нашли, то проходим мимо
    if (
      parentClassListArray.find(function (el) {
        if (el == "card") {
          return true;
        }
      })
    ) {
      if (//если открыт элемент, то выходим из функции
        Array.prototype.slice.call(event.target.classList).find(function (el) {
          if (el == "match") {
            return true;
          }
        })
      ) {
        return;
      }

      if (clickCounter.length == 2){
        classArray[clickCounter[0]].close();
        classArray[clickCounter[1]].close();
        resetClickCounter();
      }//если есть две открытые карточки на момент открытия третьей, то закрываем их

      parentClassListArray.forEach((element) => {
        if (element == "open") {
          cardClassCounter++;
        }
      });//обработка повторного нажатия на карточку, если открыта - закрываем, если нет - открываем и сверяем, есть ли открытые, и, если есть, то сравниваем их между собой далее
      if (cardClassCounter) {
        event.target.parentElement.classList.remove("open");
        resetClickCounter()
      } else {
        event.target.parentElement.classList.add("open");
        clickCounter.push(event.target.previousElementSibling.id);
        checkCards();
      }
    }
  }
  function resetClickCounter(){
            clickCounter = [];
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
        resetClickCounter()
      } else {
        classArray[clickCounter[0]].dismatch();
        classArray[clickCounter[1]].dismatch();
        //resetClickCounter()
      }
    }
  }
})();
