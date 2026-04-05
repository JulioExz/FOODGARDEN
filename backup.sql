--
-- PostgreSQL database dump
--

\restrict tlxy4WMTup1D2I2BNzAVTrFUdktIfc6xxohh6SIBhmRfEh5YsqwY30IDRNClpjF

-- Dumped from database version 17.8
-- Dumped by pg_dump version 17.8

-- Started on 2026-04-04 16:54:54

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 16503)
-- Name: DetalleVentas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DetalleVentas" (
    id integer NOT NULL,
    "ventaId" integer NOT NULL,
    "productoId" integer NOT NULL,
    cantidad integer NOT NULL,
    "precioUnitario" numeric(18,2) NOT NULL,
    subtotal numeric(18,2) NOT NULL
);


ALTER TABLE public."DetalleVentas" OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16502)
-- Name: DetalleVentas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DetalleVentas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DetalleVentas_id_seq" OWNER TO postgres;

--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 231
-- Name: DetalleVentas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DetalleVentas_id_seq" OWNED BY public."DetalleVentas".id;


--
-- TOC entry 222 (class 1259 OID 16411)
-- Name: DuenoLocales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DuenoLocales" (
    id integer NOT NULL,
    "duenoId" integer NOT NULL,
    "localId" integer NOT NULL,
    "fechaAsignacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."DuenoLocales" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16410)
-- Name: DuenoLocales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DuenoLocales_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."DuenoLocales_id_seq" OWNER TO postgres;

--
-- TOC entry 4961 (class 0 OID 0)
-- Dependencies: 221
-- Name: DuenoLocales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DuenoLocales_id_seq" OWNED BY public."DuenoLocales".id;


--
-- TOC entry 226 (class 1259 OID 16447)
-- Name: Empleados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Empleados" (
    id integer NOT NULL,
    "usuarioId" integer NOT NULL,
    "localId" integer NOT NULL,
    puesto character varying(50) NOT NULL,
    salario numeric(18,2) NOT NULL,
    "fechaContratacion" date DEFAULT CURRENT_DATE,
    estado character varying(20) DEFAULT 'activo'::character varying
);


ALTER TABLE public."Empleados" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16446)
-- Name: Empleados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Empleados_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Empleados_id_seq" OWNER TO postgres;

--
-- TOC entry 4962 (class 0 OID 0)
-- Dependencies: 225
-- Name: Empleados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Empleados_id_seq" OWNED BY public."Empleados".id;


--
-- TOC entry 224 (class 1259 OID 16429)
-- Name: GerenteLocales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GerenteLocales" (
    id integer NOT NULL,
    "gerenteId" integer NOT NULL,
    "localId" integer NOT NULL,
    "fechaAsignacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."GerenteLocales" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16428)
-- Name: GerenteLocales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GerenteLocales_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GerenteLocales_id_seq" OWNER TO postgres;

--
-- TOC entry 4963 (class 0 OID 0)
-- Dependencies: 223
-- Name: GerenteLocales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GerenteLocales_id_seq" OWNED BY public."GerenteLocales".id;


--
-- TOC entry 220 (class 1259 OID 16400)
-- Name: Locales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Locales" (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(500),
    categoria character varying(50) NOT NULL,
    estado character varying(20) DEFAULT 'activo'::character varying,
    ubicacion character varying(100),
    telefono character varying(20),
    horario character varying(100),
    imagen character varying(255),
    "fechaCreacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."Locales" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16399)
-- Name: Locales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Locales_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Locales_id_seq" OWNER TO postgres;

--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 219
-- Name: Locales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Locales_id_seq" OWNED BY public."Locales".id;


--
-- TOC entry 234 (class 1259 OID 16520)
-- Name: MovimientosInventario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MovimientosInventario" (
    id integer NOT NULL,
    "productoId" integer NOT NULL,
    "empleadoId" integer NOT NULL,
    tipo character varying(20) NOT NULL,
    cantidad integer NOT NULL,
    motivo character varying(255) NOT NULL,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."MovimientosInventario" OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16519)
-- Name: MovimientosInventario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MovimientosInventario_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."MovimientosInventario_id_seq" OWNER TO postgres;

--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 233
-- Name: MovimientosInventario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MovimientosInventario_id_seq" OWNED BY public."MovimientosInventario".id;


--
-- TOC entry 228 (class 1259 OID 16466)
-- Name: Productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Productos" (
    id integer NOT NULL,
    "localId" integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(500),
    precio numeric(18,2) NOT NULL,
    categoria character varying(50) NOT NULL,
    stock integer DEFAULT 0,
    "stockMinimo" integer DEFAULT 10,
    imagen character varying(255),
    estado character varying(20) DEFAULT 'disponible'::character varying,
    "fechaCreacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."Productos" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16465)
-- Name: Productos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Productos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Productos_id_seq" OWNER TO postgres;

--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 227
-- Name: Productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Productos_id_seq" OWNED BY public."Productos".id;


--
-- TOC entry 218 (class 1259 OID 16388)
-- Name: Usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Usuarios" (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    rol character varying(20) NOT NULL,
    telefono character varying(20),
    avatar character varying(255),
    estado character varying(20) DEFAULT 'activo'::character varying,
    "fechaCreacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."Usuarios" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16387)
-- Name: Usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Usuarios_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Usuarios_id_seq" OWNER TO postgres;

--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 217
-- Name: Usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Usuarios_id_seq" OWNED BY public."Usuarios".id;


--
-- TOC entry 230 (class 1259 OID 16484)
-- Name: Ventas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Ventas" (
    id integer NOT NULL,
    "localId" integer NOT NULL,
    "empleadoId" integer NOT NULL,
    subtotal numeric(18,2) NOT NULL,
    impuestos numeric(18,2) NOT NULL,
    total numeric(18,2) NOT NULL,
    "metodoPago" character varying(20) NOT NULL,
    estado character varying(20) DEFAULT 'completada'::character varying,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."Ventas" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16483)
-- Name: Ventas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Ventas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Ventas_id_seq" OWNER TO postgres;

--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 229
-- Name: Ventas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Ventas_id_seq" OWNED BY public."Ventas".id;


--
-- TOC entry 4758 (class 2604 OID 16506)
-- Name: DetalleVentas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleVentas" ALTER COLUMN id SET DEFAULT nextval('public."DetalleVentas_id_seq"'::regclass);


--
-- TOC entry 4743 (class 2604 OID 16414)
-- Name: DuenoLocales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DuenoLocales" ALTER COLUMN id SET DEFAULT nextval('public."DuenoLocales_id_seq"'::regclass);


--
-- TOC entry 4747 (class 2604 OID 16450)
-- Name: Empleados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Empleados" ALTER COLUMN id SET DEFAULT nextval('public."Empleados_id_seq"'::regclass);


--
-- TOC entry 4745 (class 2604 OID 16432)
-- Name: GerenteLocales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GerenteLocales" ALTER COLUMN id SET DEFAULT nextval('public."GerenteLocales_id_seq"'::regclass);


--
-- TOC entry 4740 (class 2604 OID 16403)
-- Name: Locales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Locales" ALTER COLUMN id SET DEFAULT nextval('public."Locales_id_seq"'::regclass);


--
-- TOC entry 4759 (class 2604 OID 16523)
-- Name: MovimientosInventario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovimientosInventario" ALTER COLUMN id SET DEFAULT nextval('public."MovimientosInventario_id_seq"'::regclass);


--
-- TOC entry 4750 (class 2604 OID 16469)
-- Name: Productos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos" ALTER COLUMN id SET DEFAULT nextval('public."Productos_id_seq"'::regclass);


--
-- TOC entry 4736 (class 2604 OID 16391)
-- Name: Usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios" ALTER COLUMN id SET DEFAULT nextval('public."Usuarios_id_seq"'::regclass);


--
-- TOC entry 4755 (class 2604 OID 16487)
-- Name: Ventas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ventas" ALTER COLUMN id SET DEFAULT nextval('public."Ventas_id_seq"'::regclass);


--
-- TOC entry 4952 (class 0 OID 16503)
-- Dependencies: 232
-- Data for Name: DetalleVentas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DetalleVentas" (id, "ventaId", "productoId", cantidad, "precioUnitario", subtotal) FROM stdin;
\.


--
-- TOC entry 4942 (class 0 OID 16411)
-- Dependencies: 222
-- Data for Name: DuenoLocales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DuenoLocales" (id, "duenoId", "localId", "fechaAsignacion") FROM stdin;
1	2	1	2025-10-24 20:12:17.527
2	2	3	2025-10-24 20:12:17.527
3	3	2	2025-10-24 20:12:17.527
\.


--
-- TOC entry 4946 (class 0 OID 16447)
-- Dependencies: 226
-- Data for Name: Empleados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Empleados" (id, "usuarioId", "localId", puesto, salario, "fechaContratacion", estado) FROM stdin;
\.


--
-- TOC entry 4944 (class 0 OID 16429)
-- Dependencies: 224
-- Data for Name: GerenteLocales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GerenteLocales" (id, "gerenteId", "localId", "fechaAsignacion") FROM stdin;
\.


--
-- TOC entry 4940 (class 0 OID 16400)
-- Dependencies: 220
-- Data for Name: Locales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Locales" (id, nombre, descripcion, categoria, estado, ubicacion, telefono, horario, imagen, "fechaCreacion") FROM stdin;
1	Tacos El Patr¢n	Tacos mexicanos	Comida Mexicana	activo	Local 12-A	664-111-2222	10AM-10PM	\N	2025-10-24 20:12:17.527
2	Sushi Bar Tokio	Sushi fresco	Comida Japonesa	activo	Local 08-B	664-222-3333	11AM-11PM	\N	2025-10-24 20:12:17.527
3	Burger House	Hamburguesas	Comida R pida	activo	Local 05-C	664-333-4444	9AM-11PM	\N	2025-10-24 20:12:17.527
\.


--
-- TOC entry 4954 (class 0 OID 16520)
-- Dependencies: 234
-- Data for Name: MovimientosInventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MovimientosInventario" (id, "productoId", "empleadoId", tipo, cantidad, motivo, fecha) FROM stdin;
\.


--
-- TOC entry 4948 (class 0 OID 16466)
-- Dependencies: 228
-- Data for Name: Productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Productos" (id, "localId", nombre, descripcion, precio, categoria, stock, "stockMinimo", imagen, estado, "fechaCreacion") FROM stdin;
\.


--
-- TOC entry 4938 (class 0 OID 16388)
-- Dependencies: 218
-- Data for Name: Usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Usuarios" (id, nombre, email, password, rol, telefono, avatar, estado, "fechaCreacion", "fechaActualizacion") FROM stdin;
2	Carlos Ram¡rez	carlos@foodgarden.com	$2a$10$CwTycUXWue0Thq9StjUM0uyhG8okaOEbkiTt9b.twm.p7ksZqXqK6	due¤o	664-234-5678	\N	activo	2025-10-24 20:12:17.527	2025-10-24 20:12:17.527
3	Mar¡a Gonz lez	maria@foodgarden.com	$2a$10$CwTycUXWue0Thq9StjUM0uyhG8okaOEbkiTt9b.twm.p7ksZqXqK6	due¤o	664-345-6789	\N	activo	2025-10-24 20:12:17.527	2025-10-24 20:12:17.527
4	Juan perez	empleado1@gmail.com	$2b$10$wJBTTaVlXmqyribduvUy7.TZeQ2pzFk.Vr/UsFE5lJjHXXYIibMxi	empleado	664-345-6789	\N	activo	2025-10-26 16:40:42.54	2025-10-26 16:40:42.54
1	Admin Principal	admin@foodgarden.com	$2b$10$wc6i2ocntTpXe5hJP4Jfj.2QkP8ahZ6Q5RXPWyF25gsX6w3srrxVe	admin	664-123-4567	\N	activo	2025-10-24 20:12:17.523	2026-04-04 16:26:10.404687
\.


--
-- TOC entry 4950 (class 0 OID 16484)
-- Dependencies: 230
-- Data for Name: Ventas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Ventas" (id, "localId", "empleadoId", subtotal, impuestos, total, "metodoPago", estado, fecha) FROM stdin;
\.


--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 231
-- Name: DetalleVentas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DetalleVentas_id_seq"', 1, false);


--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 221
-- Name: DuenoLocales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DuenoLocales_id_seq"', 1, false);


--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 225
-- Name: Empleados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Empleados_id_seq"', 1, false);


--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 223
-- Name: GerenteLocales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GerenteLocales_id_seq"', 1, false);


--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 219
-- Name: Locales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Locales_id_seq"', 1, false);


--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 233
-- Name: MovimientosInventario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MovimientosInventario_id_seq"', 1, false);


--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 227
-- Name: Productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Productos_id_seq"', 1, false);


--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 217
-- Name: Usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Usuarios_id_seq"', 1, false);


--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 229
-- Name: Ventas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Ventas_id_seq"', 1, false);


--
-- TOC entry 4776 (class 2606 OID 16508)
-- Name: DetalleVentas DetalleVentas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleVentas"
    ADD CONSTRAINT "DetalleVentas_pkey" PRIMARY KEY (id);


--
-- TOC entry 4766 (class 2606 OID 16417)
-- Name: DuenoLocales DuenoLocales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DuenoLocales"
    ADD CONSTRAINT "DuenoLocales_pkey" PRIMARY KEY (id);


--
-- TOC entry 4770 (class 2606 OID 16454)
-- Name: Empleados Empleados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Empleados"
    ADD CONSTRAINT "Empleados_pkey" PRIMARY KEY (id);


--
-- TOC entry 4768 (class 2606 OID 16435)
-- Name: GerenteLocales GerenteLocales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GerenteLocales"
    ADD CONSTRAINT "GerenteLocales_pkey" PRIMARY KEY (id);


--
-- TOC entry 4764 (class 2606 OID 16409)
-- Name: Locales Locales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Locales"
    ADD CONSTRAINT "Locales_pkey" PRIMARY KEY (id);


--
-- TOC entry 4778 (class 2606 OID 16526)
-- Name: MovimientosInventario MovimientosInventario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovimientosInventario"
    ADD CONSTRAINT "MovimientosInventario_pkey" PRIMARY KEY (id);


--
-- TOC entry 4772 (class 2606 OID 16477)
-- Name: Productos Productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT "Productos_pkey" PRIMARY KEY (id);


--
-- TOC entry 4762 (class 2606 OID 16398)
-- Name: Usuarios Usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_pkey" PRIMARY KEY (id);


--
-- TOC entry 4774 (class 2606 OID 16491)
-- Name: Ventas Ventas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ventas"
    ADD CONSTRAINT "Ventas_pkey" PRIMARY KEY (id);


--
-- TOC entry 4788 (class 2606 OID 16514)
-- Name: DetalleVentas fk_detalle_producto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleVentas"
    ADD CONSTRAINT fk_detalle_producto FOREIGN KEY ("productoId") REFERENCES public."Productos"(id);


--
-- TOC entry 4789 (class 2606 OID 16509)
-- Name: DetalleVentas fk_detalle_venta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DetalleVentas"
    ADD CONSTRAINT fk_detalle_venta FOREIGN KEY ("ventaId") REFERENCES public."Ventas"(id);


--
-- TOC entry 4779 (class 2606 OID 16423)
-- Name: DuenoLocales fk_dueno_local; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DuenoLocales"
    ADD CONSTRAINT fk_dueno_local FOREIGN KEY ("localId") REFERENCES public."Locales"(id);


--
-- TOC entry 4780 (class 2606 OID 16418)
-- Name: DuenoLocales fk_dueno_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DuenoLocales"
    ADD CONSTRAINT fk_dueno_usuario FOREIGN KEY ("duenoId") REFERENCES public."Usuarios"(id);


--
-- TOC entry 4783 (class 2606 OID 16460)
-- Name: Empleados fk_empleado_local; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Empleados"
    ADD CONSTRAINT fk_empleado_local FOREIGN KEY ("localId") REFERENCES public."Locales"(id);


--
-- TOC entry 4784 (class 2606 OID 16455)
-- Name: Empleados fk_empleado_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Empleados"
    ADD CONSTRAINT fk_empleado_usuario FOREIGN KEY ("usuarioId") REFERENCES public."Usuarios"(id);


--
-- TOC entry 4781 (class 2606 OID 16441)
-- Name: GerenteLocales fk_gerente_local; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GerenteLocales"
    ADD CONSTRAINT fk_gerente_local FOREIGN KEY ("localId") REFERENCES public."Locales"(id);


--
-- TOC entry 4782 (class 2606 OID 16436)
-- Name: GerenteLocales fk_gerente_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GerenteLocales"
    ADD CONSTRAINT fk_gerente_usuario FOREIGN KEY ("gerenteId") REFERENCES public."Usuarios"(id);


--
-- TOC entry 4790 (class 2606 OID 16532)
-- Name: MovimientosInventario fk_movimiento_empleado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovimientosInventario"
    ADD CONSTRAINT fk_movimiento_empleado FOREIGN KEY ("empleadoId") REFERENCES public."Empleados"(id);


--
-- TOC entry 4791 (class 2606 OID 16527)
-- Name: MovimientosInventario fk_movimiento_producto; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MovimientosInventario"
    ADD CONSTRAINT fk_movimiento_producto FOREIGN KEY ("productoId") REFERENCES public."Productos"(id);


--
-- TOC entry 4785 (class 2606 OID 16478)
-- Name: Productos fk_producto_local; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Productos"
    ADD CONSTRAINT fk_producto_local FOREIGN KEY ("localId") REFERENCES public."Locales"(id);


--
-- TOC entry 4786 (class 2606 OID 16497)
-- Name: Ventas fk_venta_empleado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ventas"
    ADD CONSTRAINT fk_venta_empleado FOREIGN KEY ("empleadoId") REFERENCES public."Empleados"(id);


--
-- TOC entry 4787 (class 2606 OID 16492)
-- Name: Ventas fk_venta_local; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ventas"
    ADD CONSTRAINT fk_venta_local FOREIGN KEY ("localId") REFERENCES public."Locales"(id);


-- Completed on 2026-04-04 16:54:54

--
-- PostgreSQL database dump complete
--

\unrestrict tlxy4WMTup1D2I2BNzAVTrFUdktIfc6xxohh6SIBhmRfEh5YsqwY30IDRNClpjF

