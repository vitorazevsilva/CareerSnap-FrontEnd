$(document).ready(function() {
    // **************************************************
    // *******         Local Variables            *******
    // **************************************************



    // **************************************************
    // *******          Initial Actions           *******
    // **************************************************

    API.getData('https://api.pexels.com/v1/search?query=profile&per_page=50&orientation=landscape&size=large', 'kvxSI3ko3VLt4LdTfSzIDrgLeouyG60Sy7oYxpk8Sf6z8rjkfqnuw5lU').then((pexels) => {
        let randomNumber = Math.floor(Math.random() * 51);
        $('#avatar').attr('src', pexels.json.photos[randomNumber].src.landscape);
        $('#fullName').css({ 'color': `#${complementar(pexels.json.photos[randomNumber].avg_color)} !important` });
    })

    var searchParams = new URLSearchParams(window.location.search);
    var cv = searchParams.get('cv')
    if (cv) {
        // Currículo de outra pessoa
        getUserInfo('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.VQqkiChC9O3A1b-ToArvk8knfeVkU-9cRjmFJkoLHeI', cv)
        getUserExperience('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.VQqkiChC9O3A1b-ToArvk8knfeVkU-9cRjmFJkoLHeI', cv)
        getUserSkill('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.VQqkiChC9O3A1b-ToArvk8knfeVkU-9cRjmFJkoLHeI', cv)
    } else if (_Token) {
        getUserInfoByToken(_Token)
        getUserExperienceByToken(_Token)
        getUserSkillByToken(_Token)
    } else {
        // Sem Conta e Currículo
        window.location.replace("/");
    }


    // **************************************************
    // *******          Interact Actions           *******
    // **************************************************

    $('#signOut').click(function(e) {
        localStorage.removeItem("Token");
        sessionStorage.removeItem("Token");
        window.location.replace("/");
    });

    $('#editProfile').click(function(e) {
        window.location.href = `manage.html?ct=profile`, '_blank';
    });

    $('#newExperience').click(function(e) {
        window.open(`manage.html?ct=experience`, '_blank');
    });

    $('#newSkill').click(function(e) {
        window.open(`manage.html?ct=skill`, '_blank');
    });

});

const startFunctions = (env) => {

    switch (env) {
        case 'exp':
            $('button[exp_id]').removeClass('hide')
            $('#signOut').removeClass('hide')
            $('#editProfile').removeClass('hide')
            $('#newExperience').removeClass('hide')
            $('#newSkill').removeClass('hide')
            $('#shareProfile').removeClass('hide')
            $('button[exp_id]').click(function(e) {
                if ($(this).attr('action') === 'del') {
                    var role = $(`#roleExp_id-${$(this).attr('exp_id')}`).html();
                    var entry = role.toLowerCase().replaceAll(' ', '')
                    $("body").overhang({
                        type: "prompt",
                        message: `Are you sure you want to delete ${role} from your list of Experience? Ok, then write " ${entry} "`,
                        overlay: true,
                        callback: (res) => {
                            if (res == entry) {
                                API.deleteData(`${API._baseUrl + API.endPoints.experience._base}/${$(this).attr('exp_id')}`, {}, _Token)
                                    .then((res) => {
                                        if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
                                        if (res.status === 200) {
                                            $("body").overhang({
                                                type: "success",
                                                message: "✅ " + res.json.message,
                                                duration: 2,
                                                upper: false,
                                                callback: () => {
                                                    $(`#rowExperience-${$(this).attr('exp_id')}`).remove();
                                                }
                                            })
                                        }
                                    })
                            } else {
                                toastError(`⛔️ Incorrect Verification`, 2)
                            }
                        }
                    });
                } else if ($(this).attr('action') === 'edit') {
                    window.location.href = `manage.html?ct=experience&id=${$(this).attr('exp_id')}`, '_blank';
                }
            });



            break;

        case 'skill':
            $('button[skill_id]').removeClass('hide')
            $('button[skill_id]').click(function(e) {
                if ($(this).attr('action') === 'del') {
                    var role = $(`#roleSkill_id-${$(this).attr('skill_id')}`).html();
                    var entry = role.toLowerCase().replaceAll(' ', '')
                    $("body").overhang({
                        type: "prompt",
                        message: `Are you sure you want to delete ${role} from your list of Skills? Ok, then write " ${entry} "`,
                        overlay: true,
                        callback: (res) => {
                            if (res == entry) {
                                API.deleteData(`${API._baseUrl + API.endPoints.skill._base}/${$(this).attr('skill_id')}`, {}, _Token)
                                    .then((res) => {
                                        if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
                                        if (res.status === 200) {
                                            $("body").overhang({
                                                type: "success",
                                                message: "✅ " + res.json.message,
                                                duration: 2,
                                                upper: false,
                                                callback: () => {
                                                    $(`#rowSkill-${$(this).attr('skill_id')}`).remove();
                                                }
                                            })
                                        }
                                    })
                            } else {
                                toastError(`⛔️ Incorrect Verification`, 2)
                            }
                        }
                    });
                } else if ($(this).attr('action') === 'edit') {
                    window.location.href = `manage.html?ct=skill&id=${$(this).attr('skill_id')}`, '_blank';
                }

            });

            break;
        default:
            break;
    }

}


// **************************************************
// *******          Other Functions           *******
// **************************************************

const complementar = (corHex) => {
    let r = parseInt(corHex.substring(0, 2), 16);
    let g = parseInt(corHex.substring(2, 4), 16);
    let b = parseInt(corHex.substring(4, 6), 16);
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
    const corHexComplementar = ((255 - r) << 16 | (255 - g) << 8 | (255 - b)).toString(16).padStart(6, '0');
    return corHexComplementar;
}

const formatDate = (date) => {
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

const getUserInfo = async(auth, user_id) => {
    await API.getData(`${API._baseUrl + API.endPoints._user}/${user_id}`, auth)
        .then((res) => {
            if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
            if (res.status === 200) {
                const user = {...res.json.content }
                if (!("id" in user)) throw toastError(`⛔️ Unavailable or invalid curriculum`, 2, () => { window.location.replace("/"); });
                let birthDate = new Date(user.birth_date)
                $('#fullName').html(`<h2>${user.full_name}</h2>`);
                $('#birthDate').html(`${birthDate.toLocaleDateString()} (${Math.round(((new Date() - birthDate)/(1000*60*60*24))/365)} years)`);
                $('#email').html(`${user.email}`);
                $('#phone').html(`${user.phone}`);
                $('#address').html(`${JSON.parse(user.address).street}, ${JSON.parse(user.address).city}`);
                $('#address2').html(`${JSON.parse(user.address).zipCode},${JSON.parse(user.address).state}`);
                $('#nationality').html(`${user.nationality}`);
            }

        })
}

const getUserInfoByToken = async(auth) => {
    await API.getData(`${API._baseUrl + API.endPoints._user}`, auth)
        .then((res) => {
            if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
            if (res.status === 200) {
                const user = {...res.json.content }
                if (!("id" in user)) throw toastError(`⛔️ Unavailable or invalid curriculum`, 2, () => { window.location.replace("/"); });
                let birthDate = new Date(user.birth_date)
                $('#fullName').html(`<h2>${user.full_name}</h2>`);
                $('#birthDate').html(`${birthDate.toLocaleDateString()} (${Math.round(((new Date() - birthDate)/(1000*60*60*24))/365)} years)`);
                $('#email').html(`${user.email}`);
                $('#phone').html(`${user.phone}`);
                $('#address').html(`${JSON.parse(user.address).street}, ${JSON.parse(user.address).city}`);
                $('#address2').html(`${JSON.parse(user.address).zipCode},${JSON.parse(user.address).state}`);
                $('#nationality').html(`${user.nationality}`);

                $('#shareProfile').click(function(e) {
                    copyToClipboard(`${window.location.href}?cv=${user.id}`)
                });
            }

        })
}

const getUserExperience = async(auth, user_id) => {
    await API.postData(`${API._baseUrl + API.endPoints.experience.search}`, { user_id }, auth)
        .then((res) => {
            if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
            if (res.status === 200) {
                const experience = [...res.json.content]
                experience.forEach((exp, inx) => {
                    $('#experience').append(`
                    <div id="rowExperience-${exp.id}" class="row justify-content-between align-items-start g-2">
                        <div class="col">
                            <div class="w3-container">
                                <h5 class="w3-opacity"><b id="roleExp_id-${exp.id}">${exp.role} / ${exp.company}</b></h5>
                                <h6 class="w3-text-teal"><i class="fa fa-calendar fa-fw w3-margin-right"></i>${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}</h6>
                                <p>${exp.description}</p>
                                <hr>
                            </div>
                        </div>
                        <div class="col-2">
                            <button type="button" action="edit" exp_id=${exp.id} class="btn w3-border-teal w3-hover-teal w3-text-teal text-uppercase mb-2 rounded-pill shadow-sm hide"><i class="fa fa-pencil"></i></button>
                            <button type="button" action="del" exp_id=${exp.id} class="btn w3-border-teal w3-hover-teal w3-text-teal text-uppercase mb-2 rounded-pill shadow-sm hide"><i class="fa fa-trash"></i></button>
                        </div>
                    </div>
                    `);
                });
            }

        })
}

const getUserExperienceByToken = async(auth) => {
    await API.getData(`${API._baseUrl + API.endPoints.experience._base}`, auth)
        .then((res) => {
            if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
            if (res.status === 200) {
                const experience = [...res.json.content]
                experience.forEach((exp, inx) => {
                    $('#experience').append(`
                    <div id="rowExperience-${exp.id}" class="row justify-content-between align-items-start g-2">
                        <div class="col">
                            <div class="w3-container">
                                <h5 class="w3-opacity"><b id="roleExp_id-${exp.id}">${exp.role} / ${exp.company}</b></h5>
                                <h6 class="w3-text-teal"><i class="fa fa-calendar fa-fw w3-margin-right"></i>${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}</h6>
                                <p>${exp.description}</p>
                                <hr>
                            </div>
                        </div>
                        <div class="col-2">
                            <button type="button" action="edit" exp_id=${exp.id} class="btn w3-border-teal w3-hover-teal w3-text-teal text-uppercase mb-2 rounded-pill shadow-sm hide"><i class="fa fa-pencil"></i></button>
                            <button type="button" action="del" exp_id=${exp.id} class="btn w3-border-teal w3-hover-teal w3-text-teal text-uppercase mb-2 rounded-pill shadow-sm hide"><i class="fa fa-trash"></i></button>
                        </div>
                    </div>
                    `);
                });
                startFunctions('exp')
            }

        })
}

const getUserSkill = async(auth, user_id) => {
    await API.postData(`${API._baseUrl + API.endPoints.skill.search}`, { user_id }, auth)
        .then((res) => {
            if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
            if (res.status === 200) {
                const skill = [...res.json.content]
                skill.forEach((skl, inx) => {
                    $('#skill').append(`
                    <div id="rowSkill-${skl.id}" class="row justify-content-between align-items-start g-2">
                        <div class="col">
                            <div class="w3-container">
                                <h5 class="w3-opacity"><b id="roleSkill_id-${skl.id}">${skl.field_of_study} / ${skl.institution}</b></h5>
                                <h6 class="w3-text-teal"><i class="fa fa-calendar fa-fw w3-margin-right"></i>${skl.start_year} - ${skl.completion_year}</h6>
                                <p>${skl.designation}</p>
                                <hr>
                            </div>
                        </div>
                        <div class="col-2">
                            <button type="button" action="edit" data-toggle="modal" data-target="#myModal" skill_id=${skl.id} class="btn w3-border-teal w3-hover-teal w3-text-teal w3-text-uppercase text-uppercase mb-2 rounded-pill shadow-sm hide"><i class="fa fa-pencil"></i></button>
                            <button type="button" action="del" skill_id=${skl.id} class="btn w3-border-teal w3-hover-teal w3-text-teal w3-text-uppercase text-uppercase mb-2 rounded-pill shadow-sm hide"><i class="fa fa-trash"></i></button>
                        </div>
                    </div>
                    `);
                });
            }

        })
}

const getUserSkillByToken = async(auth) => {
    await API.getData(`${API._baseUrl + API.endPoints.skill._base}`, auth)
        .then((res) => {
            if (res.status === 400 || res.status === 403) throw toastError(`⛔️ ${res.json.message}`);
            if (res.status === 200) {
                const skill = [...res.json.content]
                skill.forEach((skl, inx) => {
                    $('#skill').append(`
                    <div id="rowSkill-${skl.id}" class="row justify-content-between align-items-start g-2">
                        <div class="col">
                            <div class="w3-container">
                                <h5 class="w3-opacity"><b id="roleSkill_id-${skl.id}">${skl.field_of_study} / ${skl.institution}</b></h5>
                                <h6 class="w3-text-teal"><i class="fa fa-calendar fa-fw w3-margin-right"></i>${skl.start_year} - ${skl.completion_year}</h6>
                                <p>${skl.designation}</p>
                                <hr>
                            </div>
                        </div>
                        <div class="col-2">
                            <button type="button" .js-click-modal action="edit" skill_id=${skl.id} class="btn w3-border-teal w3-hover-teal w3-text-teal w3-text-uppercase text-uppercase mb-2 rounded-pill shadow-sm hide"><i class="fa fa-pencil"></i></button>
                            <button type="button" action="del" skill_id=${skl.id} class="btn w3-border-teal w3-hover-teal w3-text-teal w3-text-uppercase text-uppercase mb-2 rounded-pill shadow-sm hide"><i class="fa fa-trash"></i></button>
                        </div>
                    </div>
                    `);
                });
                startFunctions('skill')

            }

        })
}

function copyToClipboard(text) {
    const tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    $("body").overhang({
        type: "success",
        message: "📋 Share link has been copied",
        duration: 2,
        upper: false,
    })
}