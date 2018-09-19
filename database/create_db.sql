-- ************************************** `ContractStatus`

CREATE TABLE `ContractStatus`
(
 `IDContractStatus` INT NOT NULL AUTO_INCREMENT ,
 `Status`           VARCHAR(20) NOT NULL ,

PRIMARY KEY (`IDContractStatus`)
);

-- ************************************** `Package`

CREATE TABLE `Package`
(
 `IDPackage`       INT NOT NULL AUTO_INCREMENT ,
 `Name`            VARCHAR(50) NOT NULL ,
 `Status`          VARCHAR(30) NOT NULL ,
 `Type`            VARCHAR(30) NOT NULL ,
 `Price`           INT NOT NULL ,
 `Description`     VARCHAR(250) NOT NULL ,
 `Duration`        INT NOT NULL ,
 `MaxCompanyNumbe` INT NOT NULL ,

PRIMARY KEY (`IDPackage`)
);

-- ************************************** `Company`

CREATE TABLE `Company`
(
 `PIB`         INT NOT NULL AUTO_INCREMENT ,
 `Name`        VARCHAR(50) NOT NULL ,
 `Address`     VARCHAR(70) NOT NULL ,
 `City`        VARCHAR(50) NOT NULL ,
 `PostCode`    INT NOT NULL ,
 `Country`     VARCHAR(50) NOT NULL ,
 `Logo`        VARCHAR(200) ,
 `Description` VARCHAR(300) ,
 `Website`     VARCHAR(100) NOT NULL ,

PRIMARY KEY (`PIB`)
);

-- ************************************** `User`

CREATE TABLE `User`
(
 `Username`          VARCHAR(50) NOT NULL ,
 `FirstName`         VARCHAR(50) NOT NULL ,
 `LastName`          VARCHAR(50) NOT NULL ,
 `Email`             VARCHAR(70) NOT NULL ,
 `Password`          VARCHAR(50) NOT NULL ,
 `Gender`            VARCHAR(15) NOT NULL ,
 `BirthDate`         DATE NOT NULL ,
 `LinkedIn`          VARCHAR(100) ,
 `RegistrationState` VARCHAR(30) NOT NULL ,
 `Type`              VARCHAR(30) NOT NULL ,
 `LinkProfileImage`  VARCHAR(200) ,

PRIMARY KEY (`Username`)
);

-- ************************************** `PackageItem`

CREATE TABLE `PackageItem`
(
 `IDPackageItem` INT NOT NULL AUTO_INCREMENT ,
 `Description`   VARCHAR(150) NOT NULL ,
 `IDPackage`     INT NOT NULL ,

PRIMARY KEY (`IDPackageItem`),
KEY `fkIdx_281` (`IDPackage`),
CONSTRAINT `FK_281` FOREIGN KEY `fkIdx_281` (`IDPackage`) REFERENCES `Package` (`IDPackage`)
);

-- ************************************** `Contract`

CREATE TABLE `Contract`
(
 `IDContract`        INT NOT NULL AUTO_INCREMENT ,
 `IDPackage`         INT NOT NULL ,
 `CreationDate`      DATE NOT NULL ,
 `ExpiredDate`       DATE NOT NULL ,
 `AdditionalComment` VARCHAR(300) ,
 `IDContractStatus`  INT NOT NULL ,
 `PIB`               INT NOT NULL ,

PRIMARY KEY (`IDContract`),
KEY `fkIdx_226` (`IDPackage`),
CONSTRAINT `FK_226` FOREIGN KEY `fkIdx_226` (`IDPackage`) REFERENCES `Package` (`IDPackage`),
KEY `fkIdx_265` (`IDContractStatus`),
CONSTRAINT `FK_265` FOREIGN KEY `fkIdx_265` (`IDContractStatus`) REFERENCES `ContractStatus` (`IDContractStatus`),
KEY `fkIdx_272` (`PIB`),
CONSTRAINT `FK_272` FOREIGN KEY `fkIdx_272` (`PIB`) REFERENCES `Company` (`PIB`)
);

-- ************************************** `BankAccount`

CREATE TABLE `BankAccount`
(
 `IDBankAccount` VARCHAR(50) NOT NULL ,
 `Currency`      VARCHAR(10) NOT NULL ,
 `PIB`           INT NOT NULL ,

PRIMARY KEY (`IDBankAccount`),
KEY `fkIdx_218` (`PIB`),
CONSTRAINT `FK_218` FOREIGN KEY `fkIdx_218` (`PIB`) REFERENCES `Company` (`PIB`)
);

-- ************************************** `InContact`

CREATE TABLE `InContact`
(
 `Username` VARCHAR(50) NOT NULL ,
 `PIB`      INT NOT NULL ,

PRIMARY KEY (`Username`, `PIB`),
KEY `fkIdx_153` (`Username`),
CONSTRAINT `FK_153` FOREIGN KEY `fkIdx_153` (`Username`) REFERENCES `User` (`Username`),
KEY `fkIdx_158` (`PIB`),
CONSTRAINT `FK_158` FOREIGN KEY `fkIdx_158` (`PIB`) REFERENCES `Company` (`PIB`)
);

-- ************************************** `Email`

CREATE TABLE `Email`
(
 `IDEmail` INT NOT NULL AUTO_INCREMENT ,
 `Email`   VARCHAR(30) NOT NULL ,
 `PIB`     INT NOT NULL ,

PRIMARY KEY (`IDEmail`),
KEY `fkIdx_138` (`PIB`),
CONSTRAINT `FK_138` FOREIGN KEY `fkIdx_138` (`PIB`) REFERENCES `Company` (`PIB`)
);

-- ************************************** `Contact`

CREATE TABLE `Contact`
(
 `IDContact` INT NOT NULL AUTO_INCREMENT ,
 `Telephone` VARCHAR(30) NOT NULL ,
 `Email`     VARCHAR(30) NOT NULL ,
 `FirstName` VARCHAR(30) NOT NULL ,
 `LastName`  VARCHAR(30) NOT NULL ,
 `PIB`       INT NOT NULL ,

PRIMARY KEY (`IDContact`),
KEY `fkIdx_129` (`PIB`),
CONSTRAINT `FK_129` FOREIGN KEY `fkIdx_129` (`PIB`) REFERENCES `Company` (`PIB`)
);

-- ************************************** `DonateContract`

CREATE TABLE `DonateContract`
(
 `IDContract`      INT NOT NULL ,
 `EstiamatedValue` INT NOT NULL ,
 `Description`     VARCHAR(150) NOT NULL ,
 `Quantity`        INT NOT NULL ,
 `DeliveryDate`    DATE NOT NULL ,

PRIMARY KEY (`IDContract`),
KEY `fkIdx_243` (`IDContract`),
CONSTRAINT `FK_243` FOREIGN KEY `fkIdx_243` (`IDContract`) REFERENCES `Contract` (`IDContract`)
);

-- ************************************** `MoneyContract`

CREATE TABLE `MoneyContract`
(
 `IDContract`        INT NOT NULL ,
 `Value`             INT NOT NULL ,
 `IsPaymentFinished` TINYINT(1) NOT NULL ,
 `IsInvoiceSent`     TINYINT(1) NOT NULL ,
 `PaymentDate`       DATE NOT NULL ,

PRIMARY KEY (`IDContract`),
KEY `fkIdx_238` (`IDContract`),
CONSTRAINT `FK_238` FOREIGN KEY `fkIdx_238` (`IDContract`) REFERENCES `Contract` (`IDContract`)
);

-- ************************************** `Lecture`

CREATE TABLE `Lecture`
(
 `Username`           VARCHAR(50) NOT NULL ,
 `PIB`                INT NOT NULL ,
 `IDLecture`          INT NOT NULL AUTO_INCREMENT ,
 `TitleSerbian`       VARCHAR(50) NOT NULL ,
 `TItleEnglish`       VARCHAR(50) ,
 `DescriptionSerbian` VARCHAR(300) NOT NULL ,
 `DescriptionEnglish` VARCHAR(300) ,
 `DateTime`           DATETIME NOT NULL ,
 `Hall`               VARCHAR(50) NOT NULL ,
 `FirstName`          VARCHAR(50) NOT NULL ,
 `LastName`           VARCHAR(50) NOT NULL ,
 `Biography`          VARCHAR(300) ,
 `FilePath`           VARCHAR(200) ,

PRIMARY KEY (`IDLecture`),
KEY `fkIdx_179` (`Username`, `PIB`),
CONSTRAINT `FK_179` FOREIGN KEY `fkIdx_179` (`Username`, `PIB`) REFERENCES `InContact` (`Username`, `PIB`)
);

-- ************************************** `Advertisement`

CREATE TABLE `Advertisement`
(
 `Username`        VARCHAR(50) NOT NULL ,
 `PIB`             INT NOT NULL ,
 `IDAdvertisement` INT NOT NULL AUTO_INCREMENT ,
 `Title`           VARCHAR(70) NOT NULL ,
 `Description`     VARCHAR(250) NOT NULL ,
 `CreationTime`    DATETIME NOT NULL ,
 `ExpireDate`      DATE NOT NULL ,
 `Type`            INT NOT NULL ,
 `FilePath`        VARCHAR(200) ,

PRIMARY KEY (`IDAdvertisement`),
KEY `fkIdx_164` (`Username`, `PIB`),
CONSTRAINT `FK_164` FOREIGN KEY `fkIdx_164` (`Username`, `PIB`) REFERENCES `InContact` (`Username`, `PIB`)
);
