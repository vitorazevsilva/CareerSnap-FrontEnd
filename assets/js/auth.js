$(document).ready(() => {
    // **************************************************
    // *******         Local Variables            *******
    // **************************************************

    let passwordStrength, countryNames, countryCodes;
    let data = {}
    let recoveryClick = false;


    // **************************************************
    // *******          Initial Actions           *******
    // **************************************************

    if (_Token) throw window.location.replace("./home.html");

    //#######################################################

    switch (window.location.hash) {
        case '#signup':
            $('#signin-div').fadeOut('fast', () => {
                $('#signup-div').fadeIn('fast');
            });
            break;
        case '#signin':
            $('#signup-div').fadeOut('fast', () => {
                $('#signin-div').fadeIn('fast');
            });
            break;
        case '#recovery':

            break;
        default:
            var searchParams = new URLSearchParams(window.location.search);

            /* let data = {}
            data.email = searchParams.get('email'); */

            if (searchParams.get('recovery_key')) {

                $('#signin-div').fadeOut('fast', () => {
                    $('#recovery-div').fadeIn('fast');
                });

                if (!searchParams.get('email') || !validateEmail(searchParams.get('email'))) throw toastError("❔ Invalid verification url");
            }
            break;
    }

    API.getData('https://restcountries.com/v2/all')
        .then((res) => {
            const countries = res.json;
            countryNames = countries.map(country => country.name);
            countryCodes = countries.map(country => country.callingCodes[0])
            countryNames.forEach((c, idx) => {
                $('#signup-selectCountry').append(`<option value="${idx}">${c}</option>`);
            });
            $('#signup-selectCountry').find('option:contains("Country")').prop('selected', true);
        })

    // **************************************************
    // *******        Interaction Actions         *******
    // **************************************************


    $('#signup').click(() => {
        $('#signin-div').fadeOut('fast', () => {
            $('#signup-div').fadeIn('fast');
        });
    });

    $('#signin').click(() => {
        $('#signup-div').fadeOut('fast', () => {
            $('#signin-div').fadeIn('fast');
        });
    });

    $('#recovery').click(() => {
        if (!recoveryClick) {
            recoveryClick = true;
            data = { email: $('#signin-inputEmail').val() };
            API.postData(API._baseUrl + API.endPoints.auth._recovery, data)
                .then((res) => {
                    if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
                    if (res.status === 201) {
                        $("body").overhang({
                            type: "success",
                            message: "✅ " + res.json.message,
                            duration: 10,
                            upper: false,
                        })
                    };
                })

        }
    });


    $("#signup-inputPassword").on("input", function() {
        let password = $(this).val();
        passwordStrength = 0;


        if (password.length > 0 && password.length < 8)
            passwordStrength += 0.50;
        else if (password.length > 7) {
            passwordStrength += 0.75;
            if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))
                passwordStrength++
                if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))
                    passwordStrength++
                    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~,-])/))
                        passwordStrength++
                        if (passwordStrength > 3) passwordStrength += 0.25
        }

        $("#passwordStrength").css("width", (passwordStrength * 25) + "%");
        if (passwordStrength < 1.5) {
            $("#passwordStrength").removeClass();
            $("#passwordStrength").addClass("progress-bar progress-bar-striped progress-bar-animated bg-danger");
        } else if (passwordStrength < 2.5) {
            $("#passwordStrength").removeClass();
            $("#passwordStrength").addClass("progress-bar progress-bar-striped progress-bar-animated bg-warning");
        } else {
            $("#passwordStrength").removeClass();
            $("#passwordStrength").addClass("progress-bar progress-bar-striped progress-bar-animated bg-success");
        }

    });

    $("#recovery-inputPassword").on("input", function() {
        let password = $(this).val();
        passwordStrength = 0;


        if (password.length > 0 && password.length < 8)
            passwordStrength += 0.50;
        else if (password.length > 7) {
            passwordStrength += 0.75;
            if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/))
                passwordStrength++
                if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/))
                    passwordStrength++
                    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~,-])/))
                        passwordStrength++
                        if (passwordStrength > 3) passwordStrength += 0.25
        }

        $("#recovery-passwordStrength").css("width", (passwordStrength * 25) + "%");
        if (passwordStrength < 1.5) {
            $("#recovery-passwordStrength").removeClass();
            $("#recovery-passwordStrength").addClass("progress-bar progress-bar-striped progress-bar-animated bg-danger");
        } else if (passwordStrength < 2.5) {
            $("#recovery-passwordStrength").removeClass();
            $("#recovery-passwordStrength").addClass("progress-bar progress-bar-striped progress-bar-animated bg-warning");
        } else {
            $("#recovery-passwordStrength").removeClass();
            $("#recovery-passwordStrength").addClass("progress-bar progress-bar-striped progress-bar-animated bg-success");
        }

    });

    $('#signup-selectCountry').change((e) => {
        let id = $('#signup-selectCountry').find('option:selected').val()
        $("#signup-inputPhone").inputmask({ "mask": `+${countryCodes[id]} 999999999` }).prop('disabled', false);;
    });

    // **************************************************
    // *******          Submits Actions           *******
    // **************************************************

    $('#signup-form').submit((e) => {

        data.full_name = $('#signup-inputFullName').val();
        data.email = $('#signup-inputEmail').val();
        data.password = $('#signup-inputPassword').val();
        let password2 = $('#signup-input2Password').val();
        console.log(passwordStrength)
        e.preventDefault()
        if (!data.full_name) throw toastError("🪪 Please enter your full name.");
        if (!checkNameCount(data.full_name)) throw toastError("🪪 Please enter your FULL name.");
        if (!data.email) throw toastError("📧 Please enter your email.");
        if (!validateEmail(data.email)) throw toastError("📧 Please enter valid email.");
        if (!data.password) throw toastError("🔑 Please enter your password.");
        if (passwordStrength < 2.5) throw toastError("🔐 Please enter a secure password.");
        if (data.password != password2) throw toastError("🔓 Passwords do not match.");

        $('#signup-div').fadeOut('fast', () => {
            $('#signup_l-div').fadeIn('fast');
        });

    });

    $('#recovery-form').submit((e) => {

        let password = $('#recovery-inputPassword').val();
        let password2 = $('#recovery-input2Password').val();

        e.preventDefault()
        if (!password) throw toastError("🔑 Please enter your password.");
        if (passwordStrength < 2.5) throw toastError("🔐 Please enter a secure password.");
        if (password != password2) throw toastError("🔓 Passwords do not match.");

        var searchParams = new URLSearchParams(window.location.search);

        let data = {}
        data.email = searchParams.get('email');
        data.recovery_key = searchParams.get('recovery_key');
        data.password = password;
        try {
            API.updateData(API._baseUrl + API.endPoints.auth._recovery, data)
                .then((res) => {
                    if (res.status === 403 || res.status === 400) throw toastError(`⛔️ ${res.json.message}`);
                    if (res.status === 200) {
                        $("body").overhang({
                            type: "success",
                            message: "✅ " + res.json.message,
                            duration: 5,
                            upper: false,
                            callback: () => {
                                window.location.replace("./auth.html");
                            }
                        })
                    };
                })
        } catch (err) {
            console.error(err);
        }

    });


    $('#signup_l-form').submit((e) => {
        data.birth_date = $('#signup-inputBirthDate').val();
        data.address = {
            street: $('#signup-inputStreet').val(),
            city: $('#signup-inputCity').val(),
            state: $('#signup-inputState').val(),
            zip_code: $('#signup-inputZipCode').val(),
        }
        data.country = countryNames[$('#signup-selectCountry').find('option:selected').val()]
        data.nationality = $('#signup-inputNationality').val();
        data.phone = $('#signup-inputPhone').val();
        console.log(data)
        e.preventDefault()
        if (!data.birth_date) throw toastError("📆 Please enter your Birth date.");
        if (!data.address.street) throw toastError("🏡 Please enter your street.");
        if (!data.address.city) throw toastError("🏡 Please enter your city.");
        if (!data.address.state) throw toastError("🏡 Please enter your state.");
        if (!data.address.zip_code) throw toastError("🏡  Please enter your Zip code.");
        if (!data.country) throw toastError("🏳️ Please enter your full name.");
        if (!data.nationality) throw toastError("🏳️ Please enter your full name.");
        if (!data.phone) throw toastError("☎️ Please enter your full name.");

        try {
            API.postData(API._baseUrl + API.endPoints.auth._signup, data)
                .then((res) => {
                    if (res.status === 400) throw toastError(`⛔️ ${res.json.message}`);
                    if (res.status === 201) {
                        sessionStorage.setItem('Token', res.json.token);
                        $("body").overhang({
                            type: "success",
                            message: "✅ " + res.json.message,
                            duration: 3,
                            upper: false,
                            callback: () => {
                                window.location.replace("./home.html");
                            }
                        })

                    };
                })
        } catch (err) {
            console.error(err);
        }

    });

    $('#signin-form').submit(function(e) {
        let data = {}
        data.email = $('#signin-inputEmail').val();
        data.password = $('#signin-inputPassword').val();
        let remember = $('#signup-inputType').is(':checked');

        e.preventDefault();
        if (!validateEmail(data.email)) throw toastError("📧 Please enter valid email.");
        if (!data.password) throw toastError("🔑 Please enter your password.");

        try {
            API.postData(API._baseUrl + API.endPoints.auth._signin, data)
                .then((res) => {
                    if (res.status === 403) throw $('#signin-errPassword').removeClass("hide").then(toastError(`⛔️ ${res.json.message}`))
                    if (res.status === 200) {
                        remember ? localStorage.setItem('Token', res.json.token) : sessionStorage.setItem('Token', res.json.token);
                        $("body").overhang({
                            type: "success",
                            message: "✅ " + res.json.message,
                            duration: 3,
                            upper: false,
                            callback: () => {
                                window.location.replace("./home.html");
                            }
                        })
                    };
                })
        } catch (err) {
            console.error(err);
        }
    });
});

// **************************************************
// *******          Other Functions           *******
// **************************************************

const toastError = (message) => {
    $("body").overhang({
        type: "error",
        message: message,
        duration: 5,
        upper: true
    });
}

const validateEmail = (email) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

const changeClass = (elem, rem = '', add = '') => {
    if (!elem) return false;
    $(elem).removeClass(rem);
    $(elem).addClass(add);
    return true;
}

const checkNameCount = (name) => {
    let words = name.split(' ');
    return words.length >= 3;
}