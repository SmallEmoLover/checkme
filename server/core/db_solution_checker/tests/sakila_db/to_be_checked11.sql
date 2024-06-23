USE sakila;
create table address_new (
    address_id integer(11) NOT NULL,
        address varchar(30) NOT NULL,
        adress2 varchar(30) NOT NULL,
        district varchar(30) NOT NULL,
        city_id integer(11) NOT NULL,
        postal_code integer(11) NOT NULL,
        phone integer(10) NOT NULL,
        location varchar(30) NOT NULL,
        last_update datetime
);
SHOW TABLES LIKE 'address_new' LIMIT 1;