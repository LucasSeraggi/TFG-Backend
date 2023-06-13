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

DROP TYPE IF EXISTS ENUM_WEEK_DAY CASCADE;
CREATE TYPE ENUM_WEEK_DAY AS ENUM (
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
);

DROP TYPE IF EXISTS DATE_CUSTOM CASCADE;
CREATE TYPE DATE_CUSTOM AS (
    week_day ENUM_WEEK_DAY,
    hour_start VARCHAR(5),
    hour_end VARCHAR(5)
);