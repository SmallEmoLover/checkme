USE sakila;
select f.title as 'Movie Title'
from film as f
join film_category as fc on fc.film_id = f.film_id
join category as c on c.category_id = fc.category_id
where c.name = 'Family';