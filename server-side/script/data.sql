-- CLEAR TABLE --
drop table third_party_chart_of_account;
drop table chart_of_account;
drop table society_account;
drop table equivalent_currency_detail;
drop table society_equivalent_currency;
drop table society;
drop table account;
drop table currency;


-- Data test --
insert into currencies values
(1, 'AR'),
(2, 'EUR'),
(3, 'USD');


insert into users values
('1', 'Mister', 'Admin', '2000-01-01', 'admin@gmail.com', '034 00 000 00', 'LOT IBIS NOWHERE');


insert into societies values
('1', '12345678', 'DIMPEX', 'dimpex.png', 'Production articles industriels et vente de marchandises', 'ENCEINTE ITU ANDOHARANOFOTSY BP 1960 Antananarivo 101', 'Antananarivo', '2023-01-01', NULL, NULL, NULL, NULL, '2023-01-01', '1', '1');