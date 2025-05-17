from settings import supabase


def insert_sample_products():
    products = [
        {
            "title": "Mahaan Poster",
            "description": "A beautiful handmade ceramic vase.",
            "price": 999,
            "mrp": 999,
            "thumbnail_url": "https://1drv.ms/i/c/66cc4eeb809536b4/EcYi_lC6WJ1HgotGzAjmGKwBMorswgs0wuITWb8m45U4lg?e=XQEuZQ",
            "image_urls": [
                "https://1drv.ms/i/c/66cc4eeb809536b4/EcYi_lC6WJ1HgotGzAjmGKwBMorswgs0wuITWb8m45U4lg?e=XQEuZQ",
                "https://1drv.ms/i/c/66cc4eeb809536b4/ETZ7u5BufjRDqBTan-IVTHoBouVSykihIHnFIaa2mrffvw?e=LlqUsq",
            ],
        }
    ]

    for product in products:
        res = supabase.table("products").insert(product).execute()
        print(f"Inserted: {product['title']} →", res)


if __name__ == "__main__":
    insert_sample_products()
