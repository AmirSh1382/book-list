let $ = document;

/////////////////////////////

// variabels ///////////////
const body = $.body;
const mainBody = $.querySelector(".mainBody");
const titleInput = $.querySelector(".titleInput");
const authorInput = $.querySelector(".authorInput");
const yearInput = $.querySelector(".yearInput");
const addBookBtn = $.querySelector(".addBookBtn");
const tipElem = $.querySelector(".tip")
const bookList = $.querySelector(".book-list");
const inputValidationAlert = $.querySelector(".inputValidationAlert");
const deleteModal = $.querySelector(".modalAlert");
const modalBookName = $.querySelector(".selesctedBookName");
const modalDiscardBtn = $.querySelector(".discard");
const modalDeleteBtn = $.querySelector(".delete");

let bookInfosArray = [];
let isFocusedOnInput = false;

// functions /////////////////
// to get user screen height every 0.1s
function liveUserScreenHeight() {
  let userScreenHeight = visualViewport.height + "px";
  body.style.minHeight = userScreenHeight;
}

// to validate users => if passed: go to next stage  else: show input validation alert
function inputsValidation() {
  if (titleInput.value.trim().length < 3) {
    inputAlertFadeIn("Title input", "most contain at least 3 characters");
  } else if (authorInput.value.trim().length < 3) {
    inputAlertFadeIn("Author input", "most contain at least 3 characters");
  } else if (yearInput.value.trim().length < 2){
    inputAlertFadeIn("Year input", "most contain at least 2 characters");
  } else if (isNaN(+yearInput.value)) {
    inputAlertFadeIn("Year input", "should only contain numbers");
  } else {
    let bookInfo = {
      id: bookInfosArray.length,
      title: titleInput.value,
      author: authorInput.value,
      year: yearInput.value,
    };

    bookInfosArray.push(bookInfo);

    setLocalStorage(bookInfosArray);
    bookInfoGenerator(bookInfosArray);

    tipElem.style.opacity = "1"
    titleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
    isFocusedOnInput = false;
  }
}

// to set the main books array on the local storage
function setLocalStorage(booksArray) {
  localStorage.setItem("bookInfos", JSON.stringify(booksArray));
}

// to create a book info template ,based on the books array and append it to dom
function bookInfoGenerator(booksArray) {
  bookList.innerHTML = "";

  booksArray.forEach(function (book) {
    let trElem = $.createElement("tr");
    let thElemforTitle = $.createElement("td");
    let thElemforAuthor = $.createElement("td");
    let thElemForYear = $.createElement("td");

    thElemforTitle.innerHTML = book.title;
    thElemforAuthor.innerHTML = book.author;
    thElemForYear.innerHTML = book.year;

    trElem.setAttribute(
      "onclick",
      "openModal(" + book.id + "," + JSON.stringify(book.title) + ")"
    );

    trElem.append(thElemforTitle);
    trElem.append(thElemforAuthor);
    trElem.append(thElemForYear);

    bookList.append(trElem);
  });
}

// to get book infos from local storage and update the dom based on it
function getLocalStorage() {
  let localStorageInfo = JSON.parse(localStorage.getItem("bookInfos"));

  if (localStorageInfo) {
    bookInfosArray = localStorageInfo;
  } else {
    bookInfosArray = [];
  }

  bookInfoGenerator(bookInfosArray);
}

// to focus on the next input by clicking on Enter button on the keyboard
function goToNextInput(event) {
  if (event.key === "Enter") {
    isFocusedOnInput = true;

    if (event.target === titleInput) {
      authorInput.focus();
    } else if (event.target === authorInput) {
      yearInput.focus();
    } else if (event.target === yearInput) {
      inputsValidation();
    }
  }
}

// if inputValidation fails , this fucntion will show the validation alert
function inputAlertFadeIn(InputName, AlertMassage) {
  let inputName = $.querySelector(".inputName");
  let alertMassage = $.querySelector(".alertMassage");

  inputName.innerHTML = InputName;
  alertMassage.innerHTML = AlertMassage;

  inputValidationAlert.style.display = "block";
  setTimeout(function () {
    inputValidationAlert.style.transform = "translateX(0)";
  }, 1);

  setTimeout(inputAlertFadeOut, 6000);
}

// and after 6s this fucntion will close the validation alert
function inputAlertFadeOut() {
  inputValidationAlert.style.transform = "translateX(-400px)";
  setTimeout(function () {
    inputValidationAlert.style.display = "none";
  }, 700);
}

// this will open the delete momdal by clicking on a book info from dom
function openModal(bookId, bookTitle) {
  mainBody.style.filter = "blur(5px)";
  deleteModal.style.top = "40px";

  modalBookName.innerHTML = bookTitle;
  
  modalDeleteBtn.setAttribute("onclick", "deleteAction(" + bookId + ")");
}

// and then by clicking on discard btn this will close the modal
function closeModal() {
  mainBody.style.filter = "blur(0px)";
  deleteModal.style.top = "-300px";
}

// by clicking on the delete btn this fucntion will delete the selected book info from dom and local storage
function deleteAction(bookId) {
  let deletedBookIndex = bookInfosArray.findIndex(function (book) {
    return book.id === bookId;
  });

  bookInfosArray.splice(deletedBookIndex, 1);

  bookInfoGenerator(bookInfosArray);
  setLocalStorage(bookInfosArray);

  closeModal();
}

// event listeners //////////////
setInterval(liveUserScreenHeight, 100);
window.addEventListener("load", getLocalStorage);
addBookBtn.addEventListener("click", inputsValidation);
modalDiscardBtn.addEventListener("click", closeModal);

window.addEventListener("keyup", function (event) {
  if (event.key === "Enter" && !isFocusedOnInput) {
    titleInput.focus();
    isFocusedOnInput = true;
  }
});
titleInput.addEventListener("keydown", goToNextInput);
authorInput.addEventListener("keydown", goToNextInput);
yearInput.addEventListener("keydown", goToNextInput);