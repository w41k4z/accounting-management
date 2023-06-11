CREATE DATABASE accounting_management_system OWNER walker;

CREATE SEQUENCE currency_seq;
CREATE SEQUENCE account_seq;
CREATE SEQUENCE society_seq;
CREATE SEQUENCE soc_equi_curr_seq;
CREATE SEQUENCE equi_curr_det_seq;
CREATE SEQUENCE society_account_seq;
CREATE SEQUENCE chart_of_account_seq;
CREATE SEQUENCE third_party_account_type_seq;
CREATE SEQUENCE third_party_chart_of_account_seq;
CREATE SEQUENCE journal_code_seq;
CREATE SEQUENCE journal_seq;

CREATE TABLE currencies (
    id SERIAL PRIMARY KEY,
    label VARCHAR(3) NOT NULL UNIQUE
);
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    first_name VARCHAR(25),
    birthdate DATE NOT NULL,
    email VARCHAR(25) NOT NULL UNIQUE,
    phone_number VARCHAR(14),
    address TEXT
);
CREATE TABLE societies (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    password VARCHAR(16) NOT NULL
    name VARCHAR(25) NOT NULL,
    logo VARCHAR(50) NOT NULL,
    object TEXT NOT NULL,
    address TEXT NOT NULL,
    headquarters VARCHAR(25) NOT NULL,
    creation_date DATE NOT NULL,
    tin VARCHAR(25), -- tax identification number
    stn VARCHAR(25), -- statistical number
    crgn VARCHAR(25), -- commercial register number
    status VARCHAR(25), 
    stdtacpd DATE NOT NULL, -- start date of accounting period
    accounting_currency VARCHAR(5) REFERENCES currencies(id)
);
CREATE TABLE general_chart_of_accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(5) NOT NULL, -- is unique for each society
    entitled VARCHAR(50)
);
CREATE TABLE third_party_chart_of_accounts (
    id SERIAL PRIMARY KEY,
    type ENUM('FO', 'CL') NOT NULL,
    value VARCHAR(25) NOT NUll
);
ALTER TABLE third_party_chart_of_account
  ADD CONSTRAINT uq_third_party_chart_of_account UNIQUE(key, value);

CREATE TABLE journal_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(2) NOT NULL,
    entitled VARCHAR(25) NOT NULL
);
CREATE TABLE reference_documents (
    id SERIAL PRIMARY KEY,
    reference VARCHAR(2) NOT NULL,
    meaning VARCHAR(15) NOT NULL
);
CREATE TABLE journals (
    id SERIAL PRIMARY KEY,
    society_id VARCHAR(8) REFERENCES society(id),
    journal_date DATE NOT NULL,
    code INT REFERENCES journal_codes(id),
    reference INT REFERENCES reference_documents(id),
    ref_number VARCHAR(1) NOT NULL,
    description TEXT NOT NULL
);
CREATE TABLE journal_details (
    id SERIAL PRIMARY KEY,
    journal_id INT REFERENCES journals(id),
    general_account INT REFERENCES general_chart_of_accounts(id),
    third_party_account INT REFERENCES third_party_chart_of_accounts(id),
    debit DECIMAL(10,2),
    credit DECIMAL(10,2)
);