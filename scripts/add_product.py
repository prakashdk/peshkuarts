from dotenv import load_dotenv
from settings import supabase
from product_base import movies
from product_base import movie_descriptions
import os

load_dotenv()

CLOUDINERY_KEY = os.getenv("CLOUDINERY_KEY")


def get_image_urls(folder_name):
    return [
        f"https://ik.imagekit.io/{CLOUDINERY_KEY}/etsy%20peshkuarts/{folder_name}/mockup1.png",
        f"https://ik.imagekit.io/{CLOUDINERY_KEY}/etsy%20peshkuarts/{folder_name}/mockup2.png",
    ]


def insert_sample_products():
    products = []

    for movie in movies:
        image_urls = get_image_urls(movie)
        data = {
            "title": f"{movie} Poster",
            "description": movie_descriptions.get(movie, ""),
            "price": 199,
            "mrp": 299,
            "thumbnail_url": image_urls[0],
            "image_urls": image_urls,
        }
        products.append(data)

    for product in products:
        res = (
            supabase.table("products").upsert(product, on_conflict=["title"]).execute()
        )
        print(f"Inserted: {product['title']} →", res)


if __name__ == "__main__":
    insert_sample_products()
