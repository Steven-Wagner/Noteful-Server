alter table noteful_notes
    add column
        modified timestamp default now() not null