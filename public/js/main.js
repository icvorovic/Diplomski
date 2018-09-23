function checkRequiredFields(form) {
  if (form.find('.required').filter(function () { return this.value === '' }).length > 0) {
    return false;
  }

  return true;
}

function initDatePicker() {
  $('.datepicker').datepicker({
    format: 'yyyy-mm-dd',
    yearRange: 1900,
    i18n: {
      months: [
        'Januar',
        'Februar',
        'Mart',
        'April',
        'Maj',
        'Jun',
        'Jul',
        'Avgust',
        'Septembar',
        'Oktobar',
        'Novembar',
        'Decembar'
      ],
      weekdays: [
        'Nedelja',
        'Ponedeljak',
        'Utorak',
        'Sreda',
        'Cetvrtak',
        'Petak',
        'Subota'
      ],
      weekdaysAbbrev: [
        'N', 'P', 'U', 'S', 'C', 'P', 'S'
      ]
    }
  });
}

function addPackageItem(element) {
  var html = $(element).parent().parent().clone();
  $(element).parent().parent().parent().append(html);
}

function removePackageItem(element) {
  $(element).parent().parent().remove();
}

function showErrorMessage(elementId, messageText) {
  $('#' + elementId).html('<i class="left material-icons">error</i>' + messageText);
  $('#' + elementId).show();
  setTimeout(function () {
    $('#' + elementId).fadeOut("slow");
  }, 3000);
}

function showSuccessMessage(elementId, messageText) {
  $('#' + elementId).html('<i class="left material-icons">error</i>' + messageText);
  $('#' + elementId).show();
  setTimeout(function () {
    $('#' + elementId).fadeOut("slow");
  }, 3000);
}

function sendFormRequest(formName, type, url, successMessage, failMessage) {
  var form = $('form[name="' + formName + '"]');
  var formData = new FormData(form[0]);

  if (!checkRequiredFields(form)) {
    showErrorMessage(formName + "ErrorMessage", "Popunite sva obavezna polja");
    return;
  }

  $.ajax({
    type: type,
    url: url,
    data: formData,
    processData: false,
    contentType: false,
    statusCode: {
      200: function (response) {
        if (response.redirect) {
          window.location = response.redirect;
        } else if (successMessage) {
          showSuccessMessage(formName + "SuccessMessage", successMessage);
        }
      },
      401: function (response) {
        showErrorMessage(formName + "ErrorMessage", failMessage);
      }
    },
  });
}

function login() {
  sendFormRequest("loginForm", "POST", "/login", null, "Neispravni kredencijali!");
}

function register() {
  var form = $('form[name="registrationForm"]');

  if (!checkRequiredFields(form)) {
    showErrorMessage("registrationFormErrorMessage", "Popunite sva obavezna polja");
    return;
  }

  var confirmationPassword = $('#registrationConfirmationPassword').val();
  var password = $('#registrationPassword').val();

  if (confirmationPassword !== password) {
    showErrorMessage("registrationFormErrorMessage", "Ponovljena sifra nije ista!");
    return;
  }

  var passwordLenght = password.length;
  var upperCaseLetters = 0;
  var lowerCaseLetters = 0;
  var numericSymbols = 0;
  var specialSymbols = 0;

  for (var i = 0; i < password.length; i++) {
    var passwordChar = password.charAt(i);
    if (passwordChar >= 'a' && passwordChar <= 'z') {
      lowerCaseLetters++;
    }
    if (passwordChar >= 'A' && passwordChar <= 'Z') {
      upperCaseLetters++;
    }
    if ("#@!.,*".indexOf(passwordChar) > -1) {
      specialSymbols++;
    }
    if (passwordChar >= '0' && passwordChar <= '9') {
      numericSymbols++;
    }
  }

  if (passwordLenght < 8 || passwordLenght > 12) {
    showErrorMessage("registrationFormErrorMessage", "Sifra mora da sadzi izmedju 8 i 12 karaktera!");
    return;
  }

  if (upperCaseLetters < 1) {
    showErrorMessage("registrationFormErrorMessage", "Sifra mora da sadzi barem 1 veliko slovo!");
    return;
  }

  if (lowerCaseLetters < 3) {
    showErrorMessage("registrationFormErrorMessage", "Sifra mora da sadzi barem 3 mala slova!");
    return;
  }

  if (numericSymbols < 1) {
    showErrorMessage("registrationFormErrorMessage", "Sifra mora da sadzi barem 1 numerik!");
    return;
  }

  if (specialSymbols < 1) {
    showErrorMessage("registrationFormErrorMessage", "Sifra mora da sadzi barem 1 specijalni znak(#@!.,*)!");
    return;
  }

  sendFormRequest("registrationForm", "POST", "/register", "Uspesno ste se registrovali!", "Registracija neuspesna!");
}

function changePassword() {
  sendFormRequest("changePasswordForm", "POST", "/change-password", "Uspesno ste promenili sifru!", "Neispravni kredencijali!");
}

function addMoneyContract() {
  sendFormRequest("addMoneyContractForm", "POST", "/add-money-contract", "Uspesno ste dodali ugovor!", "Neispravni podaci!");
}

function addDonateContract() {
  sendFormRequest("addDonateContractForm", "POST", "/add-donate-contract", "Uspesno ste dodali ugovor!", "Neispravni podaci!");
}

function addPackage() {
  sendFormRequest("addPackageForm", "POST", "/add-package-", "Uspesno ste dodali ugovor!", "Neispravni podaci!");
}

function addCompany() {
  sendFormRequest("createCompanyForm", "POST", "/create-company", "Uspesno ste dodali kompaniju!", "Neispravni podaci!");
}

function addAdvertisement() {
  sendFormRequest("addAdvertisementForm", "POST", "/add-company-advertisement", "Uspesno ste dodali oglas!", "Neispravni podaci!");
}

function addLecture() {
  sendFormRequest("addLectureForm", "POST", "/add-company-lecture", "Uspesno ste dodali predavanje!", "Neispravni podaci!");
}

function addLectureCsv() {
  sendFormRequest("addLectureCsvForm", "POST", "/add-company-lecture-csv", "Uspesno ste dodali predavanja!", "Izaberite odgovarajuci fajl!");
}

function addAdvertisementJson() {
  sendFormRequest("addAdvertisementJsonForm", "POST", "/add-company-advertisement-json", "Uspesno ste dodali oglase!", "Izaberite odgovarajuci fajl!");
}

function approveRegisterRequest(element, username) {
  changeUserStatus(username, 'ODOBREN');
  $(element).parent().parent().fadeOut("slow");
}

function declineRegisterRequest(element, username) {
  changeUserStatus(username, 'ODBIJEN');
  $(element).parent().parent().fadeOut("slow");
}

function changeUserStatus(username, state) {
  var url = '/update-user-status';

  $.ajax({
    type: "POST",
    url: url,
    data: {
      Username: username,
      RegistrationState: state
    }
  });
}

function searchCompany() {
  var form = $('form[name="searchCompanyForm"]');
  var url = '/search-company';

  $.ajax({
    type: "GET",
    url: url,
    data: form.serialize(), // serializes the form's elements.
    statusCode: {
      200: function (response) {
        $('#results').empty();
        var table =
          '<table class="highlight">' +
          '<thead>' +
          '<tr>' +
          '<th>Naziv kompanije</th>' +
          '<th>Detalji</th>' +
          '</tr>' +
          '</thead>' +
          '<tbody>';

        response.companyList.forEach(function (element) {
          table += '<tr><td>' + element.company.Name + '</td><td><a href="/company-info/' + element.company.PIB + '">Detalji</a><td></tr>';
        });
        table += '</tbody></table>';
        $('#results').append(table);

        var pagination = '<ul class="pagination">';
        var numberOfPages = Math.max(1, response.companyList.length / 20);

        for (var i = 0; i < numberOfPages; i++) {
          if (i == 0) {
            pagination += '<li class="active"><a href="#">1</a></li>'
          } else {
            pagination += '<li class="waves-effect"><a href="#">' + (i + 1) + '</a></li>';
          }
        }

        pagination += '</ul>';
        $('#results').append(pagination);
      },
    },
  });
}