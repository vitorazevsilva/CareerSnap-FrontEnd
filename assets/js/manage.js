if (!_Token) throw window.location.replace("/");
$(document).ready(function() {
    var searchParams = new URLSearchParams(window.location.search);
    var _id = searchParams.get('id');
    var _content = searchParams.get('ct');
    let passwordStrength
    let user = {}
    $('.fa').addClass(_id && _content != 'profile' ? 'fa-pencil' : 'fa-check-square');
    $('button[id$="ubmitButton"]').html(_content == 'profile' ? 'Edit' : _id ? 'Edit' : 'Create');

    switch (_content) {
        case 'profile':
            $('#title').html('Profile');
            $('#profile-form').fadeIn('fast');
            API.getData(`${API._baseUrl + API.endPoints._user}`, _Token)
                .then((res) => {
                    if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
                    if (res.status === 200) {
                        user = {...res.json.content }
                        if (!("id" in user)) throw toastError(`⛔️ Unavailable or invalid curriculum`, 2, () => { window.location.replace("/"); });
                        $('#profile-inputFullName').val(`${user.full_name}`);
                        $('#profile-inputBirthDate').val(`${user.birth_date}`);
                        $('#profile-inputEmail').val(`${user.email}`);
                        $('#profile-inputStreet').val(`${JSON.parse(user.address).street}`);
                        $('#profile-inputCity').val(`${JSON.parse(user.address).city}`);
                        $('#profile-inputState').val(`${JSON.parse(user.address).state}`);
                        $('#profile-inputZipCode').val(`${JSON.parse(user.address).zipCode}`);
                        $('#profile-inputPhone').val(`${user.phone}`);
                        $('#address').html(`${JSON.parse(user.address).street}, ${JSON.parse(user.address).city}`);
                        $('#address2').html(`${JSON.parse(user.address).zipCode},${JSON.parse(user.address).state}`);
                        $('#profile-inputNationality').val(`${user.nationality}`);
                    }

                })
            break;
        case 'experience':
            $('#title').html('Work Experience');
            $('#experience-form').fadeIn('fast');
            if (_id)
                API.getData(`${API._baseUrl + API.endPoints.experience._base}/${_id}`, _Token)
                .then((res) => {
                    if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
                    if (res.status === 200) {
                        const experience = {...res.json.content }

                        $('#experience-inputRole').val(`${experience.role}`);
                        $('#experience-inputStartDate').val(`${experience.start_date}`);
                        $('#experience-inputEndDate').val(`${experience.end_date}`);
                        $('#experience-inputCompany').val(`${experience.company}`);
                        $('#experience-inputDescription').val(`${experience.description}`);
                    }

                })
            break;
        case 'skill':
            $('#title').html('Skill');
            $('#skill-form').fadeIn('fast');
            if (_id)
                API.getData(`${API._baseUrl + API.endPoints.skill._base}/${_id}`, _Token)
                .then((res) => {
                    if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
                    if (res.status === 200) {
                        const skill = {...res.json.content }

                        $('#skill-inputDesignation').val(`${skill.designation}`);
                        $('#skill-inputStartYear').val(`${skill.start_year}`);
                        $('#skill-inputCompletionYear').val(`${skill.completion_year}`);
                        $('#skill-inputInstitution').val(`${skill.institution}`);
                        $('#skill-inputFieldOfStudy').val(`${skill.field_of_study}`);
                    }

                })
            break;

        default:
            toastError(`⛔️ Parameter Error`, 2, () => {
                window.location.replace("./curriculum.html")
            })
            break;
    }

    API.getData('https://restcountries.com/v2/all')
        .then((res) => {
            const countries = res.json;
            countryNames = countries.map(country => country.name);
            countryCodes = countries.map(country => country.callingCodes[0])
            countryNames.forEach((c, idx) => {
                $('#profile-selectCountry').append(`<option value="${idx}">${c}</option>`);
            });

            $("#profile-selectCountry option").filter(function() {
                return $(this).html() == `${user.country}`;
            }).prop("selected", true);
            let id = $('#profile-selectCountry').find('option:selected').val()
            $("#profile-inputPhone").inputmask({ "mask": `+${countryCodes[id]} 999999999` })
        })

    $('#profile-selectCountry').change((e) => {
        let id = $('#profile-selectCountry').find('option:selected').val()
        $("#profile-inputPhone").inputmask({ "mask": `+${countryCodes[id]} 999999999` })
    });

    $("#password-inputPassword").on("input", function() {
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

    $('#password-passwordButton').click(() => {
        $('#password-form').fadeOut('fast', () => {
            $('#profile-form').fadeIn('fast');
        });
    });

    $('#profile-passwordButton').click(() => {
        $('#profile-form').fadeOut('fast', () => {
            $('#password-form').fadeIn('fast');
        });
    });

    $('#experience-form').submit(function(e) {
        e.preventDefault();
        let data = {}
        data.role = $('#experience-inputRole').val();
        data.start_date = $('#experience-inputStartDate').val();
        data.end_date = $('#experience-inputEndDate').val();
        data.company = $('#experience-inputCompany').val();
        data.description = $('#experience-inputDescription').val();

        if (_id) {
            try {
                API.updateData(API._baseUrl + API.endPoints.experience._base + '/' + _id, data, _Token)
                    .then((res) => {
                        if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
                        if (res.status === 200) {
                            sessionStorage.setItem('Token', res.json.token);
                            $("body").overhang({
                                type: "success",
                                message: "✅ " + res.json.message,
                                duration: 3,
                                upper: false,
                                callback: () => {
                                    window.location.replace('./curriculum.html')
                                }
                            })

                        };
                    })
            } catch (err) {
                console.error(err);
            }
        } else {
            try {
                API.postData(API._baseUrl + API.endPoints.experience._base, data, _Token)
                    .then((res) => {
                        if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
                        if (res.status === 201) {
                            sessionStorage.setItem('Token', res.json.token);
                            $("body").overhang({
                                type: "success",
                                message: "✅ " + res.json.message,
                                duration: 2,
                                upper: false
                            })

                        };
                    })
            } catch (err) {
                console.error(err);
            }
        }

    });
    $('#skill-form').submit(function(e) {
        e.preventDefault();
        let data = {}
        data.designation = $('#skill-inputDesignation').val();
        data.start_year = $('#skill-inputStartYear').val();
        data.completion_year = $('#skill-inputCompletionYear').val();
        data.institution = $('#skill-inputInstitution').val();
        data.field_of_study = $('#skill-inputFieldOfStudy').val();

        if (_id) {
            try {
                API.updateData(API._baseUrl + API.endPoints.skill._base + '/' + _id, data, _Token)
                    .then((res) => {
                        if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
                        if (res.status === 200) {
                            sessionStorage.setItem('Token', res.json.token);
                            $("body").overhang({
                                type: "success",
                                message: "✅ " + res.json.message,
                                duration: 3,
                                upper: false,
                                callback: () => {
                                    window.location.replace('./curriculum.html')
                                }
                            })

                        };
                    })
            } catch (err) {
                console.error(err);
            }
        } else {
            try {
                API.postData(API._baseUrl + API.endPoints.skill._base, data, _Token)
                    .then((res) => {
                        if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
                        if (res.status === 201) {
                            sessionStorage.setItem('Token', res.json.token);
                            $("body").overhang({
                                type: "success",
                                message: "✅ " + res.json.message,
                                duration: 2,
                                upper: false
                            })

                        };
                    })
            } catch (err) {
                console.error(err);
            }
        }

    });
    $('#profile-form').submit(function(e) {
        e.preventDefault();
        let data = {}
        data.full_name = $('#profile-inputFullName').val();
        data.email = $('#profile-inputEmail').val();
        data.birth_date = $('#profile-inputBirthDate').val();
        data.address = {
            street: $('#profile-inputStreet').val(),
            city: $('#profile-inputCity').val(),
            state: $('#profile-inputState').val(),
            zipCode: $('#profile-inputZipCode').val(),
        }
        data.country = countryNames[$('#profile-selectCountry').find('option:selected').val()]
        data.nationality = $('#profile-inputNationality').val();
        data.phone = $('#profile-inputPhone').val();

        try {
            API.updateData(API._baseUrl + API.endPoints._user, data, _Token)
                .then((res) => {
                    if (res.status === 400) throw toastError(`⛔️ ${res.json.message}`);
                    if (res.status === 200) {
                        sessionStorage.setItem('Token', res.json.token);
                        $("body").overhang({
                            type: "success",
                            message: "✅ " + res.json.message,
                            duration: 2,
                            upper: false,
                            callback: () => {
                                window.location.replace('./curriculum.html')
                            }
                        })

                    };
                })
        } catch (err) {
            console.error(err);
        }
    });
    $('#password-form').submit(function(e) {
        e.preventDefault();
        let data = {}
        data.password = $('#password-inputPassword').val();
        let password2 = $('#password-input2Password').val();
        if (!data.password) throw toastError("🔑 Please enter your password.");
        if (passwordStrength < 2.5) throw toastError("🔐 Please enter a secure password.");
        if (data.password != password2) throw toastError("⛔️ Passwords do not match");

        try {
            API.updateData(API._baseUrl + API.endPoints._user, data, _Token)
                .then((res) => {
                    if (res.status === 400) throw toastError(`⛔️ ${res.json.message}`);
                    if (res.status === 200) {
                        sessionStorage.setItem('Token', res.json.token);
                        $("body").overhang({
                            type: "success",
                            message: "✅ " + res.json.message,
                            duration: 2,
                            upper: false,
                            callback: () => {
                                window.location.replace('./curriculum.html')
                            }
                        })

                    };
                })
        } catch (err) {
            console.error(err);
        }


    });

});