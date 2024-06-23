USE sakila;
select last_name as 'Last Name', count(last_name) as 'Last Name Count'
from actor
group by last_name;