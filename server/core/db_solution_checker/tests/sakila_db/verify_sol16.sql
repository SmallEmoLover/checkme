USE sakila;
select concat(c.first_name,' ',c.last_name) as 'Customer Name', sum(p.amount) as 'Total Paid'
from payment as p
join customer as c
on p.customer_id = c.customer_id
group by p.customer_id;