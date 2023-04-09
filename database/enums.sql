DROP TYPE IF EXISTS ENUM_USERS_ROLE CASCADE;

CREATE TYPE ENUM_USERS_ROLE AS ENUM (
    'Administrador',
    'Estudante',
    'Professor',
    'Tutor'
);

DROP TYPE IF EXISTS ENUM_ACTIVITIES_TYPE CASCADE;

CREATE TYPE ENUM_ACTIVITIES_TYPE AS ENUM (
    'quiz',
    'dissertation',
    'fill_the_blanks'
);