USE sakila;
update actor
set first_name = 'GROUCHO'
where first_name = 'Harpo';

update actor
set first_name = case
    when first_name = 'Harpo' THEN 'GROUCHO'
    when first_name = 'Groucho' THEN 'MUCHO GROUCHO'
    else first_name
END;

select *
from actor;