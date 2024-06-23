USE sakila;
update actor
set first_name = 'HARPO'
where first_name = 'Groucho' and last_name = 'Williams';

select *
from actor
where last_name = 'Williams';