USE sakila;
select f.title
from film as f
where f.language_id = (select language_id from language where name = 'English')
and f.title like 'K%' or 'Q%' ;