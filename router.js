var db = require('./db');
// Load the full build.
var _ = require('lodash');

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
                Password: password
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
        db.userModel.create({
            Username: request.body.Username,
            FirstName: request.body.FirstName,
            LastName: request.body.LastName,
            Email: request.body.Email,
            Password: request.body.Password,
            Gender: request.body.Gender,
            BirthDate: request.body.BirthDate,
            LinkedIn: request.body.LinkedIn,
            RegistrationState: 'NEODOBREN',
            Type: 'CLAN_TIMA',
            Status: 'STATUS',
        }).then(function () {
            response.statusCode = 200;
            response.end();
        }).catch(function (err) {
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
        var fs = require('fs');
        var dir = './company_logo/' + request.body.CompanyPIB;

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        let logoFile;
        if (request.files) {
            logoFile = request.files.CompanyLogo;

            console.log(logoFile);

            logoFile.mv('./company_logo/' + request.body.CompanyPIB + '/' + logoFile.name, function (err) {
                if (err)
                    return res.status(500).send(err);
            });
        }

        console.log(request.body);

        db.companyModel.create({
            Name: request.body.CompanyName,
            Address: request.body.CompanyAddress,
            City: request.body.CompanyCity,
            PostCode: request.body.CompanyPostCode,
            PIB: request.body.CompanyPIB,
            Country: request.body.CompanyCountry,
            Description: request.body.CompanyDescription,
            Website: request.body.CompanyWebsite,
            Logo: './company_logo/' + request.body.CompanyPIB + '/' + logoFile.name
        }).then(function (newCompany) {
            newCompany.createBankaccount({
                IDBankAccount: request.body.CompanyBankAccount,
                PIB: request.body.PIB,
                Currency: request.body.CompanyCurrency
            });

            response.statusCode = 200;
            response.end();
        }).catch(function (err) {
            console.log(err);
            response.statusCode = 401;
            response.end();
        });
});

app.post('/add-company-advertisement', function (request, response) {
    
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