USE sakila;
select concat(s.first_name,' ',s.last_name) as 'Staff Member', sum(p.amount) as 'Total Amount'
from payment as p
join staff as s
on p.staff_id = s.staff_id
where payment_date like '2005-08%'
group by p.staff_id;