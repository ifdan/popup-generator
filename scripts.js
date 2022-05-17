/*
  Feature set:
  1. Your referenced pop up will initally be hidden when page loads.
  2. Set a delay for when to show to user in seconds.
  3. Set how often you want to show to a user in days.
  4. When pop up is showing, it adds a opaque background to the document with your referenced div in the center.
  5. When pop up is showing, the document will not be scrollable.
  6. A button with the class="close" in your referenced div with remove your pop up from the document.

  If your pop up contains a form, the added feature set is:
  7. A xmlhttprequest to sign up app for list submission.
  8. Dynamically references the list code and x-code set in the object args.
  9. Validate the email that is submitted to list.
  10. If email cannot pass validation, show an error in the email input field.
  11. If email passes validation, show a success message in place of the form. 
*/

// LiveContent initial constructor.
function LiveContent(args) {
  this.args = args;
}

// static identifiers.
LiveContent.prototype.body = document.getElementsByTagName('body')[0];
LiveContent.prototype.display = false;

// load live content dependent styles
LiveContent.prototype.loadStyles = function () {
  for (let sheet of document.styleSheets) {
    if (sheet.href === 'https://s3.amazonaws.com/cloudcollective/styles/liveContent/devLiveContent.css.gz') {
      return;
    }
  }
  let link = document.createElement('link');
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "https://s3.amazonaws.com/cloudcollective/styles/liveContent/devLiveContent.css.gz";
  document.head.appendChild(link);
}

// move your pop up from its current position to the end of the <body>. This handles creating a consistent overlay for the page.
LiveContent.prototype.movePosition = function (popUp) {
  if (this.body.lastElementChild !== popUp) {
    this.body.append(popUp);
  }
}

// Set the property "display" for your specific pop up to true or false and pass in the referenced pop up to explicitly show or hide your popup depending on your boolean. Useful for testing, used in the script for intial page load and to remove the pop up.
LiveContent.prototype.displayed = function (popUp) {
  if (this.display) {
    popUp.style.display = 'block';
    this.body.style.overflow = 'hidden';
  } else {
    popUp.classList.remove('reveal');
    setTimeout(() => {
      popUp.style.display = 'none';
      this.body.style.overflow = 'visible';
    }, 350);
  }
}

// show the pop up with your delay. Add dependent listeners.
LiveContent.prototype.execute = function (popUp, delay) {
  this.addListenerToCloseBtn(popUp, popUp.querySelectorAll('.close')[0]);
  this.addListenerToPopUp(popUp, popUp.querySelectorAll('.live-content-email')[0]);
  this.preventFormReload(popUp.getElementsByTagName('form')[0]);
  this.addListenerToEmailField(popUp.querySelectorAll('.live-content-email')[0]);
  this.addListenerToSubmitBtn(popUp, popUp.querySelectorAll('.live-content-list-submit')[0], popUp.querySelectorAll('.live-content-email')[0]);
  setTimeout(() => {
    popUp.style.display = 'block';
    this.body.style.overflow = 'hidden';
    this.display = true;
    setTimeout(() => {
      popUp.classList.add('reveal');
    }, 350);
  }, parseInt(delay) * 1000);
}

// next three methods are cookie functionality.
LiveContent.prototype.checkCookie = function (info) {
  let popUp = document.getElementsByClassName(info.popUpName)[0];
  if (typeof popUp !== 'undefined') {
    this.loadStyles();
    this.movePosition(popUp);
    let hasSeen = this.getCookie(info.popUpName);
    let daysToLive = info.showAgainInDays;
    if (!hasSeen) {
      this.setCookie(info.popUpName, "true", parseInt(daysToLive));
      this.displayed(popUp);
      this.execute(popUp, info.delayInSeconds);
    } else {
      this.display = false;
      this.displayed(popUp);
    }
  } else {
    console.error(`TO DEV: Add a value to your property "popUpName" and add the "popUpName" as a class for the div that has the id="live-content"`);
  }
}

LiveContent.prototype.getCookie = function (name) {
  let cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");
    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

LiveContent.prototype.setCookie = function (name, value, daysToLive) {
  let cookie = `${name}=${encodeURIComponent(value)}`;
  if (typeof daysToLive === "number") {
    cookie += `; max-age=${(daysToLive * 24 * 60 * 60)}`;
    document.cookie = cookie;
  }
}

// email validation.
LiveContent.prototype.validate = function (value) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(value).toLowerCase());
}

// create request.
LiveContent.prototype.setRequest = function (popUp, form, request, url) {
  let currentObject = this;
  request.open("POST", url, true);
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader("Content-Type", "application/json");
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      form.classList.add('temp');
      currentObject.showSuccess(form);
      setTimeout(() => {
        currentObject.display = false;
        currentObject.displayed(popUp);
        setTimeout(() => {
          popUp.remove();
        }, 350);
      }, 4000);
    }
  }
  return request;
}

// generate error in email field.
LiveContent.prototype.generateError = function (emailField, errorText) {
  if (!emailField.classList.contains('error')) {
    emailField.classList.add('error');
    let errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.appendChild(document.createElement('span'));
    errorElement.childNodes[0].innerText = errorText;
    emailField.nextElementSibling.insertAdjacentElement('afterend', errorElement);
  }
}

// show success message in place of form.
LiveContent.prototype.showSuccess = function (form) {
  setTimeout(() => {
    form.classList.remove('temp');
    form.innerHTML = "<p>Success! Check your email inbox for your free insights!</p>";
    form.classList.add('success-message');
  }, 500);
}

// listeners.
LiveContent.prototype.addListenerToCloseBtn = function (popUp, closeBtn) {
  let currentObject = this;
  if (typeof closeBtn !== 'undefined') {
    closeBtn.addEventListener('click', function () {
      currentObject.display = false;
      currentObject.displayed(popUp);
      setTimeout(() => {
        popUp.remove();
      }, 350);
    })
  } else {
    console.error(`TO DEV: Add a div with the class="close" inside pop up named ${currentObject.popUpName}.`);
  }
}

LiveContent.prototype.addListenerToPopUp = function (popUp, emailField) {
  if (typeof emailField !== 'undefined') {
    popUp.addEventListener('click', function () {
      if (emailField.classList.contains('error')) {
        emailField.classList.remove('error');
        document.querySelector('.error-message').remove();
      }
    });
  }
}

LiveContent.prototype.preventFormReload = function (form) {
  if (typeof form !== 'undefined') {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
    });
  }
}

LiveContent.prototype.addListenerToEmailField = function (emailField) {
  if (typeof emailField !== 'undefined') {
    emailField.addEventListener('focus', function (event) {
      if (event.target.classList.contains('error')) {
        event.target.classList.remove('error');
        document.querySelector('.error-message').remove();
      }
    });
  }
}

LiveContent.prototype.addListenerToSubmitBtn = function (popUp, submitBtn, emailField) {
  let currentObject = this;
  if (typeof submitBtn !== 'undefined') {
    submitBtn.addEventListener('click', function (event) {
      if (currentObject.validate(emailField.value)) {
        if (currentObject.args.listCode !== '' && currentObject.args.sourceId !== '') {
          submitBtn.innerHTML = "<img src=\"https://cloudcollective.s3.amazonaws.com/shareableAssets/images/assets/loading.gif\">";
          let request = currentObject.setRequest(popUp, popUp.getElementsByClassName('form-content')[0], new XMLHttpRequest(), "https://signupapp2.com/signupapp/signups/process");
          request.send(JSON.stringify({
            "signup": {
              "emailAddress": emailField.value,
              "listCode": currentObject.args.listCode,
              "sourceId": currentObject.args.sourceId
            }
          }));
        } else {
          currentObject.generateError(emailField, 'Please make a selection above.');
        }
      } else {
        currentObject.generateError(emailField, 'Please enter a valid email address.');
      }
      event.stopPropagation();
      event.preventDefault();
    });
  }
}

function LiveContentOptionSignUp(args) {
  LiveContent.call(this);
  this.args = args;
}

LiveContentOptionSignUp.prototype = Object.create(LiveContent.prototype);
LiveContentOptionSignUp.prototype.constructor = LiveContentOptionSignUp;

LiveContentOptionSignUp.prototype.addListenerToToggles = function (toggles) {
  let currentObject = this;
  let selectedIndex = [];

  function addIndex(array, index) {
    if (!array.includes(index)) {
      array.push(index)
    }
  }

  function removeIndex(array, index) {
    if (array.includes(index)) {
      let indexOfIndex = array.indexOf(index);
      array.splice(indexOfIndex, 1);
    }
  }

  function addRequestInfo(array) {
    if (array.includes(0) && array.length === 1) {
      currentObject.args.sourceId = 'X190X388';
      currentObject.args.listCode = 'BOLDPROF';
    } else if (array.includes(1) && array.length === 1) {
      currentObject.args.sourceId = 'X190X386';
      currentObject.args.listCode = 'WININVES';
    } else if (array.includes(2) && array.length === 1) {
      currentObject.args.sourceId = 'X190X385';
      currentObject.args.listCode = 'SOVINVES';
    } else if (array.includes(3) && array.length === 1) {
      currentObject.args.sourceId = 'X190X387';
      currentObject.args.listCode = 'BAUDAILY';
    } else if (array.includes(0) && array.includes(1) && array.length === 2) {
      currentObject.args.sourceId = 'X190X392';
      currentObject.args.listCode = 'BOLDPROF';
    } else if (array.includes(0) && array.includes(2) && array.length === 2) {
      currentObject.args.sourceId = 'X190Y393';
      currentObject.args.listCode = 'BOLDPROF';
    } else if (array.includes(0) && array.includes(3) && array.length === 2) {
      currentObject.args.sourceId = 'X190Y395';
      currentObject.args.listCode = 'BOLDPROF';
    } else if (array.includes(1) && array.includes(3) && array.length === 2) {
      currentObject.args.sourceId = 'X190X391';
      currentObject.args.listCode = 'BAUDAILY';
    } else if (array.includes(2) && array.includes(3) && array.length === 2) {
      currentObject.args.sourceId = 'X190X390';
      currentObject.args.listCode = 'BAUDAILY';
    } else if (array.includes(1) && array.includes(2) && array.length === 2) {
      currentObject.args.sourceId = 'X190X389';
      currentObject.args.listCode = 'WININVES';
    } else if (array.includes(0) && array.includes(1) && array.includes(2) && array.length === 3) {
      currentObject.args.sourceId = 'X190Y396';
      currentObject.args.listCode = 'BOLDPROF';
    } else if (array.includes(0) && array.includes(1) && array.includes(3) && array.length === 3) {
      currentObject.args.sourceId = 'X190Y398';
      currentObject.args.listCode = 'BOLDPROF';
    } else if (array.includes(0) && array.includes(2) && array.includes(3) && array.length === 3) {
      currentObject.args.sourceId = 'X190Y397';
      currentObject.args.listCode = 'BOLDPROF';
    } else if (array.includes(1) && array.includes(2) && array.includes(3) && array.length === 3) {
      currentObject.args.sourceId = 'X190Y385';
      currentObject.args.listCode = 'BAUDAILY';
    } else if (array.includes(0) && array.includes(1) && array.includes(2) && array.includes(3) && array.length === 4) {
      currentObject.args.sourceId = 'X190Y399';
      currentObject.args.listCode = 'BOLDPROF';
    } else if (array.length === 0) {
      currentObject.args.sourceId = '';
      currentObject.args.listCode = '';
    }
  }

  toggles.forEach(function (element, index) {
    element.addEventListener('click', function () {
      element.checked ? addIndex(selectedIndex, index) : removeIndex(selectedIndex, index);
      addRequestInfo(selectedIndex);
    })
  });
}