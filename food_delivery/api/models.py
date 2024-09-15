from cloudinary.models import CloudinaryField
from django.db import models
from django.contrib.auth.models import AbstractUser
from django_ckeditor_5.fields import CKEditor5Field


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Role(BaseModel):
    id = models.PositiveIntegerField(primary_key=True)
    name = models.CharField(max_length=30, null=False)

    def __str__(self):
        return self.name


class User(AbstractUser):
    phone_number = models.CharField(max_length=13, null=False)
    avatar = CloudinaryField(null=True, blank=True)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)
    address = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.username


class RestaurantCategory(BaseModel):
    name = models.CharField(max_length=50, unique=True, null=False)

    def __str__(self):
        return self.name


class FoodCategory(BaseModel):
    name = models.CharField(max_length=50, unique=True, null=False)

    def __str__(self):
        return self.name


class Restaurant(BaseModel):
    name = models.CharField(max_length=255, null=False)
    phone_number = models.CharField(max_length=12, null=False)
    address = models.CharField(max_length=255, null=False)
    image = CloudinaryField(null=False)
    rating = models.FloatField(null=True)
    category = models.ForeignKey(RestaurantCategory, on_delete=models.PROTECT)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.name} ({self.address})'


class Employee(User):
    res = models.ForeignKey(Restaurant, on_delete=models.CASCADE)


class Food(BaseModel):
    name = models.CharField(max_length=255, null=False)
    price = models.FloatField()
    discount = models.FloatField()
    description = models.TextField()
    category = models.ForeignKey(FoodCategory, on_delete=models.PROTECT)
    image = CloudinaryField(null=False)
    rating = models.FloatField(null=True)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.name} ({self.restaurant.name})'


class Notification(BaseModel):
    message = models.CharField(max_length=255, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.message


class OrderStatus(models.IntegerChoices):
    PENDING = 0, 'Pending'
    CONFIRM = 1, 'Confirm'


class Cart(BaseModel):
    note = models.CharField(max_length=255, null=True)
    status = models.IntegerField(choices=OrderStatus, default=OrderStatus.PENDING)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.id}. {self.user} - {self.restaurant}'


class CartDetail(BaseModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    amount = models.FloatField()
    quantity = models.IntegerField()


class PaymentStatus(models.IntegerChoices):
    PENDING = 0, 'Pending'
    CONFIRM = 1, 'Confirm'
    DELIVERING = 2, 'Delivering'
    COMPLETED = 3, 'Completed'
    FAILED = 4, 'Failed'


class PaymentMethod(models.IntegerChoices):
    CASH = 0, 'Cash'
    BANK = 1, 'Bank'
    E_WALLET = 2, 'E-Wallet'


class Payment(BaseModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    status = models.IntegerField(choices=PaymentStatus.choices)
    method = models.IntegerField(choices=PaymentMethod.choices, default=PaymentMethod.CASH)
    note = models.TextField(null=True)


class Rating(BaseModel):
    STAR_CHOICES = [(i, str(i)) for i in range(1, 6)]
    star = models.IntegerField(choices=STAR_CHOICES)
    comment = CKEditor5Field(null=True)
    image = CloudinaryField(null=False)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE)

