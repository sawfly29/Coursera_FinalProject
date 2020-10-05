(function () {
  let field = document.querySelector(".content");

  field.addEventListener("click", function (event) {
    rotateHandler(event);
    //.classList.add('chosen')
  });

  function rotateHandler(event) {
    let counter = 0,
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
      parentClassListArray.forEach((element) => {
        if (element == "chosen") {
          counter++;
        }
      });
      if (counter) {
        event.target.parentElement.classList.remove("chosen");
      } else {
        event.target.parentElement.classList.add("chosen");
      }
    }
  }
})();
