CREATE TABLE public.users (
	id int4 DEFAULT nextval('user_sequence'::regclass) NOT NULL,
	username varchar(50) NOT NULL,
	email varchar(50) not null,
	"password" varchar(50) not null,
	created_at timestamp default 'now()',
	updated_at timestamp,
	CONSTRAINT users_pk PRIMARY KEY (id)
);


CREATE TABLE public.courses (
	id int4 DEFAULT nextval('courses_sequence'::regclass) NOT NULL,
	course varchar(50) NOT NULL,
	mentor varchar(50) not null,
	title varchar(50) not null,
	CONSTRAINT courses_pk PRIMARY KEY (id)
);


CREATE TABLE public.userCourse (
	id_user int4 not null,
	id_course int4 not null
);


insert into public.users(username, email, password,updated_at) 
values('Andi','andi@andi.com','12345',now()),
('Budi','budi@budi.com','6789',now()),
('Caca','caca@caca.com','8739',now()),
('Deni','deni@deni.com','9908',now()),
('Fira','fira@fira.com','8851',now());

insert into public.users(username, email, password,updated_at) 
values('Fafa','fafa@andi.com','12kdj5',now());

select*from users;

insert into public.courses(course,mentor,title) 
values('C++','Ari', 'Dr.'),
('C#','Ari', 'Dr.'),
('C#','Ari', 'Dr.'),
('CSS','Cania', 'S.Kom'),
('HTML','Cania', 'S.Kom'),
('Javascript','Cania', 'S.Kom'),
('Python','Barry', 'S.T'),
('Micropython','Barry', 'S.T'),
('Java','Darren', 'M.T'),
('Ruby','Darren', 'M.T');

select*from courses c;

insert into public.usercourse(id_user, id_course) 
values(1,1),(1,2),(1,3),(2,4),(2,5),(2,6),(3,7),(3,8),(3,9),
(4,1),(4,3),(4,5),(5,2),(5,4),(5,6),(6,7),(6,8),(6,9);

select*from public.usercourse u;



select u.id, u.username, c.course, c.mentor, c.title
from usercourse uc
join users u on uc.id_user = u.id 
join courses c on uc.id_course = c.id ;

select u.id, u.username, c.course, c.mentor, c.title
from usercourse uc
join users u on uc.id_user = u.id 
join courses c on uc.id_course = c.id 
where c.title ilike 'S.%';

select u.id, u.username, c.course, c.mentor, c.title
from usercourse uc
join users u on uc.id_user = u.id 
join courses c on uc.id_course = c.id 
where c.title not ilike 'S.%';


select c.mentor, count(u.id) as jumlah_pesesrta,
count(u.id)*2000000 as total_fee
from usercourse uc
join users u on uc.id_user = u.id 
join courses c on uc.id_course = c.id 
group by c.mentor order by count(u.id) desc;




