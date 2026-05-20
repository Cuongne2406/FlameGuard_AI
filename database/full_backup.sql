--
-- PostgreSQL database dump
--

\restrict kf9fUuBg1dnaE8MIgw7mVCfes1cHy7hHbHqH3sXrZEZziHSl5d9j0rNZLWkb40O

-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

-- Started on 2026-04-22 20:32:55

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

--
-- TOC entry 909 (class 1247 OID 17968)
-- Name: assetloanstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assetloanstatus AS ENUM (
    'REQUESTED',
    'APPROVED',
    'BORROWED',
    'RETURNED',
    'OVERDUE'
);


ALTER TYPE public.assetloanstatus OWNER TO postgres;

--
-- TOC entry 906 (class 1247 OID 17958)
-- Name: assetstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.assetstatus AS ENUM (
    'AVAILABLE',
    'IN_USE',
    'MAINTENANCE',
    'BROKEN'
);


ALTER TYPE public.assetstatus OWNER TO postgres;

--
-- TOC entry 915 (class 1247 OID 17988)
-- Name: auditaction; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.auditaction AS ENUM (
    'AUTO_PUBLISHED',
    'FLAGGED_FOR_REVIEW',
    'AUTO_HIDDEN'
);


ALTER TYPE public.auditaction OWNER TO postgres;

--
-- TOC entry 882 (class 1247 OID 17890)
-- Name: authprovider; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.authprovider AS ENUM (
    'LOCAL',
    'S4H'
);


ALTER TYPE public.authprovider OWNER TO postgres;

--
-- TOC entry 978 (class 1247 OID 18277)
-- Name: awardstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.awardstatus AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public.awardstatus OWNER TO postgres;

--
-- TOC entry 894 (class 1247 OID 17920)
-- Name: campaignstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.campaignstatus AS ENUM (
    'PLANNING',
    'ONGOING',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public.campaignstatus OWNER TO postgres;

--
-- TOC entry 1032 (class 1247 OID 26734)
-- Name: criteriatype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.criteriatype AS ENUM (
    'MIN_GPA',
    'MIN_TRAINING_SCORE',
    'MIN_EVENTS_ATTENDED',
    'REQUIRED_EVENT_CATEGORY',
    'CUSTOM'
);


ALTER TYPE public.criteriatype OWNER TO postgres;

--
-- TOC entry 981 (class 1247 OID 18284)
-- Name: documentstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.documentstatus AS ENUM (
    'PENDING',
    'PROCESSING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public.documentstatus OWNER TO postgres;

--
-- TOC entry 900 (class 1247 OID 17940)
-- Name: eventregistrationstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.eventregistrationstatus AS ENUM (
    'REGISTERED',
    'ATTENDED',
    'CANCELLED',
    'PENDING'
);


ALTER TYPE public.eventregistrationstatus OWNER TO postgres;

--
-- TOC entry 897 (class 1247 OID 17930)
-- Name: eventstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.eventstatus AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'LIVE',
    'ENDED'
);


ALTER TYPE public.eventstatus OWNER TO postgres;

--
-- TOC entry 903 (class 1247 OID 17948)
-- Name: fundrequeststatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.fundrequeststatus AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'DISBURSED'
);


ALTER TYPE public.fundrequeststatus OWNER TO postgres;

--
-- TOC entry 891 (class 1247 OID 17914)
-- Name: orgstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.orgstatus AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public.orgstatus OWNER TO postgres;

--
-- TOC entry 888 (class 1247 OID 17904)
-- Name: orgtype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.orgtype AS ENUM (
    'UNIVERSITY',
    'FACULTY',
    'CLUB',
    'CLASS'
);


ALTER TYPE public.orgtype OWNER TO postgres;

--
-- TOC entry 912 (class 1247 OID 17980)
-- Name: sentimentlabel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.sentimentlabel AS ENUM (
    'POSITIVE',
    'NEUTRAL',
    'NEGATIVE'
);


ALTER TYPE public.sentimentlabel OWNER TO postgres;

--
-- TOC entry 1008 (class 1247 OID 18406)
-- Name: transactionstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transactionstatus AS ENUM (
    'PENDING',
    'COMPLETED',
    'REJECTED'
);


ALTER TYPE public.transactionstatus OWNER TO postgres;

--
-- TOC entry 1005 (class 1247 OID 18401)
-- Name: transactiontype; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transactiontype AS ENUM (
    'INCOME',
    'EXPENSE'
);


ALTER TYPE public.transactiontype OWNER TO postgres;

--
-- TOC entry 885 (class 1247 OID 17896)
-- Name: userstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.userstatus AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED'
);


ALTER TYPE public.userstatus OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 18035)
-- Name: academic_terms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academic_terms (
    id uuid NOT NULL,
    year_name character varying NOT NULL,
    semester_name character varying NOT NULL,
    start_date date,
    end_date date,
    is_current boolean,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.academic_terms OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 18051)
-- Name: ai_audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_audits (
    id uuid NOT NULL,
    content_type character varying,
    content_text text,
    action_taken public.auditaction,
    reason character varying,
    processed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.ai_audits OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 18252)
-- Name: ai_predictions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_predictions (
    id uuid NOT NULL,
    event_id uuid NOT NULL,
    predicted_attendance integer,
    confidence_score numeric(3,2),
    ai_recommendations jsonb,
    generated_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.ai_predictions OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 18043)
-- Name: ai_sentiments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_sentiments (
    id uuid NOT NULL,
    source_type character varying,
    source_id character varying,
    content_excerpt text,
    sentiment_score numeric(3,2),
    sentiment_label public.sentimentlabel,
    detected_keywords jsonb,
    analyzed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.ai_sentiments OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 26674)
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 18192)
-- Name: asset_loans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_loans (
    id uuid NOT NULL,
    asset_id uuid NOT NULL,
    borrowed_by uuid NOT NULL,
    borrowed_quantity integer,
    borrow_date timestamp with time zone,
    expected_return_date timestamp with time zone,
    actual_return_date timestamp with time zone,
    status public.assetloanstatus,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.asset_loans OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 18141)
-- Name: assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assets (
    id uuid NOT NULL,
    organization_id uuid NOT NULL,
    name character varying NOT NULL,
    description text,
    quantity integer,
    unit character varying,
    storage_location character varying,
    status public.assetstatus,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.assets OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 18167)
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid NOT NULL,
    user_id uuid,
    action character varying NOT NULL,
    entity_type character varying NOT NULL,
    entity_id uuid,
    old_values jsonb,
    new_values jsonb,
    ip_address character varying,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 26726)
-- Name: award_criteria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.award_criteria (
    id uuid NOT NULL,
    name character varying NOT NULL,
    type public.criteriatype NOT NULL,
    value character varying NOT NULL,
    is_required boolean,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.award_criteria OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 18293)
-- Name: awards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.awards (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    award_name character varying NOT NULL,
    description text,
    status public.awardstatus,
    decision_number character varying,
    awarded_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    points integer DEFAULT 0,
    assessment json,
    screening_results json,
    evidence_url character varying
);


ALTER TABLE public.awards OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 18125)
-- Name: budgets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budgets (
    id uuid NOT NULL,
    organization_id uuid NOT NULL,
    academic_term_id uuid NOT NULL,
    total_amount numeric(15,2),
    used_amount numeric(15,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.budgets OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 18107)
-- Name: campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaigns (
    id uuid NOT NULL,
    organization_id uuid NOT NULL,
    academic_term_id uuid NOT NULL,
    name character varying NOT NULL,
    description character varying,
    start_date date,
    end_date date,
    status public.campaignstatus,
    total_budget_allocated numeric(15,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.campaigns OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 18154)
-- Name: chatbot_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chatbot_logs (
    id uuid NOT NULL,
    user_id uuid,
    question_category character varying,
    interaction_duration_seconds integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.chatbot_logs OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 18443)
-- Name: club_proposals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.club_proposals (
    id uuid NOT NULL,
    organization_id uuid,
    title character varying NOT NULL,
    description text,
    amount numeric(15,2),
    requested_by uuid NOT NULL,
    status character varying,
    created_at timestamp with time zone,
    icon character varying,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.club_proposals OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 18306)
-- Name: digital_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.digital_documents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    document_type character varying NOT NULL,
    purpose text,
    status public.documentstatus,
    file_url character varying,
    rejection_reason character varying,
    request_date timestamp without time zone,
    processed_date timestamp without time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    document_code character varying,
    title character varying,
    is_public boolean DEFAULT false
);


ALTER TABLE public.digital_documents OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 27375)
-- Name: event_feedbacks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_feedbacks (
    id uuid NOT NULL,
    event_id uuid NOT NULL,
    user_id uuid NOT NULL,
    rating integer NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.event_feedbacks OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 26697)
-- Name: event_incidents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_incidents (
    id uuid NOT NULL,
    event_id uuid NOT NULL,
    reported_by uuid NOT NULL,
    description text NOT NULL,
    severity character varying,
    status character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.event_incidents OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 26679)
-- Name: event_qa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_qa (
    id uuid NOT NULL,
    event_id uuid NOT NULL,
    user_id uuid,
    question text NOT NULL,
    answer text,
    is_answered boolean,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.event_qa OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 18208)
-- Name: event_registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_registrations (
    id uuid NOT NULL,
    event_id uuid NOT NULL,
    user_id uuid NOT NULL,
    check_in_time timestamp with time zone,
    status public.eventregistrationstatus,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    check_in_token character varying
);


ALTER TABLE public.event_registrations OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 18179)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id uuid NOT NULL,
    campaign_id uuid,
    name character varying NOT NULL,
    location character varying,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    capacity integer,
    status public.eventstatus,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    description text,
    image_url character varying,
    points_awarded integer,
    org_id uuid
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 18413)
-- Name: finance_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.finance_transactions (
    id uuid NOT NULL,
    budget_id uuid NOT NULL,
    type public.transactiontype NOT NULL,
    title character varying NOT NULL,
    description text,
    amount numeric(15,2) NOT NULL,
    performed_by_name character varying,
    status public.transactionstatus,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.finance_transactions OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 18224)
-- Name: fund_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fund_requests (
    id uuid NOT NULL,
    budget_id uuid NOT NULL,
    event_id uuid,
    requested_by uuid NOT NULL,
    amount numeric(15,2) NOT NULL,
    reason text,
    status public.fundrequeststatus,
    approved_by uuid,
    approved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    evidence_urls text
);


ALTER TABLE public.fund_requests OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 18340)
-- Name: news; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news (
    id uuid NOT NULL,
    title character varying NOT NULL,
    category character varying,
    excerpt text,
    content text,
    image_url character varying,
    author_id uuid,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.news OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 18319)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    title character varying NOT NULL,
    message text NOT NULL,
    is_read boolean,
    created_at timestamp without time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 18022)
-- Name: organizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organizations (
    id uuid NOT NULL,
    parent_id uuid,
    name character varying NOT NULL,
    type public.orgtype NOT NULL,
    description character varying,
    status public.orgstatus,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    fee_percentage numeric(5,2),
    avatar_url character varying,
    icon character varying,
    warning_message text,
    warning_deadline timestamp without time zone,
    last_activity_at timestamp without time zone,
    leader_user_id uuid,
    contact_email character varying,
    phone character varying
);


ALTER TABLE public.organizations OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 18014)
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id uuid NOT NULL,
    resource_name character varying NOT NULL,
    action character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 27393)
-- Name: point_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.point_categories (
    id uuid NOT NULL,
    name character varying NOT NULL,
    max_score integer,
    description character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.point_categories OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 27401)
-- Name: point_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.point_logs (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    event_id uuid,
    category_id uuid,
    points integer NOT NULL,
    reason character varying NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.point_logs OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 18059)
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 18005)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    name character varying NOT NULL,
    description character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 18425)
-- Name: student_fees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_fees (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    academic_term_id uuid NOT NULL,
    title character varying NOT NULL,
    amount numeric(15,2) NOT NULL,
    status character varying,
    paid_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.student_fees OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 18331)
-- Name: system_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_settings (
    id uuid NOT NULL,
    key character varying NOT NULL,
    value text NOT NULL,
    description character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.system_settings OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 18381)
-- Name: user_experiences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_experiences (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    role character varying NOT NULL,
    location character varying,
    period character varying,
    bullets character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_experiences OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 18089)
-- Name: user_organizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_organizations (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    title character varying,
    is_primary boolean,
    joined_date date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_organizations OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 18074)
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 18368)
-- Name: user_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_skills (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    name character varying NOT NULL,
    level integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_skills OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 17995)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    student_id character varying,
    full_name character varying NOT NULL,
    email character varying NOT NULL,
    password_hash character varying,
    auth_provider public.authprovider NOT NULL,
    phone_number character varying,
    status public.userstatus,
    avatar_url character varying,
    last_login_at date,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    level integer DEFAULT 1,
    training_score integer DEFAULT 0,
    is_2fa_enabled boolean DEFAULT false,
    email_alerts_enabled boolean DEFAULT true,
    zalo_alerts_enabled boolean DEFAULT true,
    daily_digest_enabled boolean DEFAULT false,
    otp_code character varying,
    otp_expires_at timestamp without time zone,
    class_id uuid,
    device_id character varying,
    push_token character varying,
    class_name character varying,
    academic_year integer,
    bio text,
    social_links character varying,
    is_profile_updated boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 5248 (class 0 OID 18035)
-- Dependencies: 221
-- Data for Name: academic_terms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.academic_terms (id, year_name, semester_name, start_date, end_date, is_current, created_at, updated_at, deleted_at) FROM stdin;
6b4b905f-64a0-4e9c-b212-2903031def1a	2023-2024	Học kỳ 1	2023-08-15	2024-01-15	f	2026-03-17 14:41:47.320033+07	\N	\N
e833498d-7788-4b69-aa2d-9643220d5793	2023-2024	Học kỳ 2	2024-02-01	2024-07-01	f	2026-03-17 14:41:47.320033+07	\N	\N
a1239704-4244-4fe2-aa6e-305c4df15f80	2024-2025	Học kỳ 1	2024-08-15	2025-01-15	f	2026-03-17 14:41:47.320033+07	\N	\N
06fbc5c5-bc90-4a80-be93-43e12094bc53	2024-2025	Học kỳ 2	2025-02-01	2025-07-01	f	2026-03-17 14:41:47.320033+07	\N	\N
7215598e-4b8a-4c39-9b32-fa2e7ea95f63	2025-2026	Học kỳ 1	2025-08-15	2026-01-15	t	2026-03-17 14:41:47.320033+07	\N	\N
b5aa939d-aefb-489a-a9bc-09e1d9088396	2025-2026	Học kỳ 2	2026-02-01	2026-07-01	f	2026-03-17 14:41:47.320033+07	\N	\N
\.


--
-- TOC entry 5250 (class 0 OID 18051)
-- Dependencies: 223
-- Data for Name: ai_audits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_audits (id, content_type, content_text, action_taken, reason, processed_at, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5263 (class 0 OID 18252)
-- Dependencies: 236
-- Data for Name: ai_predictions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_predictions (id, event_id, predicted_attendance, confidence_score, ai_recommendations, generated_at, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5249 (class 0 OID 18043)
-- Dependencies: 222
-- Data for Name: ai_sentiments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_sentiments (id, source_type, source_id, content_excerpt, sentiment_score, sentiment_label, detected_keywords, analyzed_at, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5274 (class 0 OID 26674)
-- Dependencies: 247
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
9b60bfe9cd0f
\.


--
-- TOC entry 5260 (class 0 OID 18192)
-- Dependencies: 233
-- Data for Name: asset_loans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_loans (id, asset_id, borrowed_by, borrowed_quantity, borrow_date, expected_return_date, actual_return_date, status, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5256 (class 0 OID 18141)
-- Dependencies: 229
-- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.assets (id, organization_id, name, description, quantity, unit, storage_location, status, created_at, updated_at, deleted_at) FROM stdin;
a6ec9c2e-988b-4339-8ba0-bb7cce75c03b	936d909a-0227-49da-bbac-a5eb6d701136	Máy chiếu Sony	máy chiếu	1	Cái	Hầm B2	AVAILABLE	2026-03-17 12:41:07.823332+07	\N	\N
\.


--
-- TOC entry 5258 (class 0 OID 18167)
-- Dependencies: 231
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, created_at, updated_at, deleted_at) FROM stdin;
4c2d8979-fd83-4f3b-818c-8379a883f366	\N	BATCH_UPDATE_SETTINGS	SystemSetting	\N	null	null	\N	2026-03-17 14:16:49.889615+07	\N	\N
e50deade-8f5f-48b0-83db-c137c6fb8ac5	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-17 14:31:49.336254+07	\N	\N
d324a902-316c-4606-8654-4763bfe5de24	\N	BATCH_UPDATE_SETTINGS	SystemSetting	\N	null	null	\N	2026-03-17 14:38:50.282115+07	\N	\N
499ddb52-7c9c-477e-911d-413dfc9d406c	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-17 15:19:24.332691+07	\N	\N
2d89115a-2672-4d1d-af46-4609eb1bd819	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-17 15:20:17.623769+07	\N	\N
8d78603e-a9f9-42e9-bc97-562d174ec614	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-17 15:26:40.813568+07	\N	\N
871ff22f-a26c-4082-8640-b6bec4dfd257	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-17 17:37:42.174388+07	\N	\N
0aae0b94-0143-4ef9-9cae-1702385ac38c	\N	UPDATE_USER	User	c0731e91-b328-4c03-854f-6a1df1f1be9b	null	null	\N	2026-03-17 18:05:12.357338+07	\N	\N
b03fc5c6-38a6-438d-b90b-eb3b36466597	\N	UPDATE_USER	User	ef838a8b-85da-477b-9668-d601a19595fb	null	null	\N	2026-03-17 18:07:14.068994+07	\N	\N
fba99763-e9b6-4484-a194-936a4e5d5eaf	\N	UPDATE_USER	User	c0731e91-b328-4c03-854f-6a1df1f1be9b	null	null	\N	2026-03-17 18:07:34.206537+07	\N	\N
2e104cca-aa55-45d5-ba7a-37477408e5de	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-17 18:13:21.69938+07	\N	\N
fb28c295-84af-4664-a4c5-5384972c76f0	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-17 18:14:21.530031+07	\N	\N
73d88935-4c68-4463-b29b-c59273d7d112	\N	UPDATE_USER	User	c0731e91-b328-4c03-854f-6a1df1f1be9b	null	null	\N	2026-03-17 18:14:32.510793+07	\N	\N
2f05d54f-713b-4b7d-8d77-eac887025bb0	\N	UPDATE_USER	User	ef838a8b-85da-477b-9668-d601a19595fb	null	null	\N	2026-03-17 18:14:46.222087+07	\N	\N
2415a481-bfbf-43bb-9d3b-4ffd4d7aa188	\N	UPDATE_USER	User	c0731e91-b328-4c03-854f-6a1df1f1be9b	null	null	\N	2026-03-17 18:15:59.457466+07	\N	\N
c760cf88-8480-4ffd-8abd-40692043a7de	\N	CREATE_ROLE	Role	1c97955f-bb6b-480b-bcac-82087af06179	null	null	\N	2026-03-17 18:16:50.981702+07	\N	\N
ae2718c4-7fd1-43c6-b01f-79f61dc37e8a	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-17 18:23:59.089585+07	\N	\N
246753a9-4523-48f6-b983-7f1debf0c165	\N	UPDATE_ROLE	Role	e9bd0a50-4828-4628-8afa-e587939eb1f5	null	null	\N	2026-03-17 18:27:13.167223+07	\N	\N
63fcaf52-1eb7-4245-99d9-6c2191437f71	\N	UPDATE_ROLE	Role	e9bd0a50-4828-4628-8afa-e587939eb1f5	null	null	\N	2026-03-17 18:27:13.794701+07	\N	\N
389c0ce1-9e34-452e-ad34-036af257c540	\N	UPDATE_ROLE	Role	e9bd0a50-4828-4628-8afa-e587939eb1f5	null	null	\N	2026-03-17 18:27:14.238089+07	\N	\N
b1759dfe-da5d-4675-9a20-9184a3686eac	\N	UPDATE_ROLE	Role	e9bd0a50-4828-4628-8afa-e587939eb1f5	null	null	\N	2026-03-17 18:27:14.658363+07	\N	\N
aa044291-e51c-4132-b172-bb810904f1ff	\N	UPDATE_ROLE	Role	1c97955f-bb6b-480b-bcac-82087af06179	null	null	\N	2026-03-17 18:27:32.498127+07	\N	\N
06d2d62d-1c65-4bd2-8ce1-92afd547c90b	\N	UPDATE_ROLE	Role	1c97955f-bb6b-480b-bcac-82087af06179	null	null	\N	2026-03-17 18:27:33.13018+07	\N	\N
d69c3458-04bd-414c-8448-6aa79adb9052	\N	UPDATE_ROLE	Role	1c97955f-bb6b-480b-bcac-82087af06179	null	null	\N	2026-03-17 18:27:33.396091+07	\N	\N
eaad4ea2-e117-42d5-942e-6779fec2fe3c	\N	UPDATE_ROLE	Role	1c97955f-bb6b-480b-bcac-82087af06179	null	null	\N	2026-03-17 18:27:33.685367+07	\N	\N
2b4222d0-a852-422f-8f4f-dac0c4d545c4	\N	DELETE_ROLE	Role	1c97955f-bb6b-480b-bcac-82087af06179	null	null	\N	2026-03-17 18:34:16.26808+07	\N	\N
403c1401-bb0f-42d8-86ba-ac8ca091c826	\N	CREATE_ROLE	Role	fef8cbd5-020e-49a6-9943-e8d9a42d431a	null	null	\N	2026-03-17 18:34:32.337992+07	\N	\N
68793581-b551-4085-a50c-2b689bfbad12	\N	CREATE_ROLE	Role	27255f5e-6bfb-490f-92fa-180451414a29	null	null	\N	2026-03-17 18:34:36.893043+07	\N	\N
879e9404-d45f-42a0-a748-f01e6a68b549	\N	DELETE_ROLE	Role	fef8cbd5-020e-49a6-9943-e8d9a42d431a	null	null	\N	2026-03-17 18:43:01.11308+07	\N	\N
d5a00a29-3de0-417e-bf26-2d3a7cc537ca	\N	DELETE_ROLE	Role	27255f5e-6bfb-490f-92fa-180451414a29	null	null	\N	2026-03-17 18:43:04.892202+07	\N	\N
fc9cdf36-1161-46cf-852d-6eea8baf3b3e	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-17 18:52:18.931049+07	\N	\N
b78d8096-4097-4fa4-8944-92181901cc25	\N	UPDATE_USER	User	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-17 20:47:38.667862+07	\N	\N
46dedf7c-53bc-4617-9e53-d6bcb020551d	\N	UPDATE_USER	User	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-17 20:48:48.001541+07	\N	\N
8466f4ee-d19b-4c1e-b2aa-b298e492bf5b	\N	UPDATE_USER	User	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-17 20:48:48.372004+07	\N	\N
73035d70-d85f-460f-8599-04dfcb32eb06	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-18 16:36:05.00523+07	\N	\N
aec1fd6e-dfe0-42e4-88d1-ec31e01e313a	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-18 16:40:51.671713+07	\N	\N
925bbefe-2839-416e-bac6-84172f4da27f	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-18 16:46:31.230973+07	\N	\N
abbabac5-5ee9-4834-af37-0ea28ca9f062	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 11:13:12.470099+07	\N	\N
c0755c0a-85ec-40d5-b7ee-8e6d57a28d8c	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 11:22:45.881797+07	\N	\N
b1798d16-7a73-479a-9f98-88b1a69aebce	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 11:27:31.199605+07	\N	\N
6526504a-94f6-4c50-bd0b-65a1c6add5f9	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 11:27:37.613151+07	\N	\N
5a2cd790-4706-4ccb-a30b-4c91106b9f56	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 11:27:43.504404+07	\N	\N
cd144a5c-f5d9-4909-bffe-c95a171987d3	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 11:27:57.768432+07	\N	\N
13dff613-6767-4ed6-bfa9-3a6d8c6f165a	\N	UPDATE_USER	User	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 11:46:42.287406+07	\N	\N
fc9b5703-e379-4414-93fb-e2e8075db90c	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 11:55:56.979387+07	\N	\N
78958156-e309-482f-89eb-3f68f6051139	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 12:16:38.212306+07	\N	\N
1fe67126-fa67-43e9-96b9-30c6a2358add	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 12:20:35.919749+07	\N	\N
b9c7cbf3-ce61-4667-9439-8744964ce483	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 12:28:18.721902+07	\N	\N
65ee0320-44ff-48ed-b8f6-3204ffa95d5f	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 12:28:48.988836+07	\N	\N
607efab5-9b47-4920-bde8-40ddf25a20ea	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 12:53:11.472371+07	\N	\N
b57d1e3e-a129-44a2-bb2a-a0f1c774f2e2	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 13:15:12.412163+07	\N	\N
8a60ca56-d84c-4315-9caf-9cc89e49e2e5	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 13:27:05.547111+07	\N	\N
7268d637-ae31-4c11-892d-ab1ffc4791e5	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 13:36:18.711122+07	\N	\N
21d53402-0503-419f-9a4e-9221b4831962	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 13:36:29.120871+07	\N	\N
85e1a1ae-3a03-4c9e-9be7-1f5496b635c1	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 13:39:05.478904+07	\N	\N
0fee989b-cc66-4b5c-986d-fab52bbb0765	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 13:39:15.521803+07	\N	\N
eebb0644-e43a-4a31-b21b-1567cb674a26	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 14:33:07.851279+07	\N	\N
cd8290a4-e508-431a-b7a2-1635c95dc4f6	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 15:23:42.777649+07	\N	\N
3010239a-6808-4bc0-b7cb-6c53409659fd	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 15:31:50.020373+07	\N	\N
4aae1864-0733-407c-b222-f98b8cfe4350	\N	UPDATE_LOGO	SystemSetting	\N	null	null	\N	2026-03-22 15:36:57.28553+07	\N	\N
fac8473e-181d-4d18-97e2-812e3e0de836	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 15:37:07.863254+07	\N	\N
0860a768-c323-490d-8229-5ae034b7a7b5	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 15:37:25.979268+07	\N	\N
e8a481d8-cbfd-4a5b-99fc-d4b00167fb6f	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 15:40:41.344222+07	\N	\N
df183cd5-ed0b-4384-8cdd-613e867b3f3f	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 15:42:42.619882+07	\N	\N
6c36899f-9523-4224-aa5f-0c2461bc0e95	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 16:05:10.387464+07	\N	\N
7f86f7b0-b3e3-4e6f-8e4a-1d2fd2d9873d	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 16:06:53.951684+07	\N	\N
6a8dd10f-eb9e-4a04-ac57-8378ac4f9b90	\N	BATCH_UPDATE_SETTINGS	SystemSetting	\N	null	null	\N	2026-03-22 16:09:39.077545+07	\N	\N
b6f0c4a5-56db-45b7-be00-0f50e0eb3591	\N	BATCH_UPDATE_SETTINGS	SystemSetting	\N	null	null	\N	2026-03-22 16:09:48.782363+07	\N	\N
a4c3f22b-5cd2-40ef-b765-5350f00d81ea	\N	UPDATE_ROLE	Role	ca0c3414-1157-46b2-a346-2445547fbc6d	null	null	\N	2026-03-22 16:10:04.565962+07	\N	\N
81d89e5e-4dbd-451f-b9d6-36de641baa59	\N	UPDATE_ROLE	Role	ca0c3414-1157-46b2-a346-2445547fbc6d	null	null	\N	2026-03-22 16:10:04.809876+07	\N	\N
8a48cf13-5d4b-43ac-8f16-0c7b6dbb9f50	\N	BATCH_UPDATE_SETTINGS	SystemSetting	\N	null	null	\N	2026-03-22 16:11:52.975537+07	\N	\N
3b2e0dcd-2585-431f-9110-6279ce8dd2d2	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 16:14:31.083023+07	\N	\N
220544d9-75b6-40cd-8abe-4b6c582cd7d6	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 16:19:32.710289+07	\N	\N
c14a5956-a811-4181-9532-fa5d5e1c84e0	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 16:22:08.326865+07	\N	\N
ca60b043-1474-4210-a8b1-40b1933444e8	\N	BATCH_UPDATE_SETTINGS	SystemSetting	\N	null	null	\N	2026-03-22 16:22:36.924969+07	\N	\N
48a50a92-cdee-4766-a8c6-c91bbc2d28d5	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 16:22:39.983203+07	\N	\N
d8015d77-631d-4a6c-b88e-3b70213b82a4	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 16:26:29.075051+07	\N	\N
cb0c36c5-288e-497f-ac31-35b925972ac4	\N	UPDATE_USER	User	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 16:27:38.135305+07	\N	\N
1954c75d-5996-4aa5-9406-aa97730a4cff	\N	UPDATE_USER	User	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 16:27:39.414613+07	\N	\N
4361b509-611b-4e8c-88fa-b25a4f5c41ce	\N	UPDATE_USER	User	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 16:30:29.808708+07	\N	\N
2f14f0f0-005d-46b8-a7cc-969c5c40919c	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 16:30:33.433575+07	\N	\N
b7a89e34-7e30-48f7-a25a-b7dd4cb04c90	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 16:31:37.744396+07	\N	\N
d2de6b21-ab7d-40e3-a70b-428cf2ffa610	\N	UPDATE_USER	User	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-22 16:32:09.415403+07	\N	\N
fb1d79b5-981c-42ee-bf55-46decb3c9306	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-22 16:32:13.25009+07	\N	\N
2ce4d262-731c-4272-800c-9903f911238d	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-23 19:26:08.502322+07	\N	\N
6a65ccfe-d51a-4e08-9a8e-99d82b297fdd	\N	UPDATE_USER	User	ef838a8b-85da-477b-9668-d601a19595fb	null	null	\N	2026-03-23 20:04:45.045981+07	\N	\N
88b09f27-8bac-44ef-8f43-39ec4e78e5a1	\N	UPDATE_USER	User	c0731e91-b328-4c03-854f-6a1df1f1be9b	null	null	\N	2026-03-23 20:04:52.828737+07	\N	\N
234a0848-805a-4754-a4ed-ab8eb4bbc7b8	\N	UPDATE_USER	User	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-23 20:16:29.6125+07	\N	\N
5a8b3996-9bc8-436d-9051-5883d09b2f95	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-23 20:19:52.987395+07	\N	\N
9401ecf9-8ccf-4784-a0b1-a986049f7b93	\N	UPDATE_USER	User	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-23 20:20:33.772562+07	\N	\N
b38121a2-3c8d-494e-aff0-9678979f6959	\N	UPDATE_USER	User	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-23 20:20:45.413631+07	\N	\N
802352fd-9c9a-4246-bbf4-9c4faa3f03ec	\N	UPDATE_USER	User	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-23 20:20:51.908108+07	\N	\N
c006c40d-e21c-4de1-9443-b87eeb5ec8d2	\N	UPDATE_USER	User	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-23 20:36:00.014192+07	\N	\N
7f4010db-6c8c-4504-a86a-325cb0018a07	217bbe71-0e46-4294-8802-dfa4aa5b53d6	LOGIN	Authentication	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-23 20:53:04.095998+07	\N	\N
463b439a-9640-40cd-b173-1ea35c600347	\N	UPDATE_USER	User	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-23 20:53:45.071315+07	\N	\N
4441b84b-7236-4aff-8cac-519d1e8f3e89	\N	UPDATE_USER	User	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-23 20:55:56.34623+07	\N	\N
4b843e38-5a31-41ef-87d0-62b72c0d70c9	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-23 20:57:28.576626+07	\N	\N
3020fee4-aeba-4504-a406-24dc86c2d30a	217bbe71-0e46-4294-8802-dfa4aa5b53d6	LOGIN	Authentication	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-23 20:57:47.525124+07	\N	\N
52433cad-8de1-4d64-a5b9-2d9dc435c94b	217bbe71-0e46-4294-8802-dfa4aa5b53d6	LOGIN	Authentication	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-23 22:03:37.770166+07	\N	\N
bd086bcd-6ccd-4618-ac18-4b99a62e1391	217bbe71-0e46-4294-8802-dfa4aa5b53d6	LOGIN	Authentication	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-24 09:34:24.688551+07	\N	\N
c35c6f77-8ec4-40c2-9912-45d77d45b85b	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-24 09:37:07.790396+07	\N	\N
a5ebfbf5-1c5a-4353-a319-d0f82711b3f5	217bbe71-0e46-4294-8802-dfa4aa5b53d6	LOGIN	Authentication	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-24 09:37:21.011794+07	\N	\N
05b3449c-9f29-4d63-83f4-71c162ee9a1f	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-24 09:40:41.118987+07	\N	\N
16755f5e-e3a2-4985-b1e0-bfae12dc3a53	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-24 12:28:19.144397+07	\N	\N
0696a272-80e9-47ca-9e76-1a79b186fae4	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-24 14:57:59.516341+07	\N	\N
fe3c395a-8c91-4c46-8aa5-3a7ba017f2fb	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-24 15:36:23.695451+07	\N	\N
d42dea5c-b880-4f24-bc45-e12c4727b8d3	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-24 15:38:18.838466+07	\N	\N
a02120c6-df82-4d44-92ca-554ee44c9e5a	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-24 15:39:50.667794+07	\N	\N
495acb4a-f60b-4919-b83d-b165a161c9a1	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-24 16:13:06.450532+07	\N	\N
6479e652-cfa8-4313-b29b-deb329761bc7	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-25 12:44:50.883369+07	\N	\N
67abeb73-fbb1-4aa7-bf10-6a57fb8235ca	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-25 12:44:55.612976+07	\N	\N
e75090c7-e12a-4ff6-a017-3af3a04a8d44	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-25 12:52:27.831579+07	\N	\N
fbf84925-3a29-4ade-9a0a-f34fdef68d13	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-25 12:57:23.129568+07	\N	\N
0a0dec14-f872-4eeb-8e98-c6a37343fe8e	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-25 13:00:27.309901+07	\N	\N
808e09f1-6a29-4a13-8fa1-26e3924f2331	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-25 13:11:18.258092+07	\N	\N
107ad490-9917-4d54-9248-bb6c8dffb00d	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-03-25 13:26:10.222633+07	\N	\N
def1328a-c4f1-4f0d-93dd-5a340efe872e	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-25 13:57:32.942331+07	\N	\N
5b8b910d-74c9-43a5-b4cb-6e5d52b244ee	217bbe71-0e46-4294-8802-dfa4aa5b53d6	LOGIN	Authentication	217bbe71-0e46-4294-8802-dfa4aa5b53d6	null	null	\N	2026-03-25 13:57:38.949773+07	\N	\N
9f46cbe9-8d60-4de7-80e9-38f4eb1f994f	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-25 14:01:41.389448+07	\N	\N
7a04c932-2d31-46ab-bc3d-44234fad928b	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-03-25 15:02:34.918741+07	\N	\N
10766089-c4d2-4fa6-949f-337804ee6369	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-04-12 14:05:49.67369+07	\N	\N
dcb6cc7c-8250-491d-8d12-712fbb7dd366	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-04-12 14:16:04.236939+07	\N	\N
93451d5b-c680-49f9-855f-dc0ab8cde9b3	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-12 19:21:19.505021+07	\N	\N
f69308cd-05d9-4c22-b3f7-143988db1f51	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-04-12 19:34:22.96125+07	\N	\N
91cfe2e7-0934-4796-8eea-604920154ffc	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-12 23:41:43.691989+07	\N	\N
bb9b4b5e-f15d-4aeb-be4d-ef449804d799	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-04-13 12:16:54.999367+07	\N	\N
e8a3cfb2-b6b9-46dc-b86d-e4ef1cfd9ea8	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-04-13 12:17:05.895925+07	\N	\N
41cb917a-319a-47cf-97be-785ff12ccca6	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-04-13 12:18:04.42821+07	\N	\N
e8f874e6-8ef9-4354-874a-2b0be91dada5	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-13 13:29:06.954869+07	\N	\N
91579077-58ce-438c-96ad-11588e1a18b3	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-13 13:29:44.931874+07	\N	\N
725a96bc-a7a6-490e-8db3-7a82cbbca060	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-13 13:30:04.776044+07	\N	\N
2721d01e-7611-4abf-b023-95c0d07d8722	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-13 13:38:19.542415+07	\N	\N
9570e6b8-09c8-4c53-a3a5-10d93f24d492	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-13 13:39:15.748884+07	\N	\N
9ee633ba-f8b0-425f-8348-c3d72de2a901	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-04-15 20:04:00.866911+07	\N	\N
3344d918-8dbd-402f-b5a4-41eb2723b330	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-04-15 20:09:00.023086+07	\N	\N
c3574c8d-0741-4b01-a22d-d5ecd56bee1f	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-04-15 20:09:34.291462+07	\N	\N
ff624543-6f6f-4d56-884c-480523282b57	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-04-15 20:13:44.333567+07	\N	\N
22e1456e-69a8-4809-84aa-92eb29abf517	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-15 20:14:21.098398+07	\N	\N
dd109397-ab7d-4af4-84b2-25d716705789	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-15 20:14:46.763917+07	\N	\N
ab6f6fa2-0db2-4e8d-8d91-e91bc5b22640	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-15 20:15:51.039188+07	\N	\N
38beb04a-87f2-4bbe-8186-ef9dd83b4da4	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-04-15 20:18:56.876398+07	\N	\N
bf8ac1a1-b20f-4126-813f-c7e0e667d0af	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-15 20:21:10.389389+07	\N	\N
86bf04e1-81df-4fe2-b7fb-d769fa6c212c	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-04-15 20:22:56.946227+07	\N	\N
07808e59-922c-4434-be71-5004f461a611	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-04-15 20:24:07.658301+07	\N	\N
41d988a6-a04a-4f43-8640-2b6a82b282f2	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-15 21:46:47.740864+07	\N	\N
8fc52008-f663-46a5-a6bf-7bc45a3935c7	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-15 23:40:44.472538+07	\N	\N
4f22a66b-2c23-48de-b3c5-cc3b1fa65e66	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-15 23:41:53.600886+07	\N	\N
c907236a-eddc-4b30-a7f5-9c2aae6b37b5	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-15 23:42:27.007338+07	\N	\N
0db760c5-50f2-462e-8666-465061567316	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-04-15 23:52:11.864086+07	\N	\N
3045f66c-9bdb-42b6-88cd-115281156dc5	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-16 00:47:45.85881+07	\N	\N
e098f4a8-a5e5-49e4-b668-461d4c611044	\N	UPDATE_USER	User	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-16 00:54:47.358053+07	\N	\N
1aa977dc-9f90-4bb8-9f5e-101e5df0177b	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-16 00:55:50.183064+07	\N	\N
bec3001b-a797-4939-9899-ab827c05b356	\N	UPDATE_USER	User	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-16 01:15:27.62203+07	\N	\N
0bec9bbb-0255-4903-a26b-b8874e728fba	\N	UPDATE_USER	User	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-16 01:15:34.278634+07	\N	\N
5ff71dae-f873-44b7-99cf-4705b399057c	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-16 02:00:43.201158+07	\N	\N
3052a788-6ec5-45e2-8c68-5a12ac8fd73f	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-16 11:29:17.652108+07	\N	\N
d11a0c94-e11f-491e-92d7-83e1c84d7540	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-16 11:30:17.832954+07	\N	\N
fb35b902-4f08-4126-b91c-ae7c2ff64f74	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-16 11:50:04.783998+07	\N	\N
473e4763-4d61-4f8d-9caf-e5cec98533d0	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-16 12:49:48.612314+07	\N	\N
8321ff0f-4310-47b1-b829-19367725e583	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-16 13:46:37.796868+07	\N	\N
2365e36e-3b2b-4911-9ad4-1bda6b6e9c6f	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-16 13:53:03.197+07	\N	\N
772c8d43-33aa-42ce-99ff-e3c51b43a17d	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-16 14:51:36.206055+07	\N	\N
5e2b96e2-7ad1-4e6d-b54f-57628be9a7e7	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-16 15:04:21.910912+07	\N	\N
d0f3a9b4-e238-4164-b7fc-5a98adffb3c5	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-16 16:21:30.484869+07	\N	\N
cb98ae69-05a7-4950-aa0d-1f21d315dbca	904b413a-5e02-423c-be48-96e315f3da81	LOGIN	Authentication	904b413a-5e02-423c-be48-96e315f3da81	null	null	\N	2026-04-20 20:50:55.899017+07	\N	\N
28e10be7-787e-4855-a579-0afe4cfc7c07	d1153884-e1ad-4391-872f-eb0b7c93fbca	LOGIN	Authentication	d1153884-e1ad-4391-872f-eb0b7c93fbca	null	null	\N	2026-04-20 20:54:22.142692+07	\N	\N
5331f960-8b32-4fa1-b59f-a786261a422d	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	LOGIN	Authentication	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	null	null	\N	2026-04-20 20:58:26.749472+07	\N	\N
\.


--
-- TOC entry 5277 (class 0 OID 26726)
-- Dependencies: 250
-- Data for Name: award_criteria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.award_criteria (id, name, type, value, is_required, description, created_at, updated_at, deleted_at) FROM stdin;
a6a2a6f0-bbcd-43de-9399-cb5d60334673	Điểm GPA >= 3.2	MIN_GPA	3.2	t	Yêu cầu bắt buộc	2026-03-24 11:36:03.415182+07	\N	\N
a56764bb-0c36-40b0-95ae-54ee30881e51	Điểm rèn luyện >= 80	MIN_TRAINING_SCORE	80	t	Yêu cầu bắt buộc	2026-03-24 11:36:03.415182+07	\N	\N
46b42f89-6ab7-4baa-a521-fba807501020	Tham gia ít nhất 2 sự kiện	MIN_EVENTS_ATTENDED	2	f	Khuyến khích	2026-03-24 11:36:03.415182+07	\N	\N
\.


--
-- TOC entry 5264 (class 0 OID 18293)
-- Dependencies: 237
-- Data for Name: awards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.awards (id, user_id, award_name, description, status, decision_number, awarded_date, created_at, updated_at, deleted_at, points, assessment, screening_results, evidence_url) FROM stdin;
323dfc7a-9d3c-4b59-be59-af5f17ea1b25	d1153884-e1ad-4391-872f-eb0b7c93fbca	Sinh viên 5 tốt cấp Khoa	Nộp đơn xét duyện năm học 2025-2026	REJECTED	\N	\N	2026-03-24 11:40:51.248174+07	2026-03-25 13:26:26.579129+07	\N	0	null	{"overall_passed": false, "details": [{"criteria_name": "\\u0110i\\u1ec3m GPA >= 3.2", "required": "3.2", "actual": "3.5", "passed": true, "is_required": true}, {"criteria_name": "\\u0110i\\u1ec3m r\\u00e8n luy\\u1ec7n >= 80", "required": "80", "actual": "0", "passed": false, "is_required": true}, {"criteria_name": "Tham gia \\u00edt nh\\u1ea5t 2 s\\u1ef1 ki\\u1ec7n", "required": "2", "actual": "0", "passed": false, "is_required": false}]}	\N
\.


--
-- TOC entry 5255 (class 0 OID 18125)
-- Dependencies: 228
-- Data for Name: budgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budgets (id, organization_id, academic_term_id, total_amount, used_amount, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5254 (class 0 OID 18107)
-- Dependencies: 227
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campaigns (id, organization_id, academic_term_id, name, description, start_date, end_date, status, total_budget_allocated, created_at, updated_at, deleted_at) FROM stdin;
f3676d4b-84e3-4bcd-b1f1-823cc60fdfe7	936d909a-0227-49da-bbac-a5eb6d701136	6b4b905f-64a0-4e9c-b212-2903031def1a	Chủ nhật xanh	\N	2026-03-19	2026-03-19	PLANNING	2.00	2026-03-17 15:35:53.85915+07	\N	\N
fdac95af-3205-4052-b1e0-fa37b51777d3	936d909a-0227-49da-bbac-a5eb6d701136	6b4b905f-64a0-4e9c-b212-2903031def1a	Trại hè 2026	\N	2026-03-18	2026-03-20	PLANNING	8.00	2026-03-17 14:43:00.956591+07	2026-03-22 12:59:35.190335+07	\N
\.


--
-- TOC entry 5257 (class 0 OID 18154)
-- Dependencies: 230
-- Data for Name: chatbot_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chatbot_logs (id, user_id, question_category, interaction_duration_seconds, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5273 (class 0 OID 18443)
-- Dependencies: 246
-- Data for Name: club_proposals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.club_proposals (id, organization_id, title, description, amount, requested_by, status, created_at, icon, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5265 (class 0 OID 18306)
-- Dependencies: 238
-- Data for Name: digital_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.digital_documents (id, user_id, document_type, purpose, status, file_url, rejection_reason, request_date, processed_date, created_at, updated_at, deleted_at, document_code, title, is_public) FROM stdin;
4a0545d1-37fe-494e-a88e-34f5e48a0397	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	Bảng điểm Rèn luyện	Cung cấp điểm rèn luyện	PENDING	\N	\N	2026-03-16 09:27:56.348162	\N	2026-03-16 16:27:56.346985+07	2026-03-23 20:18:54.93929+07	\N	DRL-001	Điểm rèn luyện	t
8854ac68-5fbe-4cb6-8098-9e72c0793210	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	Giấy xác nhận Sinh viên	1. Tiêu chuẩn Đạo đức tốt\nTiêu chuẩn bắt buộc:\n    ◦ Điểm rèn luyện/hoạt động ngoại khóa đạt từ 80 điểm trở lên.\n    ◦ Không vi phạm pháp luật, nội quy trường lớp và nơi cư trú.\nTiêu chuẩn khác (Đạt ít nhất 01):\n    ◦ Xếp loại Đoàn viên đạt Khá trở lên (nếu là Đoàn viên).\n    ◦ Là thành viên đội thi/có bài tham luận về Mác - Lênin, tư tưởng Hồ Chí Minh cấp trường trở lên.\n    ◦ Là Thanh niên tiên tiến làm theo lời Bác hoặc điển hình tiên tiến.\n    ◦ Có hành động dũng cảm cứu người, giúp người được khen thưởng/nêu gương.\n2. Tiêu chuẩn Học tập tốt\nTiêu chuẩn bắt buộc:\n    ◦ Điểm trung bình chung học tập trong năm đạt từ 7.0/10 trở lên.\n    ◦ Không gian lận thi cử, không vi phạm quy chế học vụ.\nTiêu chuẩn khác (Đạt ít nhất 01):\n    ◦ Sinh hoạt thường xuyên tại 01 CLB học thuật.\n    ◦ Có đề tài nghiên cứu khoa học (chủ nhiệm hoặc thành viên).\n    ◦ Có bài viết chuyên môn đăng báo/tạp chí hoặc tham luận hội thảo cấp trường.\n    ◦ Đạt giải ý tưởng sáng tạo (cấp Khoa trở lên) hoặc giải thi chuyên môn (cấp toàn quốc),.\n    ◦ Là thành viên đội tuyển thi học thuật quốc gia/quốc tế.\n3. Tiêu chuẩn Thể lực tốt\nĐạt ít nhất 01 trong các tiêu chuẩn sau:\n    ◦ Đạt danh hiệu "Thanh niên khỏe" cấp trường.\n    ◦ Đạt giải Nhất, Nhì, Ba (hoặc tương đương) hội thao cấp Khoa trở lên.\n    ◦ Là thành viên đội tuyển thể thao các cấp hoặc tích cực tham gia hoạt động thể thao cấp Khoa.\n    ◦ Lưu ý riêng cho SV khuyết tật: Tập thể dục hàng ngày và rèn luyện ít nhất 01 môn thể thao phù hợp.\n4. Tiêu chuẩn Tình nguyện tốt\nTiêu chuẩn bắt buộc:\n    ◦ Được khen thưởng từ cấp Khoa trở lên về hoạt động tình nguyện.\nTiêu chuẩn khác (Đạt thêm ít nhất 01):\n    ◦ Có giấy chứng nhận tham gia một chiến dịch lớn: Mùa hè xanh, Xuân tình nguyện, Tiếp sức mùa thi hoặc Hiến máu tình nguyện.\n    ◦ Tham gia tích lũy đủ 05 ngày tình nguyện/năm (cộng dồn các hoạt động khác nhau).\n5. Tiêu chuẩn Hội nhập tốt\nĐạt ít nhất 02 trong các tiêu chuẩn sau:\n    ◦ Tin học: Đạt chứng chỉ MOS (700 điểm) hoặc có chứng chỉ cả 2 môn Word và Excel.\n    ◦ Ngoại ngữ: Đạt chứng chỉ B1 hoặc tương đương trở lên.\n    ◦ Giao lưu quốc tế: Tham gia ít nhất 02 hoạt động (hội thảo, giao lưu với SV quốc tế...).\n    ◦ Cuộc thi ngoại ngữ: Đạt giải Ba trở lên từ cấp Khoa.\n    ◦ Kỹ năng: Hoàn thành ít nhất 01 khóa kỹ năng thực hành xã hội.\n    ◦ Khen thưởng: Được Đoàn - Hội từ cấp trường khen thưởng về thành tích công tác.	PENDING	\N	\N	2026-03-16 09:27:53.933438	\N	2026-03-16 16:27:53.931211+07	2026-03-24 15:36:09.104039+07	\N	SV-001	TIÊU CHUẨN XÉT SINH VIÊN 5 TỐT CẤP TRƯỜNG	t
\.


--
-- TOC entry 5278 (class 0 OID 27375)
-- Dependencies: 251
-- Data for Name: event_feedbacks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_feedbacks (id, event_id, user_id, rating, comment, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5276 (class 0 OID 26697)
-- Dependencies: 249
-- Data for Name: event_incidents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_incidents (id, event_id, reported_by, description, severity, status, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5275 (class 0 OID 26679)
-- Dependencies: 248
-- Data for Name: event_qa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_qa (id, event_id, user_id, question, answer, is_answered, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5261 (class 0 OID 18208)
-- Dependencies: 234
-- Data for Name: event_registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_registrations (id, event_id, user_id, check_in_time, status, created_at, updated_at, deleted_at, check_in_token) FROM stdin;
\.


--
-- TOC entry 5259 (class 0 OID 18179)
-- Dependencies: 232
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, campaign_id, name, location, start_time, end_time, capacity, status, created_at, updated_at, deleted_at, description, image_url, points_awarded, org_id) FROM stdin;
\.


--
-- TOC entry 5271 (class 0 OID 18413)
-- Dependencies: 244
-- Data for Name: finance_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.finance_transactions (id, budget_id, type, title, description, amount, performed_by_name, status, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5262 (class 0 OID 18224)
-- Dependencies: 235
-- Data for Name: fund_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fund_requests (id, budget_id, event_id, requested_by, amount, reason, status, approved_by, approved_at, created_at, updated_at, deleted_at, evidence_urls) FROM stdin;
\.


--
-- TOC entry 5268 (class 0 OID 18340)
-- Dependencies: 241
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news (id, title, category, excerpt, content, image_url, author_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5266 (class 0 OID 18319)
-- Dependencies: 239
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, title, message, is_read, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5247 (class 0 OID 18022)
-- Dependencies: 220
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organizations (id, parent_id, name, type, description, status, created_at, updated_at, deleted_at, fee_percentage, avatar_url, icon, warning_message, warning_deadline, last_activity_at, leader_user_id, contact_email, phone) FROM stdin;
936d909a-0227-49da-bbac-a5eb6d701136	\N	KHOA NGOẠI NGỮ	CLUB	\N	ACTIVE	2026-03-17 11:33:13.999006+07	2026-03-17 11:51:42.761583+07	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
710b008c-7287-4735-a5ce-8790d6fea3ef	\N	KHOA CNTT	CLUB	\N	ACTIVE	2026-03-17 11:34:12.573229+07	2026-03-17 11:53:18.843394+07	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3c81e0bf-71a7-4bb3-8e3f-6d48e8dfcd11	\N	KHOA KỸ THUẬT CÔNG TRÌNH	FACULTY	\N	ACTIVE	2026-03-23 20:17:31.081265+07	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5246 (class 0 OID 18014)
-- Dependencies: 219
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, resource_name, action, created_at, updated_at, deleted_at) FROM stdin;
0d72668d-849b-438c-97ed-86dcef9f5757	EVENT	READ	2026-03-11 16:00:06.689608+07	\N	\N
c0a8a7dc-4000-4b44-b4d7-7c8aa770ee26	EVENT_REGISTRATION	CREATE	2026-03-11 16:00:06.689608+07	\N	\N
8ae08657-2787-4df7-a9f5-6d9a96d61103	E_PORTFOLIO	READ	2026-03-11 16:00:06.689608+07	\N	\N
6439ea82-142b-416f-8dde-d122fff173ed	E_PORTFOLIO	UPDATE	2026-03-11 16:00:06.689608+07	\N	\N
8319676b-e24f-40fb-bd84-50585ae9032c	CERTIFICATE	READ	2026-03-11 16:00:06.689608+07	\N	\N
e3f192fa-367f-4bea-9bd9-2e8e1acaf11d	FUND	READ	2026-03-11 16:00:06.689608+07	\N	\N
36c385bd-a639-41f5-8f25-805e67c8ed61	FUND_CONTRIBUTION	CREATE	2026-03-11 16:00:06.689608+07	\N	\N
1d0b1bbb-067f-498c-b69a-78446178eaae	DOCUMENT_REQUEST	CREATE	2026-03-11 16:00:06.689608+07	\N	\N
90277592-52df-45c3-af23-74a16f6b1df7	AI_CHAT	CREATE	2026-03-11 16:00:06.689608+07	\N	\N
661a037b-7583-4df9-960e-b56a7de4738d	EVENT_FEEDBACK	CREATE	2026-03-11 16:00:06.689608+07	\N	\N
625ec5f1-f55c-46ac-a9f9-074910e8e27b	EVENT	CREATE	2026-03-11 16:00:06.689608+07	\N	\N
64628942-f7ac-4e1e-ac7a-39bd0d77a974	EVENT	UPDATE	2026-03-11 16:00:06.689608+07	\N	\N
56f23012-7306-410a-b10a-7fe64f3c842b	EVENT	DELETE	2026-03-11 16:00:06.689608+07	\N	\N
fe4b3027-e1ac-4e2a-a0cf-c83142104a49	EVENT_REGISTRATION	UPDATE	2026-03-11 16:00:06.689608+07	\N	\N
342d2af0-2f0c-4ad3-942d-1cee91088c87	EVENT_CHECKIN	CREATE	2026-03-11 16:00:06.689608+07	\N	\N
98002fe5-2e66-4355-b5ab-6a0d7521272f	NOTIFICATION	CREATE	2026-03-11 16:00:06.689608+07	\N	\N
54048d04-7649-4789-8bb5-143be83635a0	REPORT	READ	2026-03-11 16:00:06.689608+07	\N	\N
9d995c1f-4c7a-4aa6-9d8d-9e1d23993813	KPI	READ	2026-03-11 16:00:06.689608+07	\N	\N
ed569910-8c30-4f08-94f4-2dea4d0884bb	REWARD_POINT	UPDATE	2026-03-11 16:00:06.689608+07	\N	\N
af81c6c5-57b9-4414-9ec7-98a52136728a	CERTIFICATE	CREATE	2026-03-11 16:00:06.689608+07	\N	\N
f4f4f883-5c7e-4f08-a593-f7a4c5624d2e	AI_SENTIMENT	READ	2026-03-11 16:00:06.689608+07	\N	\N
e840b15a-722d-4d86-b1d2-a9fa60adc00f	EVENT_FEEDBACK	READ	2026-03-11 16:00:06.689608+07	\N	\N
a22fdb11-6c54-4b61-994a-782475818243	RANKING	READ	2026-03-11 16:00:06.689608+07	\N	\N
cbabbf36-25ee-463a-b194-f29c16283b3c	RANKING	UPDATE	2026-03-11 16:00:06.689608+07	\N	\N
4a1e7032-2939-4c47-9e59-7a415f9cae19	DOCUMENT_REQUEST	UPDATE	2026-03-11 16:00:06.689608+07	\N	\N
872e05f5-703b-40e5-aeab-4aa7ba21a63d	STUDENT_5_GOOD	UPDATE_FACULTY	2026-03-11 16:00:06.689608+07	\N	\N
81debf6a-d7aa-4425-8e16-823862c37257	TEMPLATE	CREATE	2026-03-11 16:00:06.689608+07	\N	\N
e2a5201b-ef88-4df2-ae0a-f26e7b05d273	TEMPLATE	UPDATE	2026-03-11 16:00:06.689608+07	\N	\N
a69ac3a0-e0a8-4e38-8c5e-051265fdacbf	TEMPLATE	DELETE	2026-03-11 16:00:06.689608+07	\N	\N
bf4dc77a-d608-4e4f-9b67-087672b990b9	REPORT_UNIVERSITY	READ	2026-03-11 16:00:06.689608+07	\N	\N
0f2a6397-b051-44d9-a52d-499fe78f5fb0	STUDENT_5_GOOD	UPDATE_UNIVERSITY	2026-03-11 16:00:06.689608+07	\N	\N
\.


--
-- TOC entry 5279 (class 0 OID 27393)
-- Dependencies: 252
-- Data for Name: point_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.point_categories (id, name, max_score, description, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5280 (class 0 OID 27401)
-- Dependencies: 253
-- Data for Name: point_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.point_logs (id, user_id, event_id, category_id, points, reason, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5251 (class 0 OID 18059)
-- Dependencies: 224
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (role_id, permission_id) FROM stdin;
db38d3ba-746d-42e0-ba0c-273039beadbf	81debf6a-d7aa-4425-8e16-823862c37257
ca0c3414-1157-46b2-a346-2445547fbc6d	661a037b-7583-4df9-960e-b56a7de4738d
e9bd0a50-4828-4628-8afa-e587939eb1f5	661a037b-7583-4df9-960e-b56a7de4738d
db38d3ba-746d-42e0-ba0c-273039beadbf	661a037b-7583-4df9-960e-b56a7de4738d
ca0c3414-1157-46b2-a346-2445547fbc6d	e3f192fa-367f-4bea-9bd9-2e8e1acaf11d
e9bd0a50-4828-4628-8afa-e587939eb1f5	e3f192fa-367f-4bea-9bd9-2e8e1acaf11d
db38d3ba-746d-42e0-ba0c-273039beadbf	e3f192fa-367f-4bea-9bd9-2e8e1acaf11d
ca0c3414-1157-46b2-a346-2445547fbc6d	90277592-52df-45c3-af23-74a16f6b1df7
e9bd0a50-4828-4628-8afa-e587939eb1f5	90277592-52df-45c3-af23-74a16f6b1df7
db38d3ba-746d-42e0-ba0c-273039beadbf	90277592-52df-45c3-af23-74a16f6b1df7
ca0c3414-1157-46b2-a346-2445547fbc6d	af81c6c5-57b9-4414-9ec7-98a52136728a
e9bd0a50-4828-4628-8afa-e587939eb1f5	af81c6c5-57b9-4414-9ec7-98a52136728a
db38d3ba-746d-42e0-ba0c-273039beadbf	af81c6c5-57b9-4414-9ec7-98a52136728a
e9bd0a50-4828-4628-8afa-e587939eb1f5	c0a8a7dc-4000-4b44-b4d7-7c8aa770ee26
db38d3ba-746d-42e0-ba0c-273039beadbf	c0a8a7dc-4000-4b44-b4d7-7c8aa770ee26
e9bd0a50-4828-4628-8afa-e587939eb1f5	64628942-f7ac-4e1e-ac7a-39bd0d77a974
db38d3ba-746d-42e0-ba0c-273039beadbf	64628942-f7ac-4e1e-ac7a-39bd0d77a974
db38d3ba-746d-42e0-ba0c-273039beadbf	e2a5201b-ef88-4df2-ae0a-f26e7b05d273
e9bd0a50-4828-4628-8afa-e587939eb1f5	f4f4f883-5c7e-4f08-a593-f7a4c5624d2e
db38d3ba-746d-42e0-ba0c-273039beadbf	f4f4f883-5c7e-4f08-a593-f7a4c5624d2e
ca0c3414-1157-46b2-a346-2445547fbc6d	fe4b3027-e1ac-4e2a-a0cf-c83142104a49
e9bd0a50-4828-4628-8afa-e587939eb1f5	fe4b3027-e1ac-4e2a-a0cf-c83142104a49
db38d3ba-746d-42e0-ba0c-273039beadbf	fe4b3027-e1ac-4e2a-a0cf-c83142104a49
db38d3ba-746d-42e0-ba0c-273039beadbf	a69ac3a0-e0a8-4e38-8c5e-051265fdacbf
ca0c3414-1157-46b2-a346-2445547fbc6d	e840b15a-722d-4d86-b1d2-a9fa60adc00f
e9bd0a50-4828-4628-8afa-e587939eb1f5	e840b15a-722d-4d86-b1d2-a9fa60adc00f
db38d3ba-746d-42e0-ba0c-273039beadbf	e840b15a-722d-4d86-b1d2-a9fa60adc00f
ca0c3414-1157-46b2-a346-2445547fbc6d	36c385bd-a639-41f5-8f25-805e67c8ed61
e9bd0a50-4828-4628-8afa-e587939eb1f5	36c385bd-a639-41f5-8f25-805e67c8ed61
db38d3ba-746d-42e0-ba0c-273039beadbf	36c385bd-a639-41f5-8f25-805e67c8ed61
ca0c3414-1157-46b2-a346-2445547fbc6d	8319676b-e24f-40fb-bd84-50585ae9032c
e9bd0a50-4828-4628-8afa-e587939eb1f5	8319676b-e24f-40fb-bd84-50585ae9032c
db38d3ba-746d-42e0-ba0c-273039beadbf	8319676b-e24f-40fb-bd84-50585ae9032c
e9bd0a50-4828-4628-8afa-e587939eb1f5	342d2af0-2f0c-4ad3-942d-1cee91088c87
db38d3ba-746d-42e0-ba0c-273039beadbf	342d2af0-2f0c-4ad3-942d-1cee91088c87
db38d3ba-746d-42e0-ba0c-273039beadbf	bf4dc77a-d608-4e4f-9b67-087672b990b9
e9bd0a50-4828-4628-8afa-e587939eb1f5	ed569910-8c30-4f08-94f4-2dea4d0884bb
db38d3ba-746d-42e0-ba0c-273039beadbf	ed569910-8c30-4f08-94f4-2dea4d0884bb
e9bd0a50-4828-4628-8afa-e587939eb1f5	a22fdb11-6c54-4b61-994a-782475818243
db38d3ba-746d-42e0-ba0c-273039beadbf	a22fdb11-6c54-4b61-994a-782475818243
e9bd0a50-4828-4628-8afa-e587939eb1f5	98002fe5-2e66-4355-b5ab-6a0d7521272f
db38d3ba-746d-42e0-ba0c-273039beadbf	98002fe5-2e66-4355-b5ab-6a0d7521272f
ca0c3414-1157-46b2-a346-2445547fbc6d	1d0b1bbb-067f-498c-b69a-78446178eaae
e9bd0a50-4828-4628-8afa-e587939eb1f5	1d0b1bbb-067f-498c-b69a-78446178eaae
db38d3ba-746d-42e0-ba0c-273039beadbf	1d0b1bbb-067f-498c-b69a-78446178eaae
e9bd0a50-4828-4628-8afa-e587939eb1f5	0f2a6397-b051-44d9-a52d-499fe78f5fb0
db38d3ba-746d-42e0-ba0c-273039beadbf	0f2a6397-b051-44d9-a52d-499fe78f5fb0
ca0c3414-1157-46b2-a346-2445547fbc6d	6439ea82-142b-416f-8dde-d122fff173ed
e9bd0a50-4828-4628-8afa-e587939eb1f5	6439ea82-142b-416f-8dde-d122fff173ed
db38d3ba-746d-42e0-ba0c-273039beadbf	6439ea82-142b-416f-8dde-d122fff173ed
e9bd0a50-4828-4628-8afa-e587939eb1f5	56f23012-7306-410a-b10a-7fe64f3c842b
db38d3ba-746d-42e0-ba0c-273039beadbf	56f23012-7306-410a-b10a-7fe64f3c842b
e9bd0a50-4828-4628-8afa-e587939eb1f5	cbabbf36-25ee-463a-b194-f29c16283b3c
db38d3ba-746d-42e0-ba0c-273039beadbf	cbabbf36-25ee-463a-b194-f29c16283b3c
e9bd0a50-4828-4628-8afa-e587939eb1f5	54048d04-7649-4789-8bb5-143be83635a0
db38d3ba-746d-42e0-ba0c-273039beadbf	54048d04-7649-4789-8bb5-143be83635a0
e9bd0a50-4828-4628-8afa-e587939eb1f5	8ae08657-2787-4df7-a9f5-6d9a96d61103
db38d3ba-746d-42e0-ba0c-273039beadbf	8ae08657-2787-4df7-a9f5-6d9a96d61103
ca0c3414-1157-46b2-a346-2445547fbc6d	4a1e7032-2939-4c47-9e59-7a415f9cae19
e9bd0a50-4828-4628-8afa-e587939eb1f5	4a1e7032-2939-4c47-9e59-7a415f9cae19
db38d3ba-746d-42e0-ba0c-273039beadbf	4a1e7032-2939-4c47-9e59-7a415f9cae19
e9bd0a50-4828-4628-8afa-e587939eb1f5	0d72668d-849b-438c-97ed-86dcef9f5757
db38d3ba-746d-42e0-ba0c-273039beadbf	0d72668d-849b-438c-97ed-86dcef9f5757
e9bd0a50-4828-4628-8afa-e587939eb1f5	9d995c1f-4c7a-4aa6-9d8d-9e1d23993813
db38d3ba-746d-42e0-ba0c-273039beadbf	9d995c1f-4c7a-4aa6-9d8d-9e1d23993813
e9bd0a50-4828-4628-8afa-e587939eb1f5	872e05f5-703b-40e5-aeab-4aa7ba21a63d
db38d3ba-746d-42e0-ba0c-273039beadbf	872e05f5-703b-40e5-aeab-4aa7ba21a63d
e9bd0a50-4828-4628-8afa-e587939eb1f5	625ec5f1-f55c-46ac-a9f9-074910e8e27b
db38d3ba-746d-42e0-ba0c-273039beadbf	625ec5f1-f55c-46ac-a9f9-074910e8e27b
ca0c3414-1157-46b2-a346-2445547fbc6d	8ae08657-2787-4df7-a9f5-6d9a96d61103
ca0c3414-1157-46b2-a346-2445547fbc6d	c0a8a7dc-4000-4b44-b4d7-7c8aa770ee26
ca0c3414-1157-46b2-a346-2445547fbc6d	0d72668d-849b-438c-97ed-86dcef9f5757
\.


--
-- TOC entry 5245 (class 0 OID 18005)
-- Dependencies: 218
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, created_at, updated_at, deleted_at) FROM stdin;
ca0c3414-1157-46b2-a346-2445547fbc6d	STUDENT	1. QUYỀN SINH VIÊN / ĐOÀN VIÊN (User Level)	2026-03-11 16:00:06.713317+07	\N	\N
e9bd0a50-4828-4628-8afa-e587939eb1f5	FACULTY_ADMIN	2. QUYỀN BÍ THƯ KHOA / LIÊN CHI HỘI TRƯỞNG (Admin Level)	2026-03-11 16:00:06.713317+07	\N	\N
db38d3ba-746d-42e0-ba0c-273039beadbf	UNIVERSITY_ADMIN	3. QUYỀN ĐOÀN TRƯỜNG / HỘI SINH VIÊN TRƯỜNG (Super Admin)	2026-03-11 16:00:06.713317+07	\N	\N
\.


--
-- TOC entry 5272 (class 0 OID 18425)
-- Dependencies: 245
-- Data for Name: student_fees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_fees (id, user_id, academic_term_id, title, amount, status, paid_at, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- TOC entry 5267 (class 0 OID 18331)
-- Dependencies: 240
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_settings (id, key, value, description, created_at, updated_at, deleted_at) FROM stdin;
1aefe9af-975b-45d7-b1c7-3da2f382eb2a	SYSTEM_MOTTO	Empowering Student Success	Khẩu hiệu hệ thống	2026-03-17 13:25:31.094034+07	\N	\N
74b08f8c-1bb7-4711-99eb-e49b4cf45ec5	CURRENT_YEAR	2025-2026	Năm học hiện tại	2026-03-17 13:25:31.094034+07	\N	\N
872483b7-f038-4d8f-9995-8b3917a93efd	AUTO_TRANSITION	false	Tự động chuyển học kỳ	2026-03-17 13:25:31.094034+07	\N	\N
72653d58-2a33-4a73-97a4-849a2d670d14	ZALO_OA_KEY		Zalo OA Secret Key	2026-03-17 13:25:31.094034+07	\N	\N
9aa806e4-609e-413a-b883-2ef14f8a6ed9	PUSH_NOTIFICATIONS	true	Thông báo đẩy	2026-03-17 13:25:31.094034+07	\N	\N
25d950d0-e961-4f08-a3d6-edd6e1aa63f7	PRIMARY_COLOR	#0056D2	Màu chủ đạo hệ thống	2026-03-17 13:25:31.094034+07	\N	\N
91cea70d-47ef-4164-8fff-20613c83cf2c	DARK_MODE_SUPPORT	true	Hỗ trợ Dark Mode	2026-03-17 13:25:31.094034+07	\N	\N
d1171705-0850-45fc-8686-d6d78b5b50ae	PW_EXPIRE_90	false	Hết hạn mật khẩu sau 90 ngày	2026-03-17 13:25:31.094034+07	\N	\N
14dd497b-e826-4bc3-a41c-e5ed6b66482b	AUTO_BACKUP	true	Tự động sao lưu dữ liệu	2026-03-17 13:25:31.094034+07	\N	\N
4f4dd40c-9840-4774-a0d6-2e1d586f0c78	SYSTEM_NAME	LHU Digital Youth Union	Tên hệ thống	2026-03-17 13:25:31.094034+07	2026-03-17 13:28:18.011145+07	\N
e28d6451-e058-4433-ad03-f040c3f2d755	SMTP_HOST	lehau21847@gmail.com	Cấu hình SMTP Host	2026-03-17 13:25:31.094034+07	2026-03-17 13:28:18.037297+07	\N
395b52d7-ef40-4e7c-9332-dcab28263c4f	CURRENT_SEMESTER	1	Học kỳ hiện tại	2026-03-17 13:25:31.094034+07	2026-03-17 14:16:49.878267+07	\N
21de2fdc-3027-4451-9b01-0e3211d9300e	PW_REQUIRE_SYMBOLS	true	Yêu cầu biểu tượng trong mật khẩu	2026-03-17 13:25:31.094034+07	2026-03-22 14:34:39.204624+07	\N
c4d4b979-035f-4063-85c0-c0096b532b19	PW_MIN_LENGTH	8	Yêu cầu độ dài mật khẩu tối thiểu	2026-03-17 13:25:31.094034+07	2026-03-22 14:34:39.204624+07	\N
ea6d9281-d371-4bab-bba4-4e9db72ff89e	PW_REQUIRE_UPPERCASE	true	Yêu cầu chữ hoa trong mật khẩu	2026-03-17 13:25:31.094034+07	2026-03-22 14:34:39.204624+07	\N
f2bd0260-ea9a-4cad-bc5b-4f28be1e9483	SYSTEM_LOGO	https://res.cloudinary.com/dtb6uvcw7/image/upload/v1774168616/system/logo/o7kjxpgrxcpsf3ucfenf.jpg	\N	2026-03-22 15:36:53.462642+07	\N	\N
09913cb1-7792-413e-bbac-0b27e2d05bbf	WEBHOOK_SECRET	Admin@123	Mã bí mật Webhook	2026-03-17 13:25:31.094034+07	2026-03-22 16:09:39.067543+07	\N
3fc27a4f-8403-4cfa-9e9f-fe08fbb1c9cf	WEBHOOK_CALLBACK_URL	admin	URL nhận Webhook	2026-03-17 13:25:31.094034+07	2026-03-22 16:09:39.067543+07	\N
a4b35597-6bb1-4038-9db9-cf422a2b87f3	SESSION_TIMEOUT	60	Thời gian hết hạn phiên (phút)	2026-03-17 13:25:31.094034+07	2026-03-22 16:09:48.767298+07	\N
a212f74b-412f-4f8f-b64f-abab434a19b9	LDAP_ENABLED	true	\N	2026-03-22 16:11:52.959075+07	\N	\N
1cedb985-2d8a-4a95-92b9-14d72eb6b60d	MAIL_SERVER	smtp.gmail.com	\N	2026-03-22 16:14:07.197141+07	\N	\N
e56b517f-1dd7-4d5a-b97b-cf297d9aa400	MAIL_PORT	587	\N	2026-03-22 16:14:07.197141+07	\N	\N
adbf0e76-7717-4e84-a1e2-2c24caac65c0	MAIL_USERNAME	cainnguyen2005@gmail.com	\N	2026-03-22 16:14:07.197141+07	\N	\N
a3f6f7f4-0e83-469f-b416-eaccf03bf5a1	MAIL_PASSWORD	gafdccrnexaarmir	\N	2026-03-22 16:14:07.197141+07	\N	\N
0d51394e-0034-4275-ae44-112d93db24ce	MAIL_FROM	cainnguyen2005@gmail.com	\N	2026-03-22 16:14:07.197141+07	\N	\N
fc8b643e-44cd-4861-903a-d59a2cc010a5	TWO_FACTOR_REQUIRED	false	Yêu cầu 2FA	2026-03-17 13:25:31.094034+07	2026-03-22 16:22:36.905933+07	\N
\.


--
-- TOC entry 5270 (class 0 OID 18381)
-- Dependencies: 243
-- Data for Name: user_experiences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_experiences (id, user_id, role, location, period, bullets, created_at, updated_at, deleted_at) FROM stdin;
2dca6c73-aeeb-4a65-a3c0-ea2c4573e245	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	Trưởng ban Công nghệ	Khoa CNTT - LHU	2024 - Nay	["Quản lý đội ngũ 15 thành viên", "Triển khai hệ thống DYUS", "Tổ chức Hackathon 2024"]	2026-03-13 21:35:09.784544+07	\N	\N
fdb45ef2-9416-4574-af94-f4b03ebdfab7	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	Bí thư Lớp	Lớp 23CT112	2023 - 2024	["Điều phối hoạt động phong trào", "Đạt giải Nhất thi đua năm học"]	2026-03-13 21:35:09.784544+07	\N	\N
\.


--
-- TOC entry 5253 (class 0 OID 18089)
-- Dependencies: 226
-- Data for Name: user_organizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_organizations (id, user_id, organization_id, title, is_primary, joined_date, created_at, updated_at, deleted_at) FROM stdin;
9742f11f-bde7-48b4-ad47-ae257096068d	ef838a8b-85da-477b-9668-d601a19595fb	710b008c-7287-4735-a5ce-8790d6fea3ef	Chủ nhiệm	t	\N	2026-03-17 11:34:17.301486+07	2026-03-17 11:53:18.8527+07	\N
66d01f8f-3453-4152-8a65-5cc66a73fe73	c0731e91-b328-4c03-854f-6a1df1f1be9b	936d909a-0227-49da-bbac-a5eb6d701136	Chủ nhiệm	f	\N	2026-03-17 11:51:42.772771+07	2026-03-23 20:03:23.659202+07	\N
1ecdf096-8f63-412a-b7eb-f047b88cb631	217bbe71-0e46-4294-8802-dfa4aa5b53d6	936d909a-0227-49da-bbac-a5eb6d701136	UVBCH	f	\N	2026-03-23 20:03:23.659202+07	2026-03-23 20:04:45.057802+07	\N
12ea90cc-6ea8-4a06-a08b-f322fb0a66c0	ef838a8b-85da-477b-9668-d601a19595fb	936d909a-0227-49da-bbac-a5eb6d701136	Chủ nhiệm	t	\N	2026-03-23 20:04:45.057802+07	\N	\N
b689a7d4-4a04-4a55-a268-4b25abaf5726	a78b8afb-510c-459e-af66-b7ffc7298f04	3c81e0bf-71a7-4bb3-8e3f-6d48e8dfcd11	Chủ nhiệm CLB	t	\N	2026-03-23 20:17:31.100396+07	\N	\N
\.


--
-- TOC entry 5252 (class 0 OID 18074)
-- Dependencies: 225
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role_id) FROM stdin;
3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	ca0c3414-1157-46b2-a346-2445547fbc6d
d1153884-e1ad-4391-872f-eb0b7c93fbca	db38d3ba-746d-42e0-ba0c-273039beadbf
ef838a8b-85da-477b-9668-d601a19595fb	ca0c3414-1157-46b2-a346-2445547fbc6d
c0731e91-b328-4c03-854f-6a1df1f1be9b	ca0c3414-1157-46b2-a346-2445547fbc6d
217bbe71-0e46-4294-8802-dfa4aa5b53d6	e9bd0a50-4828-4628-8afa-e587939eb1f5
a78b8afb-510c-459e-af66-b7ffc7298f04	ca0c3414-1157-46b2-a346-2445547fbc6d
904b413a-5e02-423c-be48-96e315f3da81	ca0c3414-1157-46b2-a346-2445547fbc6d
\.


--
-- TOC entry 5269 (class 0 OID 18368)
-- Dependencies: 242
-- Data for Name: user_skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_skills (id, user_id, name, level, created_at, updated_at, deleted_at) FROM stdin;
5cc6e0c3-114f-4004-846d-14a3ac7686b6	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	Lãnh đạo	92	2026-03-13 21:35:09.784544+07	\N	\N
77e0911c-1d47-4bed-ba40-4d8e41e25296	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	Giao tiếp	88	2026-03-13 21:35:09.784544+07	\N	\N
85f66740-75ba-423c-9b65-024e6c242544	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	Kỹ thuật	95	2026-03-13 21:35:09.784544+07	\N	\N
16fdb55c-04d9-41ca-b211-1951d4984796	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	Sáng tạo	82	2026-03-13 21:35:09.784544+07	\N	\N
f9ae1a97-884c-49d9-9713-7ac9ab8b6897	3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	Phân tích	90	2026-03-13 21:35:09.784544+07	\N	\N
\.


--
-- TOC entry 5244 (class 0 OID 17995)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, student_id, full_name, email, password_hash, auth_provider, phone_number, status, avatar_url, last_login_at, created_at, updated_at, deleted_at, level, training_score, is_2fa_enabled, email_alerts_enabled, zalo_alerts_enabled, daily_digest_enabled, otp_code, otp_expires_at, class_id, device_id, push_token, class_name, academic_year, bio, social_links, is_profile_updated) FROM stdin;
d1153884-e1ad-4391-872f-eb0b7c93fbca	admin	Admin Đoàn Trường	cainnguyen2005@gmail.com	$2b$12$SjdAj8CSE/aRRrWJ9XKBo.6AaDFMqj5rCGZp0ujAgBIAT5q.WQQOa	LOCAL	\N	ACTIVE	\N	\N	2026-03-11 16:00:07.140475+07	2026-04-16 00:46:33.379637+07	\N	1	0	f	t	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	f
a78b8afb-510c-459e-af66-b7ffc7298f04	USER2	User Second	user2@test.com	\N	LOCAL	\N	ACTIVE	\N	\N	2026-03-13 21:35:09.775076+07	2026-04-16 00:46:33.379637+07	\N	2	75	f	t	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	f
c0731e91-b328-4c03-854f-6a1df1f1be9b	\N	Lê Trọng Phúc Hậu	lehau21847@gmail.com	\N	S4H	123456789	ACTIVE	\N	\N	2026-03-13 22:08:55.774262+07	2026-04-16 00:46:33.379637+07	\N	1	0	f	t	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	f
32da3e17-9c9f-4655-8225-ec5477b960e8	\N	T3	t3@edu.vn	$2b$12$qqt2Vw7AqD5iAO64bv.jDe8fwO2KwKBx99VQjSVP210AgXWkMZbLG	LOCAL	\N	ACTIVE	\N	\N	2026-03-22 14:34:39.219882+07	2026-04-16 00:46:33.379637+07	\N	1	0	f	t	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	f
217bbe71-0e46-4294-8802-dfa4aa5b53d6	subadmin	Bí Thư Khoa CNTT	cuongne240620052@gmail.com	$2b$12$zo07KcS0qtud1pz36ZWaS.LFfBKbolscsuvt8s.WNPGC57UQITLGO	LOCAL	Chưa cập nhật	ACTIVE	https://res.cloudinary.com/dtb6uvcw7/image/upload/v1773755258/avatar/subadmin/Unknown/Ch%C6%B0a%20x%E1%BA%BFp%20l%E1%BB%9Bp/zgl0tmcctxdjhqgwuues.png	\N	2026-03-11 16:00:06.948234+07	2026-04-16 00:46:33.379637+07	\N	1	0	f	t	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	f
3b7c3ad7-b7a8-4c83-9754-367ca87ecdbb	user	User Test	cuongne24062005@gmail.com	$2b$12$J9oWA0CXdluKUJ50VACE3OUj1zYo5gP.zYnCBDeg.D/1fK1IC87lS	LOCAL	\N	ACTIVE	https://res.cloudinary.com/dtb6uvcw7/image/upload/v1774154801/avatar/user/VangLai/NoClass/gxdraviclzvxj0zile6g.jpg	\N	2026-03-11 16:00:06.733001+07	2026-04-16 00:46:33.379637+07	\N	1	0	f	t	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	f
ef838a8b-85da-477b-9668-d601a19595fb	123000991	Nguyễn Trung Cường	cainnguyen2005+old@gmail.com	\N	S4H	0923409668	ACTIVE	\N	\N	2026-03-13 21:58:21.960843+07	2026-04-16 00:46:33.379637+07	\N	1	0	f	t	t	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	f
904b413a-5e02-423c-be48-96e315f3da81	1230001941	Lê Văn Trọng	levantrong123@gmail.com	$2b$12$61xG6Fd0czi./IepQ7no1O3tMe4rnUBlBOx1Ib298IWd18BRIk1Ze	LOCAL	0123123123	ACTIVE	https://res.cloudinary.com/dtb6uvcw7/image/upload/v1776276927/avatar/user/K12/NoClass/iblld6pqin8tzzy2yzle.jpg	\N	2026-04-12 16:39:49.487163+07	2026-04-16 01:15:34.275141+07	\N	3	85	f	t	t	f	\N	\N	\N	\N	\N	21CT116	2024	đẹp trai hi	\N	t
\.


--
-- TOC entry 4984 (class 2606 OID 18042)
-- Name: academic_terms academic_terms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_terms
    ADD CONSTRAINT academic_terms_pkey PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 18058)
-- Name: ai_audits ai_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_audits
    ADD CONSTRAINT ai_audits_pkey PRIMARY KEY (id);


--
-- TOC entry 5016 (class 2606 OID 18259)
-- Name: ai_predictions ai_predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_predictions
    ADD CONSTRAINT ai_predictions_pkey PRIMARY KEY (id);


--
-- TOC entry 4986 (class 2606 OID 18050)
-- Name: ai_sentiments ai_sentiments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_sentiments
    ADD CONSTRAINT ai_sentiments_pkey PRIMARY KEY (id);


--
-- TOC entry 5039 (class 2606 OID 26678)
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- TOC entry 5008 (class 2606 OID 18197)
-- Name: asset_loans asset_loans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_loans
    ADD CONSTRAINT asset_loans_pkey PRIMARY KEY (id);


--
-- TOC entry 5000 (class 2606 OID 18148)
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- TOC entry 5004 (class 2606 OID 18173)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5045 (class 2606 OID 26732)
-- Name: award_criteria award_criteria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.award_criteria
    ADD CONSTRAINT award_criteria_pkey PRIMARY KEY (id);


--
-- TOC entry 5018 (class 2606 OID 18300)
-- Name: awards awards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.awards
    ADD CONSTRAINT awards_pkey PRIMARY KEY (id);


--
-- TOC entry 4998 (class 2606 OID 18130)
-- Name: budgets budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_pkey PRIMARY KEY (id);


--
-- TOC entry 4996 (class 2606 OID 18114)
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- TOC entry 5002 (class 2606 OID 18161)
-- Name: chatbot_logs chatbot_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chatbot_logs
    ADD CONSTRAINT chatbot_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5037 (class 2606 OID 18449)
-- Name: club_proposals club_proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_proposals
    ADD CONSTRAINT club_proposals_pkey PRIMARY KEY (id);


--
-- TOC entry 5020 (class 2606 OID 18313)
-- Name: digital_documents digital_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.digital_documents
    ADD CONSTRAINT digital_documents_pkey PRIMARY KEY (id);


--
-- TOC entry 5047 (class 2606 OID 27382)
-- Name: event_feedbacks event_feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_feedbacks
    ADD CONSTRAINT event_feedbacks_pkey PRIMARY KEY (id);


--
-- TOC entry 5043 (class 2606 OID 26704)
-- Name: event_incidents event_incidents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_incidents
    ADD CONSTRAINT event_incidents_pkey PRIMARY KEY (id);


--
-- TOC entry 5041 (class 2606 OID 26686)
-- Name: event_qa event_qa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_qa
    ADD CONSTRAINT event_qa_pkey PRIMARY KEY (id);


--
-- TOC entry 5010 (class 2606 OID 27426)
-- Name: event_registrations event_registrations_check_in_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_check_in_token_key UNIQUE (check_in_token);


--
-- TOC entry 5012 (class 2606 OID 18213)
-- Name: event_registrations event_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_pkey PRIMARY KEY (id);


--
-- TOC entry 5006 (class 2606 OID 18186)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- TOC entry 5033 (class 2606 OID 18419)
-- Name: finance_transactions finance_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_transactions
    ADD CONSTRAINT finance_transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 5014 (class 2606 OID 18231)
-- Name: fund_requests fund_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fund_requests
    ADD CONSTRAINT fund_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 5027 (class 2606 OID 18346)
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- TOC entry 5022 (class 2606 OID 18325)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4982 (class 2606 OID 18029)
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- TOC entry 4980 (class 2606 OID 18021)
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5049 (class 2606 OID 27400)
-- Name: point_categories point_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.point_categories
    ADD CONSTRAINT point_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5051 (class 2606 OID 27407)
-- Name: point_logs point_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.point_logs
    ADD CONSTRAINT point_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4990 (class 2606 OID 18063)
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- TOC entry 4978 (class 2606 OID 18012)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 5035 (class 2606 OID 18432)
-- Name: student_fees student_fees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_fees
    ADD CONSTRAINT student_fees_pkey PRIMARY KEY (id);


--
-- TOC entry 5025 (class 2606 OID 18338)
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 5031 (class 2606 OID 18388)
-- Name: user_experiences user_experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_experiences
    ADD CONSTRAINT user_experiences_pkey PRIMARY KEY (id);


--
-- TOC entry 4994 (class 2606 OID 18096)
-- Name: user_organizations user_organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_organizations
    ADD CONSTRAINT user_organizations_pkey PRIMARY KEY (id);


--
-- TOC entry 4992 (class 2606 OID 18078)
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- TOC entry 5029 (class 2606 OID 18375)
-- Name: user_skills user_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_pkey PRIMARY KEY (id);


--
-- TOC entry 4975 (class 2606 OID 18002)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4976 (class 1259 OID 18013)
-- Name: ix_roles_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_roles_name ON public.roles USING btree (name);


--
-- TOC entry 5023 (class 1259 OID 18339)
-- Name: ix_system_settings_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_system_settings_key ON public.system_settings USING btree (key);


--
-- TOC entry 4972 (class 1259 OID 18004)
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- TOC entry 4973 (class 1259 OID 18003)
-- Name: ix_users_student_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_student_id ON public.users USING btree (student_id);


--
-- TOC entry 5078 (class 2606 OID 18260)
-- Name: ai_predictions ai_predictions_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_predictions
    ADD CONSTRAINT ai_predictions_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- TOC entry 5070 (class 2606 OID 18198)
-- Name: asset_loans asset_loans_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_loans
    ADD CONSTRAINT asset_loans_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id);


--
-- TOC entry 5071 (class 2606 OID 18203)
-- Name: asset_loans asset_loans_borrowed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_loans
    ADD CONSTRAINT asset_loans_borrowed_by_fkey FOREIGN KEY (borrowed_by) REFERENCES public.users(id);


--
-- TOC entry 5065 (class 2606 OID 18149)
-- Name: assets assets_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- TOC entry 5067 (class 2606 OID 18174)
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5079 (class 2606 OID 18301)
-- Name: awards awards_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.awards
    ADD CONSTRAINT awards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5063 (class 2606 OID 18136)
-- Name: budgets budgets_academic_term_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_academic_term_id_fkey FOREIGN KEY (academic_term_id) REFERENCES public.academic_terms(id);


--
-- TOC entry 5064 (class 2606 OID 18131)
-- Name: budgets budgets_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- TOC entry 5061 (class 2606 OID 18120)
-- Name: campaigns campaigns_academic_term_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_academic_term_id_fkey FOREIGN KEY (academic_term_id) REFERENCES public.academic_terms(id);


--
-- TOC entry 5062 (class 2606 OID 18115)
-- Name: campaigns campaigns_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- TOC entry 5066 (class 2606 OID 18162)
-- Name: chatbot_logs chatbot_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chatbot_logs
    ADD CONSTRAINT chatbot_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5088 (class 2606 OID 18450)
-- Name: club_proposals club_proposals_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_proposals
    ADD CONSTRAINT club_proposals_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- TOC entry 5089 (class 2606 OID 18455)
-- Name: club_proposals club_proposals_requested_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.club_proposals
    ADD CONSTRAINT club_proposals_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES public.users(id);


--
-- TOC entry 5080 (class 2606 OID 18314)
-- Name: digital_documents digital_documents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.digital_documents
    ADD CONSTRAINT digital_documents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5094 (class 2606 OID 27383)
-- Name: event_feedbacks event_feedbacks_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_feedbacks
    ADD CONSTRAINT event_feedbacks_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- TOC entry 5095 (class 2606 OID 27388)
-- Name: event_feedbacks event_feedbacks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_feedbacks
    ADD CONSTRAINT event_feedbacks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5092 (class 2606 OID 26705)
-- Name: event_incidents event_incidents_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_incidents
    ADD CONSTRAINT event_incidents_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- TOC entry 5093 (class 2606 OID 26710)
-- Name: event_incidents event_incidents_reported_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_incidents
    ADD CONSTRAINT event_incidents_reported_by_fkey FOREIGN KEY (reported_by) REFERENCES public.users(id);


--
-- TOC entry 5090 (class 2606 OID 26687)
-- Name: event_qa event_qa_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_qa
    ADD CONSTRAINT event_qa_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- TOC entry 5091 (class 2606 OID 26692)
-- Name: event_qa event_qa_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_qa
    ADD CONSTRAINT event_qa_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5072 (class 2606 OID 18214)
-- Name: event_registrations event_registrations_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- TOC entry 5073 (class 2606 OID 18219)
-- Name: event_registrations event_registrations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5068 (class 2606 OID 18187)
-- Name: events events_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id);


--
-- TOC entry 5069 (class 2606 OID 27427)
-- Name: events events_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id);


--
-- TOC entry 5085 (class 2606 OID 18420)
-- Name: finance_transactions finance_transactions_budget_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_transactions
    ADD CONSTRAINT finance_transactions_budget_id_fkey FOREIGN KEY (budget_id) REFERENCES public.budgets(id);


--
-- TOC entry 5074 (class 2606 OID 18247)
-- Name: fund_requests fund_requests_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fund_requests
    ADD CONSTRAINT fund_requests_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- TOC entry 5075 (class 2606 OID 18232)
-- Name: fund_requests fund_requests_budget_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fund_requests
    ADD CONSTRAINT fund_requests_budget_id_fkey FOREIGN KEY (budget_id) REFERENCES public.budgets(id);


--
-- TOC entry 5076 (class 2606 OID 18237)
-- Name: fund_requests fund_requests_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fund_requests
    ADD CONSTRAINT fund_requests_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- TOC entry 5077 (class 2606 OID 18242)
-- Name: fund_requests fund_requests_requested_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fund_requests
    ADD CONSTRAINT fund_requests_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES public.users(id);


--
-- TOC entry 5082 (class 2606 OID 18347)
-- Name: news news_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- TOC entry 5081 (class 2606 OID 18326)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5053 (class 2606 OID 27432)
-- Name: organizations organizations_leader_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_leader_user_id_fkey FOREIGN KEY (leader_user_id) REFERENCES public.users(id);


--
-- TOC entry 5054 (class 2606 OID 18030)
-- Name: organizations organizations_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.organizations(id);


--
-- TOC entry 5096 (class 2606 OID 27418)
-- Name: point_logs point_logs_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.point_logs
    ADD CONSTRAINT point_logs_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.point_categories(id);


--
-- TOC entry 5097 (class 2606 OID 27413)
-- Name: point_logs point_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.point_logs
    ADD CONSTRAINT point_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- TOC entry 5098 (class 2606 OID 27408)
-- Name: point_logs point_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.point_logs
    ADD CONSTRAINT point_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5055 (class 2606 OID 18069)
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id);


--
-- TOC entry 5056 (class 2606 OID 18064)
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 5086 (class 2606 OID 18438)
-- Name: student_fees student_fees_academic_term_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_fees
    ADD CONSTRAINT student_fees_academic_term_id_fkey FOREIGN KEY (academic_term_id) REFERENCES public.academic_terms(id);


--
-- TOC entry 5087 (class 2606 OID 18433)
-- Name: student_fees student_fees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_fees
    ADD CONSTRAINT student_fees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5084 (class 2606 OID 18389)
-- Name: user_experiences user_experiences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_experiences
    ADD CONSTRAINT user_experiences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5059 (class 2606 OID 18102)
-- Name: user_organizations user_organizations_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_organizations
    ADD CONSTRAINT user_organizations_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- TOC entry 5060 (class 2606 OID 18097)
-- Name: user_organizations user_organizations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_organizations
    ADD CONSTRAINT user_organizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5057 (class 2606 OID 18084)
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- TOC entry 5058 (class 2606 OID 18079)
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5083 (class 2606 OID 18376)
-- Name: user_skills user_skills_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_skills
    ADD CONSTRAINT user_skills_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5052 (class 2606 OID 27370)
-- Name: users users_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.organizations(id);


-- Completed on 2026-04-22 20:32:56

--
-- PostgreSQL database dump complete
--

\unrestrict kf9fUuBg1dnaE8MIgw7mVCfes1cHy7hHbHqH3sXrZEZziHSl5d9j0rNZLWkb40O

