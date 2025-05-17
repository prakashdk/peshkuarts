from settings import supabase


def create_products_table():
    # SQL DDL to create table
    ddl = """
    create table if not exists products (
        id uuid default uuid_generate_v4() primary key,
        title text not null,
        description text,
        price numeric not null,
        mrp numeric not null,
        thumbnail_url text,
        image_urls text[],
        created_at timestamp with time zone default timezone('utc'::text, now())
    );
    """
    response = supabase.rpc("sql", {"sql": ddl})
    print(response)
    print("Table creation executed.")


if __name__ == "__main__":
    create_products_table()
