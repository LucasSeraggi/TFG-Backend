DROP TYPE IF EXISTS ENUM_USERS_ROLE CASCADE;

CREATE TYPE ENUM_USERS_ROLE AS ENUM (
    'Administrador',
    'Estudante',
    'Professor',
    'Tutor'
);

DROP TYPE IF EXISTS RESOURCE_COURSE_ENUM CASCADE; 

CREATE TYPE RESOURCE_COURSE_ENUM AS ENUM (
    'text',
    'file',
    'link',
    'quiz',
    'dissert',
    'fill_the_blanks'
);