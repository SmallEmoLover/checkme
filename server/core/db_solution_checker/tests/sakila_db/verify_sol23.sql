USE sakila;
select s.store_id as 'Store ID', c.city as 'City', cy.country as 'Country'
from store as s
join address as a on a.address_id = s.address_id
join city as c on c.city_id = a.city_id
join country as cy on cy.country_id = c.country_id
order by s.store_id;