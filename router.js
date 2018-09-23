var db = require('./db');
// Load the full build.
var _ = require('lodash');
var md5 = require('md5');
var fs = require('fs');
var csvParser = require('csv-parser');

const ADMIN_TYPE = 'ADMIN'
const IT_MANAGER = 'IT_MANAGER';

function isAdmin(request) {
    return request.session.userType === ADMIN_TYPE;
}

function isManager(request) {
    return request.session.userType === IT_MANAGER;
}

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
            attributes: ['Username', 'Type'],
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

        if (request.files.length > 0) {
            console.log("FIKES");
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
        db.userModel.update(
            {
                Password: md5(request.body.NewPassword)
            },
            {
                where: {
                    Username: request.body.Username,
                    Password: md5(request.body.Password)
                }
            }
        ).then(result => {
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
        });
    });

    app.post('/update-user-status', function(request, response) {
        db.userModel.update(
            {
                RegistrationState: request.body.RegistrationState
            },
            {
                where: {
                    Username: request.body.Username,
                }
            }
        ).then(result => {
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
        });
    });

    app.get('/home', function (request, response) {
        db.contractModel.findAll({
            include: [
                {
                    model: db.companyModel
                }
            ]
        }).then(contracts => {
            var mostRecentExpiredContracts = contracts;
            mostRecentExpiredContracts = _.filter(mostRecentExpiredContracts, contract => {
                return (new Date(contract.ExpiredDate)).getTime() > (new Date()).getTime();
            });
            mostRecentExpiredContracts = _.orderBy(mostRecentExpiredContracts, ['ExpiredDate'], ['asc']);
            mostRecentExpiredContracts = _.slice(mostRecentExpiredContracts, 0, 5);

            var mostRecentCreatedContracts = contracts;
            mostRecentCreatedContracts = _.filter(mostRecentCreatedContracts, contract => {
                return (new Date(contract.CreationDate)).getTime() < (new Date()).getTime();
            });
            mostRecentCreatedContracts = _.orderBy(mostRecentCreatedContracts, ['CreationDate'], ['desc']);
            mostRecentCreatedContracts = _.slice(mostRecentCreatedContracts, 0, 5);

            request.session.userType = ADMIN_TYPE;
            if (isAdmin(request) || isManager(request)) {
                db.userModel.findAll({
                    where : {
                        RegistrationState: 'NEODOBREN'
                    }
                }).then(registerRequests => {
                    if (isManager(request)) {
                        registerRequests = [];
                    }

                    console.log(registerRequests);

                    var mostRecentNextSixMonthContracts = contracts;
                    mostRecentNextSixMonthContracts = _.filter(mostRecentNextSixMonthContracts, contract => {
                        var currentDate = new Date();
                        var sixMonthDate = new Date()
                        sixMonthDate.setMonth(sixMonthDate.getMonth() + 6);
                        return (new Date(contract.ExpiredDate)).getTime() > currentDate.getTime()
                            && (new Date(contract.ExpiredDate)).getTime() < sixMonthDate.getTime();
                    });
                    mostRecentNextSixMonthContracts = _.orderBy(mostRecentNextSixMonthContracts, ['ExpiredDate'], ['asc']);
                    mostRecentNextSixMonthContracts = _.slice(mostRecentNextSixMonthContracts, 0, 20);

                    var mostRecentPreviousSixMonthContracts = contracts;
                    mostRecentPreviousSixMonthContracts = _.filter(mostRecentPreviousSixMonthContracts, contract => {
                        var currentDate = new Date();
                        var sixMonthDate = new Date();
                        sixMonthDate.setMonth(sixMonthDate.getMonth() - 6);
                        return (new Date(contract.CreationDate)).getTime() < currentDate.getTime()
                            && (new Date(contract.CreationDate)).getTime() > sixMonthDate.getTime();
                    });
                    mostRecentPreviousSixMonthContracts = _.orderBy(mostRecentPreviousSixMonthContracts, ['CreationDate'], ['desc']);
                    mostRecentPreviousSixMonthContracts = _.slice(mostRecentPreviousSixMonthContracts, 0, 20);

                    console.log(mostRecentNextSixMonthContracts.length);

                    response.render('home', {
                        mostRecentExpiredContracts: mostRecentExpiredContracts,
                        mostRecentCreatedContracts: mostRecentCreatedContracts,
                        mostRecentNextSixMonthContracts: mostRecentNextSixMonthContracts,
                        mostRecentPreviousSixMonthContracts: mostRecentPreviousSixMonthContracts,
                        registerRequests: registerRequests
                    });
                }).catch(err => console.log(err));
            } else {
                response.render('home', {
                    mostRecentExpiredContracts: mostRecentExpiredContracts,
                    mostRecentCreatedContracts: mostRecentCreatedContracts,
                    mostRecentNextSixMonthContracts: [],
                    mostRecentPreviousSixMonthContracts: [],
                    registerRequests: []
                });
            }
        });
    });

    app.get('/partners', function (request, response) {
        db.contractModel.findAll(
            {
                attributes: ['PIB', 'IDPackage'],
                group: ['PIB', 'IDPackage'],
                include: [
                    {
                        model: db.packageModel,
                    },
                    {
                        model: db.companyModel
                    }
                ]
            }
        ).then(result => {
            var groupByPackageName = _.groupBy(result, element => {
                return element.package.Name;
            })
            response.render('partners', { partnerPackages: groupByPackageName });
        });
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
                ['DateTime', 'ASC']
            ],
            where: {
                DateTime: {
                    [db.Sequelize.Op.gt]: new Date()
                }
            }
        }).then(actualLectures => {
            db.lectureModel.findAll({
                order: [
                    ['DateTime', 'DESC']
                ],
                where: {
                    DateTime: {
                        [db.Sequelize.Op.lt]: new Date()
                    }
                },
                limit: 10
            }).then(archiveLectures => {
                response.render('lectures', {
                    actualLectures: actualLectures,
                    archiveLectures: archiveLectures
                });
            })
        });
    });

    app.get('/advertisement', function (request, response) {
        db.advertisementModel.findAll({
            include: [
                {
                    model: db.inContactModel,
                    include: [
                        {
                            model: db.companyModel
                        }
                    ]
                }
            ],
            where: {
                ExpireDate: {
                    [db.Sequelize.Op.gt]: new Date()
                }
            },
            order: [
                ['CreationTime', 'DESC']
            ]
        }).then(advertisements => {
            response.render('advertisement', {
                advertisements: advertisements
            })
        });
    });

    app.get('/logout', function (req, res) {
        delete req.session.username;
        res.redirect('/');
    });
    app.post('/create-company', function (request, response) {
        var logoLink = "";
        var logoFile = null;

        if (request.files.length > 0) {
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

        var hostUrl = request.rawHeaders[index + 1];
        var splittedUrl = hostUrl.split("/")
        var pib = splittedUrl[splittedUrl.length - 1];

        var jsonFile = null

        if (request.files.length > 0) {
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
                }).catch(function (err) {
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

        if (request.files.length > 0) {
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

        if (request.files.length > 0) {
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

        if (request.files.length > 0) {
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

    app.post('/add-money-contract', function (request, response) {
        var index = request.rawHeaders.indexOf('Referer');
        if (index < 0) {
            response.statusCode = 401;
            response.send();
        }

        var hostUrl = request.rawHeaders[index + 1];
        var splittedUrl = hostUrl.split("/")
        var pib = splittedUrl[splittedUrl.length - 1];

        db.packageModel.findAll({
            where: {
                Name: request.body.MoneyContractPackageName
            }
        }).then(function (result) {
            if (result.length > 0) {
                var contractDate = new Date(request.body.MoneyContractDate);
                db.contractModel.create({
                    PIB: pib,
                    IDPackage: result[0].IDPackage,
                    IDContractStatus: request.body.moneyContractStatus,
                    CreationDate: new Date(request.body.MoneyContractDate).toISOString().slice(0, 10),
                    ExpiredDate: contractDate.setFullYear(contractDate.getFullYear() + result[0].Duration),
                    AdditionalComment: request.body.MoneyContractAdditionalComment,
                }).then(function (result) {
                    db.moneyContractModel.create({
                        IDContract: result.IDContract,
                        Value: request.body.MoneyContractValue,
                        IsPaymentFinished: (request.body.MoneyContractIsPaymentFinished) ? 1 : 0,
                        IsInvoiceSent: (request.body.MoneyContractIsInvoiceSent) ? 1 : 0,
                        PaymentDate: request.body.MoneyContractPaymentDate
                    }).then(function () {
                        response.statusCode = 200;
                        response.end();
                    })
                });
            } else {
                response.statusCode = 401;
                response.end();
            }
        });
    });

    app.post('/add-donate-contract', function (request, response) {
        var index = request.rawHeaders.indexOf('Referer');
        if (index < 0) {
            response.statusCode = 401;
            response.send();
        }

        console.log(JSON.stringify(request.body));

        var hostUrl = request.rawHeaders[index + 1];
        var splittedUrl = hostUrl.split("/")
        var pib = splittedUrl[splittedUrl.length - 1];

        db.packageModel.findAll({
            where: {
                Name: request.body.DonateContractPackageName
            }
        }).then(function (result) {
            if (result.length > 0) {
                var contractDate = new Date(request.body.DonateContractDate);
                db.contractModel.create({
                    PIB: pib,
                    IDPackage: result[0].IDPackage,
                    IDContractStatus: request.body.donateContractStatus,
                    CreationDate: new Date(request.body.DonateContractDate).toISOString().slice(0, 10),
                    ExpiredDate: contractDate.setFullYear(contractDate.getFullYear() + result[0].Duration),
                    AdditionalComment: request.body.DonateContractAdditionalComment,
                }).then(function (result) {
                    db.donateContractModel.create({
                        IDContract: result.IDContract,
                        EstiamatedValue: parseInt(request.body.DonateContractValue, 10),
                        Description: request.body.DonateContractDescription,
                        Quantity: request.body.DonateContractQuantity,
                        DeliveryDate: request.body.DonateContractDeliveryDate
                    }).then(function () {
                        response.statusCode = 200;
                        response.end();
                    })
                });
            } else {
                response.statusCode = 401;
                response.end();
            }
        });
    });

    app.post('/add-package', function(request, response) {
        db.packageModel.create({
            Name: request.body.AddPackageName,
            Price: request.body.AddPackagePrice,
            Duration: request.body.AddPackageDuration,
            MaxCompanyNumbe: request.body.AddPackageMaxCompanyNumber,
            Status: 'AKTIVAN',       
        }).then((package) =>{
            for (var i = 0; i < request.body.AddPackageItemName.length; i++) {
                package.createPackageitem({
                    Name: request.body.AddPackageItemName[i],
                    Description: request.body.AddPackageItemDescription[i]
                });
            }
            response.statusCode = 200;
            response.send();
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
                            db.sequelize.fn(
                                'LOWER', 
                                db.sequelize.col('Company.Name')
                            ),
                            'LIKE', '%' + companyName.toLowerCase() + '%')
                    }
                },
                {
                    model: db.packageModel,
                    attributes: [],
                    where: {
                        Name: db.sequelize.where(
                            db.sequelize.fn(
                                'LOWER',
                                db.sequelize.col('Package.Name')
                            ),
                            'LIKE', '%' + packageName.toLowerCase() + '%')
                    }
                },
            ],
            limit: 20                        
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
                db.contractStatusModel.findAll().then(function (statusList) {
                    response.render('company-info', { company: result[0], contractStatusList: statusList });
                })
            }
        }).catch(function (err) {
            response.statusCode = 401;
        });
    });
}