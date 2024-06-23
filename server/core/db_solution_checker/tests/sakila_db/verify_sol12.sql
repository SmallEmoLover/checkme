USE sakila;
select s.first_name as 'First Name', s.last_name as 'Last Name', a.address as 'Address'
from staff as s
join address as a
ON a.address_id = s.address_id;