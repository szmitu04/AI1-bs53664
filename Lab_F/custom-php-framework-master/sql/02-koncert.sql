DROP TABLE koncert;

CREATE  TABLE koncert (
                         koncertId integer not null
                             constraint post_pk
                                 primary key autoincrement,
                         koncertName TEXT NOT NULL,
                         koncertDate DATE NOT NULL,
                         koncertBand TEXT NOT NULL
);