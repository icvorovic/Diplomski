var db = require('./db');
// Load the full build.
var _ = require('lodash');
var md5 = require('md5');
var fs = require('fs');
var csvParser = require('csv-parser');

exports.setup = function (app) {
    app.get('/', function (request, response) {
        db.userModel.findAll().then(users => {
        });
        response.render('index');
    });

    app.post('/login', function (request, response) {
        var username = request.body.Username;
        var password = request.body.Password;
        db.userModel.findAll({
            where: {
                Username: username,
                Password: md5(password)
            }
        }).then(function (result) {
            if (result.length === 0) {
                response.statusCode = 401;
                response.end();
            } else {
                request.session.username = result[0].Username;
                request.session.userType = result[0].Type;
                response.statusCode = 200;
                response.send({ redirect: '/home' });
            }
        });;
    });

    app.post('/register', function (request, response) {
        var linkProfilePicture = "";
        var profilePicture = null;

        if (request.files) {
            profilePicture = request.files.RegistrationProfilePicture;
            linkProfilePicture = './profile_picture/' + request.body.Username + '/' + profilePicture.name;
        }
        db.userModel.create({
            Username: request.body.Username,
            FirstName: request.body.FirstName,
            LastName: request.body.LastName,
            Email: request.body.Email,
            Password: md5(request.body.Password),
            Gender: request.body.Gender,
            BirthDate: request.body.BirthDate,
            LinkedIn: request.body.LinkedIn,
            LinkProfileImage: linkProfilePicture,
            RegistrationState: 'NEODOBREN',
            Type: 'CLAN_TIMA',
        }).then(function () {
            if (profilePicture) {
                var dir = './profile_picture/' + request.body.Username;

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                profilePicture.mv('./profile_picture/' + request.body.Username + '/' + profilePicture.name, function (err) {
                    if (err)
                        return res.status(500).send(err);
                });
            }
            response.statusCode = 200;
            response.end();
        }).catch(function (err) {
            console.log(err);
            response.statusCode = 401;
            response.end();
        });
    });

    app.post('/change-password', function (request, response) {
        var username = request.body.Username;
        var password = request.body.Password;
        var newPassword = request.body.NewPassword;

        db.userModel.update(
            {
                Password: newPassword
            },
            {
                where: {
                    Username: username,
                    Password: password
                }
            }
        )
            .then(result => {
                if (result > 0) {
                    response.statusCode = 200;
                    response.end();
                } else {
                    response.statusCode = 401;
                    response.end();
                }
            })
            .catch(err => {
                response.statusCode = 401;
                response.end();
            })
    });

    app.get('/home', function (request, response) {
        console.log(request.session);
        db.userModel.findAll().then(users => {

        });
        response.render('home', {
            mostRecentExpiredContracts: [
                {
                    CompanyName: "KOMPANIJA 4",
                    ExpiredDate: "2018-07-20",
                },
                {
                    CompanyName: "KOMPANIJA 3",
                    ExpiredDate: "2018-07-20",
                },
            ],
            mostRecentCreatedContracts: [
                {
                    CompanyName: "KOMPANIJA 1",
                    CreatedDate: "2018-07-20",
                },
                {
                    CompanyName: "KOMPANIJA 2",
                    CreatedDate: "2018-07-20",
                },
            ],
        });
    });

    app.get('/partners', function (request, response) {
        db.userModel.findAll().then(users => {
        });
        response.render('partners', { partnerPackages: ['Srebrni', 'Zlatni', 'Platinium'] });
    });

    app.get('/packages', function (request, response) {
        db.packageModel.findAll(
            {
                include: db.packageItemModel,
                where: {
                    Status: 'AKTIVAN'
                }
            }
        ).then(results => {
            response.render('packages', {
                actualPackages: results
            })
        });
    });

    app.get('/lectures', function (request, response) {
        db.lectureModel.findAll({
            order: [
                ['DateTime', 'DESC']
            ]
        }).then(results => {
            response.render('lectures', {
                lectures: results
            });
        });
    });

    app.get('/advertisement', function (request, response) {
        db.userModel.findAll().then(users => {

        });
        response.render('advertisement', {
            advertisement: [
                {
                    Title: "Naslov oglasa",
                    Description: "avpijrea pribnaoejbnao dnbfadnigbiad gbapng dbapinnnnnn nnnnnnndbanbpa inbipafnbad nbadnb[ajdgn bandbgpn",
                    ExpiredDate: "2018-07-20",
                    Type: "Praksa",
                    CompanyName: "Naziv kompanije"
                },
                {
                    Title: "Naslov oglasa 2",
                    Description: "avpijrea adl kkckckaapribn aoejbnaodn bfadnigbi a dgbapngdbap inn nnnnnnnnnnnd banbpainbipa fnbadnbadn b[ajdgnbandbgpn",
                    ExpiredDate: "2013-07-20",
                    Type: "Posao",
                    CompanyName: "Naziv kompanije swa"
                },
            ]
        });
    });

    app.get('/logout', function (req, res) {
        delete req.session.username;
        res.redirect('/');
    });

    app.post('/create-company', function (request, response) {
        var logoLink = "";
        var logoFile = null;

        if (request.files) {
            logoFile = request.files.CompanyLogo;
            logoLink = './company_logo/' + request.body.CompanyPIB + '/' + logoFile.name;
        }

        db.companyModel.create({
            Name: request.body.CompanyName,
            Address: request.body.CompanyAddress,
            City: request.body.CompanyCity,
            PostCode: request.body.CompanyPostCode,
            PIB: request.body.CompanyPIB,
            Country: request.body.CompanyCountry,
            Description: request.body.CompanyDescription,
            Website: request.body.CompanyWebsite,
            Logo: logoLink
        }).then(function (newCompany) {
            newCompany.createBankaccount({
                IDBankAccount: request.body.CompanyBankAccount,
                PIB: request.body.CompanyPIB,
                Currency: request.body.CompanyCurrency
            });

            newCompany.createIncontact({
                PIB: request.body.CompanyPIB,
                Username: request.session.username
            })

            request.body.CompanyEmail.forEach(element => {
                newCompany.createEmail({
                    Email: element,
                    PIB: request.body.CompanyPIB
                })
            });

            newCompany.createContact({
                FirstName: request.body.CompanyContactPersonFirstName,
                LastName: request.body.CompanyContactPersonLastName,
                Telephone: request.body.CompanyContactPersonTelephone,
                Email: request.body.CompanyContactPersonEmail,
                PIB: request.body.CompanyPIB
            })

            if (logoFile) {
                var dir = './company_logo/' + request.body.CompanyPIB;

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                logoFile.mv('./company_logo/' + request.body.CompanyPIB + '/' + logoFile.name, function (err) {
                    if (err)
                        return res.status(500).send(err);
                });
            }

            response.statusCode = 200;
            response.end();
        }).catch(function (err) {
            console.log(err);
            response.statusCode = 401;
            response.end();
        });
    });

    app.post('/add-company-advertisement-json', function (request, response) {
        var index = request.rawHeaders.indexOf('Referer');
        if (index < 0) {
            response.statusCode = 401;
            response.send();
        }

        console.log(JSON.stringify(request.body));

        var hostUrl = request.rawHeaders[index + 1];
        var splittedUrl = hostUrl.split("/")
        var pib = splittedUrl[splittedUrl.length - 1];

        var jsonFile = null

        if (request.files) {
            jsonFile = request.files.AddAdvertisementJsonFile;
        } else {
            response.statusCode = 401;
            response.send();
        }

        if (!jsonFile) {
            response.statusCode = 401;
            response.send();
        }

        var json = JSON.parse(jsonFile.data.toString());

        if (json.Oglasi) {
            json.Oglasi.forEach(element => {
                var type = {
                    "posao": 1,
                    "praksa": 2,
                    "praksa/posao": 3
                }

                db.advertisementModel.create({
                    Username: request.session.username,
                    PIB: pib,
                    Title: element.Pozicija,
                    Description: element.Opis,
                    Type: type[element.Tip],
                    ExpireDate: element.RokPrijave,
                    CreationTime: new Date().toISOString().slice(0, 10)
                }).then(function () {
                }).catch(function(err) {
                    console.log(err);
                    response.statusCode = 401;
                    response.send();
                });
            });
        }
    });

    app.post('/add-company-advertisement', function (request, response) {
        var index = request.rawHeaders.indexOf('Referer');
        if (index < 0) {
            response.statusCode = 401;
            response.send();
        }

        console.log(JSON.stringify(request.body));

        var hostUrl = request.rawHeaders[index + 1];
        var splittedUrl = hostUrl.split("/")
        var pib = splittedUrl[splittedUrl.length - 1];

        var linkAdvertFile = "";
        var advertFile = null;

        if (request.files) {
            advertFile = request.files.AddAdvertisementFile;
            linkAdvertFile = './advertisements/' + new Date().getTime() + '/';
        }
        db.advertisementModel.create({
            Username: request.session.username,
            PIB: pib,
            Title: request.body.AddAdvertisementTitle,
            Description: request.body.AddAdvertisementDesc,
            Type: request.body.AddAdvertisementType,
            ExpireDate: request.body.AddAdvertisementExpiredDate,
            CreationTime: new Date().toISOString().slice(0, 10),
            FilePath: ((advertFile) ? linkAdvertFile + advertFile.name : "")
        }).then(function () {
            if (advertFile) {
                var dir = linkAdvertFile;

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                advertFile.mv(linkAdvertFile + advertFile.name, function (err) {
                    if (err)
                        return res.status(500).send(err);
                });
            }
            response.statusCode = 200;
            response.end();
        }).catch(function (err) {
            console.log(err);
            response.statusCode = 401;
            response.end();
        });
    });

    app.post('/add-company-lecture-csv', function (request, response) {
        var index = request.rawHeaders.indexOf('Referer');
        if (index < 0) {
            response.statusCode = 401;
            response.send();
        }

        var hostUrl = request.rawHeaders[index + 1];
        var splittedUrl = hostUrl.split("/")
        var pib = splittedUrl[splittedUrl.length - 1];

        var csvFile = null

        if (request.files) {
            csvFile = request.files.AddLectureCsvFile;
            if (csvFile) {
                csvFile.mv('./temp/' + csvFile.name, function (err) {
                    if (err)
                        return res.status(500).send(err);
                });
            }
        } else {
            response.statusCode = 401;
            response.send();
        }

        fs.createReadStream('./temp/' + csvFile.name)
            .pipe(csvParser())
            .on('data', function (data) {
                try {
                    console.log(data);

                    console.log(data.Naslov);

                    db.lectureModel.create({
                        Username: request.session.username,
                        PIB: pib,
                        TitleSerbian: data.Naslov,
                        TItleEnglish: data.Title,
                        DescriptionSerbian: data.Opis,
                        DescriptionEnglish: data.Description,
                        Hall: data.Sala,
                        DateTime: data.Datum + " " + data.Vreme,
                        FirstName: data.Predavac.substr(0, data.Predavac.indexOf(' ')),
                        LastName: data.Predavac.substr(data.Predavac.indexOf(' ') + 1),
                    }).then(function () {
                    }).catch(function (err) {
                        console.log(err);
                        response.statusCode = 401;
                        response.end();
                    });
                }
                catch (err) {
                    console.log(err);
                    response.statusCode = 401;
                    response.end();
                }
            })
            .on('end', function () {
                response.statusCode = 200;
                response.end();
            });
    });

    app.post('/add-company-lecture', function (request, response) {
        var index = request.rawHeaders.indexOf('Referer');
        if (index < 0) {
            response.statusCode = 401;
            response.send();
        }

        var hostUrl = request.rawHeaders[index + 1];
        var splittedUrl = hostUrl.split("/")
        var pib = splittedUrl[splittedUrl.length - 1];

        var linkLectureFile = "";
        var lectureFile = null;

        if (request.files) {
            lectureFile = request.files.LectureFile;
            linkLectureFile = './lectures/' + new Date().getTime() + '/';
        }
        db.lectureModel.create({
            Username: request.session.username,
            PIB: pib,
            TitleSerbian: request.body.LectureTitle,
            TItleEnglish: request.body.LectureTitleEnglish,
            DescriptionSerbian: request.body.LectureDescription,
            DescriptionEnglish: request.body.LectureDescriptionEnglish,
            Hall: request.body.LectureHall,
            DateTime: request.body.LectureDate + " " + request.body.LectureTime,
            FirstName: request.body.LectureFirstName,
            LastName: request.body.LectureLastName,
            Biography: request.body.LectureBiography,
            FilePath: ((lectureFile) ? linkLectureFile + lectureFile.name : "")
        }).then(function () {
            if (lectureFile) {
                var dir = linkLectureFile;

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                lectureFile.mv(linkLectureFile + lectureFile.name, function (err) {
                    if (err)
                        return res.status(500).send(err);
                });
            }
            response.statusCode = 200;
            response.end();
        }).catch(function (err) {
            console.log(err);
            response.statusCode = 401;
            response.end();
        });
    });

    app.get('/search-company', function (request, response) {
        var packageName = request.query.SearchPackageName;
        var companyName = request.query.SearchCompanyName;
        var onlyWithValidContract = request.query.SearchOnlyWithValidContract;

        db.contractModel.findAll({
            attributes: [],
            include: [
                {
                    model: db.companyModel,
                    attributes: ['PIB', 'Name'],
                    where: {
                        Name: db.sequelize.where(
                            db.sequelize.fn('LOWER', db.sequelize.col('Company.Name')),
                            'LIKE', '%' + companyName.toLowerCase() + '%')
                    }
                },
                {
                    model: db.packageModel,
                    attributes: [],
                    where: {
                        Name: db.sequelize.where(
                            db.sequelize.fn('LOWER', db.sequelize.col('Package.Name')),
                            'LIKE', '%' + packageName.toLowerCase() + '%')
                    }
                }
            ]
        }).then(function (result) {
            var uniqueList = _.uniqBy(result, 'company.PIB');
            response.statusCode = 200;
            response.send({
                companyList: uniqueList
            });
        })

    });

    app.get('/company-info/:PIB', function (request, response) {
        var PIB = request.params.PIB;
        db.companyModel.findAll({
            include: [
                {
                    model: db.contractModel,
                    include: [
                        {
                            model: db.packageModel
                        }
                    ],
                },
                {
                    model: db.bankAccountModel,
                },
                {
                    model: db.emailModel,
                },
                {
                    model: db.contactModel,
                }
            ],
            where: {
                PIB: PIB
            }
        }).then(function (result) {
            response.statusCode = 200;
            console.log(JSON.stringify(result));
            if (result.length > 0) {
                response.render('company-info', { company: result[0] });
            }
        }).catch(function (err) {
            response.statusCode = 401;
        });
    });
}