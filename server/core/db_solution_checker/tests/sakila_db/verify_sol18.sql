USE sakila;
select CONCAT(first_name,' ',last_name) as 'Actors in Alone Trip'
from actor
where actor_id in
(select actor_id from film_actor where film_id =
(select film_id from film where title = 'Alone Trip'));