Drop table earning_calender;

create table earning_calender(
symbol VARCHAR,
name VARCHAR,
reportDate Date,
fiscalDate Date,
estimate Float,
currency VARCHAR);


select count(*) from earning_calender;

select * from earning_calender;

select distinct symbol, name from earning_calender;

Drop table ticker; 

create table ticker(
symbol VARCHAR,
name VARCHAR);

select count(*) from ticker;

select * from ticker;


