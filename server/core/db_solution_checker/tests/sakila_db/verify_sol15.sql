USE sakila;
select f.title as Film, count(i.inventory_id) as 'Inventory Count'
from film as f
join inventory as i
on f.film_id = i.film_id
where f.title = 'Hunchback Impossible'
group by f.film_id;