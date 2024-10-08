# Generated by Django 5.1 on 2024-09-09 03:59

from django.db import migrations


def initial_rating_data(apps, schema_editor):
    Rating = apps.get_model('api', 'Rating')
    ratings = [
        {'star': '5', 'comment': 'Đánh giá đơn hàng 1',
         'image': 'https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg',
         'payment_id': 1},
        {'star': '4', 'comment': 'Đánh giá đơn hàng 2',
         'image': 'https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg',
         'payment_id': 2},
        {'star': '3', 'comment': 'Đánh giá đơn hàng 3',
         'image': 'https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg',
         'payment_id': 3},
        {'star': '1', 'comment': 'Đánh giá đơn hàng 4',
         'image': 'https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg',
         'payment_id': 4},
        {'star': '2', 'comment': 'Đánh giá đơn hàng 5',
         'image': 'https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg',
         'payment_id': 5},
        {'star': '3', 'comment': 'Đánh giá đơn hàng 6',
         'image': 'https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg',
         'payment_id': 6},
        {'star': '4', 'comment': 'Đánh giá đơn hàng 7',
         'image': 'https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg',
         'payment_id': 7},
        {'star': '5', 'comment': 'Đánh giá đơn hàng 8',
         'image': 'https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg',
         'payment_id': 8},
        {'star': '1', 'comment': 'Đánh giá đơn hàng 9',
         'image': 'https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg',
         'payment_id': 9},
        {'star': '2', 'comment': 'Đánh giá đơn hàng 10',
         'image': 'https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg',
         'payment_id': 10},
        {'star': '3', 'comment': 'Đánh giá đơn hàng 1',
         'image': 'https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg',
         'payment_id': 1},
        {'star': '4', 'comment': 'Đánh giá đơn hàng 2',
         'image': 'https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg',
         'payment_id': 2},
        {'star': '5', 'comment': 'Đánh giá đơn hàng 3',
         'image': 'https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg',
         'payment_id': 3},
        {'star': '1', 'comment': 'Đánh giá đơn hàng 4',
         'image': 'https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg',
         'payment_id': 4},
        {'star': '2', 'comment': 'Đánh giá đơn hàng 5',
         'image': 'https://res.cloudinary.com/dhitdivyi/image/upload/v1725855054/vedsqysasq8jjwgvjnea.jpg',
         'payment_id': 5},
    ]

    for rating in ratings:
        Rating.objects.create(
            star=rating['star'],
            comment=rating['comment'],
            image=rating['image'],
            payment_id=rating['payment_id'],
        )


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_payment_data'),
    ]

    operations = [
        migrations.RunPython(initial_rating_data)
    ]
