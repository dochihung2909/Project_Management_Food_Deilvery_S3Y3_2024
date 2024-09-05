from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import *


class UserSerializer(ModelSerializer):
    avatar = serializers.SerializerMethodField(source='avatar')

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['avatar'] = instance.avatar.url

        return rep

    def get_avatar(self, user):
        if user.avatar:
            request = self.context.get('request')
            rep = super().to_representation(user)
            if request.avatar:
                rep['avatar'] = user.avatar.url
            if request:
                return request.build_absolute_uri(rep)
            return rep

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'password', 'phone_number', 'role',
                  'avatar', 'is_active']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    # def to_representation(self, instance):
    #     rep = super().to_representation(instance)
    #     rep['avatar'] = instance.avatar.url
    #
    #     return rep

    # def get_avatar(self, user):
    #     if user.avatar:
    #         request = self.context.get('request')
    #         if request:
    #             return request.build_absolute_uri('/static/%s' % user.avatar.name)


class FoodCategorySerializer(ModelSerializer):
    class Meta:
        model = FoodCategory
        fields = ['id', 'name']


class RestaurantSerializer(ModelSerializer):
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
                  'created_date', 'updated_date', 'active']


class EmployeeSerializer(ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'user', 'restaurant']


class EmployeeSerializer(ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


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


class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'user', 'created_date']


class CartSerializer(ModelSerializer):
    cart_details = serializers.SerializerMethodField('get_cart_details')

    def get_cart_details(self, obj):
        cart_details = Cart.objects.cartdetail_set(cart=obj)
        serializer = CartDetailSerializer(cart_details, many=True)
        return serializer.data

    class Meta:
        model = Cart
        fields = ['id', 'note', 'status', 'user', 'restaurant', 'created_date', 'active', 'cart_details']


class CartDetailSerializer(ModelSerializer):
    class Meta:
        model = Cart
        fields = ['id', 'cart', 'food', 'quantity', 'amount', 'created_date', 'updated_date']


class PaymentSerializer(ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'status', 'note', 'cart', 'created_date', 'active']


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
        fields = ['id', 'star', 'comment', 'image', 'payment', 'active']
