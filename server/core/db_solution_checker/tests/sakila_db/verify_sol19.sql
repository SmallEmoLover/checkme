USE sakila;
select concat(c.first_name,' ',c.last_name) as 'Name', c.email as 'E-mail'
from customer as c
join address as a on c.address_id = a.address_id
join city as cy on a.city_id = cy.city_id
join country as ct on ct.country_id = cy.country_id
where ct.country = 'Canada';