USE sakila;
select f.title as 'Film', count(fa.actor_id) as 'Number of Actors'
from film as f
join film_actor as fa
on f.film_id = fa.film_id
group by f.title;