USE sakila;
select country_id, country
from country
where country in ('Afghanistan', 'Bangladesh', 'China');