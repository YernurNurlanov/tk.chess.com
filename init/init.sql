--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3 (Debian 16.3-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: completed_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.completed_tasks (
                                        id bigint NOT NULL,
                                        attempt_number integer,
                                        completed boolean NOT NULL,
                                        completed_at timestamp(6) without time zone,
                                        task_id bigint,
                                        student_id bigint
);


ALTER TABLE public.completed_tasks OWNER TO postgres;

--
-- Name: completed_tasks_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.completed_tasks_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.completed_tasks_seq OWNER TO postgres;

--
-- Name: consumers_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consumers_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consumers_seq OWNER TO postgres;

--
-- Name: group_students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.group_students (
                                       group_id bigint NOT NULL,
                                       student_id bigint
);


ALTER TABLE public.group_students OWNER TO postgres;

--
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
                               id bigint NOT NULL,
                               teacher_id bigint,
                               group_name character varying(100)
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- Name: groups_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.groups_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.groups_seq OWNER TO postgres;

--
-- Name: lesson_attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lesson_attendance (
                                          lesson_id bigint NOT NULL,
                                          present_student_id bigint
);


ALTER TABLE public.lesson_attendance OWNER TO postgres;

--
-- Name: lesson_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lesson_tasks (
                                     lesson_id bigint NOT NULL,
                                     task_id bigint
);


ALTER TABLE public.lesson_tasks OWNER TO postgres;

--
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
                                id bigint NOT NULL,
                                end_time timestamp(6) without time zone,
                                group_id bigint,
                                start_time timestamp(6) without time zone,
                                teacher_id bigint
);


ALTER TABLE public.lessons OWNER TO postgres;

--
-- Name: lessons_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lessons_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lessons_seq OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
                                 id bigint NOT NULL,
                                 last_payment timestamp(6) without time zone,
                                 teacher_id bigint
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
                              id bigint NOT NULL,
                              level character varying(255),
                              topic character varying(255),
                              end_fin character varying(255),
                              start_fin character varying(255) NOT NULL
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: tasks_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_seq OWNER TO postgres;

--
-- Name: teachers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teachers (
                                 id bigint NOT NULL,
                                 bio character varying(255) NOT NULL,
                                 chess_rating integer NOT NULL,
                                 experience_years integer NOT NULL,
                                 hourly_rate integer NOT NULL,
                                 schedule character varying(255) NOT NULL
);


ALTER TABLE public.teachers OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
                              id bigint NOT NULL,
                              created_at timestamp(6) without time zone NOT NULL,
                              email character varying(100) NOT NULL,
                              first_name character varying(20) NOT NULL,
                              last_name character varying(20) NOT NULL,
                              password character varying(255) NOT NULL,
                              phone character varying(255) NOT NULL,
                              role character varying(255) NOT NULL,
                              CONSTRAINT users_role_check CHECK (((role)::text = ANY (ARRAY[('ROLE_ADMIN'::character varying)::text, ('ROLE_TEACHER'::character varying)::text, ('ROLE_STUDENT'::character varying)::text])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_seq OWNER TO postgres;

--
-- Data for Name: completed_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.completed_tasks (id, attempt_number, completed, completed_at, task_id, student_id) FROM stdin;
1	2	t	2025-05-10 17:36:00.775942	1	1002
2	3	f	\N	3	1002
3	2	t	2025-05-10 18:03:05.36123	52	1002
52	3	f	\N	1	902
53	1	t	2025-05-14 21:16:24.283523	3	902
\.


--
-- Data for Name: group_students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.group_students (group_id, student_id) FROM stdin;
102	902
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groups (id, teacher_id, group_name) FROM stdin;
102	1102	tamer 1
202	1102	123
\.


--
-- Data for Name: lesson_attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lesson_attendance (lesson_id, present_student_id) FROM stdin;
\.


--
-- Data for Name: lesson_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lesson_tasks (lesson_id, task_id) FROM stdin;
402	1
402	3
402	53
402	103
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (id, end_time, group_id, start_time, teacher_id) FROM stdin;
402	2025-05-13 10:00:00	102	2025-05-13 09:00:00	1102
452	2025-05-14 09:30:00	102	2025-05-14 08:30:00	1102
454	2025-05-15 09:39:00	102	2025-05-15 08:39:00	1102
455	2025-05-13 20:41:00	102	2025-05-13 19:41:00	1102
502	2025-05-18 15:00:00	102	2025-05-18 14:00:00	1102
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, last_payment, teacher_id) FROM stdin;
902	2025-03-29 12:57:28.978758	1102
1002	2025-03-31 12:57:28.978758	\N
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, level, topic, end_fin, start_fin) FROM stdin;
1	BEGINNER	Материальный баланс	1rb2rk1/pp2pppp/3p1n2/q1pP4/2P5/4PN2/PP3PPP/RQ3RK1 w Q - 0 1	1rb2rk1/pp2pppp/3p1n2/q1p5/2PP4/4PN2/PP3PPP/RQ3RK1 w Q - 0 1
3	BEGINNER	Что лучше съесть?	k7/1p3N2/2r5/8/8/7P/6P1/6BK w - - 0 1	k7/1p3b2/2r5/4N3/8/7P/6P1/6BK w - - 0 1
52	BEGINNER	Что лучше съесть?	7r/Bp3p1k/6p1/8/8/6P1/5PK1/3R4 b - - 0 1	7r/qp3p1k/6p1/8/3B4/6P1/5PK1/3R4 w - - 0 1
53	BEGINNER	Что лучше съесть?	1k4Q1/1p6/p7/7p/q7/7P/1P4P1/7K b - - 0 1	1k4n1/1p6/p7/3Q3p/q7/7P/1P4P1/7K w - - 0 1
103	FOURTH_CATEGORY	Что лучше съесть?	8/1k2B3/8/7P/8/5p2/8/4nK2 b - - 0 1	8/1k2r3/8/7P/1B6/5p2/8/4nK2 w - - 0 1
152	BEGINNER	Сheckmate with a rook		8/8/4k3/8/8/8/R3K3/8 w - - 0 1
153	BEGINNER	Сheckmate with a rook		8/8/5k2/8/3R4/8/1K6/8 w - - 0 1
202	BEGINNER	Сheckmate with a queen		8/8/5k2/8/8/1Q6/8/4K3 w - - 0 1
203	BEGINNER	Сheckmate with a queen		8/4k3/8/8/8/8/3Q4/K7 w - - 0 1
204	BEGINNER	Linear checkmate		8/8/8/8/8/6k1/1R6/R5K1 w - - 0 1
205	BEGINNER	Linear checkmate		8/4k3/8/8/8/1R6/2R5/K7 w - - 0 1
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachers (id, bio, chess_rating, experience_years, hourly_rate, schedule) FROM stdin;
1102	18 years old. from Astana	2500	3	3000	Monday-Friday 18:00-20:00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, created_at, email, first_name, last_name, password, phone, role) FROM stdin;
1	2025-03-27 14:30:45.123456	admin@gmail.com	admin	admin	$2a$10$p/BHq96UlcYJZpOJqNLikeVD0CKFzqalWffNkkOT2G0TiGNNj5.4G	87777777777	ROLE_ADMIN
902	2025-03-29 12:58:32.272298	john.doe@example.com	John	Doe	$2a$10$EuWRtR0yQdd1U8rjQKxueelRmN.8PBkxxxOnoYnQRaiSrQCGrsy4u	87777777776	ROLE_STUDENT
1002	2025-04-02 13:11:20.617579	ansar@example.com	Ansar	Ulan	$2a$10$QuUc7Y4f7JHhKDHsKoCKnObIW9awM.MAeMC4tk9k4tTKURD0cJKMO	87777777774	ROLE_STUDENT
1102	2025-04-11 22:42:32.747653	tamer@gmail.com	Tamer	Bezpalev	$2a$10$iKYzlv4Av6bsumoOkMAj9OCQZVdfspfir2GOciU2NTh9Ux2UxPGh.	87777777775	ROLE_TEACHER
\.


--
-- Name: completed_tasks_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.completed_tasks_seq', 101, true);


--
-- Name: consumers_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consumers_seq', 251, true);


--
-- Name: groups_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.groups_seq', 251, true);


--
-- Name: lessons_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lessons_seq', 551, true);


--
-- Name: tasks_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_seq', 251, true);


--
-- Name: users_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_seq', 1351, true);


--
-- Name: completed_tasks completed_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_tasks
    ADD CONSTRAINT completed_tasks_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: users uk6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: users ukdu5v5sr43g5bfnji4vb8hg5s3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT ukdu5v5sr43g5bfnji4vb8hg5s3 UNIQUE (phone);


--
-- Name: completed_tasks ukkeiaj702nh2hldnw94sg1sv2j; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_tasks
    ADD CONSTRAINT ukkeiaj702nh2hldnw94sg1sv2j UNIQUE (student_id, task_id, attempt_number);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: lesson_attendance fk46fbno9v1g3xlttpqehanlpbs; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_attendance
    ADD CONSTRAINT fk46fbno9v1g3xlttpqehanlpbs FOREIGN KEY (lesson_id) REFERENCES public.lessons(id);


--
-- Name: group_students fk5xwqsk30pbk3opg7gyuqydfua; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.group_students
    ADD CONSTRAINT fk5xwqsk30pbk3opg7gyuqydfua FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: students fk7xqmtv7r2eb5axni3jm0a80su; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT fk7xqmtv7r2eb5axni3jm0a80su FOREIGN KEY (id) REFERENCES public.users(id);


--
-- Name: lesson_tasks fke2n9x7d4ftbtn46jpksm0krat; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_tasks
    ADD CONSTRAINT fke2n9x7d4ftbtn46jpksm0krat FOREIGN KEY (lesson_id) REFERENCES public.lessons(id);


--
-- Name: groups fknmyf0spmtdlf9j4rx8el081uc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT fknmyf0spmtdlf9j4rx8el081uc FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: teachers fkpavufmal5lbtc60csriy8sx3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT fkpavufmal5lbtc60csriy8sx3 FOREIGN KEY (id) REFERENCES public.users(id);


--
-- Name: lessons fktdolsaotaqlwxbxwaxt00kimk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT fktdolsaotaqlwxbxwaxt00kimk FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- PostgreSQL database dump complete
--

