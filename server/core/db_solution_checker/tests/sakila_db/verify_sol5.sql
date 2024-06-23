USE sakila;
select first_name, last_name
from actor
where last_name like '%LI%'
order by last_name, first_name;