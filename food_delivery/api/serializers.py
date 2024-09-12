from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import *


class UserSerializer(ModelSerializer):
    # def to_representation(self, instance):
    #     rep = super().to_representation(instance)
    #     rep['avatar'] = instance.avatar.url
    #
    #     return rep

    def get_avatar(self, user):
        if user.avatar:
            request = self.context.get('request')
            rep = super().to_representation(user)
            if request.avatar:
                rep['avatar'] = user.avatar.url
            if request:
                return request.build_absolute_uri(rep)
            return rep

    def create(self, validated_data):
        data = validated_data.copy()

        user = User(**data)
        user.set_password(data["password"])
        user.save()

        return user

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'phone_number', 'role',
                  'avatar']
        # extra_kwargs = {
        #     'password': {
        #         'write_only': True
        #     }
        # }


class FoodCategorySerializer(ModelSerializer):
    class Meta:
        model = FoodCategory
        fields = ['id', 'name']


class EmployeeSerializer(ModelSerializer):
    res = serializers.PrimaryKeyRelatedField(queryset=Restaurant.objects.all())

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['avatar'] = instance.avatar.url

        return rep

    def get_avatar(self, employee):
        if employee.avatar:
            request = self.context.get('request')
            rep = super().to_representation(employee)
            if request.avatar:
                rep['avatar'] = employee.avatar.url
            if request:
                return request.build_absolute_uri(rep)
            return rep

    def validate(self, data):
        res = data.get('res')
        username = data.get('username')
        if Employee.objects.filter(res=res, username=username).exists():
            raise serializers.ValidationError("An employee already exists in this restaurant!")
        return data

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        employee = Employee(**validated_data)
        if password:
            employee.password = make_password(password)

        employee.save()

        return employee

    class Meta:
        model = Employee
        fields = ['id', 'first_name', 'last_name', 'username', 'password', 'phone_number', 'role',
                  'avatar', 'is_active', 'res']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class FoodSerializer(ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['image'] = instance.image.url

        return rep

    def get_image(self, food):
        if food.image:
            request = self.context.get('request')
            rep = super().to_representation(food)
            if request.image:
                rep['image'] = food.image.url
            if request:
                return request.build_absolute_uri(rep)
            return rep

    class Meta:
        model = Food
        fields = ['id', 'name', 'price', 'discount', 'description', 'image', 'rating', 'category', 'restaurant',
                  'created_date', 'active']


class RestaurantCategorySerializer(ModelSerializer):

    class Meta:
        model = RestaurantCategory
        fields = ['id', 'name']


class RestaurantSerializer(ModelSerializer):
    foods = serializers.SerializerMethodField('get_foods')
    category = serializers.SerializerMethodField('get_category_name')

    def get_category_name(self, obj):
        category = obj.category.name

        return category

    def get_foods(self, restaurant):
        foods = restaurant.food_set.filter(active=True)
        serializer = FoodSerializer(foods, many=True)
        return serializer.data

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['image'] = instance.image.url

        return rep

    def get_image(self, restaurant):
        if restaurant.image:
            request = self.context.get('request')
            rep = super().to_representation(restaurant)
            if request.image:
                rep['image'] = restaurant.image.url
            if request:
                return request.build_absolute_uri(rep)
            return rep

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'phone_number', 'address', 'image', 'rating', 'category', 'owner',
                  'created_date', 'updated_date', 'active', 'foods']





class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'user', 'created_date']


class CartSerializer(ModelSerializer):
    cart_details = serializers.SerializerMethodField('get_cart_details')
    total_amount = serializers.SerializerMethodField('get_total_amount')

    def get_cart_details(self, cart):
        cart_details = cart.cartdetail_set.filter(active=True)
        serializer = CartDetailSerializer(cart_details, many=True)
        return serializer.data

    def get_total_amount(self, cart):
        cart_details = cart.cartdetail_set.filter(active=True)
        total = sum(detail.amount for detail in cart_details)

        return total

    class Meta:
        model = Cart
        fields = ['id', 'note', 'status', 'user', 'restaurant', 'created_date', 'active', 'cart_details', 'total_amount']


class CartDetailSerializer(ModelSerializer):
    food = serializers.SerializerMethodField('get_food')

    def get_food(self, obj):
        f = obj.food
        return FoodSerializer(f).data

    class Meta:
        model = CartDetail
        fields = ['id', 'cart', 'food', 'quantity', 'amount', 'created_date', 'updated_date']
        read_only_fields = ['amount']


class PaymentSerializer(ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'status', 'method', 'note', 'cart', 'created_date', 'active']


class RatingSerializer(ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['image'] = instance.image.url

        return rep

    def get_image(self, food):
        if food.image:
            request = self.context.get('request')
            rep = super().to_representation(food)
            if request.image:
                rep['image'] = food.image.url
            if request:
                return request.build_absolute_uri(rep)
            return rep

    class Meta:
        model = Rating
        fields = ['id', 'star', 'comment', 'image', 'payment', 'created_date', 'active']
