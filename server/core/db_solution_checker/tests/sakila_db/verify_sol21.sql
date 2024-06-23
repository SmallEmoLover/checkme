USE sakila;
select f.title as 'Movie', count(r.rental_date) as 'Times Rented'
from film as f
join inventory as i on i.film_id = f.film_id
join rental as r on r.inventory_id = i.inventory_id
group by f.title
order by count(r.rental_date) desc;